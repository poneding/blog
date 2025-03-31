[🏠 首页](../_index.md) / [Kubernetes](_index.md) / Kubernetes 0-1 K8s自建LoadBalancer

# Kubernetes 0-1 K8s自建LoadBalancer

## Metallb介绍

一般只有云平台支持LoadBalancer，如果脱离云平台，自己搭建的K8s集群，Service的类型使用LoadBalancer是没有任何效果的。为了让私有网络中的K8s集群也能体验到LoadBalabcer，Metallb成为了解决方案。

Metallb运行在K8s集群中，监视集群内LoadBalancer类型的服务，然后从配置的IP池中为其分配一个可用IP，以ARP/NDP或BGP的方式将其广播出去，这个可用IP成为了LoadBalancer的Url，可供集群外访问。

## Metallb搭建过程

创建命名空间 metallb-system：

```shell
vim metallb-namespace.yaml
```

写入文件内容：

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: metallb-system
```

下载metallb.yaml文件

```shell
wget https://raw.githubusercontent.com/metallb/metallb/v0.9.3/manifests/metallb.yaml -O metallb.yaml --no-check-certificate
```

定义LoadBalancer的IP池，先创建configmap

```shell
vim metallb-configMap.yaml
```

写入文件内容：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: metallb-system
  name: config
data:
  config: |
    address-pools:
    - name: default
      protocol: layer2
      addresses:
      - 192.168.115.140-192.168.115.199
```

> 注意：IP池的网络需要和K8s集群的IP处于同一网段，我的K8s集群网络是192.168.115.13x，这里IP池则是给到192.168.115.140-192.168.115.199的范围。

执行命令：

```shell
kubectl apply -f metallb-namespace.yaml
kubectl create secret generic -n metallb-system memberlist --from-literal=secretkey="$(openssl rand -base64 128)"
kubectl apply -f metallb.yaml
kubectl apply -f metallb-configMap.yaml
```

## LoadBalancer测试

我们使用类型为LoadBalancer的Service进行测试，以nginx服务为例。

```shell
kubectl create deployment nginx --image=nginx
kubectl expose deployment nginx --port=80 --type=LoadBalancer
```

查看nginx服务：

```bash
[root@k8s-master01 test]# kubectl get svc
NAME         TYPE           CLUSTER-IP   EXTERNAL-IP       PORT(S)        AGE
kubernetes   ClusterIP      10.0.0.1     <none>            443/TCP        11h
nginx        LoadBalancer   10.0.0.82    192.168.115.140   80:31610/TCP   8s
```

可以看到，已经为nginx服务分配了一个`192.168.115.140` 的IP，直接在浏览器中访问，一切正常。

![alt text](https://images.pding.top/2025/03/202503112119348.png)

---
[« local 存储卷实践](local-storageclass.md)

[» 使用 nfs 持久化存储](nfs-as-pvc.md)
