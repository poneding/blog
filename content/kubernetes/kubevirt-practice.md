[🏠 首页](../_index.md) / [Kubernetes](_index.md) / Kubevirt 实践

# Kubevirt 实践

## 简介

`Kubevirt`  是 Redhat 开源的以容器方式运行虚拟机的项目，以 k8s add-on 方式，利用 k8s CRD 为增加资源类型 `VirtualMachineInstance`（VMI）， 使用容器的 image registry 去创建虚拟机并提供 VM 生命周期管理。 CRD 的方式使得 kubevirt 对虚拟机的管理不局限于 pod 管理接口，但是也无法使用 pod 的 RS DS Deployment 等管理能力，也意味着 kubevirt 如果想要利用 pod 管理能力，要自主去实现，目前 kubevirt 实现了类似 RS 的功能。 kubevirt 目前支持的 runtime 是 docker 和 runc。

## 安装

1. 部署 K8s 资源

```bash
# 最新版本
export KUBEVIRT_VERSION=$(curl -s https://api.github.com/repos/kubevirt/kubevirt/releases/latest | jq -r .tag_name)
echo $KUBEVIRT_VERSION

# 安装 CRD
kubectl create -f https://github.com/kubevirt/kubevirt/releases/download/${KUBEVIRT_VERSION}/kubevirt-cr.yaml

# 安装控制器
kubectl create -f https://github.com/kubevirt/kubevirt/releases/download/${KUBEVIRT_VERSION}/kubevirt-operator.yaml
```

2. 安装 virtctl 工具

```bash
wget -O virtctl https://github.com/kubevirt/kubevirt/releases/download/${KUBEVIRT_VERSION}/virtctl-${KUBEVIRT_VERSION}-linux-amd64

chmod +x virtctl
mv virtctl /usr/local/bin
```

3. 检查资源状态

```bash
# 需要等待所有 Pod 处于 Running 状态
kubectl get pods -n kubevirt

# 需要等待 kubevirt 处于 Deployed 状态
kubectl -n kubevirt get kubevirt
```

4. 卸载

卸载首先需要删除 CRD，然后卸载控制器。

```bash
# 0、获取当前 Kubevirt 版本
export KUBEVIRT_VERSION=$(kubectl get kubevirts.kubevirt.io -n kubevirt kubevirt -o=jsonpath='{.status.observedKubeVirtVersion}')

# 1、删除 CRD
kubectl delete -f https://github.com/kubevirt/kubevirt/releases/download/${KUBEVIRT_VERSION}/kubevirt-cr.yaml

# 2、卸载控制器
kubectl delete -f kubectl create -f https://github.com/kubevirt/kubevirt/releases/download/${KUBEVIRT_VERSION}/kubevirt-operator.yaml
```

## 概念

- 虚拟机（VirtualMachine）
- 虚拟机实例（VirtualMachineInstance）

## 创建虚拟机

现在你可以像创建其他任何 K8s 资源一样，声明虚拟机资源然后创建了，如下：

```yaml
apiVersion: kubevirt.io/v1
kind: VirtualMachine
metadata:
  name: testvm
spec:
  running: false
  template:
    metadata:
      labels:
        kubevirt.io/size: small
        kubevirt.io/domain: testvm
    spec:
      domain:
        devices:
          disks:
            - name: containerdisk
              disk:
                bus: virtio
            - name: cloudinitdisk
              disk:
                bus: virtio
          interfaces:
          - name: default
            masquerade: {}
        resources:
          requests:
            memory: 64M
      networks:
      - name: default
        pod: {}
      volumes:
        - name: containerdisk
          containerDisk:
            image: quay.io/kubevirt/cirros-container-disk-demo
        - name: cloudinitdisk
          cloudInitNoCloud:
            userDataBase64: SGkuXG4=
```

创建虚拟机：

```bash
kubectl apply -f testvm.yaml
```

查看虚拟机状态，虚拟机应该处于未运行的状态：

```bash
# kubectl get vms

kubectl get vms -o yaml testvm | grep -E 'running:.*|$'
```

## 运行虚拟机

使用 `virtctl start` 命令运行虚拟机：

```bash
virtual start testvm
```

> 注意：
>
> 如果遇到 `virtctl start testvm dial tcp 127.0.0.1:8080: connect: connection refused`问题，通过 `kubectl proxy --port 8080` 在本地代理 K8s apiserver 服务。

等待片刻，再次查看虚拟机状态，虚拟机应该处于未运行的状态：

