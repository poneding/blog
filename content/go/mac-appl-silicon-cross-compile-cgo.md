[🏠 首页](../_index.md) / [Golang 编程](_index.md) / Mac M1 交叉编译 CGO

# Mac M1 交叉编译 CGO

## 方法一

 1、安装依赖

```bash
brew tap messense/macos-cross-toolchains
brew install x86_64-unknown-linux-gnu
brew install aarch64-unknown-linux-gnu
```

2、添加到 PATH

```bash
export PATH=$PATH:/opt/homebrew/Cellar/x86_64-unknown-linux-gnu/11.2.0_1/bin::/opt/homebrew/Cellar/aarch64-unknown-linux-gnu/11.2.0_1/bin
```

3、编译 CGO 程序

```bash
CGO_ENABLED=1 GOOS=linux GOARCH=amd64 CC=x86_64-unknown-linux-gnu-gcc CXX=x86_64-unknown-linux-gnu-g++ go build
CGO_ENABLED=1 GOOS=linux GOARCH=arm64 CC=aarch64-unknown-linux-gnu-gcc CXX=aarch64-unknown-linux-gnu-g++ go build
```

## 方法二

1、安装依赖

```bash
brew install FiloSottile/musl-cross/musl-cross
```

2、添加到 PATH

```bash
export PATH=$PATH:/opt/homebrew/Cellar/musl-cross/0.9.9_1/bin
```

3、编译 CGO 程序

```bash
# -tags=musl 不能省略不然会出现其他错误
CGO_ENABLED=1 GOOS=linux GOARCH=amd64 CC=x86_64-linux-musl-gcc CXX=x86_64-linux-musl-g++ go build -tags=musl

# 如果linux不想安装musl支持
CGO_ENABLED=1 GOOS=linux GOARCH=amd64 CC=x86_64-linux-musl-gcc CXX=x86_64-linux-musl-g++ CGO_LDFLAGS="-static" go build -tags=musl

CGO_ENABLED=1 GOOS=linux GOARCH=amd64 CC=x86_64-linux-musl-gcc CGO_LDFLAGS="-static" go build
CGO_ENABLED=1 GOOS=linux GOARCH=arm64 CC=x86_64-linux-musl-gcc CGO_LDFLAGS="-static" go build
```

## 参考

- <https://blog.csdn.net/qq_41416964/article/details/129571304>
- <https://zhuanlan.zhihu.com/p/338891206>

---
[« Goreleaser](goreleaser.md)

[» pprof](pprof.md)
