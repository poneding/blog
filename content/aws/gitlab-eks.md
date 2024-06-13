[🏠 首页](../_index.md) / [AWS](_index.md) / Gitlab & EKS

# Gitlab & EKS

## 创建IAM User&Group

User：gitlab-ci，保存生成的Access key ID和Secret Access Key，后面会用到

Group：Gitlab.CI，添加Policy如下：

| Policy Name                                                  |
| :----------------------------------------------------------- |
| ![img](https://console.aws.amazon.com/iam/assets/images/policy_icon.png) [AmazonEKSWorkerNodePolicy](https://console.aws.amazon.com/iam/home?region=us-east-1#policies/arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy) |
| ![img](https://console.aws.amazon.com/iam/assets/images/policy_icon.png) [AmazonEC2ContainerRegistryFullAccess](https://console.aws.amazon.com/iam/home?region=us-east-1#policies/arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess) |
| ![img](https://console.aws.amazon.com/iam/assets/images/policy_icon.png) [AmazonEC2ContainerRegistryReadOnly](https://console.aws.amazon.com/iam/home?region=us-east-1#policies/arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly) |
| ![img](https://console.aws.amazon.com/iam/assets/images/policy_icon.png) [AmazonEC2ContainerServiceFullAccess](https://console.aws.amazon.com/iam/home?region=us-east-1#policies/arn:aws:iam::aws:policy/AmazonEC2ContainerServiceFullAccess) |
| ![img](https://console.aws.amazon.com/iam/assets/images/policy_icon.png) [AmazonEKS_CNI_Policy](https://console.aws.amazon.com/iam/home?region=us-east-1#policies/arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy) |

将user gitlab-ci添加到Group Gitlab.CI

## 将IAM User添加到ConfigMap

```bash
kubectl edit cm aws-auth -n kube-system
```

在mapUsers键追加：

```yaml
    - "groups":
      - "system:masters"
      "userarn": "arn:aws:iam::xxxxxxx:user/gitlab-ci"
      "username": "gitlab-ci" 
```

## Gitlab仓库设置

Setting => CI/CD => Variables，添加变量：

- AWS_ACCESS_KEY_ID：<gitlab-ci用户的Access key ID>
- AWS_SECRET_ACCESS_KEY：<gitlab-ci用户的Secret Access Key>

## Gitlab仓库.gitlab-ci.yml

```yaml

```

---
[« EKS-使用EFS](eks-use-efs.md)

[» K8s 部署 Kong 服务](k8s-deploy-kong.md)
