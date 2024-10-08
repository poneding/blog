[🏠 首页](../_index.md) / [Linux](_index.md) / shell 命令间隔符

# shell 命令间隔符

我们经常能看到Shell命令间有很多中间隔符：|，||，&& 等，它们到底有着什么样的作用呢？一一来看：

**1. |**：

间隔符 `|` 起着管道的作用，是将上一条命令的 **stdout** 作为下一条命令的 **stdin**：

示例：

```bash
echo hello world! | tee hello.txt
```

**2. ||**：

命令被 **||** 分割，只有当前面的命令发生错误，才会执行后面的命令。

示例：

```bash
# 如果创业失败，那么就继续打工
sh chuangye.sh || sh dagong.sh
```

**3. &&**：

命令被 **&&** 分割，命令会连续执行，但是如果前面的命令发生错误，会影响后面的命令继续执行。

示例：

```bash
# 洗了手才能吃饭
sh wash_hand.sh && sh eat.sh
```

**4. ;**：

命令被 **;** 分割，命令会连续执行，即使前面的命令发生错误，也不影响后面的命令继续执行。

示例：

```bash
# 不管有没有赚到钱，都要回家过年
sh earn_money.sh; sh go_home.sh
```

**5. >**：

输出到指定文件（文件不存在则创建文件，文件存在则会覆盖文件内容）

```bash
echo "Hello World" > hello.txt
```

**6. >>**：

追加到指定文件（文件不存在则创建文件，文件存在则追加文件内容）

```bash
echo "Hello World" >> hello.txt
```

---
[« Linux 挂载磁盘](mount-disk.md)

[» shell 基础](shell.md)
