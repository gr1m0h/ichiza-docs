---
sidebar_position: 4
title: ichiza-starter
---

# ichiza-starter

[ichiza-starter](https://github.com/gr1m0h/ichiza-starter) は、コミュニティが複製する
**template repository** です。ここから作った運営リポジトリには、ichiza を動かすための
配線がすべて済んでいて、イベント作成から当日までスマホの GitHub アプリだけでも回せます。

```bash
gh repo create <owner>/<repo> --template gr1m0h/ichiza-starter --private --clone
```

## 中身

```text
.github/workflows/ichiza-new.yml      # イベント作成（Run workflow ボタン）
.github/workflows/ichiza-remind.yml   # 毎朝 09:00 JST の期限チェック（cron）
.github/workflows/ichiza-registry.yml # 募集ページ本文の再生成（Run workflow ボタン）
.github/workflows/ichiza-watch.yml    # 毎朝 09:00 JST の申込数ウォッチ（cron・要 CONNPASS_API_KEY）
ichiza.yaml                           # コミュニティの既定値
templates/lifecycle.yaml              # タスク雛形（複数可、--lifecycle で切替）
templates/registry/                   # 募集ページ本文のテンプレート（page.md）
events/                               # イベントごとの event.yaml + tasks.yaml
```

## ichiza-new.yml — イベント作成ボタン

`workflow_dispatch` の入力フォーム（slug / title / date / mode）から
`gr1m0h/ichiza/actions/new@v0` を呼び出します。実行すると:

1. ichiza CLI をインストール（`actions/setup`）
2. `ichiza new --issues` で `event.yaml` + `tasks.yaml` + マイルストーン +
   期限つき GitHub Issues を生成（ラベルは自動作成）
3. connpass にそのまま貼れる募集ページ本文を job summary に出力
4. `ichiza/new-<スラグ>` ブランチに commit して PR を作成

GitHub UI の **Run workflow ボタン**（スマホの GitHub アプリ含む）から実行できるので、
共同運営者に CLI の知識は不要です。PR 作成許可が OFF でも失敗せず、
job summary に手動作成リンク（タイトル・本文入力済み）が表示されます。

## ichiza-remind.yml — 毎朝の期限チェック

cron（`0 0 * * *` = 09:00 JST）で `gr1m0h/ichiza/actions/remind@v0` を実行し、
期限超過 + 7 日以内のタスクを Slack に digest 通知します。close 済み Issue のタスクは
対象外です。Secrets に `SLACK_WEBHOOK_URL` の登録が必要です
（[Getting Started](./getting-started.md#2-2-slack-webhook)）。
`workflow_dispatch` でも起動できるので、手動での動作確認も可能です。

## ichiza-registry.yml — 募集ページ本文の再生成

Run workflow（slug を入力）で `event.yaml` から募集ページ本文を再生成し、
job summary に出力します。登壇者やタイムテーブルを更新したら、公開済みの
connpass ページの本文に**まるごと貼り直します**（connpass の編集は本文の全置換のため、
差分追記より崩れません）。文面は `templates/registry/page.md` でカスタマイズできます。

## ichiza-watch.yml — 毎朝の申込数ウォッチ

cron（09:00 JST）で開催前イベントの申込数 / 定員充足率 / 補欠 / 受付状態を
Slack へ通知します。対象は `event.yaml` に `connpass_url` があるイベント
（募集ページ公開後に追記）。`CONNPASS_API_KEY` secret が未設定の間は自動でスキップされます。

## 登壇者の追加 {#speakers}

1. `events/<slug>/event.yaml` の `speakers:` に登壇者情報を追記
   （形式は[設定リファレンス](./ichiza/configuration.md)を参照）
2. **ichiza registry** を Run workflow で実行し、summary の本文を connpass に貼り直す

## バージョン追従

workflows は `gr1m0h/ichiza/actions/*@v0` のタグ参照なので、本体側のリリース
（パッチ → `v0` タグ付け替え）に運営リポジトリ側の変更なしで追従します。
