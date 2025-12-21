---
title: Discord Invite vs guilds.join Intent
status: active
draft_status: n/a
created_at: 2025-12-21
updated_at: 2025-12-21
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
- OAuth ログインは会員向けページに限定する。
- CTA 付近に同意文言を簡潔に表示する。

## Rationale
- 運用と UI の一貫性を保ち、参加導線を明確にするため。

## Outcome
- LP での参加導線が単純化され、OAuth の誤表示を回避できる。

## Approval
- 承認: penne
