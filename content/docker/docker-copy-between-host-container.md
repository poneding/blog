[🏠 首页](../_index.md) / [Docker](_index.md) / Docker 主机容器互拷贝文件

# Docker 主机容器互拷贝文件

命令：`docker cp`

## 1. 将 Docker 容器内文件拷贝到 Host

 获取 docker 容器的 Container ID 或Name

```shell
sudo docker ps
```

![alt text](https://images.poneding.com/2025/03/202503112120377.png)

使用以下命令从容器内拷出文件

```shell
sudo docker cp [CONTAINER ID/NAME]:[CONTAINER_PATH] [HOST_PATH]
```

例如我需要将容器内 `/app/appsettings.json` 文件拷贝到宿主机的 `~/temp/` 目录 ***（该目录必须存在）*** 下

```shell
sudo docker cp b3e608e28f21:/app/appsettings.json ~/temp/appsettings.json
# 不指定文件名亦可，默认使用原文件名
sudo docker cp b3e608e28f21:/app/appsettings.json ~/temp/
```

## 2. 将 Host 文件拷贝至 Docker 容器

同样，需要先获取容器的 Container ID 或 Name；

使用以下命令将文件拷贝至容器内

```shell
sudo docker cp [HOST_PATH] [CONTAINER ID/NAME]:[CONTAINER_PATH]
```

例如我需要将宿主机的 `~/temp/hello.txt` 文件拷贝至容器内 `/app/` 目录 ***（该目录必须存在）*** 下

```shell
sudo docker cp ~/temp/hello.txt b3e608e28f21:/app/hello.txt 
# 不指定文件名亦可，默认使用原文件名
sudo docker cp ~/temp/hello.txt b3e608e28f21:/app/
```

---
[« Docker 容器中安装 PFX 证书](docker-container-install-pfx-cert.md)

[» 使用 docker manifest 命令构建多架构镜像](docker-manifest-build-cross-arch-image.md)
