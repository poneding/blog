[🏠 首页](../_index.md) / [Kubernetes](_index.md) / 二进制搭建 K8s - 2 部署 etcd 集群

# 二进制搭建 K8s - 2 部署 etcd 集群

## 写在前面

记录和分享使用二进制搭建 K8s 集群的详细过程，由于操作比较冗长，大概会分四篇写完：

1. **[机器准备](./binary-build-k8s-01-prepare-nodes.md)**：
2. **[部署 etcd 集群](./binary-build-k8s-02-deploy-etcd.md)**：
3. **[部署 Master](./binary-build-k8s-03-deploy-master.md)**：
4. **[部署 Node](./binary-build-k8s-04-deploy-worker.md)**：

etcd 作为 K8s 的数据库，需要首先安装，为其他组件做服务基础。

etcd 是一个分布式的数据库系统，为了模拟 etcd 的高可用，我们将 etcd 部署在三台虚拟机上，正好就部署在 K8s 集群所使用的三台机器上吧。

etcd 集群，K8s 组件之间通信，为了安全可靠，我们最好启用 HTTPS 安全机制。K8s 提供了基于 CA 签名的双向数字证书认证方式和简单的基于 HTTP Base 或 Token 的认证方式，其中 CA 证书方式的安全性最高。我们使用 cfssl 为我们的 K8s 集群配置 CA 证书，此外也可以使用 openssl。

## 安装 cfssl

在 Master 机器执行：

```sh
cd /root/kubernetes/resources
cp cfssl_linux-amd64 /usr/bin/cfssl
cp cfssljson_linux-amd64 /usr/bin/cfssljson
cp cfssl-certinfo_linux-amd64 /usr/bin/cfssl-certinfo
chmod +x /usr/bin/cfssl /usr/bin/cfssljson /usr/bin/cfssl-certinfo
```

在所有机器执行：

```sh
mkdir /etc/etcd/ssl -p
```

## 制作 etcd 证书

在 Master 机器执行：

```sh
mkdir /root/kubernetes/resources/cert/etcd -p
cd /root/kubernetes/resources/cert/etcd
```

编辑 ca-config.json

```sh
vim ca-config.json
```

写入文件内容如下：

```json
{
  "signing": {
    "default": {
      "expiry": "87600h"
    },
    "profiles": {
      "etcd": {
         "expiry": "87600h",
         "usages": [
            "signing",
            "key encipherment",
            "server auth",
            "client auth"
        ]
      }
    }
  }
}
```

编辑 ca-csr.json：

```sh
vim ca-csr.json
```

写入文件内容如下：

```json
{
    "CN": "etcd ca",
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "names": [
        {
            "C": "CN",
            "L": "Hunan",
            "ST": "Changsha"
        }
    ]
}
```

生成 ca 证书和密钥：

```sh
cfssl gencert -initca ca-csr.json | cfssljson -bare ca
```

编辑 server-csr.json：

```shell
vim server-csr.json
```

写入文件内容如下：

```json
{
    "CN": "etcd",
    "hosts": [
        "192.168.115.131",
        "192.168.115.132",
        "192.168.115.133"
        ],
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "names": [
        {
            "C": "CN",
            "L": "Hunan",
            "ST": "Changsha"
        }
    ]
}
```

> hosts 中配置所有 Master 和 Node 的 IP 列表。

生成 etcd 证书和密钥

```shell
cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=etcd server-csr.json | cfssljson -bare server
# 此时目录下会生成 7 个文件
ls
ca-config.json  ca.csr  ca-csr.json  ca-key.pem  ca.pem  server.csr  server-csr.json  server-key.pem  server.pem
```

拷贝证书

```shell
cp ca.pem server-key.pem  server.pem /etc/etcd/ssl
scp ca.pem server-key.pem  server.pem 192.168.115.132:/etc/etcd/ssl
scp ca.pem server-key.pem  server.pem 192.168.115.133:/etc/etcd/ssl
```

## 安装 etcd 集群

在所有机器执行：

```shell
cd /root/kubernetes/resources
tar -zxvf /root/kubernetes/resources/etcd-v3.4.9-linux-amd64.tar.gz
cp ./etcd-v3.4.9-linux-amd64/etcd ./etcd-v3.4.9-linux-amd64/etcdctl /usr/bin
```

## 配置 etcd

这里开始命令需要分别在 Master 和 Node 机器执行，配置 etcd.conf

```shell
vim /etc/etcd/etcd.conf
```

k8s-master01 写入文件内容如下：

