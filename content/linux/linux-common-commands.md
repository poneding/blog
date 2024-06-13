[🏠 首页](../_index.md) / [Linux](_index.md) / Linux常用命令

# Linux常用命令

## 1.文件和目录相关

```powershell
cd ..  切换到上一级目录
cd ../.. 切换到上两级目录
cd [dir]  进入 dir 目录
cd   进入个人的主目录
cd ~[username] 进入个人的主目录
cd -  进入上次目录

pwd  查看目录路径 
ls  查看当前目录下的目录和文件（不包含隐藏目录或文件）
ls -a 查看当前目录下的所有目录和文件
ls -F 查看当前目录下的文件 （不包含目录和隐藏文件）
ls -l 查看文件和目录的详细资料 
ls *[0-9]* 查看包含字符的文件和目录

mkdir dir1 创建目录
mkdir dir1 dir2 
mkdir -p dir1/dir1/dir1  创建一个目录树

rm -f file1 删除文件
rmdir dir1 删除空
rm -rf dir1 删除包含内容的目录
rm -rf dir1 dir2 删除多个目录
mv dir1 dir2 重命名或移动一个目录（看 dir2 是否存在）
cp file1 file2  复制文件
cp dir/* . 复制某目录下所有内容到当前目录
cp -a dir1/dir2 .  复制目录下所有内容到当前目录
cp -a dir1 dir2  复制一个目录

ln -s dir1|file1 link1 创建文件或目录 link 的软件链接
ln dir1|file1 link1  创建文件或目录 link 的物理链接，也叫硬链接
[
 软链接和物理链接的区别：
 1. 软链接可以用于目录和文件，物理链接只能用于文件；
 2. 源文件删除后，物理链接仍然可以打开访问(更像复制)，软链接则已经损坏
]

find /home/[user] -name  某目录下搜索文件
find ~ -iname '*test*'  # iname 忽略大小写

zip file1.zip file1 file2 dir1  将文件和目录压缩成 zip 文件（dir 不包含内容）
zip -r file1.zip file1 file2 dir1 将文件和目录压缩成 zip 文件（dir 包含内容）
unzip file1.zip  解压 zip 文件
tar -zxvf ***.tar.gz

cat file1  查看一个文件
tac file1   从最后一行开始反向查看一个文件的内容 
more file1   查看一个长文件的内容 
less file1   类似于 'more' 命令，但是它允许在文件中和正向操作一样的反向操作 
head -2 file1  查看一个文件的前两行 
tail -2 file1  查看一个文件的最后两行 

grep hello file1 查询关键字 ‘hello’
dump -0aj -f /tmp/home0.bak /home 制作一个 '/home' 目录的完整备份 
dump -1aj -f /tmp/home0.bak /home 制作一个 '/home' 目录的交互式备份 

vi file1 //编辑文件

# lsof (https://www.cnblogs.com/sparkbj/p/7161669.html)
lsof # 列出所有打开的文件
lsof /path/file # 查看谁在使用某个文件
losf -u username # 查看某用户打开的文件
```

## 2.系统

```powershell
date 显示当前时间 

shutdown -h now  关闭系统
reboot 重启
logout 注销

groupadd group_name  创建一个新用户组 
groupdel group_name  删除一个用户组 
groupmod -n new_group_name old_group_name  重命名一个用户组 
useradd -c "Name Surname " -g admin -d /home/user1 -s /bin/bash user1  创建一个属于 "admin" 用户组的用户 
usermod -a -G sudo dp 将用户添加到sudo组
useradd user1  创建一个新用户 
userdel -r user1  删除一个用户 ( '-r' 排除主目录) 
usermod -c "User FTP" -g system -d /ftp/user1 -s /bin/nologin user1  修改用户属性 
passwd  修改密码 
passwd user1  修改一个用户的口令 (只允许root执行) 

# 以下两个命令可用于查看user属于哪个组
id user1
groups user1

# screen
screen -dmS dp
screen -ls
screen -rd dp

# 查看linux系统
cat /proc/version
uname -a
lsb_release -a (首选)
```

## 3.技巧

```shell
# 上行命令的最后一个参数 !$
$ mv /path/to/wrongfile /some/other/place
mv: cannot stat '/path/to/wrongfile': No such file or directory
$ mv /path/to/rightfile !$

# 上行命令的第 n 个参数，0,1,2,..,n !:n
$ tar -cvf afolder afolder.tar # 写反参数
tar: failed to open
$ !:0 !:1 !:3 !:2
tar -cvf afolder.tar afolder

# 上行命令参数范围 
$ grep '(ping|pong)' afile # 写错 egrep
# Linux 下 grep 显示前后几行信息
# 标准 unix/linux 下的 grep 通过下面參数控制上下文
grep -C 5 foo file 显示 file 文件里匹配 foo 字串那行以及上下 5 行
grep -B 5 foo file 显示 foo 及前 5 行
grep -A 5 foo file 显示 foo 及后 5 行

$ egrep !:1-$
egrep '(ping|pong)' afile
ping

# 前一个命令结果过滤
$ ps -ef | grep nginx

# 查看端口
lsof -i:[port]
netstat -tunlp |grep [port]

# 远程
sudo ssh -i xxx.pem ubuntu@192.168.1.1 
# 远程直接进入某目录
sudo ssh -i xxx.pem ubuntu@192.168.1.1 -t '/some/path; bash --login'

# linux 系统间文件复制
sudo scp -i ~/dp/k8s.dp.io/.ssh/id_rsa /home/ubuntu/hello.txt admin@bastion-k8s-dp-com-qcojf8-1198362181.ap-southeast-1.elb.amazonaws.com:~/

# shell 文件出错即退出
#!/usr/bin/env bash
set -e -o pipefail

# 查看系统是 32 位还是 64 位
uname -a

# 退出 telnet
ctrl+]，然后输入 quit
# base64 编码&反编码
echo -n "JayChou" | base64
echo -n SmF5Q2hvdQ== | base64 --decode
```

