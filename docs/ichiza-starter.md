---
sidebar_position: 4
title: ichiza-starter
---

# ichiza-starter

[ichiza-starter](https://github.com/gr1m0h/ichiza-starter) は、コミュニティが複製する
**template repository** です。ここから作った運営リポジトリには、ichiza を動かすための
配線がすべて済んでいます。

```bash
gh repo create <owner>/<repo> --template gr1m0h/ichiza-starter --private --clone
```

## 中身

```text
.github/workflows/ichiza-new.yml     # Run workflow ボタン（旗揚げ）
.github/workflows/ichiza-remind.yml  # 毎朝の期限チェック（cron）
.github/ISSUE_TEMPLATE/speaker.yml   # 登壇者情報 Issue Form
ichiza.yaml                          # root 設定（既定値 / adapter）
templates/lifecycle.yaml             # ライフサイクル定義（最小構成）
```

## ichiza-new.yml — 旗揚げボタン

`workflow_dispatch` の入力フォーム（slug / title / date / mode）から
`gr1m0h/ichiza/actions/new@v0` を呼び出します。実行すると:

1. ichiza CLI をインストール（`actions/setup`）
2. `ichiza new --issues` で `event.yaml` + `tasks.yaml` + Issues を生成
3. `ichiza/new-<スラグ>` ブランチに commit して PR を作成

GitHub UI の **Run workflow ボタン**（スマホの GitHub アプリ含む）から実行できるので、
共同運営者に CLI の知識は不要です。

## ichiza-remind.yml — 毎朝の期限チェック

cron（`0 0 * * *` = 09:00 JST）で `gr1m0h/ichiza/actions/remind@v0` を実行し、
期限超過 + 7 日以内のタスクを Slack に digest 通知します。
Secrets に `SLACK_WEBHOOK_URL` の登録が必要です（[Getting Started](./getting-started.md#3-3-slack-webhook)）。
`workflow_dispatch` でも起動できるので、手動での動作確認も可能です。

## speaker.yml — 登壇者情報 Issue Form {#issue-form}

登壇者に Issue Form の URL を送るだけで、掲載に必要な情報が構造化された形で集まります。

| 項目 | 必須 |
| --- | --- |
| お名前（ハンドルネーム可） | ✓ |
| SNS の URL（X、GitHub など） | — |
| 簡単な経歴・プロフィール | ✓ |
| セッションタイトル（仮で OK） | ✓ |
| 登壇形態（リモート希望） | — |

提出された Issue には `speakers` ラベルが付き、
[`ichiza speakers`](./ichiza/commands.md#ichiza-speakers) がこれを収集して掲載文を生成します。

## バージョン追従

workflows は `gr1m0h/ichiza/actions/*@v0` のタグ参照なので、本体側のリリース
（パッチ → `v0` タグ付け替え）に運営リポジトリ側の変更なしで追従します。
