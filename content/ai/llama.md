[🏠 首页](../_index.md) / [AI](_index.md) / llama

# llama

## 安装

MacOS：

```bash
brew install ollama
```

Linux：

```bash
curl -sSL https://ollama.com/install.sh | sh
```

安装完成之后，查看安装版本：

```bash
ollama -v
```

## 启动

```bash
ollama start

# 通过注入 OLLAMA_HOST 环境变量设置监听地址
# OLLAMA_HOST=0.0.0.0 ollama start
```

## 下载并运行大模型

Llama3 目前可供下载的大模型有两个版本：8B 和 70B，本地运行容量有限，选择 8B 版本即可，大小大概 5G 左右。

```bash
ollama run llama3
```

执行完成后，会直接进入一个交互界面，可以直接进行对话了。

## 执行生成命令

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3",
  "prompt": "Why is the sky blue?",
  "stream": false
}'
```
