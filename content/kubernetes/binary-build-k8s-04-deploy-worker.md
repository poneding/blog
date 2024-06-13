[🏠 首页](../_index.md) / [Kubernetes](_index.md) / 二进制搭建 K8s - 4 部署 Node

# 二进制搭建 K8s - 4 部署 Node

## 写在前面

记录和分享使用二进制搭建 K8s 集群的详细过程，由于操作比较冗长，大概会分四篇写完：

1. **[机器准备](./binary-build-k8s-01-prepare-nodes.md)**：
2. **[部署 etcd 集群](./binary-build-k8s-02-deploy-etcd.md)**：
3. **[部署 Master](./binary-build-k8s-03-deploy-master.md)**：
4. **[部署 Node](./binary-build-k8s-04-deploy-worker.md)**：

K8s 的 Node 上需要运行 kubelet 和 kube-proxy。本篇介绍在 Node 机器安装这两个组件，除此之外，安装通信需要的 cni 插件。

本篇的执行命令需要在准备的两台Node机器上执行。

## 安装 docker

可以参照官网：<https://docs.docker.com/engine/install/>

```shell
# 卸载老版本或重装 docker 时执行第一行
yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine -y

# 安装 docker
yum install -y yum-utils
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
yum install docker-ce docker-ce-cli containerd.io -y

# 查看 Docker 版本
docker version
```

启动 Docker

```bash
systemctl enable docker
systemctl start docker
```

## 安装 kubelet

```shell
cd /root/kubernetes/resources
tar -zxvf ./kubernetes-node-linux-amd64.tar.gz
mkdir /etc/kubernetes/{ssl,bin} -p
cp kubernetes/node/bin/kubelet ./kubernetes/node/bin/kube-proxy /etc/kubernetes/bin
cd /etc/kubernetes
```

准备 kubelet 配置文件

```shell
vim kubelet
```

执行上行命令，在 k8s-node01 写入文件内容如下：

```bash
KUBELET_ARGS="--logtostderr=false \
--v=2 \
--log-dir=/var/log/kubernetes  \
--enable-server=true \
--kubeconfig=/etc/kubernetes/kubelet.kubeconfig \
--hostname-override=k8s-node01 \
--network-plugin=cni \
--bootstrap-kubeconfig=/etc/kubernetes/bootstrap.kubeconfig \
--config=/etc/kubernetes/kubelet-config.yml \
--cert-dir=/etc/kubernetes/ssl"
```

在 k8s-node02 写入文件内容如下：

```bash
KUBELET_ARGS="--logtostderr=false \
--v=2 \
--log-dir=/var/log/kubernetes  \
--enable-server=true \
--kubeconfig=/etc/kubernetes/kubelet.kubeconfig \
--hostname-override=k8s-node02 \
--network-plugin=cni \
--bootstrap-kubeconfig=/etc/kubernetes/bootstrap.kubeconfig \
--config=/etc/kubernetes/kubelet-config.yml \
--cert-dir=/etc/kubernetes/ssl"
```

准备 bootstrap.kubeconfig 文件

```bash
vim /etc/kubernetes/bootstrap.kubeconfig
```

执行上行命令，写入文件内容如下：

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority: /etc/kubernetes/ssl/ca.pem
    server: https://192.168.115.131:6443
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: kubelet-bootstrap
  name: default
current-context: default
kind: Config
preferences: {}
users:
- name: kubelet-bootstrap
  user:
    token: d5c5d767b64db39db132b433e9c45fbc
```

> 注意：token 的值需要替换为 master 生成的 token.csv 中所用的 token。

准备 kubelet-config.yml 文件

```bash
vim kubelet-config.yml
```

执行上行命令，写入文件内容如下：

```bash
kind: KubeletConfiguration
apiVersion: kubelet.config.k8s.io/v1beta1
address: 0.0.0.0
port: 10250
readOnlyPort: 10255
cgroupDriver: cgroupfs
clusterDNS:
- 10.0.0.2
clusterDomain: cluster.local 
failSwapOn: false
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 2m0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/ssl/ca.pem 
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 5m0s
    cacheUnauthorizedTTL: 30s
evictionHard:
  imagefs.available: 15%
  memory.available: 100Mi
  nodefs.available: 10%
  nodefs.inodesFree: 5%
