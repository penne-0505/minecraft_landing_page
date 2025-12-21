---
title: Contract Checkout Integration Notes
status: superseded
draft_status: n/a
created_at: 2025-12-14
updated_at: 2025-12-21
references:
  - ../plan/Membership/contract_checkout_integration.md
  - contract_page_requirements.md
---

## 目的
temp.js で受領した UI モックを Contract ページに統合するにあたり、同意項目・メタデータ・エラー挙動を明文化する。

## 同意項目と必須条件
- 利用規約同意 (`consent_terms`): 必須。未チェック時は決済ボタン非活性。
- 支援者一覧への掲載 (`consent_display`): 任意（初期ON）。拒否時は「匿名で表示」文言を明示。
- Discord ロール自動付与 (`consent_roles`): 任意（初期ON）。拒否しても決済可。
- チェックボックスは説明文を含めタップ/クリック可能領域とする。

## メタデータ（Stripe Checkout）
- `priceType`: `one_month | sub_monthly | sub_yearly`
- `discord_user_id`: Discord OAuth で取得したユーザーID
- `consent_display`: boolean（文字列化して送信）
- `consent_roles`: boolean（文字列化して送信）
- `consent_terms`: boolean（文字列化して送信）

## 画面遷移とエラー暫定挙動
- `plan` クエリが無い場合: 即 `/membership` にリダイレクト。
- Discord 未認証: 自動で OAuth へ遷移。401 や失敗時はダイアログ表示後 `/membership` に戻す（暫定対応）。
- 決済ボタン活性条件: ログイン済み・`consent_terms` チェック済み・plan あり・ローディング中でない。

## 導線
- ページ内に「戻る・キャンセル」ボタン（/membership）。
- ヘルプリンク `/help` をページ内に配置（ヘッダー/フッター不可）。未実装の場合は空ページ可。

## プラン表示
- priceType をキーとする共通定数 `PLANS` を利用（label, price, unit, color 等）。
- プランカードに Discord アカウント情報（avatar, name, discriminator）を表示。

## 計測
- 追加のトラッキングは現状不要。後からイベントを増やせる構造とする。

## 残課題
- `/help` ページの実装（空でも可）。
- temp.js 由来のアニメーション/スタイルをどこまで再現するか要調整。
