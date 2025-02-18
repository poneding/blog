[🏠 首页](../_index.md) / [操作系统](_index.md) / ohmyzsh

# ohmyzsh

## 安装

- MacOS

```bash
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

ch -s /bin/zsh
```

- Linux

```bash
sudo apt update
sudo apt install zsh -y

chsh -s /usr/bin/zsh
```

打开一个新的终端，切换到 `zsh`

##  安装 zsh-autosuggestions

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

## 安装 `zsh-syntax-highlighting`：

```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

echo "source ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ${ZDOTDIR:-$HOME}/.zshrc
```

## **配置 `.zshrc` 文件添加 ohmyzsh 插件**：

```bash
...
plugins=(git docker docker-compose kubectl autojump zsh-autosuggestions globalias)

...
GLOBALIAS_FILTER_VALUES=(ls grep)
```

---
[« MacOS](macos.md)

[» openssl](openssl.md)
