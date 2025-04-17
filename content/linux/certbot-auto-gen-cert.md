[🏠 首页](../_index.md) / [Linux](_index.md) / certbot-auto 生成证书

# certbot-auto 生成证书

## 安装

```bash
wget https://dl.eff.org/certbot-auto
chmod a+x ./certbot-auto
cp ./certbot-auto /usr/local/bin
```

## 生成证书

条件：

- 提前已经将域名解析到本服务器；
- 本服务器端口 80、443 处于未被占用的状态，如果 web 服务占用了 80 端口，需要临时关闭。

```bash
certbot-auto certonly --standalone --email poneding@gmail.com -d test.pding.top
```

以上命令执行完成后，将会在 /etc/letsencrypt/live 目录下生成域名证书文件。默认证书有效期为 3 个月。

## nginx 配置证书

参考示例：

```nginx
server {
        listen 80;
        server_name abc.com;
        rewrite ^(.*) https://test.pding.top permanent;
}
server{
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;

    ssl_certificate /etc/letsencrypt/live/test.pding.top/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/test.pding.top/privkey.pem;

    server_name test.pding.top;
    root /web/test.pding.top/;
}
```

## 证书续期

配置定时任务

```bash
0 3 1 * * certbot-auto renew --pre-hook "systemctl stop nginx" --renew-hook "systemctl start nginx"
```

## 参考

- certbot 文档：<https://eff-certbot.readthedocs.io/en/stable/index.html>

---
[» Linux-history 输出附带日期](history-with-date.md)
