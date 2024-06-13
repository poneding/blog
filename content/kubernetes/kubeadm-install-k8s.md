[🏠 首页](../_index.md) / [Kubernetes](_index.md) / kubeadm 安装 k8s (containerd)

# kubeadm 安装 k8s (containerd)

使用 kubeadm 安装 k8s 集群，是社区推荐的安装方式，本文档将介绍使用 kubeadm 安装 k8s 集群的详细过程。

Notes:

1. 随着 kubeadm & k8s 版本的更新，安装过程可能会有所不同，截至目前，本文档使用的是 kubeadm v1.28.3 & k8s v1.28.3 版本；
2. 本文档使用的操作系统是 Ubuntu 22.04，其他操作系统可能会有所不同。

## 要求

- 至少一台物理机或虚拟机（例如：Ubuntu 22.04）作为集群节点，最少 2 核 2G 内存；
- 多节点之前网络互通，且节点主机名不冲突；
- Master 节点需要开放以下端口：6443、2379-2380、10250、10251、10252；

## 准备工作

禁用交换分区：

```bash
# 临时禁用交换分区
sudo swapoff -a

vim /etc/fstab
# 注释掉 swap 分区的配置
```

配置系统：

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# sysctl params required by setup, params persist across reboots
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system
```

## 安装 containerd

参照 [containerd 安装](https://github.com/containerd/containerd/blob/main/docs/getting-started.md)。

```bash
export LATEST=$(curl -s https://api.github.com/repos/containerd/containerd/releases/latest | jq -r .tag_name)

LATEST=${LATEST#v}

wget https://github.com/containerd/containerd/releases/download/v$LATEST/containerd-$LATEST-linux-amd64.tar.gz

sudo tar Cxzvf /usr/local containerd-$LATEST-linux-amd64.tar.gz

# systemd 配置
sudo wget https://raw.githubusercontent.com/containerd/containerd/main/containerd.service -O /lib/systemd/system/containerd.service

sudo systemctl daemon-reload
sudo systemctl enable --now containerd.service
sudo systemctl restart containerd.service
```

## 安装 kubeadm、kubelet 和 kubectl

```bash
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl

curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.28/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

# 国内网络使用下面命令替换
# curl -fsSL https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | apt-key add -

echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.28/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list

# 国内网络使用下面命令替换
# cat << EOF | sudo tee /etc/apt/sources.list.d/kubernetes.list
# deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
# EOF

sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
```

> 早于 Debian 12 和 Ubuntu 22.04 的版本，/etc/apt/keyrings 目录默认不存在，需要手动创建：`sudo mkdir -m 755 /etc/apt/keyrings`

## 安装集群

国内网络提前拉取 `registry.k8s.io/pause:3.9` 镜像：

```bash
docker pull registry.aliyuncs.com/google_containers/pause:3.9
docker tag registry.aliyuncs.com/google_containers/pause:3.9 registry.k8s.io/pause:3.9
```

使用 `kubeadm init` 初始化集群：

```bash
sudo kubeadm init \
  --pod-network-cidr 10.244.0.0/16 \
  --kubernetes-version 1.29.0 \
  --control-plane-endpoint=<EXTERNAL_IP>:6443 \
  --ignore-preflight-errors=Swap
```

Notes:

1. 需要确保 `--control-plane-endpoint` 端点在执行环境是可以访问的，如果参数值为服务器的公网 IP，那么你可能需要对安全组开通 6443 端口;
2. 国内网络拉取镜像使用代理添加命令参数：`--image-repository registry.aliyuncs.com/google_containers`。

初始化完成后，执行以下命令，配置集群访问环境：

```bash
mkdir -p ~/.kube
sudo cp -i /etc/kubernetes/admin.conf ~/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

查看集群节点状态：

```bash
kubectl get nodes
```

如果允许 Pod 调度到 Master 节点，那么需要去除 Master 节点的污点：

```bash
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
```

## 安装网络插件

安装 `flannel` 网络插件：

```bash
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml
```

flannel 默认使用 CIDR 为 `10.244.0.0/16`，需要与 `kubeadm init` 时指定的 `--pod-network-cidr` 参数一致。

## 安装 metrics-server

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

在多数情况下，metrics-server 由于证书问题无法正常启动，需要修改 `metrics-server` 的 `Deployment` 配置，添加 `--kubelet-insecure-tls` 参数：

```bash
kubectl edit deployment metrics-server -n kube-system
```

```yaml
...
spec:
  ...
  template:
    ...
    spec:
      containers:
      - args:
        - --cert-dir=/tmp
        - --secure-port=4443
        - --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname
        - --kubelet-use-node-status-port
        - --metric-resolution=15s
        - --kubelet-insecure-tls
```

## 部署应用

```bash
kubectl create deployment nginx --image=nginx
kubectl expose deployment nginx --name=nginx --port=80 --target-port=80 --type=NodePort
```

## 参考

- [Bootstrapping clusters with kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/)
- [Container Runtimes](https://kubernetes.io/docs/setup/production-environment/container-runtimes/)

---
[« kubeadm 安装 Kubernetes (Docker)](kubeadm-install-k8s-docker.md)

[» Kubeadm 升级 K8s](kubeadm-upgrade.md)
