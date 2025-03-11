[🏠 首页](../_index.md) / [Golang 编程](_index.md) / Golang 发布类库 - 1

# Golang 发布类库 - 1

![alt text](https://images.poneding.com/2025/03/202503111815499.png)

本页介绍如何在 Github 上发布我们自己的 Golang 类库。

**1、创建 github 仓库托管 go 类库代码，例如 common-go：**：

![alt text](https://images.poneding.com/2025/03/202503111815836.png)

**2、将仓库克隆至本地：**：

```bash
git clone https://github.com/poneding/common-go.git
```

**3、初始化go类库的module：**：

```bash
cd common-go
go mod init github.com/poneding/common-go
mkdir hello
```

> 注意：
>
> 使用 `go env` 命令查看是否开启 go-module 功能，如果没开启需要设置环境变量：`go env -w GO111MODULE=on`；
>
> module 名称需要与 github 仓库一致，这样其他人才能通过 `go get github.com/poneding/commmon-go` 下载到你的类库。

**4、编写 go 类库代码，例如：**：

*hell/hello.go*：

```go
package hello

import "fmt"

func Say(name string) {
    fmt.Printf("Hello, %s\n", name)
}
```

**5、提交 go 代码到 github：**：

```bash
git add .
git commit -m "add hello"
git push -u origin main
```

**6、发行版本**：

最佳实践是创建对应的版本发布分支，然后使用发布分支创建 tag，发布：

```bash
git checkout -b v1
git push -u origin v1
git tag v1.0.0 
git push --tags
```

此时，在 github 仓库 release 中可以看到发布的版本。

**7、创建 demo-go 项目，测试使用 go 类库：**：

```bash
go mod init demo-go
```

在 go.mod 引入 `github.com/poneding/common-go@v1.0.0`：

*go.mod*：

```go
module demo-go

go 1.16

require github.com/poneding/common-go v1.0.0
```

调用 `github.com/poneding/common-go` 库的 `hello.Say` 方法：

*main.go*：

```go
package main

import (
    "github.com/poneding/common-go/hello"
)

func main() {
    hello.Say("Jay")
}
```

**8、运行：**：

```bash
$ go run main.go
Hello, Jay
```

---
[« Golang 实现双向认证](go-mtls.md)

[» Golang 发布类库 - 2](go-publish-package-02.md)
