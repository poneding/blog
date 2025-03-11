[🏠 首页](../_index.md) / [Docker](_index.md) / Docker 可视化工具 Kitematic

# Docker 可视化工具 Kitematic

![alt text](https://images.poneding.com/2025/03/202503111823842.png)

使用 Kitematic，以可视化的方式管理 docker 镜像，容器等。

## 安装 Kitematic

在 ubuntu（desktop）中安装 kitematic 作为示例，其他平台安装下载地址：<https://github.com/docker/kitematic/releases>

```bash
# download
wget https://github.com/docker/kitematic/releases/download/v0.17.11/Kitematic-0.17.11-Ubuntu.zip
unzip Kitematic-0.17.11-Ubuntu.zip

# install
sudo dpkg -i Kitematic-0.17.11_amd64.deb
```

## 用户组管理

ubuntu 已经安装了 docker 了，当我们安装完 Kitematic 之后，第一次打开会遇到

将当前用户加入到 docker 组：

```shell
sudo usermod -aG docker $USER
# 重启 docker
sudo systemctl restart docker
sudo chmod a+rw /var/run/docker.sock
```

完成上面操作后，重启主机，应该就可以使用 Kitamatic 了。

## 使用 Kitematic

第一次启动 Kitematic，需要登录 docker 账号，登录完成后，界面如下。

![alt text](https://images.poneding.com/2025/03/202503111823004.png)

主界面会列出一些热门的镜像，比如 redis，jenkins。可以通过切换右上角菜单选项，查看我的 Docker 账号中的镜像列表，以及我当前主机中已经拉取的镜像列表。

点击镜像的 Create 按钮，可以直接以默认方式启动容器，比如我选择 redis 镜像，点击 Create 按钮，之后会在我的左侧 Containers 列表中出现一个 redis 容器，这个过程中包含拉取镜像，启动容器。

![alt text](https://images.poneding.com/2025/03/202503111823284.png)

容器运行后，可以在容器界面对容器进行容器配置，例如环境变量配置、端口映射配置、卷映射配置等；

也可以在容器界面对容器进行容器管理，例如容器停止、重启、和删除。

![alt text](https://images.poneding.com/2025/03/202503111823425.png)

这个工具功能还在不断完善，但是使用体验还算不错，推荐给大家，更多使用细节可以自己慢慢挖掘。

---
[« 理解 docker run --link](docker-run-link.md)

[» Dockerfile](dockerfile.md)
