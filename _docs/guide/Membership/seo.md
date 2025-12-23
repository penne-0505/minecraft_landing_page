---
title: LP SEO Operations
status: active
draft_status: n/a
created_at: 2025-12-22
updated_at: 2025-12-22
references:
  - _docs/plan/Membership/seo/plan.md
  - .env.example
related_issues: []
related_prs: []
---

## Overview
Join Landing を中心に、SPA でも安定してメタ情報・OG/Twitter・構造化データを反映するための運用ガイド。

## Setup
- `.env` に SEO 変数を設定する。
- 本番 URL が確定したら `public/robots.txt` と `public/sitemap.xml` を更新する。
  - 現在の本番ドメイン: `https://minecraft-clover.pages.dev`
  - ロゴ: `public/logo.jpg`（元データ: `src/assets/logo/logo.jpg`）
  - OG 共有画像: 作成後に `public/` 配置 or 画像URLを `.env` に設定する。

### 環境変数
`.env.example` の以下をプロダクション値で上書きする。
- `VITE_SITE_NAME`
- `VITE_SITE_DESCRIPTION`
- `VITE_SITE_OG_IMAGE` (1200x630 推奨)
- `VITE_SITE_LOGO` (正方形推奨)
- `VITE_SITE_TWITTER`
- `VITE_SITE_LOCALE`
- `VITE_SITE_SOCIALS` (カンマ区切り)

## Metadata
- `src/components/Seo.jsx` が SPA の head 更新を担当。
- 各ページの `Seo` で title/description/canonical/OG/Twitter を設定。
- `/contract`, `/thanks`, `/cancellation`, `/supporters`, `/help` は `noindex` 運用。

## Structured Data
- Join Landing で `Organization` / `WebSite` / `WebPage` を JSON-LD として注入。
- ロゴや公式 SNS を設定する場合は `VITE_SITE_LOGO` / `VITE_SITE_SOCIALS` を更新。

## Robots / Sitemap
- `public/robots.txt` の `Sitemap` URL を本番ドメインに合わせる。
- `public/sitemap.xml` は主要ページのみを掲載（/join は `/` に正規化）。

## Validation
- Lighthouse の SEO で警告が残らないことを確認。
- OG/Twitter のプレビューと JSON-LD の検証を実施。
