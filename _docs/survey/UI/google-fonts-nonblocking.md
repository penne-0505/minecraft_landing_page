---
title: Google Fonts Non-Blocking Load Survey for LP
status: active
draft_status: n/a
created_at: 2025-12-23
updated_at: 2025-12-23
references: ["perf_insight.md"]
related_issues: []
related_prs: []
---

## Background
LighthouseでLPのフォントCSSがレンダリングブロック要因として報告されていた。現状は`index.html`でGoogle FontsのCSSを同期的に読み込んでいる。

## Purpose
LPの初期描画を阻害しないフォント読み込み方式に切り替え、FCP/LCPの改善余地を確保する。

## Method
- `index.html`のGoogle Fontsを`rel="preload" as="style"`に変更し、`onload`で`rel="stylesheet"`へ切り替える方式を検討する。
- JavaScript無効時のフォールバックとして`<noscript>`内に従来の`rel="stylesheet"`を維持する。

## Results
- 変更によりフォントCSSの読み込みが非ブロッキングになり、初期描画パスから外れる。
- `display=swap`指定は維持されるため、テキスト不可視（FOIT）よりもフォント置換（FOUT）を優先する挙動は変わらない。

## Considerations
- フォントの切り替えタイミングにより、軽微なFOUTが発生する可能性がある。
- LP固有フォント（Caveat / Zen Kurenaido）は`JoinLanding.jsx`で動的に読み込まれているため、本変更の対象はベースフォントのみとなる。

## Recommended Actions
- `index.html`のGoogle Fonts読み込みを非ブロッキング化する。
- 変更後にLighthouseで「レンダリングをブロックしているリソース」の改善を確認する。
