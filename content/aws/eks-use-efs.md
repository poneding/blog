[🏠 首页](../_index.md) / [AWS](_index.md) / EKS-使用EFS

# EKS-使用EFS

创建EFS

```bash
aws efs create-file-system \
    --performance-mode generalPurpose \
    --throughput-mode bursting \
    --encrypted \
 --tags Key=Name,Value=<fs-name> Key=creator,Value=dp Key=env:dev,Value=1 

# 上面的命令会得到fs-id
aws efs create-mount-target \
    --file-system-id <fs-id> \
    --subnet-id subnet-08d7609e614373fb8 \
    --security-groups sg-0af0f0e8705380529 
 
aws efs create-mount-target \
    --file-system-id <fs-id> \
    --subnet-id subnet-09c0707ea8ad281bb \
    --security-groups sg-0af0f0e8705380529

aws efs create-mount-target \
    --file-system-id <fs-id> \
    --subnet-id subnet-063a8f10feb97868d \
    --security-groups sg-0af0f0e8705380529
```

---
[« EKS实践 集成Gitlab自动发布（二）](eks-intergrate-gitlab-auto-release-02.md)

[» Gitlab & EKS](gitlab-eks.md)
