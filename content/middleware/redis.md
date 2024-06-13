[🏠 首页](../_index.md) / [数据中间件](_index.md) / Redis

# Redis

## 安装

### Docker 安装 redis

```bash
sudo docker run --name redis-01 \
 -p 2501:6379 \
 -v /home/dp/apps/redis/redis-01/conf/redis.conf:/etc/redis/redis.conf \
 -v /home/dp/apps/redis/redis-01/data:/data \
 -d \
 redis:6.0 redis-server /etc/redis/redis.conf --appendonly yes
```

> 1. redis.conf 是配置文件
> 2. redis-server /etc/redis/redis.conf，启用配置，如果没有 redis-server 则 redis 默认是无配置启动
> 3. --appendonly yes 启用数据持久化

redis.conf 参照：

```ini
bind 127.0.0.1    # 注释掉这部分，使 redis 可以外部访问
daemonize no   # 用守护线程的方式启动
requirepass your_pwd # 给 redis 设置密码
appendonly yes   # redis 持久化　　默认是 no
tcp-keepalive 300   # 防止出现远程主机强迫关闭了一个现有的连接的错误 默认是 300
```

---
[« Postgres](postgres.md)
