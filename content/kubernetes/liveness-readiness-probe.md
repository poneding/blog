[🏠 首页](../_index.md) / [Kubernetes](_index.md) / Kubernetes 0-1 Pod中的livenessProbe和readinessProbe解读

# Kubernetes 0-1 Pod中的livenessProbe和readinessProbe解读

![alt text](https://images.pding.top/2025/03/202503111814475.png)

## 写在前面

K8s对Pod的健康状态可以通过两类探针来检查：livenessProbe和readinessProbe，kubelet通过定期执行这两类探针来诊断容器的健康状况。

## livenessProbe简介

存活指针，判断Pod（中的应用容器）是否健康，可以理解为健康检查。我们使用livenessProbe来定期的去探测，如果探测成功，则Pod状态可以判定为Running；如果探测失败，可kubectl会根据Pod的重启策略来重启容器。

如果未给Pod设置livenessProbe，则默认探针永远返回Success。

当我们执行`kubectl get pods`命令，输出信息中`STATUS`一列我们可以看到Pod是否处于`Running`状态。

## readinessProbe简介

就绪指针，就绪的意思是已经准备好了，Pod的就绪我们可以理解为这个Pod可以接受请求和访问。我们使用readinessProbe来定期的去探测，如果探测成功，则Pod 的Ready状态判定为True；如果探测失败，Pod的Ready状态判定为False。

与livenessProbe不同的是，kubelet不会对readinessProbe的探测情况有重启操作。

当我们执行`kubectl get pods`命令，输出信息中`READY`一列我们可以看到Pod的`READY`状态是否为True。

## 定义参数

livenessProbe和readinessProbe的定义参数是一致的，可以通过`kubectl explain pods.spec.containers.readinessProbe`或`kubectl explain pods.spec.containers.livenessProbe`命令了解：

![alt text](https://images.pding.top/2025/03/202503111814321.png)

就绪探针的几种类型：

**httpGet**：

向容器发送Http Get请求，调用成功（通过Http状态码判断）则确定Pod就绪；

使用方式：

```yaml
livenessProbe:
  httpGet:
    path: /app/healthz
    port: 80
```

**exec**：

在容器内执行某命令，命令执行成功（通过命令退出状态码为0判断）则确定Pod就绪；

使用方式：

```yaml
livenessProbe:
  exec:
    command:
    - cat 
    - /app/healthz
```

**tcpSocket**：

打开一个TCP连接到容器的指定端口，连接成功建立则确定Pod就绪。

使用方式：

```yaml
livenessProbe:
  tcpSocket:
    port: 80
```

一般就绪探针会在启动容器一段时间后才开始第一次的就绪探测，之后做周期性探测。所以在定义就绪指针时，会给以下几个参数：

- **initialDelaySeconds**：在初始化容器多少秒后开始第一次就绪探测；
- **timeoutSeconds**：如果该次就绪探测超过多少秒后还未成功，判定为超时，该次探测失败，Pod不就绪。默认值1，最小值1；
- **periodSeconds**：如果Pod未就绪，则每隔多少秒周期性的做就绪探测。默认值10，最小值1；
- **failureThreshold**：如果容器之前探测成功，后续连续几次探测失败，则确定容器未就绪。默认值3，最小值1；
- **successThreshold**：如果容器之前探测失败，后续连续几次探测成功，则确定容器就绪。默认值1，最小值1。

## 使用示例

目前我在docker hub有一个测试镜像：poneding/helloweb:v1，容器启动后，有一个健康检查路由/healthz/return200，访问该路由状态码返回200；有一个检查路由/health/return404，访问该路由状态码返回404。

![alt text](https://images.pding.top/2025/03/202503111820593.png)

![alt text](https://images.pding.top/2025/03/202503111820351.png)

### readinessProbe示例

在实验之前先了解一下Pod和Service的负载均衡关系：在K8s中，Service作为Pod的负载均衡器，是通过Label Selector匹配Pod的。但是这句话没有说完整，因为还有一个必要条件：Pod当前已经就绪。也就是说，Service通过Label Selector匹配当前就绪的Pod，还未就绪的Pod就算labelSelector匹配上了，也不会出现在Service的endpoints中，请求是不会被转发过去的，如下图示例。

![alt text](https://images.pding.top/2025/03/202503111820877.png)

示例说明：我们使用`poneding/helloweb:v1`镜像启动三个Pod，三个Pod的Label都设置成一样，为了使Service匹配到；三个Pod其中两个readinessProbe使用httpGet探测/health/return200，模拟探测成功，一个readinessProbe使用httpGet探测/health/return404，模拟探测失败。

编写我们的helloweb-readinessProbe.yaml文件如下：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: helloweb1
  labels:
    app: helloweb
spec:
  containers:
    - name: helloweb
      image: poneding/helloweb:v1
      readinessProbe:
          httpGet:
            path: /healthz/return200
            port: 80
          initialDelaySeconds: 30
          timeoutSeconds: 10     
      ports:
        - containerPort: 80

---
apiVersion: v1
kind: Pod
metadata:
  name: helloweb2
  labels:
    app: helloweb
spec:
  containers:
    - name: helloweb
      image: poneding/helloweb:v1
      readinessProbe:
          httpGet:
            path: /healthz/return200
            port: 80
          initialDelaySeconds: 30
          timeoutSeconds: 10     
      ports:
        - containerPort: 80

---
apiVersion: v1
kind: Pod
metadata:
  name: helloweb3
  labels:
    app: helloweb
spec:
  containers:
    - name: helloweb
      image: poneding/helloweb:v1
      readinessProbe:
          httpGet:
            path: /healthz/return404
            port: 80
          initialDelaySeconds: 30
          timeoutSeconds: 10     
      ports:
        - containerPort: 80

---
apiVersion: v1
kind: Service
metadata:
  name:  helloweb
spec:
  selector:
    app:  helloweb
  type:  ClusterIP
  ports:
  - name:  http
    port:  80
    targetPort:  80  
```

运行命令部署Pod和Service：

```shell
kubectl apply -f helloweb-readinessProbe.yaml
```

之后，我们查看Pod的就绪情况：

![alt text](https://images.pding.top/2025/03/202503111829400.png)

可以看到Pod只有helloweb1和helloweb2当前使处于`READY`（就绪）的状态，helloweb3尚未Ready，我们接着查看helloweb service的endpoints：

![alt text](https://images.pding.top/2025/03/202503111829752.png)

可以看到Service的EndPoints只将helloweb1、helloweb2 pod的IP负载上了。

查看日志访问情况：

![alt text](https://images.pding.top/2025/03/202503111829505.png)

可以看到每隔10秒（readniessProbe.periodSeconds默认10s）就会做一次就绪探测。

### livenessProbe示例

编写我们的helloweb-livenessProbe.yaml文件如下：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: helloweb4
  labels:
    app: helloweb
spec:
  containers:
    - name: helloweb
      image: poneding/helloweb:v1
      livenessProbe:
          httpGet:
            path: /healthz/return200
            port: 80
          initialDelaySeconds: 30
          timeoutSeconds: 10     
      ports:
        - containerPort: 80

---
apiVersion: v1
kind: Pod
metadata:
  name: helloweb5
  labels:
    app: helloweb
spec:
  containers:
    - name: helloweb
      image: poneding/helloweb:v1
      livenessProbe:
          httpGet:
            path: /healthz/return404
            port: 80
          initialDelaySeconds: 30
          timeoutSeconds: 10     
      ports:
        - containerPort: 80
```

运行命令部署Pod和Service：

```shell
kubectl apply -f helloweb-livenessProbe.yaml
```

之后，我们查看Pod的就绪情况：

![alt text](https://images.pding.top/2025/03/202503111829199.png)

可以看到helloweb4的STATUS状态为`Running`，而helloweb5的STATUS状态最终变为`CrashLoopBackOff`，并且一直在重启。

相信到这里，你已经对`readniessProbe`和`livenessProbe`有一个清晰的了解了。

![alt text](https://images.pding.top/2025/03/202503111829565.png)

---
[« Kustomize](kustomize.md)

[» local 存储卷实践](local-storageclass.md)
