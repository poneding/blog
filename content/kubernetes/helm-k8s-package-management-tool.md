[🏠 首页](../_index.md) / [Kubernetes](_index.md) / Kubernetes 0-1 Helm Kubernetes 的包管理工具

# Kubernetes 0-1 Helm Kubernetes 的包管理工具

![alt text](https://images.poneding.com/2025/03/202503111830647.png)

Helm is the best way to find, share, and use software built for Kubernetes.

Helm是为Kubernetes寻找，共享和使用软件构建的最佳方式。

## 简介

Helm帮助管理Kubernetes应用程序，即使是面对复杂的K8s引用，Helm Charts也可以轻松实现定义，安装和升级。

Helm是CNCF的毕业项目，由Helm社区维护。

**Charts**：

Charts可以看作是Helm的程序包，一个Chart是描述Kubernetes资源集的文件集合。

**Repository**：

存储和共享Charts，可以看作是Kubernetes程序包的存储中心。

**Release**：

由一个Chart运行起来的实例，这将在kubernetes集群中生成或更新一组资源，可以使用同一个chart运行成多个release。例如，如果你想运行多个redis服务，你可以通过多次安装redis的chart得到。

看到以上三个概念，你可能会觉得似曾相识，没错，与docker三个概念——image，registry，container如出一辙，也许现在你会加深点理解了。

## 安装

可以方便的使用脚本安装

```bash
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3
chmod 700 ./get-helm.sh
./get-helm.sh
```

也可以下载指定版本手动安装

下载地址：<https://github.com/helm/helm/releases>

```bash
wget https://get.helm.sh/helm-v3.5.2-linux-amd64.tar.gz
tar -zxvf ./helm-v3.5.2-linux-amd64.tar.gz
sudo mv linux-amd64/helm /usr/local/bin/helm
```

第一个helm命令

```bash
helm help
```

更多安装方式可查看：<https://helm.sh/docs/intro/install/>

## 使用

**初始化Helm Chart仓库**：

首先添加helm官方的helm stable charts仓库

```bash
helm repo add stable https://charts.helm.sh/stable
```

**查询charts仓库**：

例如你想查找prometheus应用仓库，打开<https://artifacthub.io/站点，在查询输入框中输入prometheus之后，搜索可以得到官方或民间的仓库。>

![alt text](https://images.poneding.com/2025/03/202503111830169.png)

![alt text](https://images.poneding.com/2025/03/202503111830421.png)

一般选择具有官方标志的仓库，进入该仓库的主页，里面会有charts的基本信息，以及安装命令的帮助。

![alt text](https://images.poneding.com/2025/03/202503111830682.png)

添加Prometheus的官方Charts仓库

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
```

添加仓库后，就可以在当前已经添加的仓库中搜索你需要的kubernetes应用了

```bash
$ helm search repo prometheus
NAME                                                    CHART VERSION   APP VERSION     DESCRIPTION                                       
prometheus-community/kube-prometheus-stack              13.5.0          0.45.0          kube-prometheus-stack collects Kubernetes manif...
prometheus-community/prometheus                         13.2.1          2.24.0          Prometheus is a monitoring system and time seri...
prometheus-community/prometheus-adapter                 2.11.1          v0.8.3          A Helm chart for k8s prometheus adapter
...
```

**创建release**：

使用特定的chart安装kubernetes应用

```bash
$ helm install prometheus prometheus-community/prometheus
NAME: prometheus
LAST DEPLOYED: Sun Feb  7 02:04:59 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
...
```

**查看release**：

```bash
$ helm ls
NAME        NAMESPACE  REVISION  UPDATED              STATUS    CHART              APP VERSION
prometheus  default    1         2021-02-07 02:04:59  deployed  prometheus-13.2.1  2.24.0 
$ helm status prometheus
NAME: prometheus
LAST DEPLOYED: Sun Feb  7 02:04:59 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
```

并且可以查看K8s集群是否正在创建你需要的应用

```bash
$ kubectl get pod
NAME                                                        READY   STATUS              RESTARTS   AGE
prometheus-alertmanager-5dbfffbbc4-jppgj         0/2     Pending             0          36s
prometheus-kube-state-metrics-66c4db67ff-r65tg   0/1     ContainerCreating   0          36s
prometheus-node-exporter-tvjnx                   1/1     Running             0          36s
prometheus-pushgateway-798b886754-x4fvq          0/1     ContainerCreating   0          36s
prometheus-server-74656c5bbc-k4m6x               0/2     Pending             0          36s
```

**删除 release**：

以下命令会删除所有install创建的所有Kubernetes资源

```bash
$ helm uninstall prometheus
release "prometheus" uninstalled
```

如果你想保存安装的历史信息，方便以后查看发布审计或者回滚发布，可以使用`--keep-history`命令标识。

```bash
$ helm uninstall prometheus --keep-history
release "prometheus" uninstalled

# 此时查看安装状态将变成uninstalled
$ helm ls
NAME    NAMESPACE       REVISION        UPDATED STATUS  CHART   APP VERSION
$ helm ls -a
NAME        NAMESPACE  REVISION  UPDATED             STATUS       CHART              APP VERSION
prometheus  default    1         2021-02-07 02:12:46 uninstalled  prometheus-13.2.1  2.24.0   
$ helm status prometheus
NAME: prometheus
LAST DEPLOYED: Sat Feb  6 02:49:41 2021
NAMESPACE: default
STATUS: uninstalled
REVISION: 1
...
```

**将删除release重新安装/回滚回来**：

每次成功的install或upgrade release后，我们都会得到release的REVISION，在回滚release时需要使用到这个版本号

```bash
$ helm rollback prometheus 1
Rollback was a success! Happy Helming!
```

## 定制

Charts是允许用户定制的，例如你想修改应用端口，或者应用的副本数量，可以通过修改charts的资源文件，然后依据资源文件创建release。

首先，下载应用的charts文件集合到本地

```bash
$ helm repo add bitnami https://charts.bitnami.com/bitnami
"bitnami" has been added to your repositories
$ mkdir nginx
$ helm show values bitnami/nginx > ./nginx/values.yaml
```

修改values.yaml文件，如果你对K8s资源的定义有所了解，那么你能轻松的修改该文件。

```bash
$ vim ./nginx/values.yaml
...
# 修改nginx deployment副本数为2
replicaCount: 2
...
```

文件修改完成后，使用如下命令安装

```bash
$ helm install nginx -f ./nginx/values.yaml bitnami/nginx
NAME: nginx
LAST DEPLOYED: Sun Feb  7 02:59:48 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
...
```

以上操作可以使用如下命令代替：

```bash
helm install nginx --set replicaCount=2 bitnami/nginx
```

使用--set设置配置说明：

- 如果同时指定了values.yaml文件和使用--set设置配置，那么--set设置的配置优先级更高

- 多组配置：--set a=1,b=2
- 层级：--set user.name=jaychou

- 数组：--set users={jay,jack,john} --set users[0].name=jaychou

**由于文件更易管理和迁移，更推荐修改values.yaml的方式定制Chart**：

查看release的资源创建情况

```bash
$ kubectl get pod
NAME                            READY   STATUS    RESTARTS   AGE
nginx-78956d9896-5qvdl          1/1     Running   0          32s
nginx-78956d9896-fhw5w          1/1     Running   0          32s
```

确实，如我们所愿，创建了2个副本实例。

**更新Release**：

已经安装了的release，修改定制文件后升级发布

```bash
$ helm upgrade nginx -f ./values.yaml bitnami/nginx
Release "nginx" has been upgraded. Happy Helming!
NAME: nginx
LAST DEPLOYED: Sun Feb 7 03:05:26 2021
NAMESPACE: default
STATUS: deployed
REVISION: 2
TEST SUITE: None
...
```

## 常用命令

帮助命令

```bash
helm help
helm get -h
```

更新charts仓库

```bash
helm repo update 
```

更多helm install的方式

- 从chart仓库安装，我们上面使用的方式

- 本地编写chart模板和values.yaml等文件，然后使用以下命令安装

  ```bash
  helm install nginx /path/to/nginx-chart
  ```

- 得到chart压缩文件，使用以下命令安装

  ```bash
  helm install nginx nginx-chart.tgz
  ```

- chart压缩文件的http url，使用以下命令安装

  ```bash
  helm install nginx https://xxx.com/charts/ngin-chart.tgz
  ```

如果你有兴趣，你可以创建自己的charts，执行以下命令会在目录下生成charts文件

```bash
$ helm create my-nginx
Creating my-nginx

# 定制后
$ helm package my-nginx
Successfully packaged chart and saved it to: /path/to/my-nginx-0.1.0.tgz
$ helm install my-nginx ./my-nginx-0.1.0.tgz
NAME: nginx2
LAST DEPLOYED: Sun Feb 28 14:20:53 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
...
```

更多了解请前往[官方文档](https://helm.sh/docs/)

![alt text](https://images.poneding.com/2025/03/202503111831061.png)

---
[« Gateway API 实践](gateway-api-practice.md)

[» Kubernetes 0-1 实现Pod自动扩缩HPA](hpa-usage.md)
