[🏠 首页](../_index.md) / [Rust 编程](_index.md) / Rust VSCode 调试

# Rust VSCode 调试

## 1. 安装插件

- [CodeLLDB](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## 2. 配置

项目根目录配置 `.vscode/launch.json`，调试运行时打开 main.rs 文件。

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "lldb",
            "request": "launch",
            "name": "Debug Rust Project",
            "cargo": {
                "args": [
                    "build",
                    "--target-dir=${fileDirname}/../target",
                    "--manifest-path=${fileDirname}/../Cargo.toml"
                ]
            },
            "args": [],
            "cwd": "${workspaceFolder}"
        },
        {
            "type": "lldb",
            "request": "launch",
            "name": "Debug Rust Unit Tests",
            "cargo": {
                "args": [
                    "test",
                    "--no-run",
                    "--target-dir=${fileDirname}/../target",
                    "--manifest-path=${fileDirname}/../Cargo.toml"
                ]
            },
            "args": [],
            "cwd": "${workspaceFolder}"
        }
    ]
}
```

> 支持 Wrokspace 下多 Rust 项目调试。

---
[« 查看根目录](rust-programming.md)

[» Rust WASM 编程](wasm-programming.md)
