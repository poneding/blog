[🏠 首页](../_index.md) / [Kubernetes](_index.md) / 使用 nfs 持久化存储

# 使用 nfs 持久化存储

一般云平台都会提供云存储服务，如 AWS EBS 服务，K8s 可以直接使用云存储服务创建 PV 和 PVC 作为 Volume 的存储后端。假设你没有使用到云存储，那么 NFS 可能会适合你。

NFS（Network File System），网络文件系统，允许计算机之间共享存储资源，这里也就不具体介绍了。

## 部署 nfs

以下命令需要root权限，示例中机器IP为`192.168.115.137`。

1. **安装 nfs**：

```shell
# Ubuntu & Debian
apt install nfs-kernel-server -y
# CentOS
yum install nfs-util -y
```

2. **创建共享目录**：

```shell
mkdir /nfs/data -p
```

3. **修改 nfs 的默认配置，在文末添加配置**：

```shell
vim /etc/exports
/nfs/data  *(rw,sync,no_root_squash)
```

其中：

- /nfs/data：共享目录
- *：对所有开放访问，可以配置成网段，IP，域名等
- rw：读写权限
- sync：文件同时写入磁盘和内存
- no_root_squash：当登录 NFS 主机使用共享目录的使用者是 root 时，其权限将被转换成为匿名使用者，通常它的 UID 与 GID，都会变成 nobody 身份

4. **重启 rpc，nfs 需要向 rpc 注册**：

```shell
systemctl restart rpcbind.service
systemctl enable rpcbind.service
```

5. **重启 nfs 服务**：

```shell
systemctl restart nfs-kernel-server.service
systemctl enable nfs-kernel-server.service
```

6. **挂载共享，在 fstab 文件中添加配置**：

```shell
vim /etc/fstab
192.168.115.137:/nfs/data /nfs/data               nfs    rw,tcp,soft  0  0
```

## 创建 PV

PersistentVolume 作为 K8s 的存储资源，我们需要为它定义 apacity（存储能力），accessModes（访问模式）persistentVolumeReclaimPolicy（回收策略），存储媒介等信息。

下面定义了一个 pv 资源，文件名为 pv1.yaml

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv1
spec:
  capacity:
    storage: 1Gi
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Recycle
  nfs:
    path: /nfs/data
    server: 192.168.115.137
```

需要对 AccessModes 和 PersistentVolumeReclaimPolicy 做简单的枚举介绍：

### AccessModes 访问模式

设置对 PV 存储资源的访问权限：

- ReadWriteOnce（RWO）：读写权限，只能被单个实例挂载
- ReadOnlyMany（ROX）：只读权限，可以被多个实例挂载

- ReadWriteMany（RWX）：读写权限，可以被多个实例挂载

### PersistentVolumeReclaimPolicy 回收策略

当挂载实例被删除时，设置对 PV 存储资源的回收策略：

- Retain：保留
- Recycle：清除
- Delete：删除，一般用于云存储服务删除对应的资源，如 AWS 的 EBS

现在创建 pv:

```shell
kubectl apply -f pv1.yaml
```

查看 pv，可以看到当前 pv1 的 STATUS 为 Available:

```shell
kubectl get pv
NAME   CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   REASON   AGE
pv1    1Gi        RWO            Recycle          Available                                   48s
```

这里也需要对 PV 的状态作下简单介绍：

### Status

PV 的生命周期包含了四个阶段：

- Avaliable：当前未绑定 PVC，处于可用状态

- Bound：已经被 PVC 绑定，不可用

- Released：之前被 PVC 绑定，PVC 删除时，PV 会被重新声明，很短暂的一段时间内处于 Released 状态
- Failed：PV 自动回收失败

## 创建 PVC

下面定义了一个 pvc 资源，文件名为 pvc1.yaml

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc1
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi  
```

现在创建 pvc

```shell
kubectl apply -f pvc1.yaml
```

查看 PVC，可以看到 pvc1 已经处于 Bound 的状态，说明它已经绑定上了一个 PV，而我们目前只创建了一个名为 pv1 的 PV

```shell
NAME   STATUS   VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE
pvc1   Bound    pv1      1Gi        RWO                           3s
```

再次查看 PV，看看是不是被 pvc1 绑定了。

```shell
NAME   CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM          STORAGECLASS   REASON   AGE
pv1    1Gi        RWO            Recycle          Bound    default/pvc1                           2m
```

确实如我们所想，pv1 被 pvc1 绑定，并且 pv1 的状态也更新成了 Bound。其实这是集群自动为我们的 PVC 寻找到的符合条件的 PV：

- 当前状态处于 Avaliable 的 PV
- PV 容量 >= PVC 申请容量
- pvc 和 pv 的 AccessMode 需要一致

当然，我们也可以通过标签选择器为 PVC 指定绑定的 PV。

定义 PV：

```yaml
...
kind: PersistentVolume
metadata:
  labels:
    app: pv1
....
```

定义 PVC：

```yaml
...
kind: PersistentVolumeClaim
spec:
  selector:
    matchLabels:
      app: pv1
...      
```

## Volume 使用 PVC

```yaml
...
      volumes:
      - name: www
        persistentVolumeClaim:
          claimName: pvc1
...          
```

---
[« Kubernetes 0-1 K8s自建LoadBalancer](metallb.md)

[» Kubernetes 0-1 了解 Pod](pod-understood.md)
