[🏠 首页](../_index.md) / [Linux](_index.md) / Linux 挂载磁盘

# Linux 挂载磁盘

1. 在 VMware 界面添加额外的虚拟硬盘。
2. 在 Linux 系统中识别并挂载这个新硬盘。

以下是详细的步骤：

## 识别新磁盘

登录 Linux 系统，使用 lsblk 或 fdisk 命令检查新添加的磁盘设备。

```bash
lsblk
```

或

```bash
sudo fdisk -l
```

你应该能看到一个新的设备，例如 /dev/sdb（根据你实际的设备名称）。

## 分区新磁盘

如果磁盘是全新的，需要先为其创建分区。

1. 使用 fdisk 为新磁盘创建分区：

```bash
sudo fdisk /dev/sdb
```

2. 按以下步骤操作：

• 输入 n 创建新分区。

• 输入 p 创建主分区。

• 输入分区号（通常是 1）。

• 选择分区大小，默认值可以将整个磁盘用于一个分区。

• 输入 w 写入更改并退出。

## 格式化新分区

使用 mkfs 命令格式化新创建的分区，例如格式化为 ext4 文件系统：

```bash
sudo mkfs.ext4 /dev/sdb1
```

/dev/sdb1 是刚刚创建的分区，根据实际情况修改。

## 挂载新分区

创建一个挂载点并挂载分区：

1. 创建挂载目录，例如 /mnt/newdisk：

```bash
sudo mkdir /mnt/newdisk
```

2. 挂载分区：

```bash
sudo mount /dev/sdb1 /mnt/newdisk
```

3. 验证是否挂载成功：

```bash
df -h
```

## 配置自动挂载

如果你希望系统重启后自动挂载该磁盘，需要将挂载信息写入 /etc/fstab 文件。

1. 获取分区的 UUID：

```bash
sudo blkid /dev/sdb1
```

这会返回类似这样的输出：

```txt
/dev/sdb1: UUID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" TYPE="ext4"
```

2. 编辑 /etc/fstab 文件：

```bash
sudo vim /etc/fstab
```

3. 在文件末尾添加一行，指定分区的 UUID、挂载点、文件系统类型等信息：

```txt
UUID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx /mnt/newdisk ext4 defaults 0 0
```

4. 保存并退出。使用以下命令测试挂载是否正确：

```bash
sudo mount -a
```

---
[« Linux-安全登录](linux-secure-login.md)

[» shell 命令间隔符](shell-command-interval-character.md)
