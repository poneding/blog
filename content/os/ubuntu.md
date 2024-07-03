[🏠 首页](../_index.md) / [操作系统](_index.md) / Ubuntu

# Ubuntu

## 终端默认使用英文

```bash
LANG=en_US.UTF-8
LANGUAGE=en_US:en
LC_ALL=en_US.UTF-8
```

## 下载 arm64 桌面镜像

```bash
https://cdimage.ubuntu.com/jammy/daily-live/current/jammy-desktop-arm64.iso
```

## 关闭防火墙

```bash
sudo ufw disable
sudo ufw status
```

## 修改时区

```bash
sudo cp /usr/share/zoneinfo/Asia/Shanghai  /etc/localtime
sudo timedatectl set-timezone Asia/Shanghai
date

# 同步时间
sudo apt install ntpdate -y
sudo ntpdate cn.pool.ntp.org
```

## 解决英文系统下中文显示问题

修改字体优先级

```bash
sudo vim /etc/fonts/conf.avail/64-language-selector-prefer.conf
```

注意：在 Ubuntu 23.10 或更新版本的系统上修改文件：

```bash
sudo vim /etc/fonts/conf.d/64-language-selector-cjk-prefer.conf
```

```txt

将 `JP` 和 `KR` 所在行往下调整即可，调整成如下所示：

```xml
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
        <alias>
                <family>sans-serif</family>
                <prefer>
                        <family>Noto Sans CJK SC</family>
                        <family>Noto Sans CJK TC</family>
                        <family>Noto Sans CJK HK</family>
                        <family>Noto Sans CJK JP</family>
                        <family>Noto Sans CJK KR</family>
                        <family>Lohit Devanagari</family>
                </prefer>
        </alias>
        <alias>
                <family>serif</family>
                <prefer>
                        <family>Noto Serif CJK SC</family>
                        <family>Noto Serif CJK TC</family>
                        <family>Noto Serif CJK JP</family>
                        <family>Noto Serif CJK KR</family>
                        <family>Lohit Devanagari</family>
                </prefer>
        </alias>
        <alias>
                <family>monospace</family>
                <prefer>
                        <family>Noto Sans Mono CJK SC</family>
                        <family>Noto Sans Mono CJK TC</family>
                        <family>Noto Sans Mono CJK HK</family>
                        <family>Noto Sans Mono CJK JP</family>
                        <family>Noto Sans Mono CJK KR</family>
                </prefer>
        </alias>
</fontconfig>
```

## 安装搜狗输入法

参照官方文档：<https://pinyin.sogou.com/linux/help.php>

```bash
# 禁用ctrl+shift+f
vim ~/.config/sogoupinyin/conf/env.ini
# 找到这行ShortCutFanJian=1，改为ShortCutFanJian=0
vim ~/.config/fcitx/conf/fcitx-chttrans.config
# 找到 #Hotkey=CTRL_SHIFT_F，取消注释，并改为 #Hotkey=CTRL_SHIFT_]
# 保存之后，重新登录即可
```

## 修复 No Wi-Fi Adapter Found 问题

```bash
rfkill unblock all
sudo /etc/init.d/networking restart
sudo rm /etc/udev/rules.d/70-persistent-net.rules
sudo reboot
```

## M720 鼠标优联连接

下载 Solaar

```bash
sudo apt install solaar
```

下载完成之后，插入 USB 接收器，M720 切换至未被占用的 Channel，并重新启动（Off => On）。

打开 Solaar 应用

```bash
solaar
```

如果没有发现 M720 鼠标，则重启 Ubuntu，重启之后再次打开 Solaar 之后，可以看到列表中出现 Solaar，点击 "Pair the device" 即可。

## Ubuntu 启用中文输入法

好像是 Ubuntu 23.10 后支持。

1. 首先需要安装中文语言；
2. 选择输入法，Chinese，双击打开；
3. 输入法设置，取消英文模式。

## 虚拟机

VMWare Fusion 开启宿主机复制粘贴功能，桌面版 Ubuntu 系统安装插件：

```bash
sudo apt install open-vm-tools open-vm-tools-desktop -y
```

安装完之后，重启虚拟机即可。

## 升级

### 22.04 -> 23.04

```bash
sudo apt update
sudo apt upgrade -y

sudo apt install update-manager-core -y
sudo vim /etc/update-manager/release-upgrades
# modify Prompt=lts to Prompt=normal

sudo sed -i 's/jammy/lunar/g' /etc/apt/sources.list
sudo apt update
sudo apt upgrade -y
sudo apt dist-upgrade -y
```

### 23.04 -> 23.10

```bash
sudo apt update
sudo apt upgrade -y
sudo do-release-upgrade
```

## 输入法

RIME 输入法：

```bash
sudo apt install ibus-rime
```

安装完成后，需要注销当前用户重新登录或者直接重启生效。

配置：

输入时按 F4，可以直接在输入界面配置，例如配置默认使用简体，默认使用英文等。

## gnome-tweak 工具

下载：

```bash
sudo apt install gnome-tweak -y
```

应用界面找到 Tweak 应用运行，或者直接终端输入 `gnome-tweak` 运行。

配置：

1. 在 2K 分辨率屏幕下可以调整配置：字体 -> Scaling Factor -> 调整为 1.2；

## Ulauncher

安装：

```bash
export VERSION=$(curl -s https://api.github.com/repos/Ulauncher/Ulauncher/releases/latest | jq -r .tag_name)

wget https://github.com/Ulauncher/Ulauncher/releases/download/${VERSION}/ulauncher_${VERSION}_all.deb

sudo dpkg -i ulauncher_${VERSION}_all.deb

# 如果遇到依赖问题，则运行以下命令：
sudo apt install --fix-broken
```

配置 `Alt+Space` 快捷键：

Setting => Keyboard => Keyboard Shortcuts => View and Customize Shortcuts

第一步，先通过输入 `Alt+Space` 查询当前快捷键冲突，删除当前快捷键使用；

第二步，添加新的自定义快捷键：

```txt
Name：Ulauncher
Command：ulauncher-toggle
Shortcut：Alt+Space
```

---
[« openssl](openssl.md)

[» Windows 使用姿势](windows.md)
