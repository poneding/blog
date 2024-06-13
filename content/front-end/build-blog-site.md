[🏠 首页](../_index.md) / [前端技术](_index.md) / 搭建博客站点

# 搭建博客站点

## 1. Hugo 搭建博客

Hugo 是一个用 Go 语言编写的静态网站生成器。Hugo 的速度非常快，因为它是一个独立的二进制文件，不需要任何运行时依赖。Hugo 的主要特点是速度快、易于安装、易于使用、易于定制。

### 1.1 安装 Hugo

参考：[https://gohugo.io/installation](https://gohugo.io/installation)

### 1.2 创建博客

```bash
hugo new site blog --format yaml
cd blog
git init
```

### 1.3 选择主题

使用 `hugo-book` 主题。

```bash
git submodule add https://github.com/alex-shpak/hugo-book themes/hugo-book
```

## 2. 定制

### 2.1 配置 hugo.yaml

```yaml
# hugo server --minify --themesDir ../.. --baseURL=http://0.0.0.0:1313/theme/hugo-book/

baseURL: https://blog.poneding.com/
title: 秋河落叶
theme: hugo-book
pluralizeListTitles: false
defaultContentLanguage: cn

# Book configuration
disablePathToLower: true
enableGitInfo: true

# Needed for mermaid/katex shortcodes
markup:
  tableOfContents:
    startLevel: 2
    endLevel: 3
    # ordered: true

  highlight:
    noClasses: false
    # style: monokai

menu:
  after:
  - name: "🔗 GitHub"
    url: "https://github.com/poneding"
    weight: 10

params:
  BookTheme: "auto"
  BookToC: true
  BookFavicon: logo.png
  BookLogo: logo.png
  BookMenuBundle: /menu
  BookSection: "none"
  BookRepo: https://github.com/poneding/blog
  BookCommitPath: commit
  BookEditPath: edit/master
  BookDateFormat: "2006/01/02"
  BookSearch: true
  BookComments: true
  BookPortableLinks: true
  BookServiceWorker: true
  BookTranslatedOnly: false
```

要注意的几个配置点：

- `params.BookSection`: 本身指定一个 content 下的文档目录，我们这里设置一个不存在的目录，是为了不在左侧菜单栏展示我们的 N 多的目录树；
- `markup.highlight.noClasses`: 本身用来确认是否不使用自定义的 CSS 样式，我们这里设置为 `false`，因为我们需要使用自定义的 chorma 的代码高亮样式，跟随浏览器或系统自动切换代码高亮主题；

### 2.2 定制左侧菜单栏

创建 `content/menu/index.md` 文件，并添加如下内容：

```bash
mkdir -p content/menu
vim content/menu/index.md
```

菜单配置内容如下：

```markdown
---
headless: true
---

- [**🏠 首页**](/)

---

- **📌 置顶**
  - [Golang 编程](/go)
  - [Kubernetes](/kubernetes)
  - [Rust 编程](/rust)
  - [Git](/git)

---

- **🔗 外链**
```

### 2.3 配置 giscus 评论

拷贝 `hugo-book` 的 `layouts/_default/baseof.html` 文件到 `layouts/_default/baseof.html`，命令操作如下：

```bash
mkdir -p layouts/_default
cp themes/hugo-book/layouts/_default/baseof.html layouts/_default/baseof.html
```

通过配置 giscus 获取 js 脚本代码，参考：[https://giscus.app](https://giscus.app/zh-CN)

获取到的 js 脚本代码，在 `layouts/_default/baseof.html` 文件找到 `{{- partial "docs/comments" . -}}` 所在行，在其下一行添加 js 脚本代码，最终代码如下：

```html
...
  <div class="book-comments">
    {{- partial "docs/comments" . -}}
    <!-- start giscus -->
    <script src="https://giscus.app/client.js"
            data-repo="poneding/blog"
            data-repo-id="R_kgDOMITIHg"
            data-category="General"
            data-category-id="DIC_kwDOMITIHs4CgB4x"
            data-mapping="url"
            data-strict="0"
            data-reactions-enabled="1"
            data-emit-metadata="0"
            data-input-position="top"
            data-theme="preferred_color_scheme"
            data-lang="zh-CN"
            data-loading="lazy"
            crossorigin="anonymous"
            async>
    </script>
    <!-- end giscus -->
  </div>
...
```

### 2.4 代码主题自动切换

生成代码高亮样式文件，命令操作如下：

```bash
mkdir -p static/css

# light
echo "@media (prefers-color-scheme: light) {"  > static/css/syntax.css
hugo gen chromastyles --style=monokailight >> static/css/syntax.css
echo "}" >> static/css/syntax.css

# dark
echo "@media (prefers-color-scheme: dark) {"  >> static/css/syntax.css
hugo gen chromastyles --style=monokai >> static/css/syntax.css
echo "}" >> static/css/syntax.css
```

拷贝 `hugo-book` 的 `layouts/partials/docs/html-head.html` 文件到 `layouts/partials/docs/html-head.html`，命令操作如下：

```bash
mkdir -p layouts/partials/docs
cp themes/hugo-book/layouts/partials/docs/html-head.html layouts/partials/docs/html-head.html

# 引入样式文件
echo '<link rel="stylesheet" href="/css/syntax.css">' >> layouts/partials/docs/html-head.html
```

### 2.5 Logo

将 `logo.png` 图片放到 `static` 目录下。

## 3. 部署

### 3.1 自定义域名

我们已经在 `hugo.yaml` 中配置了 `baseURL: https://blog.poneding.com/`，我们还要创建一个 `CNAME` 文件，内容为 `blog.poneding.com`，然后将该文件放到 `static` 目录下。

```bash
echo "blog.poneding.com" > static/CNAME
```

### 3.2 使用 GitHub Actions 自动部署

前提：

- 在 GitHub 上创建一个新的仓库，例如：`poneding/blog`；
- 配置 GitHub 仓库的 `Settings` -> `Secrets`：`GH_TOKEN`，值为 GitHub 个人访问令牌；

```bash
mkdir -p .github/workflows
vim .github/workflows/deploy.yml
```

`deploy.yml` 文件内容如下：

```yaml
name: Deploy

on:
  push:
    branches:
      - master # Set a branch to deploy
  workflow_dispatch:
  schedule:
    # Runs everyday at 8:00 AM
    - cron: "0 0 * * *"

  pull_request:

jobs:
  deploy:
    runs-on: ubuntu-22.04
    concurrency:
      group: ${{ github.workflow }}-${{ github.ref }}
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: true  # Fetch Hugo themes (true OR recursive)
          fetch-depth: 0    # Fetch all history for .GitInfo and .Lastmod

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: '0.127.0'
          # extended: true

      - name: Build
        run: hugo --minify

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/master'
        with:
          github_token: ${{ secrets.GH_TOKEN }}
          publish_dir: ./public
```

### 3.3 代码提交触发部署

```bash
git add .
git commit -m "init repo"
git remote add origin git@github.com:poneding/blog.git
git push -u origin master
```

### 3.4 GitHub Pages 配置

在 GitHub 仓库的 `Settings` -> `Pages` 中配置 `Source` 为 `Deploy from a branch`, `Branch` 为 `gh-pages` 分支，`root` 为 `/`。

## 4. SEO 配置

参考：

- [Google](https://search.google.com/search-console)
- [百度](https://ziyuan.baidu.com/dashboard/index)
- [Bing](https://www.bing.com/webmasters/)

---
[» Pinia 入门](pinia.md)
