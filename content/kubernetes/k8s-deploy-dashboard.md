[🏠 首页](../_index.md) / [Kubernetes](_index.md) / Kubernetes 0-1 K8s部署Dashboard

# Kubernetes 0-1 K8s部署Dashboard

首先下载部署的必要文件：

```shell
wget https://raw.githubusercontent.com/kubernetes/dashboard/master/aio/deploy/recommended.yaml -O kube-dash.yaml --no-check-certificate
```

默认Dashboard的Service类型是ClusterIP，我们集群外面不方便访问，我们最好是将Service类型修改为NodePoart或LoadBalancer（前提是你的集群支持LoadBalancer），以LoadBalancer为例。

修改文件kube-dash.yaml文件，将kubernetes-dashboard Service部分修改成如下：

```yaml
kind: Service
apiVersion: v1
metadata:
  labels:
    k8s-app: kubernetes-dashboard
  name: kubernetes-dashboard
  namespace: kubernetes-dashboard
spec:
  type: LoadBalancer
  ports:
    - port: 443
      targetPort: 8443
  selector:
    k8s-app: kubernetes-dashboard
```

创建kube-dash-admin-user.yaml文件:

```shell
vim kube-dash-admin-user.yaml
```

写入如下内容：

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
---

apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kubernetes-dashboard  
```

执行命令：

```shell
kubectl apply -f kube-dash.yaml # 创建dashboard服务
kubectl apply -f kube-dash-admin-user.yaml # 创建kubernetes集群的管理员角色和账号
```

执行完之后，我们查看Dashboard的Service：

```shell
kubectl get svc -n kubernetes-dashboard
```

输出以下内容，可以看到，kubernetes-dashboard的svc的EXTERNAL-IP为192.168.115.141，这就是LoadBalancer为我们自动分配的一个IP。

```tex
NAME                        TYPE           CLUSTER-IP   EXTERNAL-IP       PORT(S)         AGE
dashboard-metrics-scraper   ClusterIP      10.0.0.210   <none>            8000/TCP        52s
kubernetes-dashboard        LoadBalancer   10.0.0.51    192.168.115.141   443:31385/TCP   52s
```

这时我们以`https://192.168.115.141`访问部署的dashboard，第一次访问可能需要点击 **`Advanced`** => **`Proceed to 192.168.115.141 (unsafe)`**进入。

> 注意：必须以https方式访问，因为dashboard是默认开启更为安全的https通信。

![image-20200616170556682](https://images.poneding.com/2025/03/202503111831611.png)

需要使用Token登录，使用如下命令获取token：

```shell
kubectl -n kubernetes-dashboard describe secret $(kubectl -n kubernetes-dashboard get secret | grep admin-user | awk '{print $1}')
```

输出内容，获取到token。

```tex
Name:         admin-user-token-l56hp
Namespace:    kubernetes-dashboard
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: admin-user
              kubernetes.io/service-account.uid: 95db28c5-4951-4aae-bf59-b0c26c8b35c7

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     1375 bytes
namespace:  20 bytes
token:      eyJhbGciOiJSUzI1NiIsImtpZCI6IjYtQW51Z2xPMi1WTmpEZEtIX3BBYXd1YWpGLVU2Y0J0S1dmZE9lR3hoYU0ifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJhZG1pbi11c2VyLXRva2VuLWw1NmhwIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImFkbWluLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiI5NWRiMjhjNS00OTUxLTRhYWUtYmY1OS1iMGMyNmM4YjM1YzciLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZXJuZXRlcy1kYXNoYm9hcmQ6YWRtaW4tdXNlciJ9.Dqnk21CcBWU7SHgKRUu8uebL1djF1BJChNT5qTvk1uGLTF3AN9RMmacXlzO2xC5fP3zasmBFjcmS_JY76k7CS6DHdHKgxgB8vlEfIbh-i4YTA7cKK3_Ko5hAy7e6GhoPsfcYnV5QVec2mlvfMoozJT62UT62YkNrfUZXwFz02V4EfNgCgWVPKgiKzciMVOMNJ6-FKiiXyfhl4zprb8hSPzpc0F2Jd62Ykoltuir74UoByOazAnr7bA9ZTXSf1k8fjUaOUsBh37ap_eHg3Yh2gIcYMBxsp1tV0VVNKJDnVCN-lRBhfUciK93kvxU3I8xjWRv6JUHifCvHUiiWXjGZ8A
```

> 注意：默认token的过期时间为900秒(15分钟)，为了避免频繁的因为token过期登录问题，可以修改kubernetes-dashboard的Deployment的配置，添加`token-ttl`参数：
>
> ```yaml
> ...
> args:
>   - --auto-generate-certificates
>   - --token-ttl=43200
> ...  
> ```

拿到token，拷贝到dashboard进行登录。登入后，可以看到K8s的资源信息。

![image-20200616170847284](https://images.poneding.com/2025/03/202503111831390.png)

Kubernetes-Dashboard部署完成。

---
[« Kubernetes 0-1 K8s部署coredns](k8s-deploy-coredns.md)

[» Kubernetes 0-1 K8s部署EFK](k8s-deploy-efk.md)
