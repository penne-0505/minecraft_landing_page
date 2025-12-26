---
title: Session Cookie Auth
status: active
draft_status: n/a
created_at: 2025-12-26
updated_at: 2025-12-26
references:
  - ../payment/checkout-session.md
related_issues: []
related_prs: []
---

## Overview
Discord OAuth 成功時に発行する HttpOnly クッキーで、決済関連 API を保護するための認証方式です。

## Cookie
- Name: `clover_session`
- Attributes: `HttpOnly`, `SameSite=Lax`, `Path=/`, `Max-Age` (秒)
- HTTPS 環境では `Secure` を付与します。

## Token Payload
- `sub`: Discord User ID
- `iat`: 発行時刻 (Unix 秒)
- `exp`: 有効期限 (Unix 秒)

## Environment Variables
- `AUTH_TOKEN_SECRET` (required)
  - HMAC 署名用の秘密鍵
- `AUTH_TOKEN_TTL_SECONDS` (optional)
  - セッショントークンの TTL (秒)
  - 未設定時は 7 日

## Protected Endpoints
- `POST /create-checkout-session`
- `POST /create-portal-session`
- `GET /api/checkout-session`
- `GET /api/subscription-status`
