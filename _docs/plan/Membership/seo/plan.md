---
title: LP SEO Master Plan
status: proposed
draft_status: n/a
created_at: 2025-12-22
updated_at: 2025-12-22
references:
  - _docs/standards/documentation_guidelines.md
  - _docs/standards/documentation_operations.md
  - _docs/guide/Membership/seo.md
  - perf_insight.md
  - README.md
related_issues: []
related_prs: []
---

## Overview
LP（Join Landing）に対して、技術SEO・オンページ・構造化データ・SNS共有・パフォーマンスを横断的に改善する。主な対象は `src/pages/JoinLanding.jsx` と、ビルド出力に関わる公開ファイル（robots.txt / sitemap.xml など）。

## Scope
- 技術SEO: robots.txt, sitemap.xml, canonical, hreflang, noindex 制御の整備
- On-Page: title/description, 見出し構造, 画像 alt, 内部リンク整備
- Structured Data: JSON-LD（WebSite/Organization/FAQ 等）
- Social/Sharing: Open Graph / Twitter Cards
- パフォーマンス: 画像/フォント/スクリプトの読み込み最適化（SEOに影響する指標の改善）

## Non-Goals
- コンテンツの大幅刷新（コピーの全面差し替え）
- サイト全体のリニューアルや多言語対応
- サーバーサイドレンダリング（SSR）への移行

## Requirements
- **Functional**:
  - 主要ページに固有の title/description/canonical が設定される
  - robots.txt と sitemap.xml が公開され、検索エンジンに適切に通知される
  - JSON-LD が最低 1 種（Organization or WebSite）存在する
  - OG/Twitter メタが設定され、共有時の表示が安定する
- **Non-Functional**:
  - LCP/CLS/INP の改善に寄与する読み込み順序が整備される
  - 既存のデザイン/導線の破壊がない

## Inputs Needed
- 本番ドメイン（canonical/robots/sitemap 用）: `minecraft-clover.pages.dev`
- OG 共有画像のURL（1200x630 推奨）: 未決定
- ロゴ画像のURL（構造化データ用）: `https://minecraft-clover.pages.dev/logo.jpg`
- 正式なサイト名: `Minecraft Server 🍀`
- 説明文: `Minecraft統合版（Bedrock Edition） に対応した、誰でも気軽に遊べる温かいコミュニティサーバーです。`
- 公式SNSのURL（任意）: なし

## Tasks
1. 現状分析
   - LPのメタ情報、見出し構造、画像 alt、リンク構成の棚卸し
   - 既存の robots.txt/sitemap.xml/canonical の有無を確認
2. 技術SEO
   - `public/robots.txt` と `public/sitemap.xml` の作成/更新
   - canonical/hreflang/noindex のポリシー決定と実装
3. On-Page
   - title/description の最適化（1ページ1テーマ）
   - 見出しの階層整理（H1は1つ）
   - 主要画像の alt 設計と不要画像の整理
4. Structured Data
   - WebSite/Organization/FAQ のJSON-LDを追加
   - 画像・URL・ロゴの整合性確認
5. Social/Sharing
   - OG/Twitter カード用メタの追加
   - 共有画像のサイズ/形式の確定
6. パフォーマンス連動
   - 画像サイズ・priority・lazy の再確認
   - フォント読み込み戦略（preconnect, display=swap など）

## Test Plan
- ローカルで `npm run dev` / `npm run build` / `npm run preview` の表示確認
- Lighthouse / PageSpeed のSEO項目で主要警告が解消されていること
- OG/Twitter プレビュー確認（カードの表示崩れがない）
- robots.txt と sitemap.xml の取得確認

## Deployment / Rollout
- 既存のデプロイ手順に従い反映
- 重大な表示崩れがあれば即ロールバック
