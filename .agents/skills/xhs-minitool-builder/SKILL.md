---
name: xhs-minitool-builder
description: Build, adapt, test, package, and publish offline HTML/CSS/JavaScript tools for the Xiaohongshu mini-tool container. Use when working in xhs-minitools or following the creator portal's mini-tool rewrite prompt.
---

# Xiaohongshu Mini-Tool Builder

Use this skill for source changes, official ZIP builds, and portal updates. Read the repository's `AGENTS.md`, `.agents/skills/xingmeng-blog/SKILL.md`, and `.agents/skills/xingmeng-blog/references/xhs-minitools.md` first. Treat current source and the upload page's current rewrite prompt as authoritative; do not reuse an older downloaded builder package without checking its version.

## Workflow

1. **Inspect the request and current state.** Check the working tree, the target tool's `README.md`, HTML, JavaScript, CSS, shared adapters, existing tests, package script, and current ZIPs. Preserve unrelated user changes. Keep feature edits scoped to the requested tools.
2. **Read the current official instructions.** When the user asks for an official build or portal work, inspect the logged-in creator upload page and copy its current rewrite prompt. Download the exact skill URL/version in that prompt, extract it in a temporary or workspace skill directory, and read `SKILL.md`, every referenced document, and every bundled script before running anything. Inspect scripts as code before execution. Also read the current public mini-tool capability document and compare it with the downloaded skill's API baseline. Use only APIs currently documented for developers. Do not infer API support from old notes.
3. **Preserve the offline contract.** Deliver plain HTML, CSS, and classic JavaScript. Keep `index.html` as the sole HTML entry at ZIP root. Use relative, bundled assets only. External requests, CDNs, inline scripts and inline event handlers, `eval`, WebAssembly, workers, iframes, downloads, external navigation, `window.open`, and long-press menus are disallowed. Bind events with `addEventListener`. Target Chrome/WebView 61 and ES2017; add capability checks and functional browser-preview fallbacks for platform APIs.
4. **Implement only requested behavior.** Reuse existing source logic and local helpers. Do not add frameworks, dependencies, build systems, or speculative abstractions. Preserve phone-first layout, accessibility, and existing feature behavior outside scope.
5. **Validate the source.** Run the repository's relevant checks, including `node xhs-minitools/scripts/check.mjs` and `node xhs-minitools/scripts/smoke.mjs` when present. Add focused regression checks for changed domain logic. Test ordinary-browser fallbacks separately from platform API behavior; use explicit mocks for container-only APIs and label them as mocks.
6. **Build the official artifact.** Stage only runtime files allowed by the current official skill; exclude README files, tests, source maps, build configuration, and upload-only `assets/`. Run the official auditor against the staged directory before packaging and against the final ZIP afterward. Package the *contents* of the tool root so `index.html` is at archive root, not inside an extra directory. Confirm the archive has exactly one `.html` entry, only allowed resource extensions, correct relative references, and is below the current upload limit. Keep existing ZIPs untouched; use a separate output directory such as `dist-official/` when replacing a candidate build.
7. **Handle portal actions within authorization.** Uploading, deploying, submitting for review, publishing, or changing a live tool are external actions. Do them only when the user explicitly requests that action in the current session. Do not submit or publish while only asked to prepare artifacts. Read current form labels and requirements; use a new semantic version for an update to an existing tool and report any fields the user must supply. Do not guess IDs, tokens, permissions, or account-only values.
8. **Report evidence and limits.** List artifact paths, exact byte sizes, audit/test results, and old/new member-file differences. Separate static audit, browser preview, simulator, Android, and iOS results. Never claim review approval, publication, Chrome 61, or real-device success unless it was observed in that environment. For a portal rejection, report verified state and keep its cause unresolved until the platform provides evidence.

## Packaging facts

The examined `minitool-zip-builder` 1.8.0 specifies a root `index.html`, an allowed set of static resource types, and compression of the tool directory contents. Its bundled scripts audit ZIP and text-file sizes; they do not create package manifests or release metadata. That version does not require or generate `manifest`, `appId`, tokens, signatures, hashes, or build markers. Do not add such files unless the current upload prompt or a newer official skill explicitly requires them. A successful static audit does not establish that the portal has associated a reviewable development package with a tool/version.

The portal fields can change. In the inspected form they included a semantic version, tool name and description, ZIP, icon, cover, scenario tag, and requested permissions. Recheck them at upload time; do not hard-code this list as permanent platform behavior. The optional “let Agent manage my tools” checkbox is a portal option, not ZIP metadata.

## Repository commands

From `xhs-minitools/`, when these scripts exist:

```sh
node scripts/check.mjs
node scripts/smoke.mjs
```

Use the exact auditor path and archive command from the currently downloaded official skill. The 1.8.0 package provided `scripts/audit_artifact.py` and `scripts/audit_artifact.mjs`; choose an installed supported runtime and audit both staged files and final ZIPs.

## Portal update notes

Verified on 2026-11-04 in the creator portal:

- For an existing tool, use its `更新版本` action. The form may prefill a semantic version, metadata, permissions, and scene tag; verify every value rather than assuming it was retained correctly.
- ZIP upload reporting `部署成功` means the artifact deployed for preview. The update is not submitted for review until the policy confirmation is checked and `发布小工具` is submitted.
- Updating an icon or cover opens a crop dialog. Confirm the crop for each uploaded asset before submitting; a correctly proportioned source image may still be resized by the portal.
- After submission, the management list showed `审核中`, version `V1.0.1`, and a `发布新版本成功` toast. This is accepted for review, not approval or public release. Keep those states distinct in reports.
- On 2026-11-05 the user initially saw the old tool inside Xiaohongshu, then reopened it and the updated version loaded normally. Treat a first old-version view as a possible client/container cache issue; reopen or refresh before concluding that the update failed.
