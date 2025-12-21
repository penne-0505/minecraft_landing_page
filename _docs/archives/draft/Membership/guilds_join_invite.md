---
title: Discord OAuth guilds.join での自動招待方針
status: superseded
draft_status: n/a
created_at: 2025-12-14
updated_at: 2025-12-21
references:
  - ../../plan/Membership/roadmap/plan.md
related_issues: []
related_prs: []
---

## 背景
- 一般公開LP（Join）からの参加動線は **招待URL一本化** に変更。OAuth (guilds.join) 経由の自動参加は行わない。
- OAuth ログインはメンバーシップ系ページ（`/membership` 配下など）でのみ利用し、LP では非表示とする。
- 既存の `beginDiscordLogin` は必要箇所のみで利用し、LP CTA では Discord 招待リンクを直接開く。

## 方針（決定）
- LPのCTAは Discord 招待URLを直接開く（単一URLに統一）。URLが未設定の場合は無効化/案内のフォールバックを用意する。
- OAuth/guilds.join は利用しない。Add Guild Member API 呼び出しも行わない。
- OAuth ログイン導線は `/membership` など会員向けページに限定し、LPでは表示しない。
- 同意文言は「Discordに参加するとコミュニティ規約に同意したものとみなします」等、招待リンク押下前に簡潔に表示（デザイン側に依頼）。

## 実装メモ
- 招待URLは環境変数 `VITE_DISCORD_INVITE_URL`（フロント）/ `DISCORD_INVITE_URL`（サーバー）で管理し、`.env.example` にプレースホルダーを置く。現状の本番値は運用側が保持。未設定時はボタンを無効化し、案内を表示する。
- `beginDiscordLogin` を LP からは呼ばない。`Header` など共通コンポーネントでのログイン導線は LP 表示時に非表示または招待リンクに切り替えるガードを検討。
- GA/Sentry 計測イベントは「有効化予定・時期未定」とし、招待CTAのクリック/成功確認はリンククリックベースで計測する（OAuth関連イベントは不要）。

## リスクと対応
- 招待リンクの期限/有効数が切れるリスク → 運用手順に定期確認を追加し、期限なし・最大無制限設定を推奨。
- LP に OAuth UI を残したままリリースするミス → デザインレビューと実装レビューで「LPではログインボタン非表示」をチェック項目に追加。

## 未決定・依存
- 招待URLの正式値と管理責任者（更新手順含む）。`VITE_DISCORD_INVITE_URL` などで管理するか要決定。
- 参加後に DM を送るかどうか（送る場合は Bot DM 権限が必要）。

## ToDo（実装タスクのたたき台）
1. [ ] 招待URLの正式値を環境変数に設定し、LP CTA で参照するように実装（未設定時フォールバック含む）。
2. [ ] LP 表示時にヘッダーのログイン導線を非表示または招待リンクに差し替えるガードを追加。
3. [ ] 計測イベントを招待CTAクリック中心に整理（有効化時期未定と明記）。
4. [ ] LP のCTA付近に同意文言をデザインへ依頼（OAuth表記は削除）。
5. [ ] 招待URLの管理手順を運用に共有し、期限切れ防止の確認フローを決定。
