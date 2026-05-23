---
title: Discord Invite vs guilds.join Intent
status: active
draft_status: n/a
created_at: 2025-12-21
updated_at: 2026-05-23
references:
  - ../../plan/Membership/roadmap/plan.md
  - ../../archives/draft/Membership/guilds_join_invite.md
related_issues: []
related_prs: []
---

## Overview
LP からの参加導線を Discord 招待リンクに統一し、OAuth の guilds.join を利用しない方針を記録する。

## Decision
- LP の CTA は招待 URL を直接開く。
- `VITE_DISCORD_INVITE_URL` が未設定の場合も CTA は無効化せず、toast で公開デモ用に実招待を外していることを説明し、`/demo-flow?tab=lp` へ誘導する。
- `/demo-flow` は一般流入向け LP と Membership の2導線をタブで切り替え、本番想定の本来フローを説明するハブにする。
- `/demo-flow` の各導線はフローごとにセクションを区切り、公開デモで再現できる箇所は実画面スクリーンショットを添え、外部サービスや実サーバーに依存する箇所はスクリーンショットなしで説明する。
- Membership の解約・終了導線は、契約完了までの本流と完全に同一の連続ステップに見えないよう、背景トーンを変えて支援開始後の管理導線として示す。
- OAuth ログインは会員向けページに限定する。
- CTA 付近に同意文言を簡潔に表示する。

## Rationale
- 運用と UI の一貫性を保ち、参加導線を明確にするため。
- ポートフォリオ公開版では実際の招待 URL を外す一方、未設定を理由に CTA が disabled になると、デモとして確認したい導線そのものに到達できなくなるため。
- Discord にいきなり遷移させると公開デモの境界が伝わりにくいため、toast と `/demo-flow` を一段挟んで「本来の導線」と「公開用モック導線」を区別する。
- LP は対外流入向け、Membership は既存コミュニティメンバー向けの支援・契約導線であり、公開デモでもこの責務差を明示する必要がある。

## Outcome
- LP での参加導線が単純化され、OAuth の誤表示を回避できる。
- 公開デモで実Discord招待がない理由と、本番想定ではどの外部処理へ進むのかがセクション単位で明確になる。
- 解約導線が申し込み導線と同列に見えにくくなり、契約後のライフサイクル管理として説明しやすくなる。

## Approval
- 承認: penne
