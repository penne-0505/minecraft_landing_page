---
title: Cancellation Page Integration Plan
status: proposed
draft_status: n/a
created_at: 2025-12-21
updated_at: 2025-12-21
references:
  - ./thanks_page_integration.md
related_issues: []
related_prs: []
---

## Overview
`/cancellation` を Stripe の実データに接続し、解約済みまたは解約予約済みのユーザーにのみキャンセル情報を表示する。未ログイン/未解約の場合は案内を表示する。

## Scope
- Subscription 状態取得 API を新設し、Discord ユーザー ID から Stripe の subscription を取得する。
- `/cancellation` でログイン状態と解約状態を判定し、表示内容を実データに置換する。
- 解約情報が無い/未解約の場合のフォールバック表示を追加する。

## Non-Goals
- Stripe Webhook の役割変更。
- ポータルの UI 改修。
- 永続DB導入。

## Requirements
- **Functional**
  - 未ログイン時は `/cancellation` の表示を制限し、ログイン/戻る導線を出す。
  - 解約済み (`status=canceled`) または解約予約 (`cancel_at_period_end=true`) の場合に詳細を表示する。
  - `current_period_end` 等から終了日と残日数を計算する。
  - 取得失敗時はエラー表示と復帰導線を出す。
- **Non-Functional**
  - Stripe から取得するデータは最小限に限定する。
  - 既存の UI トーンを維持する。

## Tasks
- Subscription 状態取得 API を実装（Discord ユーザー ID で検索）。
- `cancel_at_period_end` / `status` 判定と日付計算を実装。
- `/cancellation` ページのデータ取得・表示切替（loading / error / not-cancelled / cancelled）。
- ドキュメントと TODO を更新する。

## Test Plan
- 解約済みユーザーで `/cancellation` の表示が実データに一致する。
- 未解約ユーザーは案内表示となる。
- 未ログイン時にログイン/戻る導線が表示される。

## Deployment / Rollout
- 先に Functions とフロントを同時にデプロイし、API 404 を避ける。
- 問題があれば `/cancellation` を案内ページとして維持しながら修正する。
