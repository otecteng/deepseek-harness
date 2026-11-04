---
description: "Desktop profile layer that mounts the dsh-taskboard and dsh-context plugins after the Web application bundle."
kind: "package-bundle"
---

# @deepseek-ai/dsh-pilot

English | [中文](README.zh.md)

## Summary

`@deepseek-ai/dsh-pilot` is the Desktop profile layer after `@deepseek-ai/dsh-web-app`. It inserts the `dsh-taskboard` and `dsh-context` plugins, the same rows those packages contribute when added with `dsh plugin`. The shipped web, headless, SDK, and ACP profiles do not select it. Desktop preparation keeps this layer on the reserved desktop profile and drops standalone entries for those two packages so each plugin is inserted once.

## Table of Contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Further Exploration](#further-exploration)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

The reserved Desktop profile selects this bundle after `@deepseek-ai/dsh-base` and `@deepseek-ai/dsh-web-app`. Preparation appends `@deepseek-ai/dsh-pilot` when it is absent and removes `dsh-taskboard` and `dsh-context` from `dsh.profile.bundles`. Packages already installed under those names stay in `dependencies`. The task board and context behavior belong to those packages.

A custom profile can select the same layer. In-box copies resolve from the dsh installation:

```sh
dsh plugin --profile <name> add @deepseek-ai/dsh-pilot
dsh plugin --profile <name> remove @deepseek-ai/dsh-pilot
```

### What you get

The patch inserts two host rows, `dsh-taskboard` then `dsh-context`. Each package's `dsh.client` declaration loads its browser half. This bundle adds no settings of its own.

-----

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

[`cordis.patch.yml`](cordis.patch.yml) is one insert list. [`src/index.ts`](src/index.ts) exports `PILOT_BUNDLE` and `PILOT_SUPERSEDED_BUNDLES` for Desktop profile preparation. The dependency ranges are `dsh-taskboard@^0.9.6` and `dsh-context@^0.77.0`, resolved with the dsh installation rather than at profile launch.

</details>

-----

<a id="further-exploration"></a>
## Further Exploration

- [Bundle package map](../README.md) — where this layer sits among profile bundles.
- [Web app bundle](../web-app/README.md) — the layer this patch follows.
- [Desktop application](../../../apps/desktop/README.md) — the reserved desktop profile.

-----

<a id="model-experience"></a>
## Model Experience

Indirectly, through the dsh-taskboard and dsh-context packages, which own the tools and context these rows add.

#### KV Cache effect

This bundle adds no request prefix. Each inserted package owns any cache effect of its tools and prompts.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- **Standalone bundle entries insert the same rows twice** — leave `dsh-taskboard` and `dsh-context` in `dsh.profile.bundles` together with this layer and each plugin is mounted again. Desktop preparation removes those two names.
- **A profile-local copy wins over the installation copy** — `dependencies` entries left by `dsh plugin add` stay installed and are resolved before the versions this bundle depends on.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

None.

</details>
