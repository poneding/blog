[🏠 首页](../_index.md) / [Kubernetes](_index.md) / 了解 Secret

# 了解 Secret

通常我们的应用程序的配置都会包含一些敏感信息，例如数据库连接字符串，证书，私钥等，为了保证其安全性，K8s 提供了 Secret 资源对象来保存敏感数据，它和 CongfigMap 类似，也是键值对的映射，并且使用方式也几乎一样。

## 介绍 Secret

Secret 中存储着键值对数据，可以

- 作为环境变量传递给容器
- 作为文件挂载到容器的 Volume

Secret 会存储在 Pod 所调度的节点的内存中，而不是写入磁盘。

### Pod 默认生成的 Secret

每个 Pod 都会被自动挂载一个 Secret 卷，只需要使用 `kubectl desribe pod` 命令就能看到一个名称类似 `default-token-n4q6m` 的 Secret，Secret 也是一种 K8s 资源，所以，可以使用 `kubectl get secret` 或 `kubectl describe secret` 获取查看。

![alt text](https://images.pding.top/2025/03/202503111829748.png)

![alt text](https://images.pding.top/2025/03/202503111829140.png)

从上面图例可以看出，Pod 默认生成的 Secret 会包含三个配置项：ca.crt、namespace、token。其实这三个配置项是 Pod 内部安全访问Kubernetes API 服务的所有信息，而在 `kubectl describe pod` 的时候，你可以看到 Secret 所挂载的具体目录在 `/var/run/secrets/kubernetes.io/serviceaccount`.

![alt text](https://images.pding.top/2025/03/202503111829987.png)

每个 Pod 会默认生成 `default-token-xxxxx` 的 Secret，可以通过在Pod 中定义 `pod.spec.automountServiceAccountToken` 为 false 来关闭这种默认行为。

## 创建 Secret

可以直接通过 `kubectl create secret` 命令创建，也可以先编写 secret 的 yaml 文件再使用 `kubectl apply -f <filename>` 创建，推荐使用后者。

### 单行命令创建 Secret

- 创建一个键值对的 secret：

```shell
kubectl create secret generic first-secret --from-literal=user=admin --from-literal=password=admin123
```

创建完成之后，使用 `kubectl describe secret first-secret` 查看，可以看到这个 secret 的键值内容并不会直接打印出来，而是只显示了占用了多少个字节。

![alt text](https://images.pding.top/2025/03/202503111829827.png)

- 创建一个文件内容的 Secret

假如我当前有一个配置文件 secret.json，文件内容如下：

```json
{
  "User": "admin",
  "Password": "admin123"
}
```

使用以下命令创建 Secret：

```shell
kubectl create secret generic second-secret --from-file=secret.json
```

创建完成之后，使用 `kubectl describe secret second-secret` 查看 secret 的键值内容，同样也不会将文件内容显示出来：

![alt text](https://images.pding.top/2025/03/202503111829224.png)

> 默认使用文件名称 secret.json 作为键值对的 key，也可以通过 `--from-file=second_secret=app.json` 指定 key 为 `second_secret`；
>
> 可以使用多组 `--from-file=<key>=<filename>` 参数，在 secret 中定义多组文件；
>
> `--from-file=` 后面可以直接跟某个文件路径，这样会将目录下的所有文件引入到 Secret;
>
> `--from-literal` 和 `--from-file` 可以共同使用，键值合并。

删除创建的 `first-secret` 和 `second-secret`：

```shell
kubectl delete secret first-secret
kubectl delete secret second-secret
```

### 基于资源清单文件创建 Secret

- 创建一个键值对的 Secret：

首先定义 Secret 的资源文件 first-secret.yaml，定义如下：

先使用 base64 对 secret 资源文件中要保存的键值编码

```bash
echo "admin" | base64 # 得到 YWRtaW4K
echo "admin123" | base64 # 得到 YWRtaW4xMjMK
```

```shell
vim first-secret.yaml
```

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: first-secret
data:
  user: "YWRtaW4K"
  password: "YWRtaW4xMjMK"
```

使用 `kubectl apply` 命令创建 Secret 资源：

```shell
kubectl apply -f first-secret.yaml
```

创建完成之后，使用 `kubectl describe secret first-secret` 查看。

> 可以在 `data` 下定义多组键值对。

- 创建一个文件内容的 Secret

首先定义 Secret 的资源文件 second-secret.yaml，定义如下：

先使用 base64 对上文中的 secret.json 文件内容编码：

```bash
echo $(cat secret.json) | base64 # 得到 eyAiVXNlciI6ICJhZG1pbiIsICJQYXNzd29yZCI6ICJhZG1pbjEyMyIgfQo=
```

```shell
vim second-secret.yaml
```

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: second-secret
data:
  secret.json: eyAiVXNlciI6ICJhZG1pbiIsICJQYXNzd29yZCI6ICJhZG1pbjEyMyIgfQo=
```

使用 `kubectl apply` 命令创建 Secret 资源：

```shell
kubectl apply -f second-secret.yaml
```

创建完成之后，使用 `kubectl describe secret second-secret` 查看。

>可以在 `data` 下定义多组文件，也可以和键值对一起定义；
>

删除创建的 `first-secret` 和 `second-secret`：

```shell
kubectl delete secret first-secret
kubectl delete secret second-secret
```

## 使用 Secret

Secret 的用途也与 ConfigMap 相差无几：

- 使用 Secret 作为容器的环境变量
- 使用 Secret 作为 Volume 向容器提供文件

### 使用 Secret 作为容器的环境变量

假如有一个名为 `first-secret` 的 Secret，里面包含了一个键为 `user`，我想将这个 Secret 中 `user` 键用到我的环境变量 `USER_NAME` 中，可以使用如下方式：

```yaml
...
env:
- name: USER_NAME
  valueFrom:
    secretKeyRef:
      name: first-secret
      key: user
...
```

如果有一个名为 `second-secret` Secret 中包含多个键如 `USER_NAME`，`PASSWORD`，我想将这个 Secret 中所有的键都用到我的环境变量中，可以使用如下方式：

```yaml
...
spec:
  container:
  - image: <some-image>
    envFrom:
    - prefix: MYSQL_
      secretRef:
        name: second-secret
...
```

容器将会生成 `DB_USER_NAME`，`DB_PASSWORD` 环境变量，`prefix` 也可以不配置，则直接使用 Secret 的键。

注意：

- `secretRef` 与上面 `secretKeyRef` 的区别；
- 如果Secret中有一个为 `USER-NAME` 键，那么将不会生成 `MYSQL_USER-NAME` 的环境变量，因为`MYSQL_USER-NAME` 不是一个合法的环境变量名称。

### 使用 Secret 为容器的 Volume 提供文件

上次的文章——《[了解 ConfigMap](./configmap-understood.md)》中，使用 ConfigMap 向容器提供文件，这次使用 Secret 来实际使用一下。

我们现在有一个文件 secret.json 要传递到容器中，文件内容如下：

```json
{
  "User": "admin",
  "Password": "admin123"
}
```

创建 Secret

```bash
kubectl create secret generic mockapi-secret --from-file=secret.json
```

定义 mockapi-pod.yaml 文件如下：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mockapi
spec:
  containers:
  - name: mockapi
    image: poneding/mockapi:v1
    ports:
      - containerPort: 80
    volumeMounts:
      - mountPath: /app/mysettings/secret.json
        name: mockapi-secret
        subPath: secret.json
  volumes:
  - name:  mockapi-secret
    secret:
      secretName: mockapi-secret
```

创建 Pod：

```bash
kubectl apply -f mockapi-pod.yaml
```

一段时间后，可以验证文件是否挂载到容器：

![alt text](https://images.pding.top/2025/03/202503111829404.png)

Yeah！没毛病。

### 使用 Secret 拉取私有镜像

当我们要访问拉取私有仓库或者私有镜像时，我们需要可能需要使用到 Secret。

比如我现在将我 docker 仓库中的镜像 mockapi 设置成私有镜像，这是我使用该镜像创建 Pod 是会显示镜像拉取失败的，很明显，我需要登录 docker。

- 创建镜像仓库 Secret

```bash
kubectl create secret docker-registry docker-hub-secret --docker-username=<my_username> --docker-password=<my_password>
```

> 私有仓库的话使用 `--docker-server` 指定；
>
> 更多使用 `kubectl create secret docker-registry --help` 查看

- Pod 中使用 imagePullSecrets:

```yaml
...
kind: Pod
spec:
  imagePullSecrets:
    - name: docker-hub-secret
  containers:
  - name: mockapi
    image: poneding/mockapi:v1
...
```

- 使用 ServiceAccount

如果很多镜像都要从私有仓库拉取，那最好将 secret 添加到一个固定的 ServiceAccount 中，一个 ServiceAccount 可以包含多个镜像仓库 Secret：

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name:  docker-service-account
imagePullSecrets:
  - name: docker-hub-secret
  - name: harbor-secret
```

这时 Pod 使用 ServiceAccount 即可：

```yaml
...
kind: Pod
spec:
  serviceAccountName: docker-service-account
...
```

---
[« PVC 扩容](pvc-expansion.md)

[» 了解 Service](service-understood.md)
