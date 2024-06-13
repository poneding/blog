[🏠 首页](../_index.md) / [Docker](_index.md) / Docker 容器中安装 PFX 证书

# Docker 容器中安装 PFX 证书

如果正在开发 .NetCore 项目，并且你的项目需要使用到 PFX 证书。此时你需要将你的项目发布到 Docker 容器中，那么你就需要在你的 Docker 容器中安装 PFX 证书了。

## 代码中编写

使用 X509Store Api 编写你的程序

```csharp
using (var certificate = new X509Certificate2(pfxFileBytes, pfxPassword, X509KeyStorageFlags.Exportable | X509KeyStorageFlags.PersistKeySet))
using (var store = new X509Store(storeName, storeLocation, OpenFlags.ReadWrite))
{
    store.Add(certificate);
    store.Close();
}
```

## Dockerfile 中编写

使用 dotnet-certificate-tool 工具安装 pfx 证书。

首先获取到 Pfx 文件的 Thumbprint，这在 dotnet-certificate-tool 命令中作为参数被使用。

- 使用 Powershell Get-PfxCertificate 函数获取 Thumbprint

```powershell
Get-PfxCertificate -FilePath C:\Pfx\Hello-to-World.pfx
```

执行以上命令，会要求输入 pfx 证书密码，输入密码后，你应该可以得到 Thumbprint 了，输出格式大致如下：

```tex
Thumbprint                                Subject
----------                                -------
EED5DCA70697648CDFGD7FB1EFDDD683579B436E  CN=Hello-to-World, OU=IT, O=Hello
```

在 Dockerfile 内容大致如下

```dockerfile
FROM mcr.microsoft.com/dotnet/core/sdk:3.1
WORKDIR /app
COPY Hello-to-World.pfx ./
ENV PATH "$PATH:/root/.dotnet/tools"
RUN dotnet tool install dotnet-certificate-tool -g && certificate-tool add -f ./Hello-to-World.pfx -p Password123 -t EED5DCA70697648CDFGD7FB1EFDDD683579B436E
ENTRYPOINT ["dotnet", "PfxTest.dll"]
```

---
[« Docker Compose 实践](docker-compose-practice.md)

[» Docker 主机容器互拷贝文件](docker-copy-between-host-container.md)