```ini
[Member]
ETCD_NAME="etcd01"
ETCD_DATA_DIR="/var/lib/etcd/default.etcd"
ETCD_LISTEN_PEER_URLS="https://192.168.115.131:2380"
ETCD_LISTEN_CLIENT_URLS="https://192.168.115.131:2379,https://127.0.0.1:2379"

[Clustering]
ETCD_INITIAL_ADVERTISE_PEER_URLS="https://192.168.115.131:2380"
ETCD_ADVERTISE_CLIENT_URLS="https://192.168.115.131:2379"
ETCD_INITIAL_CLUSTER="etcd01=https://192.168.115.131:2380,etcd02=https://192.168.115.132:2380,etcd03=https://192.168.115.133:2380"
ETCD_INITIAL_CLUSTER_TOKEN="etcd-cluster"
ETCD_INITIAL_CLUSTER_STATE="new"
```

k8s-node01 写入文件内容如下：

```ini
[Member]
ETCD_NAME="etcd02"
ETCD_DATA_DIR="/var/lib/etcd/default.etcd"
ETCD_LISTEN_PEER_URLS="https://192.168.115.132:2380"
ETCD_LISTEN_CLIENT_URLS="https://192.168.115.132:2379,https://127.0.0.1:2379"

[Clustering]
ETCD_INITIAL_ADVERTISE_PEER_URLS="https://192.168.115.132:2380"
ETCD_ADVERTISE_CLIENT_URLS="https://192.168.115.132:2379"
ETCD_INITIAL_CLUSTER="etcd01=https://192.168.115.131:2380,etcd02=https://192.168.115.132:2380,etcd03=https://192.168.115.133:2380"
ETCD_INITIAL_CLUSTER_TOKEN="etcd-cluster"
ETCD_INITIAL_CLUSTER_STATE="new"
```

k8s-node02 写入文件内容如下：

```ini
[Member]
ETCD_NAME="etcd03"
ETCD_DATA_DIR="/var/lib/etcd/default.etcd"
ETCD_LISTEN_PEER_URLS="https://192.168.115.133:2380"
ETCD_LISTEN_CLIENT_URLS="https://192.168.115.133:2379,https://127.0.0.1:2379"

[Clustering]
ETCD_INITIAL_ADVERTISE_PEER_URLS="https://192.168.115.133:2380"
ETCD_ADVERTISE_CLIENT_URLS="https://192.168.115.133:2379"
ETCD_INITIAL_CLUSTER="etcd01=https://192.168.115.131:2380,etcd02=https://192.168.115.132:2380,etcd03=https://192.168.115.133:2380"
ETCD_INITIAL_CLUSTER_TOKEN="etcd-cluster"
ETCD_INITIAL_CLUSTER_STATE="new"
```

这里开始在所有机器执行，设置 etcd 服务配置文件

```shell
mkdir -p /var/lib/etcd
vim /usr/lib/systemd/system/etcd.service
```

执行上行命令，写入文件内容如下：

```ini
[Unit]
Description=Etcd Server
After=network.target
After=network-online.target
Wants=network-online.target

[Service]
Type=notify
EnvironmentFile=/etc/etcd/etcd.conf
ExecStart=/usr/bin/etcd \
        --cert-file=/etc/etcd/ssl/server.pem \
        --key-file=/etc/etcd/ssl/server-key.pem \
        --peer-cert-file=/etc/etcd/ssl/server.pem \
        --peer-key-file=/etc/etcd/ssl/server-key.pem \
        --trusted-ca-file=/etc/etcd/ssl/ca.pem \
        --peer-trusted-ca-file=/etc/etcd/ssl/ca.pem
Restart=on-failure
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

> etcd3.4 版本会自动 EnvironmentFile 文件中的环境变量，不需要再 ExecStart 的命令参数重复设置，否则会报：`"xxx" is shadowed by corresponding command-line flag` 的错误信息。

启动 etcd，并且设置开机自动运行 etcd

```bash
systemctl daemon-reload
systemctl start etcd.service
systemctl enable etcd.service
```

检查 etcd 集群的健康状态

```shell
etcdctl endpoint health --cacert=/etc/etcd/ssl/ca.pem --cert=/etc/etcd/ssl/server.pem --key=/etc/etcd/ssl/server-key.pem --endpoints="https://192.168.115.131:2379,https://192.168.115.132:2379,https://192.168.115.133:2379"
```

输出如下，说明 etcd 集群已经部署成功。

```tex
https://192.168.115.133:2379 is healthy: successfully committed proposal: took = 15.805605ms
https://192.168.115.132:2379 is healthy: successfully committed proposal: took = 22.127986ms
https://192.168.115.131:2379 is healthy: successfully committed proposal: took = 24.829669ms
```

第二段落**部署 etcd 集群**愉快结束。

---
[« 二进制搭建 K8s - 1 机器准备](binary-build-k8s-01-prepare-nodes.md)

[» 二进制搭建 K8s - 3 部署 Master](binary-build-k8s-03-deploy-master.md)
