---
title: Analytics & Error Reporting Hooks Intent
status: active
draft_status: n/a
created_at: 2025-12-21
updated_at: 2025-12-21
references:
  - ../../plan/Membership/roadmap/plan.md
  - ../../archives/draft/analytics_usage.md
related_issues: []
related_prs: []
---

## Overview
Analytics / Error Reporting のフック運用方針を記録し、実配信接続時の基準にする。

## Decision
- フロント/Functions のフックは共通の呼び出し点として維持する。
- 実配信は環境設定とセキュリティ確認を満たした段階で行う。

## Rationale
- 実装と運用の切り分けを維持し、段階的に導入するため。

## Outcome
- 追跡イベントの実装箇所と責務が整理される。

## Approval
- 承認: penne