## apt

```shell
apt upgrade
apt update [-y]
apt install [pkg] [-y]
apt remove/autoremove [pkg] [-y]
apt purge
```

## CentOS

```shell
sudo dhclient
sudo yum update -y
su root
vi /etc/sudoers
# root ALL=(ALL) ALL 后添加
xxx  ALL=(ALL)   ALL
# 或者
xxx  ALL=(ALL)   NOPASSWD: ALL  （不用密码）
# wq!退出

ip addr
cd /etc/sysconfig/network-scripts/
ls
sudo vi ifcfg-ens33 # ONBOOT=no 改成yes
sudo ifup ens33

# 查看文件大小
ls -ll
ls -lh
# 查看目录大小
du -sh ＊
du -sh /path/*
```

- **虚拟机镜像文件**：

  CentOS7

  下载地址：<http://mirrors.aliyun.com/centos/7/isos/x86_64/CentOS-7-x86_64-DVD-2003.iso>

## Kitematic

Download: <https://github.com/docker/kitematic/releases>

install on ubutnu:

```shell
sudo dpkg -i Kitematic-0.17.11_amd64.deb
```

```shell
sudo groupadd docker
sudo usermod -aG docker $USER
```

reboot ubutnu, then using Kitematic.

## sed替换文本

比如 `hello.txt` 文本中内容如下：

```txt
hello, Name!
```

现使用真实 Name 替换掉 `#Name#`。

```bash
export Name=JayChou
sed -i "s/Name/$Name/g" hello.txt
```

但是如果替换的文本中包含 `/` 的话，那么上面这个命令会失败：`sed: -e expression #1, char 12: unknown option to`

例如

```bash
export Name=Jay/Chou
sed -i "s/Name/$Name/g" hello.txt
```

这里为了保留被替换文本的 `/`，有两种方法

1. 在被替换文本中使用转义符号：

   ```bash
   export Name=Jay\/Chou
   sed -i "s/Name/$Name/g" hello.txt
   ```

2. 使用 `#` 代替 `/` 作为 sed 中替换与被替换字符的分割符：

   ```bash
   export Name=Jay/Chou
   sed -i "s#Name#$Name#g" hello.txt
   ```

## 修改命令行文件路径显示

文件路径太长，命令行很难看，只显示当前目录：

```bash
vim ~/.bashrc
# 将下行的w改成W
PS1='${debian_chroot:+($debian_chroot)}\u@\h:\W\$'
```

## 网络命名空间

```bash
sudo ip netns add newnetns
sudo ip netns exec newnetns bash
# 进入命名空间后 使用exit退出
sudo ip netns exec newnetns bash -rcfile <(echo "PS1=\"greenland> \"")

sudo ip netns delete newnetns
```

## 清理工作

一、删除缓存

1，非常有用的清理命令：

```bash
sudo apt-get autoclean        清理旧版本的软件缓存
sudo apt-get clean          清理所有软件缓存
sudo apt-get autoremove       删除系统不再使用的孤立软件
```

这三个命令主要清理升级缓存以及无用包的。

2，清理 opera firefox 的缓存文件：

```bash
ls ~/.opera/cache4
ls ~/.mozilla/firefox/*.default/Cache
```

3，清理 Linux 下孤立的包：
终端命令下我们可以用：

```bash
sudo apt-get install deborphan -y
```

4，卸载：tracker
这个东西一般我只要安装 ubuntu 就会第一删掉 tracker 他不仅会产生大量的 cache 文件而且还会影响开机速度。再软件中心删除。

附录：
包管理的临时文件目录:
包在
/var/cache/apt/archives
没有下载完的在
/var/cache/apt/archives/partial

二、删除软件

ubuntu 软件的删除一般用“ubuntu 软件中心”或“新立得”就能搞定，但有时用命令似乎更快更好～～

```bash
sudo apt-get remove --purge 软件名
sudo apt-get autoremove                            删除系统不再使用的孤立软件
sudo apt-get autoclean                              清理旧版本的软件缓存
dpkg -l |grep ^rc|awk '{print $2}' |sudo xargs dpkg -P       清除残余的配置文件
```

保证干净。

三、删除多余内核

1，首先要使用这个命令查看当前 Ubuntu 系统使用的内核

```bash
uname -a
```

2，再查看所有内核

```bash
dpkg --get-selections|grep linux
```

3，最后小心翼翼地删除吧

```bash
sudo apt-get remove linux-image-2.6.32-22-generic
```

ps：linux-image-xxxxxx-generic  就是要删除的内核版本
还有
linux-headers-xxxxxx
linux-headers-xxxxxx-generic  总之中间有“xxxxxx”那段的旧内核都能删，注意一般选内核号较小的删除。

---
[« Linux 命令](linux-commands.md)

[» Linux 启用 crontab 日志](linux-enable-crontab-log.md)
