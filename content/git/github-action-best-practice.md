[🏠 首页](../_index.md) / [Git](_index.md) / Github Action 使用最佳实践

# Github Action 使用最佳实践

## Commit 构建 beta 版本镜像

仓库根目录下创建 `.github/workflows/commit-cicd.yml` 文件，用于提交代码触发 `github action`。

beta 版本的镜像 tag 命名规则：`{vx.x.x}-beta-{COMMIT_ID}`，例如：`v1.0.0-beta-f37cfa2`

```yaml
name: commit-cicd
​
env:
  BASE_VERSION: v1.0.0
​
on:
  push:
    branches: [main]
  workflow_dispatch:
​
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
​
      - name: Set ENV
        run: |
          echo "VERSION=${BASE_VERSION}-beta-${GITHUB_SHA::7}" >> $GITHUB_ENV
​
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v2
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
​
      - name: Login to docker hub
        uses: docker/login-action@v2
        with:
          username: poneding
          password: ${{ secrets.DOCKER_PASSWORD }}
​
      - name: Build and push
        id: docker_build
        uses: docker/build-push-action@v3
        with:
          platforms: linux/amd64,linux/arm64
          file: Dockerfile.multiarch
          push: true
          tags: poneding/demo:${VERSION}
      
      - name: Image digest
        run: echo ${{ steps.docker_build.outputs.digest }}
​
      - name: Deploy demo
        id: deploy
        uses: actions-hub/kubectl@master
        env:
          KUBE_CONFIG: ${{ secrets.KUBE_CONFIG }}
        with:    
          args: set image deployment/demo demo=poneding/demo:${VERSION}
```

## Release 构建 stable 版本镜像

仓库根目录下创建 `.github/workflows/release-cicd.yml`文件，用于 Release 发布触发 `github action`。

stable 版本镜像 tag 命名规则：`vx.x.x`-stable，例如：`v1.0.0-stable`

```yaml
name: release-cicd
​
on:
  release:
    types: [created]
​
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
​
      - name: Set ENV
        run: |
          echo "VERSION=${GITHUB_REF#refs/*/}" >> $GITHUB_ENV
​
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v2
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
 
      - name: Login to docker hub
        uses: docker/login-action@v2
        with:
          username: poneding
          password: ${{ secrets.DOCKER_PASSWORD }}
​
      - name: Build and push
        id: docker_build
        uses: docker/build-push-action@v3
        env:
          VERSION: ${GITHUB_REF#refs/*/}
        with:
          platforms: linux/amd64,linux/arm64
          file: Dockerfile.multiarch
          push: true
          tags: poneding/demo:latest,poneding/demo:${VERSION}
      
      - name: Image digest
        run: echo ${{ steps.docker_build.outputs.digest }}
​
      - name: Deploy demo
        id: deploy
        uses: actions-hub/kubectl@master
        env:
          KUBE_CONFIG: ${{ secrets.KUBE_CONFIG }}
        with:     
          args: set image deployment/demo demo=poneding/demo:${VERSION}
```

> 镜像 tag 版本号来自于 git 中创建的 tag，所以如果要发布稳定版本，需要打一个命名为 `vx.x.x-stable` 的 tag，然后 Release 时，选择该 tag 即可。

---
[« 使用 git-secret 保护仓库敏感数据](git-secret.md)

[» 使用 GitHub 托管 helm-chart 仓库](github-host-helm-chart.md)
