[🏠 首页](../_index.md) / [Kubernetes](_index.md) / Kubernetes 0-1 使用preStop优雅终止Pod

# Kubernetes 0-1 使用preStop优雅终止Pod

![alt text](https://images.poneding.com/2025/03/202503111830216.png)

Kubernetes允许Pod终止之前，执行自定义逻辑。

## 字段定义

字段定义：`pod.spec.containers.lifecycle.preStop`

```bash
$ kubectl explain pod.spec.containers.lifecycle.preStop
KIND:     Pod
VERSION:  v1

RESOURCE: preStop <Object>

DESCRIPTION:
     PreStop is called immediately before a container is terminated due to an
     API request or management event such as liveness/startup probe failure,
     preemption, resource contention, etc. The handler is not called if the
     container crashes or exits. The reason for termination is passed to the
     handler. The Pod's termination grace period countdown begins before the
     PreStop hooked is executed. Regardless of the outcome of the handler, the
     container will eventually terminate within the Pod's termination grace
     period. Other management of the container blocks until the hook completes
     or until the termination grace period is reached. More info:
     https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks

     Handler defines a specific action that should be taken

FIELDS:
   exec <Object>
     One and only one of the following should be specified. Exec specifies the
     action to take.

   httpGet      <Object>
     HTTPGet specifies the http request to perform.

   tcpSocket    <Object>
     TCPSocket specifies an action involving a TCP port. TCP hooks not yet
     supported
```

有三种preStop方式：

- **exec**：
- **httpGet**：
- **tcpSocket**：

## 示例

使用最简单的**exec**作示例，详细查看一下exec下需要定义的字段：

```bash
$ kubectl explain pod.spec.containers.lifecycle.preStop.exec
KIND:     Pod
VERSION:  v1

RESOURCE: exec <Object>

DESCRIPTION:
...
FIELDS:
   command      <[]string>
     Command is the command line to execute inside the container, the working
     directory for the command is root ('/') in the container's filesystem. The
     command is simply exec'd, it is not run inside a shell, so traditional
     shell instructions ('|', etc) won't work. To use a shell, you need to
     explicitly call out to that shell. Exit status of 0 is treated as
     live/healthy and non-zero is unhealthy.
```

接下来按照字段释义，直接定义一个Pod：

```bash
$ kubectl apply -f pod.yaml
# pod.yaml文件内容：
apiVersion: v1
kind: Pod
metadata:
  name: busybox
  namespace: default
spec:
  containers:
    - name: busybox
      image: busybox
      command: ["/bin/sh", "-c", "sleep 10m"]
      lifecycle:
        preStop:
          exec:
            command:
              [
                "/bin/sh",
                "-c",
                "echo this pod is stopping. > /stop.log && sleep 10s",
              ]
```

删除pod：

```bash
kubectl delete pod busybox
```

在新终端窗口（因为删除pod会占用终端窗口）获取pod内文件内容，需要在pod完全删除之前（10s内，也可以将该值设置稍长一点）：

```bash
$ kubectl exec busybox -c busybox -- cat /stop.log
# 可以得到日志内容
this pod is stopping.
```

这说明，preStop确实生效了。

## 使用场景

- 你的请求已经到达了当前Pod，硬终止会导致请求失败，我们希望已经到达了当前Pod的请求处理完成再将其停止掉，尽可能避免请求失败；
- Pod已经本身已经注册到了服务中心，我们希望在Pod停止之前，主动向服务注册中心通知下线；

## 结束语

与preStop相对应，有一个postStart的概念，在容器创建成功后执行，可用于初始化资源，准备环境等；

如果preStop与postStart执行失败，将会杀死容器。所以作为钩子函数，应该尽量保证它们是轻量的；

Pod的终止过程：

删除Pod => Pod被标记为Terminating状态 => Service移除该Pod的endpoint => kubelet甄别Terminating状态的pod，执行pod的preStop钩子 => 如果执行preStop超时（grace period） ，kubelet发送SIGTERM并等待2秒 => ...

![alt text](https://images.poneding.com/2025/03/202503111830984.png)

---
[« Telepresence](telepresence.md)

[» Terraform](terraform.md)
