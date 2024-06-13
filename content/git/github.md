[🏠 首页](../_index.md) / [Git](_index.md) / GitHub

# GitHub

## GitHub 托管 helm chart 仓库

[GitHub 托管 helm chart 仓库](./github-hosting-helm-reop.md)

## 获取仓库最新 Release 的版本

方法一：

```bash
curl -s https://api.github.com/repos/ketches/registry-proxy/releases/latest | jq -r .tag_name
```

方法二：

```bash
basename $(curl -s -w %{redirect_url} https://github.com/ketches/registry-proxy/releases/latest)
```

---
[« GitHub 托管 helm-chart 仓库](github-hosting-helm-reop.md)

[» Gitlab 添加 K8s 集群](gitlab-intergrate-k8s.md)
