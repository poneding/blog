[🏠 首页](../_index.md) / [solutions](_index.md) / KubeConfig Warning

# KubeConfig Warning

打开终端，显示 Kubernetes Warning 提示：

```txt
WARNING: Kubernetes configuration file is group-readable. This is insecure. Location: /Users/dp/.kube/config
WARNING: Kubernetes configuration file is world-readable. This is insecure. Location: /Users/dp/.kube/config
```

这是由于 kubeconfig 配置文件权限不够安全的警告提示，因为 Kubernetes 要求 `~/.kube/config` 文件权限只能由当前用户访问（读写权限），所以我们可以通过修改文件的访问权限来避免这个问题：

```bash
chmod 600 ~/.kube/config
```

---
[« dbeaver 查看已创建连接密码](dbeaver-password.md)

[» MacOS 删除很慢](macos-slow-delete.md)
