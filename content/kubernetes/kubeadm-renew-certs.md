[🏠 首页](../_index.md) / [Kubernetes](_index.md) / kubeadm 更新证书

# kubeadm 更新证书

1. 检查证书是否过期

```bash
sudo kubeadm certs check-expiration
```

2. 如果证书过期，先备份证书，再更新

```bash
sudo cp -r /etc/kubernetes/pki /etc/kubernetes/pki.bak
sudo cp /etc/kubernetes/admin.conf /etc/kubernetes/admin.conf.bak
```

3. 更新所有证书

```bash
sudo kubeadm certs renew all
```

4. 检查证书是否更新

```bash
sudo kubeadm certs check-expiration
```

5. 重启 kubernetes 核心组件

```txt
mkdir k8s_manifests.bak
sudo mv /etc/kubernetes/manifests/* k8s_manifests.bak/
sudo mv k8s_manifests.bak/* /etc/kubernetes/manifests/
```

7. 更新 kubeconfig 文件

```bash
sudo cp /etc/kubernetes/admin.conf ~/.kube/config
```

8. 查看 kubernetes 核心组件运行情况

```txt
kubectl get pod -n kube-system
```

---
[« kubeadm 安装 k8s (containerd)](kubeadm-install-k8s.md)

[» Kubeadm 升级 K8s](kubeadm-upgrade.md)
