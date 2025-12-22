---
title: Checkout Session API
status: active
draft_status: n/a
created_at: 2025-12-22
updated_at: 2025-12-22
references: []
related_issues: []
related_prs: []
---

## Overview
Stripe Checkout セッションを作成するためのサーバーAPI仕様をまとめます。

## Endpoint
- Path: `/create-checkout-session`
- Method: `POST`
- Content-Type: `application/json`

## Request
### Body
- `priceType` (string, required)
  - `one_month` | `sub_monthly` | `sub_yearly`
- `discord_user_id` (string, required)
- `avatar_url` (string | null, optional)
- `consent_display` (boolean, optional)
- `consent_roles` (boolean, optional)
- `consent_terms` (boolean, optional)

## Response
### 200
```
{ "url": "https://checkout.stripe.com/..." }
```

### 400
- JSON不正
- `priceType` または `discord_user_id` の欠落
- `priceType` 不正

### 405
- `POST` 以外のメソッド

### 503
- Stripe関連の環境変数不足

### 500
- Stripe API エラーなどサーバー側の予期しない失敗

## Notes
- `one_month` は `payment`、それ以外は `subscription` で作成されます。
- `success_url` は `/thanks?session_id=...`、`cancel_url` は `/membership?checkout=cancel` を使用します。
