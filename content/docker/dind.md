[🏠 首页](../_index.md) / [Docker](_index.md) / Docker in Docker

# Docker in Docker

![alt text](https://images.poneding.com/2025/03/202503111822355.png)

`Docker-in-Docker` 的意思是在 Docker 容器中使用 docker，就像和在宿主机上使用 docker 一样，你可以理解为**套娃**。

场景：

如果你的 Jenkins 是使用 Docker 容器的方式运行的，如果你想使用 Jenkins 的 Docker 插件来为 Jenkins Job 提供运行容器，这时候你就需要用到 Docker-in-Docker；

一般这个技术使用在应用的程序集成中 **CI/CD**。

## 1. 挂载主机 /var/run/docker.sock

![alt text](https://images.poneding.com/2025/03/202503111822477.png)

**Docker 容器**：

```bash
docker run -v /var/run/docker.sock:/var/run/docker.sock --name docker-in-docker -it docker
```

在运行起来的容器中使用docker：

```bash
$ docker run -v /var/run/docker.sock:/var/run/docker.sock --name docker-in-docker -it docker
/ # docker run hello-world

Hello from Docker!
This message shows that your installation appears to be working correctly.
...
```

可以看到，在该容器中可以像在宿主机一样运行 docker 容器。

但是，使用 `docker ps -a` 命令可以查看到宿主机的运行容器，这说明容器的权限是很大的，存在一定的安全隐患：

![alt text](https://images.poneding.com/2025/03/202503111822957.png)

**Kubernetes Pod**：

准备 docker-in-docker.yaml 文件如下：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: docker-in-docker
spec:
  containers:
    - name: docker
      image: docker
      command: ["/bin/sh", "-c"]
      args:
        - sleep 300s;
      volumeMounts:
        - name: docker-sock
          mountPath: /var/run/docker.sock
  volumes:
    - name: docker-sock
      hostPath:
        path: /var/run/docker.sock
```

```bash
kubectl apply -f docker-in-docker.yaml
kubectl exec -it docker-in-docker -c docker /bin/sh
```

同样，这种方式也能获取到宿主机的容器。

![alt text](https://images.poneding.com/2025/03/202503111822263.png)

## 2. 使用 Docker-Dind

![alt text](https://images.poneding.com/2025/03/202503111821052.png)

**Docker 容器**：

```bash
docker run --privileged -d --name docker-in-docker docker:dind
docker exec -it docker-in-docker /bin/sh
```

与上面方式不同的是，这种方式运行起来的 docker-in-docker 无法看到宿主机上的容器。

![alt text](https://images.poneding.com/2025/03/202503111821799.png)

**Kubernetes Pod**：

准备 docker-in-docker.yaml 文件如下：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: docker-in-docker
spec:
  containers:
    - name: docker
      image: docker:18
      imagePullPolicy: Always
      env:
        - name: DOCKER_HOST
          value: tcp://localhost:2375
      command: ["/bin/sh", "-c"]
      args:
        - sleep 300s;
    - name: docker-dind
      image: docker:18-dind
      securityContext:
        privileged: true
  restartPolicy: OnFailure
```

> 注意：
>
> 需要两个容器，第一容器由 docker 镜像运行，第二容器由 `docker:dind` 镜像运行；
>
> 第一容器需要设置环境变量：`DOCKER_HOST=tcp://localhost:2375`；
>
> 第二容器使用特权模式运行。

```bash
kubectl apply -f docker-in-docker.yaml
kubectl exec -it docker-in-docker -c docker /bin/sh
```

## 3. 结束语

前面提到了，由于第一种方式挂载主机 `/var/run/docker.sock`，在容器视角依然能获取到宿主机的容器，也能运行或删除容器，存在一定的安全隐患，更推荐使用第二种方式，Over!

---
[« container-diff 工具的使用](container-diff.md)

[» docker buildx](docker-buildx.md)