maxOpenFiles: 1000000
maxPods: 110
```

准备 kubelet.kubeconfig 文件

```bash
vim kubelet.kubeconfig
```

执行上行命令，写入文件内容如下：

```yaml
kubelet.kubeconfig
apiVersion: v1
clusters:
- cluster:
    certificate-authority: /etc/kubernetes/ssl/ca.pem
    server: https://192.168.115.131:6443
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    namespace: default
    user: default-auth
  name: default-context
current-context: default-context
kind: Config
preferences: {}
users:
- name: default-auth
  user:
    client-certificate: /etc/kubernetes/ssl/kubelet-client-current.pem
    client-key: /etc/kubernetes/ssl/kubelet-client-current.pem
```

准备kubelet服务配置文件

```shell
vim /usr/lib/systemd/system/kubelet.service
```

执行上行命令，写入文件内容如下：

```ini
[Unit]
Description=Kubelet
Documentation=https://github.com/GoogleCloudPlatform/kubernetes
After=docker.service
Requires=docker.service

[Service]
EnvironmentFile=/etc/kubernetes/kubelet
ExecStart=/etc/kubernetes/bin/kubelet $KUBELET_ARGS
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

启动 kubelet：

```bash
systemctl daemon-reload
systemctl start kubelet
systemctl enable kubelet
systemctl status kubelet
```

给 Node 颁发证书，在 Master 上执行：

```shell
kubectl get csr
# 输出如下
NAME                                                   AGE   SIGNERNAME                                    REQUESTOR           CONDITION
node-csr-a-BmW9xMglOXlUdwBjD2QQphXLdu4iwtamEIIbhJKcY   10m   kubernetes.io/kube-apiserver-client-kubelet   kubelet-bootstrap   Pending
node-csr-zDDrVyKH7ug8fTUcDjdvDgh-f9rVCyoHuLMGaWbykAQ   10m   kubernetes.io/kube-apiserver-client-kubelet   kubelet-bootstrap   Pending
```

得到证书的 NAME，给其 Approve：

```shell
kubectl certificate approve node-csr-a-BmW9xMglOXlUdwBjD2QQphXLdu4iwtamEIIbhJKcY
kubectl certificate approve node-csr-zDDrVyKH7ug8fTUcDjdvDgh-f9rVCyoHuLMGaWbykAQ 
```

再次查看证书，证书的 CONDITION 就会更新了

```shell
kubectl get csr
# 输出如下
NAME                                                   AGE     SIGNERNAME                                    REQUESTOR           CONDITION
node-csr-a-BmW9xMglOXlUdwBjD2QQphXLdu4iwtamEIIbhJKcY   10m   kubernetes.io/kube-apiserver-client-kubelet   kubelet-bootstrap   Approved,Issued
node-csr-zDDrVyKH7ug8fTUcDjdvDgh-f9rVCyoHuLMGaWbykAQ   10m   kubernetes.io/kube-apiserver-client-kubelet   kubelet-bootstrap   Approved,Issued
```

接下来使用查看 Node 的命令，应该可以获取到 Node 信息：

```shell
kubectl get node
# 输出如下
NAME         STATUS     ROLES    AGE     VERSION
k8s-node01   NotReady   <none>   50s   v1.18.3
k8s-node02   NotReady   <none>   56s   v1.18.3
```

## 安装 kube-proxy

准备 kube-proxy 配置文件

```shell
vim kube-proxy
```

执行上行命令，写入文件内容如下：

```tex
KUBE_PROXY_ARGS="--logtostderr=false \
--v=2 \
--log-dir=/var/log/kubernetes \
--config=/etc/kubernetes/kube-proxy-config.yml"
```

准备 kube-proxy-config.yml 文件

```bash
vim /etc/kubernetes/kube-proxy-config.yml
```

执行上行命令，在 k8s-node01 写入文件内容如下：

```bash
kind: KubeProxyConfiguration
apiVersion: kubeproxy.config.k8s.io/v1alpha1
address: 0.0.0.0
metricsBindAddress: 0.0.0.0:10249
iclientConnection:
  kubeconfig: /etc/kubernetes/kube-proxy.kubeconfig
hostnameOverride: k8s-node01
clusterCIDR: 10.0.0.0/24
mode: ipvs
ipvs:
  scheduler: "rr"
iptables:
  masqueradeAll: true
```

