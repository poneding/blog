[🏠 首页](../_index.md) / [Kubernetes](_index.md) / 二进制搭建 K8s - 3 部署 Master

# 二进制搭建 K8s - 3 部署 Master

## 写在前面

记录和分享使用二进制搭建 K8s 集群的详细过程，由于操作比较冗长，大概会分四篇写完：

1. **[机器准备](./binary-build-k8s-01-prepare-nodes.md)**：
2. **[部署 etcd 集群](./binary-build-k8s-02-deploy-etcd.md)**：
3. **[部署 Master](./binary-build-k8s-03-deploy-master.md)**：
4. **[部署 Node](./binary-build-k8s-04-deploy-worker.md)**：

我们已经知道在 K8s 的 Master 上存在着 kube-apiserver、kube-controller-manager、kube-scheduler 三大组件。本篇介绍在 Master 机器安装这些组件，除此之外，如果想在 Master 机器上操作集群，还需要安装 kubectl 工具。

## 安装 kubectl

kubernetes 的安装包里已经将 kubectl 包含进去了，部署很简单：

```bash
cd /root/kubernetes/resources/
tar -zxvf ./kubernetes-server-linux-amd64.tar.gz
cp kubernetes/server/bin/kubectl /usr/bin
kubectl api-versions
```

## 制作 kubernetes 证书

```bash
mkdir /root/kubernetes/resources/cert/kubernetes /etc/kubernetes/{ssl,bin} -p
cp kubernetes/server/bin/kube-apiserver kubernetes/server/bin/kube-controller-manager kubernetes/server/bin/kube-scheduler /etc/kubernetes/bin
cd /root/kubernetes/resources/cert/kubernetes
```

接下来都在 Master 机器上执行，编辑 ca-config.json

