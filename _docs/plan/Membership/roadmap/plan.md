---
title: Membership Pages Roadmap
status: proposed
draft_status: n/a
created_at: 2025-12-07
updated_at: 2025-12-09
references: []
---

## Overview
- 目的: Stripe を単一の信頼ソースとして、メンバーシップ契約/退会と Discord コミュニティ誘導をシームレスに提供する。
- 配信: Cloudflare Pages（静的） + Pages Functions（Webhook/認可付き API）でサーバーレス構成。
- 認証: Discord OAuth 必須（scope: `identify`, `guilds.join` など）。公開 LP 以外は必ず認証前提。

## Scope
- 契約ページ: Stripe Checkout/Customer Portal を利用し、300円プラン（1ヶ月のみ / 毎月更新 / 年次更新）を提供。
- 退会処理: Customer Portal でキャンセル受付。次回課金日まで利用可とし、Webhook 経由でロール剥奪をスケジュール。
- Discord 誘導 LP: 一般公開の CTA を Discord 参加に一本化し、ヘッダー等でメンバーシップページ導線を配置。
- ロール自動化: Pages Functions から Discord Bot API を叩き、ロール付与/剥奪を非同期実行。

## Non-Goals
- 独自課金ロジックの実装（Stripe 機能に委譲）。
- DB 常駐データの保持（Stripe を SSOT とし、Bot 側の最小限キャッシュのみ許容）。
- 多言語対応（日本語のみ）。
- AB テスト（実施しない）。

## Architecture (Draft)
- Front: Vite/React, Tailwind CDN。Cloudflare Pages でホスト。
- Functions: Stripe Webhook (`checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted` など) を受信し、Discord API を Bot トークンで直接呼び出す。署名検証と簡易リトライを実装。
- Discord Bot: 同一 Discord Application 内で Bot を有効化。Cloudflare Functions から Bot トークンで直接 Discord API を呼び、ロール付与/剥奪を実行（別HTTPサービス不要）。レートリミットは Functions 側で簡易バックオフ、必要に応じてステートレス再試行。
- Monitoring: GA4/Sentry は後日導入。Hook ポイントと env プレースホルダだけ先に用意する。

## Requirements & Constraints
- 環境変数例（Cloudflare Pages Functions）: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_REDIRECT_URI`, `DISCORD_BOT_TOKEN`, `DISCORD_GUILD_ID`, `DISCORD_ROLE_MEMBER_ID`, `STRIPE_PRICE_*`.
- セキュリティ: Webhook 署名検証必須。Bot API は認可トークンを要求し、IP allowlist も検討。
- UX: モバイル優先（ただし PC 同等品質）。CTA は Discord 参加、補助導線としてメンバーシップページ。
- 法的文書: `_docs/guide/legal/` 配下にプレースホルダを作成し、フロントからリンク。文面は別担当が後日更新。

## Milestones
- M1 契約ページ (Stripe Checkout)  
  - 署名検証付き Webhook でロール付与ジョブを生成。  
  - Discord OAuth ログイン必須、ユーザー表示に Discord 名/アイコンを利用。
- M2 退会フロー  
  - Customer Portal からキャンセル。更新日まで利用可。  
  - Webhook でロール剥奪をスケジュールし、Bot に指示。
  - 2025-12-09 実装メモ: Portal セッションをフロントから生成（/create-portal-session）。`customer.subscription.deleted` でロール剥奪、`cancel_at_period_end` 設定時はサブスク有効期間中はロールを維持。
- M3 Discord 誘導 LP  
  - 一般公開。CTA=Discord 招待、ヘッダーからメンバーシップページへの導線。  
  - デザインは別担当へ依頼（デザイントークンは既存 LP を参照）。
- M4 計測・監視（後日導入）  
  - GA4/Sentry の計測フックを追加するためのイベント/エラー境界を予め配置。  
  - 導入タイミング決定後に環境変数と送信先設定を行う。

### M4 Instrumentation Notes (WIP)
- Front (Pages): `VITE_GA4_MEASUREMENT_ID`, `VITE_SENTRY_DSN`, `VITE_APP_BASE_URL`, `VITE_DISCORD_CLIENT_ID`, `VITE_DISCORD_REDIRECT_URI`
- Functions (Pages Functions): `SENTRY_DSN` (server-side 導入予定), `DEBUG_TELEMETRY` (true で no-op ログ出力) を想定
- 実装方針: 現状は no-op フックのみ。GA4 Measurement Protocol / Sentry SDK を後日接続し、`trackEvent` / `captureError` 呼び出し箇所をそのまま活用する。
- イベント候補: `checkout_session_created`, `checkout_session_completed`, `subscription_changed`, Discord OAuth 成功/失敗。

## Risks & Mitigations
- Stripe/Discord 連携失敗: Webhook イベントの冪等処理と再試行キューを Bot 側で実装。失敗時はエラーログを Sentry（導入後）へ送信。
- レートリミット: Bot 側でキューとバックオフを実装し、Functions では極力ロジックを持たない。
- ロール不整合: 定期同期ジョブ（Bot 側）で Stripe のサブスクリプション状態と Discord ロールを照合。

## Test Plan
- 単体: Webhook ハンドラの署名検証、イベントマッピング、Bot API リクエスト生成。
- 結合: ステージング Stripe/Discord 環境で Checkout → ロール付与、Portal キャンセル → ロール剥奪のエンドツーエンド。
- 観測性: GA4/Sentry 導入後にイベント発火とエラー捕捉を確認（現段階では no-op フックを設置）。

## Rollback
- Front: Cloudflare Pages の前バージョンへロールバック。
- Functions: 直近デプロイをリビジョン固定で切り戻し。Stripe Webhook エンドポイントのバージョンは削除せずステータス無効化で対応。
