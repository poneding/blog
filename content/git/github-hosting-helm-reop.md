[🏠 首页](../_index.md) / [Git](_index.md) / GitHub 托管 helm-chart 仓库

# GitHub 托管 helm-chart 仓库

## 创建 GitHub 仓库

创建 GitHub helm charts 仓库，例如：`helm-charts`，克隆到本地。

```bash
git clone git@github.com:poneding/helm-charts.git
cd helm-charts
```

## 创建 `gh-pages` 孤立分支

```bash
git checkout --orphan gh-pages
git rm -rf .
vim README.md
```

编写 README.md 文件，例如：

````markdown
# helm-charts

## Usage

[Helm](https://helm.sh) must be installed to use the charts.  Please refer to
Helm's [documentation](https://helm.sh/docs) to get started.

Once Helm has been set up correctly, add the repo as follows:

```bash
helm repo add poneding https://poneding.github.io/helm-charts
```

If you had already added this repo earlier, run `helm repo update` to retrieve
the latest versions of the packages.  You can then run`helm search repo
mycharts` to see the charts.

To install the mycharts chart:

```bash
helm install myapp poneding/myapp
```

To uninstall the chart:

```bash
helm uninstall myapp
```
````

提交代码：

```bash
git add .
git commit -am "Add README.md"
git push -u origin gh-pages
```

## 启用 GitHub Pages

仓库启用 GitHub Pages 功能，选择 `gh-pages` 分支。

## Charts 开发

```bash
git checkout master
mkdir charts
cd charts
helm create myapp
cd ..
```

## 配置 GitHub Action

使用 GitHub Action  搭配 `chart-releaser` 功能，为我们自动发布 charts 版本。

```bash
mkdir -p .github/workflows
vim .github/workflows/release-chart.yaml
```

```bash
name: Release Charts

on:
  push:
    branches:
      - master

jobs:
  release:
    # depending on default permission settings for your org (contents being read-only or read-write for workloads), you will have to add permissions
    # see: https://docs.github.com/en/actions/security-guides/automatic-token-authentication#modifying-the-permissions-for-the-github_token
    permissions:
      contents: write
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Configure Git
        run: |
          git config user.name "$GITHUB_ACTOR"
          git config user.email "$GITHUB_ACTOR@users.noreply.github.com"

      - name: Install Helm
        uses: azure/setup-helm@v3

      - name: Run chart-releaser
        uses: helm/chart-releaser-action@v1.5.0
        env:
          CR_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
```

> 需要提前将 GitHub Token 生成出来，并配置到仓库的 Secrets 中。
>
> 1. 提交代码即可第一次发版。
>
> 2. 之后对 charts 改动后，修改 `Chart.yaml` 中的 `version` 字段，helm-releaser 会检测版本改动，并自动发版。

## 参考

- [Helm | Chart Releaser Action to Automate GitHub Page Charts](https://helm.sh/docs/howto/chart_releaser_action/)
- [helm/chart-releaser-action](https://github.com/helm/chart-releaser-action)

---
[« 使用 GitHub 托管 helm-chart 仓库](github-host-helm-chart.md)

[» GitHub](github.md)
