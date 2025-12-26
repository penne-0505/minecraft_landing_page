# Contributing Guide

このプロジェクトへの関心を持っていただき、ありがとうございます。
私たちは「ドキュメント駆動」と「厳格なタスク管理」という独自の開発文化を持っていますが、コントリビューターの皆様にそれを強いることはありません。
以下のようなシンプルなフローで、気軽に貢献していただけます。

## 1. 開発フローの概要

このプロジェクトでは `TODO.md` や `_docs/plan/` で厳密な管理を行っていますが、**コントリビューターがこれらを直接編集する必要はありません。**

### 手順
1.  **Issue**: バグ報告や機能提案は、まず GitHub Issue を作成してください。
2.  **Discussion**: メンテナーと方針を合意します。
    - ※この段階で、メンテナー側で `TODO.md` へのタスク登録とID採番を行います。
3.  **Code**: 合意に基づきコードを実装します。
4.  **PR**: プルリクエストを作成します。
    - ※マージ後、メンテナー側でドキュメントへの反映やタスク完了処理を行います。

## 2. 開発環境のセットアップ

### 前提
- Node.js 18 以上（メンテナー動作確認: v25.2.1）
- npm 10 以上（動作確認: 11.6.4）
- Docker などのコンテナ環境は不要です。

### 推奨: nvm での Node 準備
```bash
nvm install 25
nvm use 25
node -v   # v25.2.1 など、18 以上になっていること
npm -v    # 10 以上になっていること
```
※ 既に Node 18 以上が入っていればこの手順は省略可。

### 初回セットアップ
```bash
npm install
```

### 環境変数（ローカル/デプロイ）
ローカルで決済・認証フローを検証する場合は、Vite 用の `.env.local` と Cloudflare Pages Functions の環境変数を用意してください。
Secrets はリポジトリにコミットせず、Cloudflare の環境変数で管理します。

#### Pages Functions（必須）
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

#### Pages Functions（任意）
- `AUTH_TOKEN_TTL_SECONDS`

#### Pages（フロント）
- `VITE_APP_BASE_URL`
- `VITE_DISCORD_CLIENT_ID`
- `VITE_DISCORD_REDIRECT_URI`
- `VITE_SENTRY_DSN`（任意）
- `VITE_GA4_MEASUREMENT_ID`（任意）

### よく使うスクリプト
```bash
npm run dev      # 開発サーバー起動（デフォルト: http://localhost:5173）
npm run build    # 本番ビルド出力（dist/）
npm run preview  # 本番ビルドのローカルプレビュー
```
- Tailwind CSS は CDN ロードのため追加設定不要です。
- 現時点で Linter は未設定です（`npm run lint` はダミー）。既存コードスタイルに合わせてください。

## 3. コーディングガイドライン

### コードスタイル

  - リポジトリに設定された Linter / Formatter に従ってください。
  - PR提出前に `flutter analyze` がパスすることを確認してください。

### AI生成コードの利用ポリシー (責任の所在)

あらゆるAIツールを使用したコードのPRを**歓迎**します。
ただし、以下の条件を遵守してください：

1.  **完全な責任**: AIが生成したコードにバグやセキュリティホールがあった場合、損害の発生に関わらず、PR提出者が全ての責任を負います。
2.  **説明責任**: レビュー時にコードの意図を問われた際、ご自身の言葉で説明できる必要があります。
3.  **最終判断権**: 最終的にコードをマージするかどうかの判断は、プロジェクトのメンテナーに委ねられます。AI生成コードであってもなくても、品質基準を満たさない場合は拒否される可能性があります。

## 4. プルリクエスト (PR) の出し方

### ブランチ名

メンテナーからタスクID（例: `Core-Feat-25`）が割り当てられている場合は、それを含めてください。
まだ割り当てられていない場合は、内容がわかる記述的な名前で構いません。

  - **IDあり**: `feat/Core-Feat-25-login-screen`
  - **IDなし**: `feat/add-login-screen`

### コミットメッセージ

可能な限り [Conventional Commits](https://www.conventionalcommits.org/) に従ってください。
`feat:`, `fix:`, `docs:`, `refactor:` などのプレフィックスを推奨します。

### PRの概要

  - 何を変更したのか？
  - なぜ変更したのか？
  - (UI変更の場合) スクリーンショットや動画

-----

**Thank you for your contribution!**
複雑なドキュメント管理やタスク更新は、マージ後に私たちが行います。お気軽にPRを送ってください。
