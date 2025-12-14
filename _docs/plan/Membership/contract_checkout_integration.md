---
title: Contract Checkout Integration Plan
status: proposed
draft_status: n/a
created_at: 2025-12-14
updated_at: 2025-12-14
references:
  - ../../draft/contract_checkout_integration.md
  - ../../draft/contract_page_requirements.md
---

## Goal
temp.js の UI モックを基に、契約前同意ページを Stripe Checkout フローへ統合し、同意メタデータを backend に連携する。

## Scope
- Front: Contract ページのUI刷新（temp.jsモック踏襲）、同意必須/任意のロジック実装、プラン未指定時リダイレクト、ヘルプ導線追加。
- Common: プラン定数（priceType キー）を Contract/CTA 双方で共有。
- Routing: `/help` 仮ページ設置（空でも可）。
- Not in scope: 決済後のサクセス/キャンセル画面改修、計測イベント追加（後日）。

## Deliverables
- 更新済み Contract ページ（UI・同意ロジック・メタデータ送信）。
- 共通プラン定数の参照化（PricingComponent, Contract）。
- `/help` へのリンク導線と仮ページ。
- ドキュメント更新（draft・plan・TODO）。

## Milestones / Steps
1. プラン定数共有・priceType 統一（完了）  
2. UI モック反映: Contract ページに temp.js のレイアウト/コンポーネントを移植し、任意/必須のチェック状態・ボタン活性条件を実装。  
3. エラーハンドリング: 401 ダイアログ→/membership リダイレクト、plan 未指定リダイレクト。  
4. 導線追加: 戻る・キャンセルボタン、ヘルプリンク `/help`（仮ページも作成）。  
5. メタデータ送信: `consent_display/roles/terms` を Checkout metadata にセット。  
6. 表示確認・軽微なスタイル調整、回帰確認（CTA→Contract→Checkout）。  

## Risks
- temp.js のアニメーション/装飾を既存スタイルとどう統合するかで工数増の可能性。  
- 401 エラー処理の UX（ダイアログ後即リダイレクト）が暫定仕様。  

## Out of Scope
- 計測イベント拡張（GA4/Sentry）。  
- 決済成功/キャンセルのトースト・バナーのデザイン改修。  

## Review / Acceptance
- 必須同意が無いと「Stripe で決済する」ボタンが活性化しないこと。  
- 任意同意を OFF にしても決済へ進めること。  
- plan 未指定で Contract に来ない（即 /membership へ戻る）こと。  
- Checkout metadata に同意3項目が送信されること。  

## Follow-ups
- `/help` ページの中身整備（別タスク可）。  
- 計測イベントの追加（後日 M4 で対応）。  
