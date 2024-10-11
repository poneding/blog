[🏠 首页](../_index.md) / [Linux](_index.md) / 制作 Linux 系统启动 U 盘

# 制作 Linux 系统启动 U 盘

以制作 Ubuntu 启动 U 盘为例：已经下载了 Ubuntu 镜像文件：`ubuntu-22.04.5-live-server-arm64.iso`

## Windows 系统下制作

使用 [Rufus](https://rufus.ie/zh/) 工具。

## Mac 系统下制作

```bash
hdiutil convert -format UDRW -o ubuntu-2204 
```

查看 U 盘名称：

```bash
diskutil list
```

卸载 U 盘：

```bash
diskutil unmountDisk /dev/disk2
```

制作盘：

```bash
sudo dd if=ubuntu-18.04.dmg of=/dev/rdisk2 bs=1m
```

> 注意，这里 /dev/rdisk2 U 盘名称前加了一个 r，制作速度会更快。

等待制作完成，弹出 U 盘：

```bash
diskutil eject /dev/disk2
```

## Linux 系统下制作

与 Mac 系统下制作类似，首先查看 U 盘名称：

```bash
sudo fdisk -l
```

卸载 U 盘：

```bash
umount /dev/sda1
```

格式化 U 盘：

```bash
sudo mkfs.ntfs -f /dev/sda1
```

制作盘：

```bash
sudo dd if=~/Downloads/ubuntu-22.04.5-live-server-arm64.iso of=/dev/sda1
```

等待制作完成，弹出 U 盘：

```bash
sudo eject eject /dev/sda
```

---
[« Linux-安全登录](linux-secure-login.md)

[» Linux 挂载磁盘](mount-disk.md)
