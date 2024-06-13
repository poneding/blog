[🏠 首页](../_index.md) / [CKA](_index.md) / 考题

# 考题

```bash
kubectl scale deployment nginx --replicas=3
```

**创建busybox**：

```bash
kubectl run busybox --image=busybox --generator=run-pod/v1 --command=true -- sleep 7d
```

```bash
# nslookup
kubectl run nginx-dns --image=nginx
kubectl run busybox --image=busybox --generator=run-pod/v1 --command=true -- sleep 7d
kubectl exec -it busybox -- nslookup nginx-dns 
kubectl exec -it busybox -- nslookup <pod-ip>
```

**etcd备份和还原**：

```bash
ETCDCTL_API=3 etcdctl --endpoints=https://[127.0.0.1]:2379 --cacert=/etc/kubernetes/pki/etcd/ca.crt \
     --cert=/etc/kubernetes/pki/etcd/server.crt --key=/etc/kubernetes/pki/etcd/server.key \
     snapshot save 
```

```bash
ETCDCTL_API=3 etcdctl --endpoints=https://[127.0.0.1]:2379 --cacert=/etc/kubernetes/pki/etcd/ca.crt \
     --name=master \
     --cert=/etc/kubernetes/pki/etcd/server.crt --key=/etc/kubernetes/pki/etcd/server.key \
     --data-dir /var/lib/etcd-from-backup \
     --initial-cluster=master=https://127.0.0.1:2380 \
     --initial-cluster-token etcd-cluster-1 \
     --initial-advertise-peer-urls=https://127.0.0.1:2380 \
     snapshot restore ...
```

---
[« 准备CKA](prepare-cka.md)
