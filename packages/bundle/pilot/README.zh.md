---
description: "在 Web 应用组合包之后挂载 dsh-taskboard 与 dsh-context 插件的 Desktop profile 层。"
kind: "package-bundle"
---

# @deepseek-ai/dsh-pilot

[English](README.md) | 中文

## 概述

`@deepseek-ai/dsh-pilot` 是接在 `@deepseek-ai/dsh-web-app` 之后的 Desktop profile 层。它插入 `dsh-taskboard` 与 `dsh-context` 插件，即这两个包通过 `dsh plugin` 安装时贡献的同一批配置行。随发行版交付的 web、headless、SDK 与 ACP profile 不选择它。Desktop 准备会把这一层保留在保留的 desktop profile 上，并去掉这两个包的独立条目，使每个插件只插入一次。

## 目录

- [使用本包](#use-this-package)
- [理解实现](#understand-the-implementation)
- [进一步探索](#further-exploration)
- [模型体验](#model-experience)
- [已知限制与延期工作](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

-----

<a id="use-this-package"></a>
## 使用本包

保留的 Desktop profile 在 `@deepseek-ai/dsh-base` 和 `@deepseek-ai/dsh-web-app` 之后选择此组合包。准备过程在缺少 `@deepseek-ai/dsh-pilot` 时追加它，并从 `dsh.profile.bundles` 中移除 `dsh-taskboard` 与 `dsh-context`。已安装在这两个名字下的包仍留在 `dependencies` 中。任务板与上下文行为属于这两个包。

自定义 profile 可以选择同一层。内置副本从 dsh 安装目录解析：

```sh
dsh plugin --profile <name> add @deepseek-ai/dsh-pilot
dsh plugin --profile <name> remove @deepseek-ai/dsh-pilot
```

### 你会得到什么

补丁按 `dsh-taskboard`、`dsh-context` 的顺序插入两条宿主配置行。每个包的 `dsh.client` 声明加载其浏览器半侧。此组合包不添加自己的设置。

-----

<a id="understand-the-implementation"></a>
## 理解实现

<details>
<summary>实现内部细节——点击展开</summary>

[`cordis.patch.yml`](cordis.patch.yml) 是一份插入列表。[`src/index.ts`](src/index.ts) 导出 `PILOT_BUNDLE` 与 `PILOT_SUPERSEDED_BUNDLES`，供 Desktop profile 准备使用。依赖范围是 `dsh-taskboard@^0.9.6` 与 `dsh-context@^0.77.0`，随 dsh 安装解析，而不是在 profile 启动时解析。

</details>

-----

<a id="further-exploration"></a>
## 进一步探索

- [组合包地图](../README.zh.md) — 这一层在 profile 组合包中的位置。
- [Web 应用组合包](../web-app/README.zh.md) — 此补丁跟随的那一层。
- [Desktop 应用](../../../apps/desktop/README.zh.md) — 保留的 desktop profile。

-----

<a id="model-experience"></a>
## 模型体验

通过 dsh-taskboard 与 dsh-context 包间接产生影响，这两个包拥有这些配置行添加的工具与上下文。

#### KV Cache 影响

此组合包不添加请求前缀。每个被插入的包负责其工具与提示词的缓存影响。

## 已知限制与延期工作

<a id="known-limitations-and-deferred-work"></a>

- **独立组合包条目会把同一批配置行再插入一次** — 若 `dsh.profile.bundles` 在本层之外仍保留 `dsh-taskboard` 与 `dsh-context`，每个插件会被再次挂载。Desktop 准备会移除这两个名字。
- **profile 本地副本优先于安装副本** — `dsh plugin add` 留下的 `dependencies` 条目保持安装状态，并先于本组合包依赖的版本被解析。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者的工作上下文——点击展开</summary>

无。

</details>
