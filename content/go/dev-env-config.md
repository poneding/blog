[🏠 首页](../_index.md) / [Golang 编程](_index.md) / Go 开发环境配置

# Go 开发环境配置

## cobra-cli

安装：

```bash
go install github.com/spf13/cobra-cli@latest
```

自动补全：

```bash
cobra-cli completion zsh > .zfunc/_cobra-cli
```

在 .zshrc 文件中添加内容（如果已添加，则忽略）：

```bash
fpath+=~/.zfunc
autoload -Uz compinit && compinit
```
---
[» Golang 函数可选参数模式](function-optional-pattern.md)
