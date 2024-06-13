[🏠 首页](../_index.md) / [Docker](_index.md) / some-apps.md

Docker 应用

## Cloudreve

项目地址：<https://github.com/cloudreve/Cloudreve>

```bash
docker run -d --name cloudreve \
-p 5212:5212 \
--mount type=bind,source=/root/apps/cloudreve/conf.ini,target=/cloudreve/conf.ini \
--mount type=bind,source=/root/apps/cloudreve/cloudreve.db,target=/cloudreve/cloudreve.db \
-v /root/apps/cloudreve/uploads:/cloudreve/uploads \
-v /root/apps/cloudreve/avatar:/cloudreve/avatar \
cloudreve/cloudreve:latest
```

## Etcd

```bash
docker run -d --name etcd \
    -p 12379:2379 \
    -p 12380:2380 \
    -e ALLOW_NONE_AUTHENTICATION=yes \
    -e ETCD_LISTEN_CLIENT_URLS=http://0.0.0.0:2379 \
    -e ETCD_ADVERTISE_CLIENT_URLS=http://etcd:2379,http://0.0.0.0:2379 \
    -v /root/apps/etcd/data:/var/run/etcd \
    quay.io/coreos/etcd:v3.5.6
```

## Minio

```bash
docker run -d --name minio \
    -p 9000:9000 \
    -p 9001:9001 \
    -e MINIO_ROOT_USER=minio \
    -e MINIO_ROOT_PASSWORD='pd1n9@1024' \
    -v /root/apps/minio/data:/data \
    quay.io/minio/minio:latest server /data --console-address ":9001"
```

## MySQL

```bash
docker run -d --name mysql \
	-v /root/apps/mysql/data:/var/lib/mysql \
	-e MYSQL_ROOT_PASSWORD='pd1n9@1024' \
	-p 3306:3306 \
	mysql:8.0
```

## Postgres

```bash
docker run -d --name postgres \
	-p 5432:5432 \
	-e POSTGRES_USER=root \
	-e POSTGRES_PASSWORD=pd1n9@1024 \
	-v /root/apps/postgres/data:/var/lib/postgresql/data \
	postgre
```

## RabbitMQ

```bash
docker run -d --name rabbitmq \
    -p 15672:15672 \
    -p 5672:5672 \
    --hostname rabbitmq \
    -e RABBITMQ_DEFAULT_USER=pding \
    -e RABBITMQ_DEFAULT_PASS=P0n3_D1n9 \
    registry.cn-hangzhou.aliyuncs.com/pding/rabbitmq:3-management
```

## Redis

```bash
docker run -d --name redis \
	-v /root/apps/redis/data:/data \
	-p 6379:6379 \
	redis:7.0 redis-server --requirepass "pd1n9@1024"
```

## Transfer

```bash
docker run -d --name transfer \
	-p 7080:8080 \
	dutchcoders/transfer.sh:latest --provider local --basedir /tmp/
```

---
[« 非 root 账号获取 docker 权限](non-root-account-get-docker-permission.md)
