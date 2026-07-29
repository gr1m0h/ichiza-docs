---
sidebar_position: 6
title: FAQ
---

# FAQ

## 旗揚げ workflow が Issue 作成で失敗する

`ichiza new --issues` は `gh issue create --label ...` を実行しますが、
gh は**リポジトリに存在しないラベルを指定するとエラーで止まります**。
`lifecycle.yaml` で使う全ラベルを先に作成してください
（[Getting Started](./getting-started.md#3-1-ラベルの事前作成必須)）。

## 旗揚げ workflow の PR 作成が 403 で失敗する

Settings → Actions → General → Workflow permissions の
**「Allow GitHub Actions to create and approve pull requests」が OFF** になっています。
workflow 側の `permissions:` 宣言だけでは足りません。

## 生成された時点で期限切れのタスクが並ぶ

開催日が近すぎます。同梱 lifecycle の最長オフセットは `-35d`（会場確定・確保）なので、
**開催日は旗揚げ日から 5 週間以上先**に置いてください。
自分の lifecycle をカスタマイズしている場合は、その最長オフセットが基準です。

## Issue を close しても tasks.yaml の done が変わらない

現状 `tasks.yaml` の done と GitHub Issue の close は連動しません。
**open Issue を正とする**運用にしてください（タスク完了 = Issue close）。
同期の実装は Roadmap の最優先項目です。

## 共同運営者に CLI のインストールは必要？

不要です。運営リポジトリの Write 権限があれば、
**Run workflow ボタン（旗揚げ）と Issue の消化**だけで運営に参加できます。
スマホの GitHub アプリからも実行可能です。CLI は Actions とローカルで
同じロジックを呼ぶための実装形態にすぎません。

## 運営リポジトリは public でもいい？

動作はしますが **private を推奨**します。タスク Issue に会場の入館情報や
登壇者の連絡先といった非公開情報が載ることがあるためです。

## X の告知は自動投稿される？

いいえ。`sns.x.mode: intent` は**半自動・無料**の方式で、remind の通知に
X の投稿画面を開く intent URL（本文入り）が添付されます。投稿ボタンを押すのは人間です。
API 経由の全自動投稿（`mode: api`）は未実装です。

## Roadmap {#roadmap}

| 優先 | 項目 | 理由 |
| --- | --- | --- |
| 1 | タスク完了の同期 | `tasks.yaml` の done と Issue close の連動。「open Issue を正とする」方針を実装に落として二重管理を回避 |
| 2 | `ichiza watch` | connpass API v2 で申込数ウォッチ（adapter 化して他サービス対応） |
| 3 | `ichiza draft` / `ichiza kpt` | 告知記事・開催記事・司会資料の下書き、アンケート集計 → KPT 下書き |
| 4 | GoReleaser + setup のバイナリ化 | workflow 実行時間の短縮（現状は毎回 `go install`） |
| 5 | starter への Renovate 設定同梱 | `@v0` タグ追従の実体となる `renovate.json` 例の同梱 |
