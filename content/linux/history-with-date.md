[🏠 首页](../_index.md) / [Linux](_index.md) / Linux-history 输出附带日期

# Linux-history 输出附带日期

![202305291417259](https://fs.poneding.com/images/202305291417259.jpg)

如果我们在 linux 系统中想看历史的命令记录，我们可以通过 command 命令来获取。

```shell
history
```

输出大概会是下面这种样子，只有简单的 command 列表。

```tex
    1  ls
    2  top
    4  docker ps
    5  df
    6  ls 
```

那么，如果想知道历史执行的 command 的时间该怎么做呢。

按照如下步骤，一步一步来。

1. 首先设置 `HISTTIMEFORMAT` 变量

```shell
$ HISTTIMEFORMAT="%d/%m/%y %T "
# OR
$ echo 'export HISTTIMEFORMAT="%d/%m/%y %T "' >> ~/.bash_profile
```

2. 使用 source 命令加载 `HISTTIMEFORMAT` 变量到当前 shell 命令窗

```shell
$ . ~/.bash_profile
# OR
$ source ~/.bash_profile
```

3. 再次运行 history 命令，已经可以输出附带执行时间的 history 了。

```shell
    1  root 2020/02/18 11:28:19 ls
    2  root 2020/02/18 11:28:21 top
    4  root 2020/02/18 11:28:58 docker ps
    5  root 2020/02/18 11:34:09 df
    6  root 2020/02/18 11:34:15 ls
```

---
[« certbot-auto 生成证书](certbot-auto-gen-cert.md)

[» Linux 命令](linux-commands.md)
