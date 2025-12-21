---
title: Thanks Page Integration Plan
status: proposed
draft_status: n/a
created_at: 2025-12-21
updated_at: 2025-12-21
references:
  - ./contract_checkout_integration.md
related_issues: []
related_prs: []
---

## Overview
決済完了後に遷移する `/thanks` を Stripe Checkout の実データに接続し、直接アクセスをブロックしたうえで購入内容を表示する。成功時のリダイレクト先と API を整備し、UI の表示状態・エラーハンドリングを明確化する。

## Scope
- Stripe Checkout の success_url を `/thanks?session_id=...` に切り替える。
- `/thanks` で `session_id` を必須にし、API 経由で決済データを取得して表示する。
- サーバー側で session の完了状態を検証し、未完了/不正時はエラー表示または誘導する。
- 表示内容を Stripe データ（プラン名、金額、決済日時、支払い方法、トランザクションID）へ置換する。

## Non-Goals
- `/membership` 側のバナー/コピー改修。
- Stripe Webhook の役割変更（ロール付与/解除ロジックは維持）。
- 新規データストレージや永続DBの導入。

## Requirements
- **Functional**
  - `/thanks` は `session_id` が無い場合は閲覧不可（エラー/誘導）。
  - 取得した Checkout Session が `complete` かつ以下のいずれかを満たす場合のみ表示する:
    - `payment_status = paid`
    - `mode = subscription` かつ `subscription.status in [trialing, active, past_due]`
  - セッションの `metadata.price_type` を使い、既存のプラン表示と一致させる。
  - 取得に失敗した場合は再試行や `/membership` への導線を出す。
- **Non-Functional**
  - 返すデータは最小限に限定し、個人情報の露出を避ける。
  - 既存の UI トーンと統一し、ローディング/エラー状態を明示する。

## Tasks
- Stripe Checkout 成功URLを `/thanks?session_id={CHECKOUT_SESSION_ID}` へ更新。
- Checkout Session を取得する API エンドポイントを追加（Cloudflare Pages Functions）。
- `/thanks` ページのデータ取得ロジックと状態表示（loading / error / success）を実装。
- `metadata.price_type` と既存プラン定義のマッピングを追加。
- ドキュメントと TODO を更新する。

## Test Plan
- Checkout 完了後に `/thanks` が表示され、金額・プラン・決済情報が一致する。
- `session_id` なし/無効/未完了の場合にエラー表示と導線が出る。
- 既存フロー（`/membership` → `/contract` → Checkout）に回帰がない。

## Deployment / Rollout
- 先に Functions とフロントの API 呼び出しをデプロイし、success_url を切り替える。
- 監視は既存の telemetry を利用し、異常時は success_url を旧URLへ戻す。
