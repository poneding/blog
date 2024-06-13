[🏠 首页](../_index.md) / [Docker](_index.md) / Linux 容器

# Linux 容器

容器是轻量级的虚拟化技术。

资源隔离和限制

## 容器镜像

### 联合文件系统

允许文件存放在不同的层级上，但是最终可以通过统一的视图查看到这些层级的所有文件。

## cgroup

## namespace

- mount：文件系统隔离
- uts：hostname domain
- pid：1号进程
- network
- user
- ipc：进程间通信
- cgroup

---
[« Dockerfile](dockerfile.md)

[» 非 root 账号获取 docker 权限](non-root-account-get-docker-permission.md)