在 k8s-node02 写入文件内容如下：

```yaml
kind: KubeProxyConfiguration
apiVersion: kubeproxy.config.k8s.io/v1alpha1
address: 0.0.0.0
metricsBindAddress: 0.0.0.0:10249
clientConnection:
  kubeconfig: /etc/kubernetes/kube-proxy.kubeconfig
hostnameOverride: k8s-node02
clusterCIDR: 10.0.0.0/24
mode: ipvs
ipvs:
  scheduler: "rr"
iptables:
  masqueradeAll: true
```

准备 kube-proxy.kubeconfig 文件

```bash
vim /etc/kubernetes/kube-proxy.kubeconfig
```

执行上行命令，写入文件内容如下：

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority: /etc/kubernetes/ssl/ca.pem
    server: https://192.168.115.131:6443
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: kube-proxy
  name: default
current-context: default
kind: Config
preferences: {}
users:
- name: kube-proxy
  user:
    client-certificate: /etc/kubernetes/ssl/kube-proxy.pem
    client-key: /etc/kubernetes/ssl/kube-proxy-key.pem
```

准备 kube-proxy 服务配置文件

```shell
vim /usr/lib/systemd/system/kube-proxy.service
```

执行上行命令，写入文件内容如下：

```ini
[Unit]
Description=Kube-Proxy
Documentation=https://github.com/GoogleCloudPlatform/kubernetes
After=network.target
Requires=network.target

[Service]
EnvironmentFile=/etc/kubernetes/kube-proxy
ExecStart=/etc/kubernetes/bin/kube-proxy $KUBE_PROXY_ARGS
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

启动 kubelet：

```bash
systemctl daemon-reload
systemctl start kube-proxy
systemctl enable kube-proxy
systemctl status kube-proxy
```

## 部署 cni 网络插件

```bash
cd /root/kubernetes/resources
mkdir -p /opt/cni/bin /etc/cni/net.d
tar -zxvf cni-plugins-linux-amd64-v0.8.6.tgz -C /opt/cni/bin
```

## 部署 Flannel 集群网络

需要在 Master 机器上执行

```bash
cd /root/kubernetes/resources
kubectl apply -f kube-flannel.yml
```

创建角色绑定

```bash
kubectl create clusterrolebinding kube-apiserver:kubelet-apis --clusterrole=system:kubelet-api-admin --user kubernetes
```

## K8s 集群测试

部署一个 nginx 的 deployment：

```bash
kubectl create deployment nginx --image=nginx
# 在等待几秒后，获取 deployment
kubectl get deployment
ifconfig cni0
kubectl expose deployment nginx --port=80 --type=NodePort
kubectl get svc
```

可以看到 nginx 已经启动成功。

```bash
NAME    READY   UP-TO-DATE   AVAILABLE   AGE
nginx   1/1     1            1           7m7s
```

> 注意：如果启动失败，可能是由于网络原因拉取镜像失败导致。可以通过 `kubectl describe pod <pod-name>` 查看。

使用 service 暴露 K8s 集群内部 Pod 服务：

```bash
kubectl expose deployment nginx --port=80 --type=NodePort
# 获取 service
kubectl get svc
```

可以看到，service 将 nginx 的服务转发到了 31839 端口

```bash
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
kubernetes   ClusterIP   10.0.0.1     <none>        443/TCP        10h
nginx        NodePort    10.0.0.101   <none>        80:31839/TCP   10s
```

此时，我们在 Node 机器上使用该端口访问 nginx，可以看到成功访问。

```tex
[root@k8s-node01]# curl 192.168.115.132:31839
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

好了，至此第四段落**部署 Node**也顺利结束。

## 结束语

在使用二进制搭建 K8s 集群的过程中，搭建的过程参考了很多园友的博客。由于我是使用最新的 K8s、etcd 版本搭建的，遇到了很多的问题，但没有关系，好事多磨。

在遇到问题的时候，几乎都是通过查看 K8s 中组件的运行状态和日志来寻找问题根源和解决方案的。

大部分问题都是出在配置方面，或是文件路径配置问题，或是新版本的配置不兼容问题。

---
[« 二进制搭建 K8s - 3 部署 Master](binary-build-k8s-03-deploy-master.md)

[» Kubernetes 0-1 尝试理解云原生](cloud-native-understood.md)
