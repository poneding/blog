[🏠 首页](../_index.md) / [Rust 编程](_index.md) / Cargo 管理工具

# Cargo 管理工具

cargo 是 Rust 的构建系统和包管理器。

## 配置国内 rsproxy 源

```bash
vim ~/.cargo/config
```

```toml
[source.crates-io]
replace-with = 'rsproxy-sparse'

[source.rsproxy]
registry = "https://rsproxy.cn/crates.io-index"

[source.rsproxy-sparse]
registry = "sparse+https://rsproxy.cn/index/"

[registries.rsproxy]
index = "https://rsproxy.cn/crates.io-index"

[net]
git-fetch-with-cli = true
```

## 创建项目

```bash
cargo new hello-world
cd hello-world
```

> 可以使用 `cargo new --vcs git hello-world` 创建项目并初始化 git 仓库，它将自动创建一个 .gitignore 文件。

## 编译项目

```bash
cargo build

# 编译之后将在 target/debug 目录下生成可执行文件
# 可以通过以下命令运行
./target/debug/hello-world
```

默认构建模式是 debug，里面包含了大量的符号和调试信息，优化级别不高。建议使用 relase 模式构建发布到生产环境。

release 模式构建花费的时间较长，但是构建出来的二进制文件则要精简很多。

```bash
cargo build --release
```

## 运行项目

```bash
cargo run
```

追踪 panic 位置运行：

```bash
RUST_BACKTRACE=1 cargo run
```

## 创建类包

```bash
cargo new --lib mylib
```

## 检测项目是否可以编译

```bash
cargo check
```

## 安装可执行文件（更新）

```bash
cargo install --path .
```

## 卸载可执行文件

```bash
cargo uninstall hello-world
```

## 发布项目

发布到 crates.io，需要注册账号。

并且，需要在 Cargo.toml 中添加部分内容，例如作者、描述、许可证必要信息以及其他信息：

```toml
[package]
name = "hello-world"
version = "0.1.0"
edition = "2021"
authors = ["Pone Ding <poneding@gmail.com>"]
description = "A hello world program in Rust"
license = "MIT OR Apache-2.0"
readme = "README.md"
keywords = ["hello", "world"]
categories = ["hello-world"]
```

```bash
cargo publish

# 忽略未提交的更改
cargo publish --allow-dirty
```

## 依赖管理

依赖的来源

- crate.io：Rust 官方 registry，包含大量开源的 Rust 库；
- git：rust 版本的 git 仓库，适用于未发布或者开发阶段；
- local crate：本地 rust 库，可用于调试。

依赖的版本范围规则参考如下，基于这样的规则，rust 会使用版本范围内最大版本号作为依赖的最终版本，例如如果定义版本为 `some_crate = "1.2.3"` 但是 `some_crate` 当前最高版本为 `1.8.9`，那么 Cargo 会自动使用 ·1.8.9· 版本作为依赖。

```toml
[dependencies]
some_crate = "1.2.3" => 版本范围[1.2.3, 2.0.0)
some_crate = "1.2" => 版本范围[1.2.0, 2.0.0)
some_crate = "1" => 版本范围[1.0.0, 2.0.0)
  
some_crate = "0.2.3" => 版本范围[0.2.3, 0.3.0)
some_crate = "0.2" => 版本范围[0.2.0, 0.3.0)
some_crate = "0" => 版本范围[0.0.0, 1.0.0)
  
some_crate = "0.0" => 版本范围[0.0.0, 0.1.0)
some_crate = "0.0.3" => 版本范围[0.0.3, 0.0.4)

some_crate = "^1.2.3" => 版本范围[1.2.3]
  
some_crate = "~1.2.3" => 版本范围[1.2.3, 1.3.0)
some_crate = "~1.2" => 版本范围[1.2.0, 1.3.0)
some_crate = "~1" => 版本范围[1.0.0, 2.0.0)

some_crate = "*" => 版本范围[0.0.0, )
some_crate = "1.*" => 版本范围[1.0.0, 2.0.0)
some_crate = "1.2.*" => 版本范围[1.2.0, 1.3.0)

some_crate = ">=1.2, < 1.5" => 版本范围[1.2.0, 1.5.0)
```

## 添加依赖

```bash
cargo add rand

cargo add hello-world

# 添加依赖并使用 features
cargo add serde --features derive,serde_derive

# 添加本地依赖
cargo add hello-world --path ../hello-world
```

依赖外部类库以及引用：

*Cargo.toml:*

```toml
...
[dependencies]
rand = "0.8.5"
```

*main.rs:*

```rs
extern crate rand;  
use rand::Rng;
```

依赖内部类库以及引用：

*Cargo.toml:*

```toml
...
[dependencies]
hello_lib = { path = "../hello_lib" }
```

*main.rs:*

```rs
extern crate hello_lib;
```

## 更新依赖

```bash
# 更新所有依赖
cargo update

# 更新指定依赖
cargo update rand
```

## 移除依赖

```bash
cargo rm rand
```

## 清除编译

```bash
cargo clean
```

## 生成文档

```bash
cargo doc
```

## 测试

```bash
cargo test
```

## workspace

目前需要手动在 workspace 目录下创建 Cargo.toml 文件。

```bash
vim Cargo.toml
[workspace]
resolver = "2"
members = [
	"hello_world",
	"hello_lib",
]
```

检查 workspace 下编译：

```bash
cargo check --workspace
```

构建

```bash
# 构建所有工作区成员
cargo build

# 构建单个工作区成员
cargo build -p hello_world
```

---
[» Rust 入门](getting-started.md)
