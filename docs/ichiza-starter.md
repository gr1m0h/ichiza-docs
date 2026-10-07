---
sidebar_position: 4
title: ichiza-starter
---
# ichiza-starter

[ichiza-starter](https://github.com/gr1m0h/ichiza-starter) は、技術勉強会の運営リポジトリを作るための
template repository です。イベント作成、Dashboard、Slack 通知、任意の Web デプロイに必要な
GitHub Actions と設定ファイルが含まれています。

```bash
gh repo create <owner>/<repo> --template gr1m0h/ichiza-starter --private --clone
```

## 責務の分け方

- **ichiza** — CLI、composite actions、Hono + Cloudflare Workers の Web 実装
- **ichiza-starter** — 各コミュニティが所有する設定、イベント、workflow
- **運営リポジトリ** — `event.yaml`、`tasks.yaml`、Dashboard Issue に運営データを保存

Web のコードは starter に複製せず、ichiza 本体で管理します。

## 中身

```text
.github/workflows/ichiza-new.yml       # イベント作成
.github/workflows/ichiza-dashboard.yml # Dashboard Issue の状態同期
.github/workflows/ichiza-remind.yml    # 期限リマインド
.github/workflows/ichiza-registry.yml  # 募集ページ本文の再生成
.github/workflows/ichiza-watch.yml     # connpass 申込数ウォッチ
.github/workflows/ichiza-web.yml       # Web コックピットのデプロイ
ichiza.yaml                            # 既定値、タイムゾーン、運営メンバー
templates/lifecycle.yaml               # ID つきタスク雛形
templates/registry/                    # 募集ページ本文テンプレート
events/                                # イベント定義
```

## ichiza-new.yml — イベント作成

`workflow_dispatch` の入力から `gr1m0h/ichiza/actions/new@v0.2.0` を呼び出します。

1. `event.yaml` と `tasks.yaml` を生成
2. `ichiza new --dashboard` で Dashboard Issue を 1 件作成
3. connpass へ貼り付けられる募集ページ本文を job summary に出力
4. `ichiza/new-<slug>` ブランチへ commit し、PR を作成

タスクの完了状態は、Dashboard の最上位チェックボックスで管理します。
PR 作成許可がない場合も、job summary に手動作成リンクを表示します。

## ichiza-dashboard.yml — Dashboard の同期

Dashboard Issue の本文編集と、main へマージされたイベント定義の変更を処理します。

- ichiza が管理する最上位チェックボックスだけを解析
- 全件完了なら Issue を close
- 未完了へ戻ったら Issue を reopen
- main へ定義がマージされたら全イベントを `dashboard sync` し、task ID ごとの完了状態と Notes を保持
- Issue 本文先頭の `ichiza-dashboard` marker で対象を識別

workflow には `issues: write` が必要です。

## ichiza-remind.yml — 期限リマインド

毎朝 09:00 JST に `gr1m0h/ichiza/actions/remind@v0.2.0` を実行し、Dashboard の
期限超過と 7 日以内の未完了タスクを Slack へ通知します。担当者に
`slack_user_id` があればメンションします。Webhook が未設定の場合は実行しません。

## ichiza-registry.yml / ichiza-watch.yml

- **registry** — `event.yaml` から募集ページ本文を再生成
- **watch** — `connpass_url` がある開催前イベントの申込数、定員、補欠、受付状態を通知

watch は `CONNPASS_API_KEY` 未設定ならスキップします。

## Web コックピット（任意・alpha）

`ichiza-web.yml` は ichiza 本体のソースコードを使い、Web アプリを Cloudflare Workers へデプロイします。
データは GitHub の Dashboard Issue から取得するため、独自のデータベースは使いません。

利用できる画面は、開催日と進捗を持つイベント一覧、イベント詳細、My Page です。期限状態と担当タスクを確認し、
Dashboard のチェックボックスを更新できます。

### 必要な Secrets

- `CLOUDFLARE_API_TOKEN` — Worker のデプロイ権限
- `ICHIZA_GITHUB_TOKEN` — 対象リポジトリだけに限定した fine-grained PAT
  - Issues: Read and write
  - Metadata: Read-only
  - Contents 権限は不要

PAT は運営リポジトリ所有者または代表運営者が発行し、有効期限を設定します。
alpha 版では PAT を使用します。今後、GitHub App への移行を予定しています。

### 必要な Variables

- `CLOUDFLARE_ACCOUNT_ID`
- `ICHIZA_WORKER_NAME`
- `CF_ACCESS_TEAM_DOMAIN`
- `CF_ACCESS_AUD`

### 初回セットアップ

1. `ichiza.yaml` の `members.email` に許可する運営者を登録
2. Account ID、Worker 名、Cloudflare API token、GitHub PAT を登録
3. Access 関連 Variables を空のまま **ichiza web** を一度実行
4. Cloudflare の対象 Worker で **Protect this Worker behind Access** を有効化
5. Access policy へ運営者のメールアドレスを登録
6. team domain と Audience tag を Variables へ設定し、workflow を再実行

Access の設定が完了するまで、Worker へのアクセスは許可されません。
無料の `workers.dev` URL を使えるため、カスタムドメインは必須ではありません。

## 登壇者・募集ページの更新 {#speakers}

1. `events/<slug>/event.yaml` の `speakers`、会場、タイムテーブルを更新
2. **ichiza registry** を実行
3. job summary の本文を connpass へ貼り直す

## 更新方法

workflows は公開済みリリース `gr1m0h/ichiza/actions/*@v0.2.0` を参照します。
Renovate が新しいリリースへの更新 PR を作るため、内容を確認してから運営リポジトリへ反映できます。
