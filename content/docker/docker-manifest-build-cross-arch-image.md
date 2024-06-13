[🏠 首页](../_index.md) / [Docker](_index.md) / 使用 docker manifest 命令构建多架构镜像

# 使用 docker manifest 命令构建多架构镜像

```bash
# 创建
docker manifest create poneding/myimage:v1 poneding/myimage-amd64:v1 poneding/myimage-arm64:v1

# 注解
docker manifest annotate poneding/myimage:v1 poneding/myimage-amd64:v1 --arch amd64
docker manifest annotate poneding/myimage:v1 poneding/asmyimageh-arm64:v1 --arch arm64

# 检查
docker manifest inspect poneding/myimage:v1

# 推送
docker manifest push poneding/myimage:v1
```

在 x86 机器上构建 arm64 镜像

```bash
docker run --rm --privileged multiarch/qemu-user-static --reset --persistent yes
```

---
[« Docker 主机容器互拷贝文件](docker-copy-between-host-container.md)

[» 理解 docker run --link](docker-run-link.md)
