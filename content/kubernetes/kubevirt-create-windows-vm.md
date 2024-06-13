[🏠 首页](../_index.md) / [Kubernetes](_index.md) / KubeVirt 创建 Windows 虚拟机

# KubeVirt 创建 Windows 虚拟机

```bash
virtctl image-upload --image-path windows-10.iso --pvc-name=windows-10-iso --size 10G --uploadproxy-url https://<cdi-uploadproxy.cdi.svc> --insecure --wait-secs 240
```

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: windows-10-data
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 40G
  storageClassName: longhorn
  volumeMode: Filesystem
---
apiVersion: kubevirt.io/v1
kind: VirtualMachine
metadata:
  name: windows-10
spec:
  running: true
  template:
    metadata:
      labels:
        kubevirt.io/domain: windows-10
    spec:
      domain:
        cpu:
          cores: 4
        devices:
          networkInterfaceMultiqueue: true #开启网卡多队列模式
          blockMultiQueue: true #开启磁盘多队列模式
          disks:
          - cdrom: 
              bus: sata
            name: virtiocontainerdisk
          - cdrom: 
              bus: sata
            name: cdromiso
            bootOrder: 1
          - disk:
              bus: virtio
            name: harddrive
            bootOrder: 2
          interfaces:
          - masquerade: {}
            model: virtio
            name: default
        resources:
          requests:
            memory: 8G
      networks:
      - name: default
        pod: {}
      volumes:
      - name: cdromiso
        persistentVolumeClaim:
          claimName: windows-10-iso
      - name: harddrive
        persistentVolumeClaim:
          claimName: windows-10-data
      - containerDisk:
          image: kubevirt/virtio-container-disk
        name: virtiocontainerdisk
```

---
[« Kuberentes](kubernetes.md)

[» Kubevirt 实践](kubevirt-practice.md)
