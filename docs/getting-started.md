---
sidebar_position: 2
title: Getting Started
---
# Getting Started

運営リポジトリを作り、最初のイベントを 1 件の Dashboard Issue として開始します。

## 0. 必要なもの

- GitHub アカウント（private リポジトリでも利用可能）
- （任意）Slack Incoming Webhook URL — 期限リマインドを使う場合
- （任意）connpass API キー — 申込数ウォッチを使う場合
- （任意）Cloudflare アカウント — Web コックピットを使う場合

## 1. 運営リポジトリを作る

[ichiza-starter](./ichiza-starter.md) は template repository として公開されています。

```bash
gh repo create <owner>/<repo> --template gr1m0h/ichiza-starter --private --clone
```

**private 推奨**: Dashboard Issue に会場の入館情報や登壇者の連絡先が載ることがあるためです。

既存リポジトリへ導入する場合は、starter の `.github/workflows/`、`ichiza.yaml`、
`templates/` をコピーします。

## 2. GitHub Actions を設定する

### 2-1. PR 作成許可

Settings → Actions → General → Workflow permissions で
**Allow GitHub Actions to create and approve pull requests** を有効にします。

```bash
gh api -X PUT repos/<owner>/<repo>/actions/permissions/workflow \
    -f default_workflow_permissions=read -F can_approve_pull_request_reviews=true
```

:::note PR 作成を許可していない場合

無効のままでもイベント作成は完了し、job summary にタイトルと本文が入力済みの
PR 作成リンクを表示します。

:::

### 2-2. Slack Webhook（任意）

Slack 通知を使う場合は、Incoming Webhook URL を Actions secret
`SLACK_WEBHOOK_URL` に登録します。未設定なら remind workflow はスキップします。

```bash
gh secret set SLACK_WEBHOOK_URL --repo <owner>/<repo>
```

### 2-3. connpass API キー（任意）

申込数ウォッチを使う場合だけ、`CONNPASS_API_KEY` を Actions secrets に登録します。

```bash
gh secret set CONNPASS_API_KEY --repo <owner>/<repo>
```

## 3. コミュニティ仕様を設定する

`ichiza.yaml` と `templates/lifecycle.yaml` を編集します。

- `timezone` — 期限計算に使うタイムゾーン
- `members` — GitHub ユーザー名、メールアドレス、Slack User ID の対応
- `defaults` — 開催形態、会場、運営役割、配信設定
- lifecycle の `id` — 各タスクに必須の、イベントをまたいで安定する識別子

```yaml
timezone: Asia/Tokyo

members:
  - github: octocat
    email: octocat@example.com
    slack_user_id: U0123456789
```

`members` は担当者の照合、Slack メンション、Web を使える運営者の許可リストに使います。
設定一覧は [設定リファレンス](./ichiza/configuration.md)、タスク定義は
[Lifecycle テンプレート](./ichiza/lifecycle.md)を参照してください。

:::caution 既定値はイベント作成時にコピーされる

`ichiza.yaml` の既定値を後から変えても、作成済みイベントには反映されません。
既存イベントを変更する場合は、`events/<slug>/event.yaml` と `tasks.yaml` を PR で更新します。
main へマージすると、`ichiza-dashboard.yml` が task ID ごとの完了状態と Notes を残したまま、
Dashboard Issue を自動で更新します。

:::

## 4. 導通テスト

Actions → **ichiza new** → **Run workflow** をテスト値で実行します。

| 入力 | 値の例 |
| --- | --- |
| slug | `test-0` |
| title | 導通テスト |
| date | 2〜3 か月先の日付 |
| mode | `hybrid` |

期待結果は次の3点です。

- `ichiza/new-test-0` ブランチの PR（`event.yaml` と `tasks.yaml`）
- イベント情報と期限つきタスクをまとめた Dashboard Issue 1 件
- job summary に connpass へ貼り付けられる募集ページ本文

Dashboard の最上位チェックボックスを操作し、すべて完了すると Issue が閉じること、
1 件を未完了に戻すと再度開くことも確認できます。テスト後は PR、ブランチ、
Dashboard Issue を削除またはクローズします。

## 5. 最初のイベントを作成する

:::caution 開催日は「作成日 + 5 週間以上先」を推奨

同梱 lifecycle の最長オフセットより近い日付では、作成時点から期限超過になるタスクがあります。

:::

1. **ichiza new** へ本番の slug、title、date、mode を入力して実行
2. PR の `event.yaml` に会場、タイムテーブル、役割分担を記入してマージ
3. job summary の本文を connpass へ貼り付け、公開後に `connpass_url` を追記
4. Dashboard Issue のチェックボックスを日々更新
5. GitHub Projects を使う場合は、この Dashboard Issue をイベントカードとして追加

イベントの設定は `event.yaml` と `tasks.yaml` で管理し、日々の進捗は Dashboard Issue で更新します。
Dashboard のタイトル、期限、担当者、管理用 HTML コメントは直接変更せず、定義ファイルを更新してください。
続きは [運営サイクルガイド](./operations.md) へ進んでください。

Web コックピットは、基本的な運用を確認したあとからでも追加できます。導入手順は
[ichiza-starter](./ichiza-starter.md#web-コックピット任意alpha)にあります。
