[🏠 首页](../_index.md) / [Docker](_index.md) / Docker 常用命令

# Docker 常用命令

## 启动容器命令

默认需要sudo权限执行

```sh
sudo docker run -d -p 80:80 --name nginx nginx
```

> --name：容器命名
>
> -d：在后台启动
>
> -p：<host端口>：<容器端口>
>
> --rm：容器退出即删除
>
> -it：i-与容器交互，t-终端

### 以root权限进入容器

```shell
sudo docker exec -it -u root nginx bash
```

### 让容器一直睡眠

使用 `curlimages/curl` 镜像，并让其一直睡眠。

```bash
docker run -d --name sleep curlimages/curl sleep infinity
```

## 操作镜像命令

### 查看镜像

```shell
sudo docker images
```

### 删除镜像

```shell
sudo docker rmi <image>
# or
sudo docker image rm <image>
```

### 删除所有镜像

```shell
sudo docker rmi $(docker images -q)
```

### 清除未使用镜像

```shell
sudo docker image prune
# or
sudo docker rmi $(sudo docker images | grep "^<none>" | awk "{print $3}")
```

### 模糊清除镜像

```bash
docker rmi $(docker images | grep 'query' | awk '{print $3}')
```
## 操作容器命令

### 查看已经退出的容器

```shell
sudo docker ps -a | grep Exited
```

### 清理已经退出的容器

```shell
sudo docker rm $(sudo docker ps -qf status=exited)
# or
sudo docker rm `sudo docker ps -a | grep Exited | awk '{print $1}'`
```

### 清除所有容器

> 使用 `-f` 参数才能清除所有容器，不使用则只会清理已经退出的容器

```shell
sudo docker rm $(sudo docker ps -a -q) -f
```

### 清除孤立容器

```shell
sudo docker container prune
```

### 强制删除容器

如果某个 Pod 突然不可用，那么运行在该节点上的 Pod 可能会一直处于 `Terminating` 的状态，无法移除。这时候如果想强制将该 Pod 从 etcd 数据库中删除，可以使用以下命令：

```bash
kubectl delete po <pod-name> -n <namespace> --force --grace-period=0
```

grace-period 表示过渡存活期，默认 30s，在删除 Pod 之前允许 Pod 慢慢终止其上的容器进程，从而优雅退出，0 表示立即终止 Pod。

---
[« docker buildx](docker-buildx.md)

[» Docker Compose 实践](docker-compose-practice.md)
