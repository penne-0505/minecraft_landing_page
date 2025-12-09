---
title: Analytics & Error Reporting Hooks (Usage)
status: proposed
draft_status: exploring
created_at: 2025-12-07
updated_at: 2025-12-09
references:
  - ../plan/Membership/roadmap/plan.md
related_issues: []
related_prs: []
---

## Overview
フロントエンドに no-op の計測/エラー報告フックを挿入済み（`src/analytics.js`）。環境変数が未設定のときは何もしないため、後日 GA4 / Sentry を有効化するだけで実動する。Functions には現時点で計測連携なし（Webhook 失敗は Stripe の再送に依存）。

## 環境変数
- `VITE_GA4_MEASUREMENT_ID`: GA4 の Measurement ID（例: `G-XXXXXXX`）。未設定なら `trackEvent` は no-op。
- `VITE_SENTRY_DSN`: Sentry DSN。未設定なら `captureError` は DEV のみ console に出力。
- `VITE_APP_BASE_URL`: Discord OAuth / Stripe 戻り先の基底 URL。環境に合わせて設定。
- `VITE_DISCORD_CLIENT_ID`, `VITE_DISCORD_REDIRECT_URI`: OAuth 用。計測有効化有無に関わらず必須。

## フロント実装箇所
- `src/analytics.js`: `trackEvent(name, params)` / `captureError(error, context)` を定義。環境変数が無い場合は no-op（または DEV コンソール出力）。
- `src/pages/Home.jsx`:  
  - `trackEvent`: `login_start`, `login_success`, `checkout_start`  
  - `captureError`: OAuth交換失敗、Checkout セッション生成失敗、fetch 例外

## 有効化手順 (GA4)
1. Cloudflare Pages の環境変数に `VITE_GA4_MEASUREMENT_ID` を設定（Production/Preview）。  
2. `src/analytics.js` のコメントアウト部分を gtag 呼び出しに置き換える。例:
   ```js
   export function trackEvent(name, params = {}) {
     if (!GA_ID) return;
     window.gtag?.("event", name, { ...params });
   }
   ```
3. `_docs/plan/Membership/roadmap/plan.md` M4 に計測ポリシー（イベント/パラメータ）を追記するか、後日 `guide/` へ昇格させる。
4. 追加イベント候補: `checkout_success` / `checkout_cancel`（URL の `checkout` パラメータで判定）、Discord 招待 CTA クリック。

## 有効化手順 (Sentry)
1. Cloudflare Pages の環境変数に `VITE_SENTRY_DSN` を設定。  
2. Sentry SDK を導入し、`captureError` 内で `Sentry.captureException(error, { extra: context })` を呼び出すよう差し替え。例:
   ```js
   import * as Sentry from "@sentry/browser";
   Sentry.init({ dsn: SENTRY_DSN, release: __APP_VERSION__, environment: import.meta.env.MODE });

   export function captureError(error, context = {}) {
     if (!SENTRY_DSN) return;
     Sentry.captureException(error, { extra: context });
   }
   ```
3. リリース/環境タグの付与ポリシーを決めて設定（例: `release`, `environment`）。  
4. Functions 側のロギング/Sentry 連携は未実装。Webhook 失敗の計測を入れる場合は `functions/stripe-webhook.js` で別途検討。

## 追加で入れたいイベント案
- `checkout_success` / `checkout_cancel`（`checkout` パラメータで判定可）  
- LP CTA クリック（Discord招待ボタン）  
- ロール反映確認の再同期アクションが入る場合、そのトリガーイベント

## 注意
- DSN や Measurement ID はフロントから見えるため、秘匿が必要な値は Functions 側で処理する。  
- 本番/プレビューで分ける場合は環境変数を切り替える。  
- Functions 側のログ/再送は Sentry とは独立運用。Stripe Webhook の冪等性と再送でリカバリする。