```bash
kubectl get vms -o yaml testvm | grep -E 'running:.*|$'

kubectl get vmis

kubectl get vms 
```

## 访问虚拟机

使用 `virtual console` 命令访问虚拟机：

```bash
virtual console testvm
```

> 注意：
>
> - 使用镜像 `quay.io/kubevirt/cirros-container-disk-demo` 创建的虚拟机，默认账号密码：`cirros/gocubsgo`；
> - 使用 `ctrl+]` 退出。

## 关闭虚拟机

使用 `virtual stop` 命令访问虚拟机：

```bash
virtual stop testvm
```

删除虚拟机：

```bash
kubectl delete vms testvm
```

## 磁盘访问

### lun

将卷以 lun 的方式公开给虚拟机。

*pvc*：

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: lun-pvc
  namespace: default
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: longhorn
  volumeMode: Filesystem
```

*vm*：

```yaml
apiVersion: kubevirt.io/v1
kind: VirtualMachine
metadata:
  name: testvm
spec:
  running: false
  template:
    metadata:
      labels:
        kubevirt.io/size: small
        kubevirt.io/domain: testvm
    spec:
      domain:
        devices:
          disks:
            - name: containerdisk
              disk:
                bus: virtio
            - name: cloudinitdisk
              disk:
                bus: virtio
            - name: lundisk
              lun: {}
          interfaces:
          - name: default
            masquerade: {}
        resources:
          requests:
            memory: 64M
      networks:
      - name: default
        pod: {}
      volumes:
        - name: containerdisk
          containerDisk:
            image: quay.io/kubevirt/cirros-container-disk-demo
        - name: cloudinitdisk
          cloudInitNoCloud:
            userDataBase64: SGkuXG4=
        - name: lundisk
          persistentVolumeClaim:
            claimName: lun-pvc
```

### disk

*pvc*:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: disk-pvc
  namespace: default
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: longhorn
  volumeMode: Filesystem
```

*vm*:

```yaml
apiVersion: kubevirt.io/v1
kind: VirtualMachine
metadata:
  name: testvm
spec:
  running: false
  template:
    metadata:
      labels:
        kubevirt.io/size: small
        kubevirt.io/domain: testvm
    spec:
      domain:
        devices:
          disks:
            - name: containerdisk
              disk:
                bus: virtio
            - name: cloudinitdisk
              disk:
                bus: virtio
            - name: disk-pvc
              disk: 
                bus: virtio
          interfaces:
          - name: default
            masquerade: {}
        resources:
          requests:
            memory: 64M
      networks:
      - name: default
        pod: {}
      volumes:
        - name: containerdisk
          containerDisk:
            image: quay.io/kubevirt/cirros-container-disk-demo
        - name: cloudinitdisk
          cloudInitNoCloud:
            userDataBase64: SGkuXG4=
        - name: disk-pvc
          persistentVolumeClaim:
            claimName: disk-pvc
```

### cdrom

将卷以 cdrom 驱动器的方式公开给虚拟机。默认情况下只读，可以通过 `readonly: false` 设置为可写。

*pvc*:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: cdrom-pvc
  namespace: default
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: longhorn
  volumeMode: Filesystem
```

*vm*:

```yaml
apiVersion: kubevirt.io/v1
kind: VirtualMachine
metadata:
  name: testvm
spec:
  running: false
  template:
    metadata:
      labels:
        kubevirt.io/size: small
        kubevirt.io/domain: testvm
    spec:
      domain:
        devices:
          disks:
            - name: containerdisk
              disk:
                bus: virtio
            - name: cloudinitdisk
              disk:
                bus: virtio
            - name: disk-pvc
              cdrom:
                readonly: false
                bus: sata
          interfaces:
          - name: default
            masquerade: {}
        resources:
          requests:
            memory: 64M
      networks:
      - name: default
        pod: {}
      volumes:
        - name: containerdisk
          containerDisk:
            image: quay.io/kubevirt/cirros-container-disk-demo
        - name: cloudinitdisk
          cloudInitNoCloud:
            userDataBase64: SGkuXG4=
        - name: cdrom-pvc
          persistentVolumeClaim:
            claimName: cdrom-pvc
```

## 排错

1. 使用 virtctl 工具运行虚拟机时，遇到 `virtctl start testvm dial tcp 127.0.0.1:8080: connect: connection refused` 错误：

解决方法：本地代理 K8s apiserver 服务。

```bash
kubectl proxy --port 8080
```

---
[« KubeVirt 创建 Windows 虚拟机](kubevirt-create-windows-vm.md)

[» Kustomize](kustomize.md)
