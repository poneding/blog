[🏠 首页](../_index.md) / [Linux](_index.md) / 服务端与客户端传输文件

# 服务端与客户端传输文件

## scp

```bash
# 客户端 <= 服务端
scp server_user@server_ip:/server_path /client_path

# 客户端 => 服务端
scp /client_path server_user@server_ip:/server_path

# 传输目录：scp -r
```

## sftp

客户端与服务端的远程文件传输工具。

第一步，连接服务端：

```bash
sftp server_user@server_ip -i ssh_key_file
```

第二步，传输文件：

```bash
# 客户端 <= 服务端
get /server_path /client_path

# 将客户端文件传输到服务端
put /client_/file/_path /server_path

# 传输文件夹：get -r，put -r
```

---
[« tee 保存 stderr 到文件](tee-keep-stderr.md)

[» vim 使用](vim-common-commands.md)
