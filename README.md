# Clover Support Landing (Preview)

> 日本語のみ記載しています。最小限のプレビュー環境用メモです。

## 概要

Minecraftサーバーのサポーター向けランディングページ（React製）のプレビュー環境をViteで構築しました。  
`src/App.jsx` がメイン実装ファイルです（旧 `temp.js` から移設済み）。

## 動かし方（ローカルプレビュー）

前提: Node.js 18以上（開発マシンでは v25.2.1 で確認）。

```bash
npm install
npm run dev   # http://localhost:5173 でプレビュー
npm run build # プロダクションビルド
```

TailwindはCDNロードで動作するため、追加のセットアップは不要です。

## 環境変数（デプロイ/Functions）

Cloudflare Pages + Pages Functions を利用する前提の構成です。決済/認証系の Functions を動かすには以下の環境変数が必要です。

### Pages Functions（必須）
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `DISCORD_REDIRECT_URI`
- `DISCORD_BOT_TOKEN`
- `DISCORD_GUILD_ID`
- `DISCORD_ROLE_MEMBER_ID`
- `STRIPE_PRICE_ONE_MONTH`
- `STRIPE_PRICE_SUB_MONTHLY`
- `STRIPE_PRICE_SUB_YEARLY`
- `AUTH_TOKEN_SECRET`

### Pages Functions（任意）
- `AUTH_TOKEN_TTL_SECONDS`（セッションクッキーの TTL 秒数）

### Pages（フロント）
- `VITE_APP_BASE_URL`
- `VITE_DISCORD_CLIENT_ID`
- `VITE_DISCORD_REDIRECT_URI`
- `VITE_SENTRY_DSN`（任意）
- `VITE_GA4_MEASUREMENT_ID`（任意）

## 技術スタック
- Vite + React 18
- framer-motion / lucide-react
- Tailwind CDN（ビルドレスのユーティリティ適用）

## ライセンス

このリポジトリは [MITライセンス](LICENSE.txt) の下でライセンスされています。