```bash
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
      "kubernetes": {
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

```bash
vim ca-csr.json
```

写入文件内容如下：

```json
{
    "CN": "kubernetes",
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "names": [
        {
            "C": "CN",
            "L": "Hunan",
            "ST": "Changsha",            
           "O": "kubernetes",
            "OU": "System"
        }
    ]
}
```

生成 ca 证书和密钥：

```bash
cfssl gencert -initca ca-csr.json | cfssljson -bare ca
```

制作 kube-apiserver、kube-proxy、admin 证书，编辑 kube-apiserver-csr.json：

```shell
vim kube-apiserver-csr.json
```

写入文件内容如下：

```json
{
    "CN": "kubernetes",
    "hosts": [
        "10.0.0.1",
        "127.0.0.1",
        "kubernetes",
        "kubernetes.default",
        "kubernetes.default.svc",
        "kubernetes.default.svc.cluster",
        "kubernetes.default.svc.cluster.local",
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
            "ST": "Changsha",
            "O": "kubernetes",
            "OU": "System"
        }
    ]
}
```

编辑 kube-proxy-csr.json：

```shell
vim kube-proxy-csr.json
```

写入文件内容如下：

```json
{
    "CN": "system:kube-proxy",
    "hosts": [],
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "names": [
        {
            "C": "CN",
            "L": "Hunan",
            "ST": "Changsha",
            "O": "kubernetes",
            "OU": "System"
        }
    ]
}
```

编辑 admin-csr.json：

```shell
vim admin-csr.json
```

写入文件内容如下：

```json
{
    "CN": "admin",
    "hosts": [],
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "names": [
        {
            "C": "CN",
            "L": "Hunan",
            "ST": "Changsha",
            "O": "system:masters",
            "OU": "System"
        }
    ]
}
```

生成证书和密钥

```shell
cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=kubernetes kube-apiserver-csr.json | cfssljson -bare kube-apiserver
cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=kubernetes kube-proxy-csr.json | cfssljson -bare kube-proxy
cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=kubernetes admin-csr.json | cfssljson -bare admin
# 此时目录下生成的文件
ll
-rw-r--r--. 1 root root 1001 May 28 00:32 admin.csr
-rw-r--r--. 1 root root  282 May 28 00:32 admin-csr.json
-rw-------. 1 root root 1679 May 28 00:32 admin-key.pem
-rw-r--r--. 1 root root 1407 May 28 00:32 admin.pem
-rw-r--r--. 1 root root  294 May 28 00:30 ca-config.json
-rw-r--r--. 1 root root 1013 May 28 00:31 ca.csr
-rw-r--r--. 1 root root  284 May 28 00:30 ca-csr.json
-rw-------. 1 root root 1675 May 28 00:31 ca-key.pem
-rw-r--r--. 1 root root 1383 May 28 00:31 ca.pem
-rw-r--r--. 1 root root 1273 May 28 00:32 kube-apiserver.csr
-rw-r--r--. 1 root root  597 May 28 00:31 kube-apiserver-csr.json
-rw-------. 1 root root 1679 May 28 00:32 kube-apiserver-key.pem
-rw-r--r--. 1 root root 1655 May 28 00:32 kube-apiserver.pem
-rw-r--r--. 1 root root 1009 May 28 00:32 kube-proxy.csr
-rw-r--r--. 1 root root  287 May 28 00:31 kube-proxy-csr.json
-rw-------. 1 root root 1679 May 28 00:32 kube-proxy-key.pem
-rw-r--r--. 1 root root 1411 May 28 00:32 kube-proxy.pem
```

将 kube-proxy 证书拷贝到 Node：

前提，需要在 Node 机器创建目录，以下命令在 Node 机器上执行：

```bash
mkdir /etc/kubernetes/ -p
```

然后再在Master机器执行拷贝操作。

```bash
cp ca.pem ca-key.pem kube-apiserver.pem kube-apiserver-key.pem kube-proxy.pem kube-proxy-key.pem /etc/kubernetes/ssl
scp -r /etc/kubernetes/ssl 192.168.115.132:/etc/kubernetes
scp -r /etc/kubernetes/ssl 192.168.115.133:/etc/kubernetes
```

## 创建 TLSBootstrapping Token

```bash
cd /etc/kubernetes
head -c 16 /dev/urandom | od -An -t x | tr -d ' '
# 执行上一步会得到一个 token，例如 d5c5d767b64db39db132b433e9c45fbc，编辑文件 token.csv 时需要
vim token.csv
```

写入文件内容，替换生成的 token

```bash
d5c5d767b64db39db132b433e9c45fbc,kubelet-bootstrap,10001,"system:node-bootstrapper"
```

## 安装 kube-apiserver

准备 kube-apiserver 配置文件

```shell
vim apiserver
```

执行上行命令，写入文件内容如下：

```tex
KUBE_API_ARGS="--logtostderr=false \
--v=2 \
--log-dir=/var/log/kubernetes \
--etcd-servers=https://192.168.115.131:2379,https://192.168.115.132:2379,https://192.168.115.133:2379 \
--bind-address=192.168.115.131 \
--secure-port=6443 \
--advertise-address=192.168.115.131 \
--allow-privileged=true \
--service-cluster-ip-range=10.0.0.0/24 \
--enable-admission-plugins=NamespaceLifecycle,LimitRanger,ServiceAccount,ResourceQuota,NodeRestriction \
--authorization-mode=RBAC,Node \
--enable-bootstrap-token-auth=true \
--token-auth-file=/etc/kubernetes/token.csv \
--service-node-port-range=30000-32767 \
--kubelet-client-certificate=/etc/kubernetes/ssl/kube-apiserver.pem \
--kubelet-client-key=/etc/kubernetes/ssl/kube-apiserver-key.pem \
--tls-cert-file=/etc/kubernetes/ssl/kube-apiserver.pem  \
--tls-private-key-file=/etc/kubernetes/ssl/kube-apiserver-key.pem \
--client-ca-file=/etc/kubernetes/ssl/ca.pem \
--service-account-key-file=/etc/kubernetes/ssl/ca-key.pem \
--etcd-cafile=/etc/etcd/ssl/ca.pem \
--etcd-certfile=/etc/etcd/ssl/server.pem \
--etcd-keyfile=/etc/etcd/ssl/server-key.pem \
--audit-log-maxage=30 \
--audit-log-maxbackup=3 \
--audit-log-maxsize=100 \
--audit-log-path=/var/logs/kubernetes/k8s-audit.log"
```

准备 kube-apiserver 服务配置文件

```shell
vim /usr/lib/systemd/system/kube-apiserver.service
```

执行上行命令，写入文件内容如下：

```ini
[Unit]
Description=Kubernetes API Server
Documentation=https://github.com/GoogleCloudPlatform/kubernetes
After=etcd.service
Wants=etcd.service

[Service]
Type=notify
EnvironmentFile=/etc/kubernetes/apiserver
ExecStart=/etc/kubernetes/bin/kube-apiserver $KUBE_API_ARGS
Restart=on-failure
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

启动 kube-apiserver:

```shell
systemctl daemon-reload
systemctl start kube-apiserver
systemctl enable kube-apiserver
systemctl status kube-apiserver
```

## 安装 kube-controller-manager

准备 kube-controller-manger 配置文件

```shell
vim controller-manager
```

执行上行命令，写入文件内容如下：

```tex
KUBE_CONTROLLER_MANAGER_ARGS="--logtostderr=false \
--v=2 \
--log-dir=/var/log/kubernetes \
--leader-elect=true \
--master=127.0.0.1:8080 \
--bind-address=127.0.0.1 \
--allocate-node-cidrs=true \
--cluster-cidr=10.244.0.0/16 \
--service-cluster-ip-range=10.0.0.0/24 \
--cluster-signing-cert-file=/etc/kubernetes/ssl/ca.pem \
--cluster-signing-key-file=/etc/kubernetes/ssl/ca-key.pem  \
--root-ca-file=/etc/kubernetes/ssl/ca.pem \
--service-account-private-key-file=/etc/kubernetes/ssl/ca-key.pem \
--experimental-cluster-signing-duration=87600h0m0s"
```

