[🏠 首页](../_index.md) / [Git](_index.md) / Gitlab 跨版本升级

# Gitlab 跨版本升级

本文记录 Gitlab 跨版本升级的具体操作过程。

按照官方的说法，gitlab 允许小版本直接升级，大版本需要阶段升级。

跨版本升级示例：**`11.0.x` -> `11.11.x` -> `12.0.x` -> `12.10.x` -> `13.0.x`**。

官方推荐的升级路线文档：<https://docs.gitlab.com/ee/policy/maintenance.html#upgrade-recommendations>

## 目的

实现 gitlab 版本：11.2.3 到 13.0.0 版本的升级，我选择的升级路线是：11.2.3 => 11.11.8 => 12.0.12  => 12.10.6 => 13.0.0 => 13.1.2

我当前创建 gitlab 容器的脚本如下：

```bash
sudo docker run --detach \
  --hostname gitlab.example.com \
  --publish 8443:443 --publish 8080:80 --publish 8022:22 \
  --name gitlab \
  --restart always \
  --volume /home/ubuntu/Apps/gitlab/etc/gitlab:/etc/gitlab \
  --volume /home/ubuntu/Apps/gitlab/var/log/gitlab/logs:/var/log/gitlab \
  --volume /home/ubuntu/Apps/gitlab/var/opt/gitlab:/var/opt/gitlab \
  gitlab/gitlab-ce:11.2.3-ce.0
```

我当前的 gitlab 容器已经将 `/etc/gitlab`，`/var/log/gitlab`，`/var/opt/gitlab` 挂载到了宿主机上。

## 操作步骤

进入 gitlab 容器，停止 gitlab 服务，然后退出容器：

```shell
sudo docker exec -it gitlab /bin/bash
# 进入容器后执行
gitlab-ctl stop
```

退出容器后，删除 gitlab 容器：

```shell
sudo docker rm gitlab -f
```

使用新版本的脚本运行 gitlab 容器，这里只修改 gitlab 的镜像版本就可以了：

```shell
sudo docker run --detach \
  --hostname gitlab.example.com \
  --publish 8443:443 --publish 8080:80 --publish 8022:22 \
  --name gitlab \
  --restart always \
  --volume /home/ubuntu/Apps/gitlab/etc/gitlab:/etc/gitlab \
  --volume /home/ubuntu/Apps/gitlab/var/log/gitlab/logs:/var/log/gitlab \
  --volume /home/ubuntu/Apps/gitlab/var/opt/gitlab:/var/opt/gitlab \
  gitlab/gitlab-ce:11.2.3-ce.0
```

启动容器后，查看容器运行状态：

```shell
sudo docker ps | grep gitlab
```

等到容器状态为 `Up xxx (healthy)` 后，进入容器，停掉 gitlab 服务。。。

后面就是重复工作了，直到运行最新版本的gitlab容器。

## Gitlab 备份

在升级之前，最好先对 gitlab 数据做一个全量备份，避免升级失败造成的不可逆影响。

具体的还原操作如下：

如果你和我一样使用 gitlab 容器，首先进入容器，然后执行备份命令：

```shell
gitlab-rake gitlab:backup:create
```

以上命令执行完后，会在容器的 `/var/opt/gitlab/backups` 目录下创建文件名类似 `1592276197_2020_06_16_11.2.3_gitlab_backup.tar` 的备份文件。

## Gitlab 还原

如果你想利用 gitlab 的备份文件还原，那么你运行还原操作的 gitlab 必须和备份时使用的 gitlab 版本一致，否则可能会出现还原失败的问题。

具体的还原操作如下：

如果你和我一样使用 gitlab 容器，首先将 gitlab 的备份文件拷贝到 `/var/opt/gitlab/backups/` 目录下，然后进入 gitlab 容器，执行还原命令：

```shell
gitlab-rake gitlab:backup:restore BACKUP=1592276197_2020_06_16_11.2.3
```

> `BACKUP` 命令参数指定值为 `/var/opt/gitlab/backups/` 目录下的备份文件，但是无需携带 `_gitlab_backup.tar` 后缀。

---
[« Gitlab 添加 K8s 集群](gitlab-intergrate-k8s.md)

[» 多 GitHub 账号管理](multi-github-account-management.md)
