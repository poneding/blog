[🏠 首页](../_index.md) / [solutions](_index.md) / dbeaver 查看已创建连接密码

# dbeaver 查看已创建连接密码

查看 `dbeaver` 已保存的数据库密码：

1、获取工作空间路径

![alt text](https://images.poneding.com/2024/10/202412251140789.png)

2、使用工作空间路径，查找到数据库连接认证信息文件，例如：`/Users/dp/Library/DBeaverData/workspace6/General/.dbeaver/credentials-config.json`

3、使用以下命令解析密码：

```bash
openssl aes-128-cbc -d \
  -K babb4a9f774ab853c96c2d653dfe544a \
  -iv 00000000000000000000000000000000 \
  -in /Users/dp/Library/DBeaverData/workspace6/General/.dbeaver/credentials-config.json | dd bs=1 skip=16
 2>/dev/null
```

---
[» KubeConfig Warning](kubeconfig-warning.md)
