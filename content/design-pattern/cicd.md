[我的博客](../_index.md) / [设计模式](_index.md) / CI/CD

# CI/CD

## Concepts

### Pipeline

### PipelineStage

**Fields**：

| Name                | Type   | Desc                                    |
| ------------------- | ------ | --------------------------------------- |
| ID                  | string |                                         |
| PipelineID          | string |                                         |
| PrevPipelineStageID | string |                                         |
| Status              | uint8  | Pending, Runing, Success, Failed, Abort |
| Name                | string |                                         |
|                     |        |                                         |
|                     |        |                                         |

### PipelineStageTask

**Fields**：

| Name                    | Type    | Desc                                             |
| ----------------------- | ------- | ------------------------------------------------ |
| ID                      | string  |                                                  |
| PipelineStageID         | string  |                                                  |
| PrevPipelineStageTaskID | string  |                                                  |
| Image                   | string  | Container image task running on.                 |
| DindRequired            | boolean | Docker in docker?                                |
| DindImage               | string  | dependency DindRequired default: docker:18-dind. |
| Scripts                 | string  |                                                  |
| CacheDirs               | string  |                                                  |
| EnvironmentVariables    | string  |                                                  |
| Status                  | string  |                                                  |
| EnvironmentVariables    | string  |                                                  |
| EnvironmentVariables    | string  |                                                  |
