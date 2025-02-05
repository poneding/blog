[🏠 首页](../_index.md) / [Docker](_index.md) / Mac 重装 Docker Desktop

# Mac 重装 Docker Desktop

在使用 Docker Desktop 的过程中，突然遇到程序崩溃 `Invalid virtual machine configuration. The storage device attachment is invalid`，在重启以及简单重装无果后，我们试用以下方式重装。

第一步，卸载 Docker Desktop，打开终端，执行以下命令：

```bash
# 卸载
/Applications/Docker.app/Contents/MacOS/uninstall

# 删除剩余文件
rm -rf ~/Library/Group\ Containers/group.com.docker
rm -rf ~/Library/Containers/com.docker.docker
rm -rf ~/.docker
```

第二步，重启 Mac，重启后，打开活动监视器，查看是否存在名为`com.docker.vmnetd` 的进程，如果存在，结束该进程（如果无法正常结束，那么尝试强制结束进程）。

第三步，重装 Docker Desktop。

---
[« 非 root 账号获取 docker 权限](non-root-account-get-docker-permission.md)

[» nginx](some-apps.md)