准备 kube-controller-manger 服务配置文件

```shell
vim /usr/lib/systemd/system/kube-controller-manager.service
```

执行上行命令，写入文件内容如下：

```ini
[Unit]
Description=Kubernetes Controller Manager
Documentation=https://github.com/GoogleCloudPlatform/kubernetes
After=kube-apiserver.service
Requires=kube-apiserver.service

[Service]
EnvironmentFile=/etc/kubernetes/controller-manager
ExecStart=/etc/kubernetes/bin/kube-controller-manager $KUBE_CONTROLLER_MANAGER_ARGS
Restart=on-failure
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

启动kube-controller-manager:

```shell
systemctl daemon-reload
systemctl start kube-controller-manager
systemctl enable kube-controller-manager
systemctl status kube-controller-manager
```

## 安装 kube-scheduler

准备 kube-scheduler 配置文件

```shell
vim scheduler
```

执行上行命令，写入文件内容如下：

```tex
KUBE_SCHEDULER_ARGS="--logtostderr=false \
--v=2 \
--log-dir=/var/log/kubernetes \
--master=127.0.0.1:8080 \
--leader-elect \
--bind-address=127.0.0.1"
```

准备 kube-scheduler 服务配置文件

```shell
vim /usr/lib/systemd/system/kube-scheduler.service
```

执行上行命令，写入文件内容如下：

```ini
[Unit]
Description=Kubernetes Scheduler
Documentation=https://github.com/GoogleCloudPlatform/kubernetes
After=kube-apiserver.service
Requires=kube-apiserver.service

[Service]
EnvironmentFile=/etc/kubernetes/scheduler
ExecStart=/etc/kubernetes/bin/kube-scheduler $KUBE_SCHEDULER_ARGS
Restart=on-failure
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

启动 kube-scheduler:

```shell
systemctl daemon-reload
systemctl start kube-scheduler
systemctl enable kube-scheduler
systemctl status kube-scheduler
```

## kubelet-bootstrap 授权

```bash
kubectl create clusterrolebinding kubelet-bootstrap \
--clusterrole=system:node-bootstrapper \
--user=kubelet-bootstrap
```

查看 Master 状态

```bash
kubectl get cs
```

如果 Master 部署成功，应该输出：

```bash
NAME                 STATUS    MESSAGE             ERROR
scheduler            Healthy   ok                  
controller-manager   Healthy   ok                  
etcd-2               Healthy   {"health":"true"}   
etcd-1               Healthy   {"health":"true"}   
etcd-0               Healthy   {"health":"true"}
```

## apiserver 授权 kubelet

准备 apiserver-to-kubelet-rbac.yaml 文件

```shell
cd /root/kubernetes/resources
vim apiserver-to-kubelet-rbac.yaml 
```

执行上行命令，写入文件内容如下：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  annotations:
    rbac.authorization.kubernetes.io/autoupdate: "true"
  labels:
    kubernetes.io/bootstrapping: rbac-defaults
  name: system:kube-apiserver-to-kubelet
rules:
  - apiGroups:
      - ""
    resources:
      - nodes/proxy
      - nodes/stats
      - nodes/log
      - nodes/spec
      - nodes/metrics
      - pods/log
    verbs:
      - "*"
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: system:kube-apiserver
  namespace: ""
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: system:kube-apiserver-to-kubelet
subjects:
  - apiGroup: rbac.authorization.k8s.io
    kind: User
    name: kubernetes
    
# This role allows full access to the kubelet API
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubelet-api-admin
  labels:
    addonmanager.kubernetes.io/mode: Reconcile
rules:
- apiGroups:
  - ""
  resources:
  - nodes/proxy
  - nodes/log
  - nodes/stats
  - nodes/metrics
  - nodes/spec
  verbs:
  - "*"
# This binding gives the kube-apiserver user full access to the kubelet API
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: kube-apiserver-kubelet-api-admin
  labels:
    addonmanager.kubernetes.io/mode: Reconcile
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: kubelet-api-admin
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: kube-apiserver    
```

执行以下命令：

```bash
kubectl apply -f apiserver-to-kubelet-rbac.yaml 
```

第三段落**部署 Master**顺利结束。

---
[« 二进制搭建 K8s - 2 部署 etcd 集群](binary-build-k8s-02-deploy-etcd.md)

[» 二进制搭建 K8s - 4 部署 Node](binary-build-k8s-04-deploy-worker.md)
