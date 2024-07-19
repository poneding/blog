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

## README 美化

### 徽标

[![Go Report Card](https://goreportcard.com/badge/github.com/ketches/registry-proxy)](https://goreportcard.com/report/github.com/ketches/registry-proxy)
[![Go Doc](https://pkg.go.dev/badge/github.com/ketches/registry-proxy)](https://pkg.go.dev/github.com/ketches/registry-proxy)
[![GitHub release](https://img.shields.io/github/v/release/ketches/registry-proxy)](https://img.shields.io/github/v/release/ketches/registry-proxy)
[![GitHub license](https://img.shields.io/github/license/ketches/registry-proxy)](https://img.shields.io/github/license/ketches/registry-proxy)
[![GitHub stars](https://img.shields.io/github/stars/ketches/registry-proxy)](https://img.shields.io/github/stars/ketches/registry-proxy)
[![GitHub forks](https://img.shields.io/github/forks/ketches/registry-proxy)](https://img.shields.io/github/forks/ketches/registry-proxy)

```md
[![Go Report Card](https://goreportcard.com/badge/github.com/ketches/registry-proxy)](https://goreportcard.com/report/github.com/ketches/registry-proxy)
[![Go Doc](https://pkg.go.dev/badge/github.com/ketches/registry-proxy)](https://pkg.go.dev/github.com/ketches/registry-proxy)
[![GitHub release](https://img.shields.io/github/v/release/ketches/registry-proxy)](https://img.shields.io/github/v/release/ketches/registry-proxy)
[![GitHub license](https://img.shields.io/github/license/ketches/registry-proxy)](https://img.shields.io/github/license/ketches/registry-proxy)
[![GitHub stars](https://img.shields.io/github/stars/ketches/registry-proxy)](https://img.shields.io/github/stars/ketches/registry-proxy)
[![GitHub forks](https://img.shields.io/github/forks/ketches/registry-proxy)](https://img.shields.io/github/forks/ketches/registry-proxy)
```

### Stars 走势

[![Stargazers over time](https://starchart.cc/ketches/registry-proxy.svg?variant=adaptive)](https://starchart.cc/ketches/registry-proxy)

```md
[![Stargazers over time](https://starchart.cc/ketches/registry-proxy.svg?variant=adaptive)](https://starchart.cc/ketches/registry-proxy)
```

### 贡献者列表

![Contributors](https://contrib.rocks/image?repo=ketches/registry-proxy)

```md
![Contributors](https://contrib.rocks/image?repo=ketches/registry-proxy)
```

---
[« GitHub 托管 helm-chart 仓库](github-hosting-helm-reop.md)

[» Gitlab 添加 K8s 集群](gitlab-intergrate-k8s.md)
