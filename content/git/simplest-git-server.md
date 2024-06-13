[🏠 首页](../_index.md) / [Git](_index.md) / 搭建最简单的 git 仓库服务

# 搭建最简单的 git 仓库服务

## 远端

创建仓库服务目录：

```bash
git init --bare git-server-demo.git
```

其实也可以直接在终端创建，但是你首先要可以能够通过 ssh 的方式连接远端，例如远端 IP 是 `192.168.10.24`

```bash
ssh root@192.168.10.24 git init --bare git-server-demo.git
```

执行完命令之后，将在远端目标目录下生成 `git-server-demo` 目录，子目录结构如下：

```bash
tree git-server-demo.git
git-server-demo.git
├── branches
├── config
├── description
├── HEAD
├── hooks
│   ├── applypatch-msg.sample
│   ├── commit-msg.sample
│   ├── fsmonitor-watchman.sample
│   ├── post-update.sample
│   ├── pre-applypatch.sample
│   ├── pre-commit.sample
│   ├── pre-merge-commit.sample
│   ├── prepare-commit-msg.sample
│   ├── pre-push.sample
│   ├── pre-rebase.sample
│   ├── pre-receive.sample
│   ├── push-to-checkout.sample
│   └── update.sample
├── info
│   └── exclude
├── objects
│   ├── info
│   └── pack
└── refs
    ├── heads
    └── tags
```

## 终端

必要条件：可以 ssh 的方式登录远端服务器账号。

尝试克隆代码：

```bash
git clone root@192.168.10.24:git-server-demo.git
```

剩余就是常规 git 步骤了。
---
[« 多 GitHub 账号管理](multi-github-account-management.md)
