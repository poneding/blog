[🏠 首页](../_index.md) / [AI](_index.md) / 动手学深度学习

# 动手学深度学习

# 环境准备

备注：开发机器为 MacOS M1 Pro

## python

<https://www.python.org/ftp/python/3.12.4/python-3.12.4-macos11.pkg>

### miniconda

```bash
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh

sh Miniconda3-latest-MacOSX-arm64.sh -b
```

### jupyter

### PyTorch 框架

```bash
pip install torch==1.12.0
pip install torchvision==0.13.0
```

### d2l 包

```bash
pip install d2l==0.17.6
```

### D2L Notebook

```bash
wget https://zh-v2.d2l.ai/d2l-zh.zip
unzip d2l-zh.zip
rm d2l-zh.zip
cd mxnet
```

## 开始

```bash
# 前提时安装了 zsh，否则使用 bash
./miniconda3/bin/conda init zsh

source ~/.zshrc

conda create --name d2l python3.12.4 -y

conda activate d2l
```

---
[» llama](llama.md)
