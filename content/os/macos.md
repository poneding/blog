[🏠 首页](../_index.md) / [操作系统](_index.md) / MacOS

# MacOS

## CursorUIViewService 未响应

```bash
sudo defaults write /Library/Preferences/FeatureFlags/Domain/UIKit.plist redesigned_text_cursor -dict-add Enabled -bool NO

# 改回
sudo defaults write /Library/Preferences/FeatureFlags/Domain/UIKit.plist redesigned_text_cursor -dict-add Enabled -bool YES
```

## 静态壁纸位置

历史系统壁纸: `/Users/dp/Library/Application Support/com.apple.mobileAssetDesktop`
当前系统壁纸：`/System/Library/Desktop Pictures`
动态壁纸：`/Library/Application Support/com.apple.idleassetsd/Customer/4KSDR240FPS`

## Git 忽略 .DS_Store 文件

```bash
# 配置全局忽略文件
git config --global core.excludesfile ~/.gitignore_global

# 添加 .DS_Store 文件到全局忽略文件
echo .DS_Store >> ~/.gitignore_global
echo ._.DS_Store >> ~/.gitignore_global
echo **/.DS_Store >> ~/.gitignore_global
echo **/._.DS_Store >> ~/.gitignore_global
```

## 配置 PATH

在终端使用 `export` 命令设置 `PATH` 并不能全局生效，如果你想设置全局 `PATH` ，可以使用以下这个方法：

```bash
sudo mkdir /etc/paths.d/mypath
vim /etc/paths.d/mypath
/your/path
```

## 查看端口占用并退出程序

有时候使用 VSCode 调试或运行程序后，无法成功推出程序，端口一直占用。

查看端口占用：

```bash
# [port] 替换成你想查看的端口号，例如：sudo lsof -i tcp:8080
sudo lsof -i tcp:[port]
```

上述命令可以得到程序的进程 PID，退出进程：

```bash
# [PID] 替换成程序的进程 PID
sudo kill -9 [PID]
```

## 重置 Downie 试用

```bash
rm -rfv ~/Library/Containers/com.charliemonroe.Downie-4/Data/Library/Application\ Support/Downie\ 4
```

配置快捷命令：

```bash
vim ~/.zsh

alias reset-downie-trial='rm -rfv ~/Library/Containers/com.charliemonroe.Downie-4/Data/Library/Application\ Support/Downie\ 4'

```

## 自定义 PATH

```bash
mkdir -p ~/.dev/bin
echo "export PATH=$PATH:~/.dev/bin"
```

## 更新 Python 的证书包

```bash
/Applications/Python\ 3.6/Install\ Certificates.command
```

## Mac 缓存清理

### go 缓存清理

```bash
go clean -cache
```

### npm 缓存清理

```bash
npm cache clean --force
sudo npm cache clean --force
```

### yarn 缓存清理

```bash
yarn cache clean
```

### rust 缓存清理

```bash
# install cargo-cache
cargo install cargo-cache
# clean cache
cargo cache --autoclean
```

## iTerm2

解决 iTerm2 下使用 Solarized Dark 主题时，zsh-autosuggestions 显示问题：

```bash
vim .oh-my-zsh/custom/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh
```

找到并配置：`ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='fg=10'`

```txt
exec zsh
```

## Go 调试问题

如果遇到 `Failed to launch: could not launch process: can not run under Rosetta, check that the installed build of Go is right for your CPU architecture` 问题，尝试以下解决方案：

安装最新版本的 `delve`：

```bash
go install github.com/go-delve/delve/cmd/dlv@latest
```

## 卸载程序文件权限问题

在参照 Docker 官方文档[卸载 Docker Desktop](https://docs.docker.com/desktop/uninstall/) 时，遇到了程序文件删除问题：

```bash
$ rm -rf ~/Library/Containers/com.docker.docker

rm: /Users/dp/Library/Containers/com.docker.docker/.com.apple.containermanagerd.metadata.plist: Operation not permitted
rm: /Users/dp/Library/Containers/com.docker.docker: Operation not permitted
```

解决方案：

进入系统设置 => 隐私与安全性 => 完全磁盘访问权限，添加终端程序如 `iTerm` 访问权限。再次执行删除命令，OK～

## 设置 Dock 栏显示速度

```bash
defaults write com.apple.dock autohide-delay -float 0 && defaults write com.apple.dock autohide-time-modifier -float 0.2 && killall Dock
```

重置：

```bash
defaults delete com.apple.dock autohide-delay && defaults delete com.apple.dock autohide-time-modifier && killall Dock
```

## python

在 Mac 上卸载了老版本的 python，并安装了新版本的 python3 后，执行命令提示：env: python: No such file or directory

解决方式：

```bash
sudo ln -s -f /usr/local/bin/python3 /usr/local/bin/python
```

## ITerm2 配置


![image.png](https://images.poneding.com/2024/10/20241013092641.png)
![image.png](https://images.poneding.com/2024/10/20241013092858.png)


---
[» ohmyzsh](ohmyzsh.md)
