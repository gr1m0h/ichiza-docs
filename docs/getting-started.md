---
sidebar_position: 2
title: Getting Started
---

# Getting Started

運営リポジトリの作成から、最初のイベント作成まで。

## 0. 必要なもの

- GitHub アカウント（private リポジトリの無料枠でも十分）
- Slack の Incoming Webhook URL — 期限リマインドの通知先
  （[作り方](https://api.slack.com/messaging/webhooks)。後から設定しても OK）
- （任意）connpass API キー — 申込数ウォッチ（`watch`）を使う場合のみ。
  [利用申請](https://help.connpass.com/api/)で発行（コミュニティ・個人は無償、審査あり）

## 1. 運営リポジトリを作る

[ichiza-starter](./ichiza-starter.md) は template repository として公開されています。

```bash
gh repo create <owner>/<repo> --template gr1m0h/ichiza-starter --private --clone
```

**private 推奨**: タスク Issue に会場の入館情報や登壇者の連絡先が載ることがあるためです。

既存のリポジトリを運営リポジトリにする場合は、starter の中身
（`.github/workflows/` / `ichiza.yaml` / `templates/`）を直接コピーしてください。

## 2. 前提条件を潰す

### 2-1. Actions の PR 作成許可（推奨）

Settings → Actions → General → Workflow permissions で
**「Allow GitHub Actions to create and approve pull requests」を ON** にします
（個人アカウントは既定で不許可）。

```bash
gh api -X PUT repos/<owner>/<repo>/actions/permissions/workflow \
    -f default_workflow_permissions=read -F can_approve_pull_request_reviews=true
```

:::note 忘れてもイベント作成は失敗しません

OFF のままでも workflow は完走し、PR の代わりに job summary へ
手動作成リンク（タイトル・本文入力済み）が表示されます。恒久対応はこの権限設定です。

:::

### 2-2. Slack Webhook

Slack App の Incoming Webhook で URL を発行し、
Settings → Secrets and variables → Actions に `SLACK_WEBHOOK_URL` として登録します
（YAML に直書きしない）。毎朝 9:00 JST の cron で「今週の締切」digest が届くようになります。

```bash
gh secret set SLACK_WEBHOOK_URL --repo <owner>/<repo>
```

### 2-3. connpass API キー（任意）

申込数ウォッチを使う場合のみ、`CONNPASS_API_KEY` を Secrets に登録します。
未設定の間は watch workflow が自動でスキップされるので、後回しで構いません。

```bash
gh secret set CONNPASS_API_KEY --repo <owner>/<repo>
```

## 3. コミュニティ仕様に設定する

`ichiza.yaml`（既定値）と `templates/lifecycle.yaml`（タスク定義）を編集します。
最小構成のままでも動くので、まずはそのまま進めても構いません。

- `defaults.mode`（開催形態）・`defaults.venue`（会場）・`defaults.roles`（運営役割）、
  hybrid / online で開催するなら `defaults.streaming` を見直す
- 設定キーの一覧は [設定リファレンス](./ichiza/configuration.md)
- タスク定義の書き方は [Lifecycle テンプレート](./ichiza/lifecycle.md)
- フル構成の実例は本体リポジトリの [`examples/meetup/`](https://github.com/gr1m0h/ichiza/tree/main/examples/meetup)

:::caution 既定値はイベント作成時にコピーされる

`ichiza.yaml` の既定値は**イベント作成時に雛形へコピーされる**ため、作成後に変えても
既存イベントには反映されません（個別の修正は `events/<slug>/event.yaml` を直接編集）。

:::

## 4. 導通テスト

Actions タブ → **ichiza new** → **Run workflow** をテスト値で実行します。

| 入力 | 値の例 |
| --- | --- |
| slug | `test-0` |
| title | 導通テスト |
| date | 2〜3 ヶ月先の日付 |
| mode | `hybrid` |

**期待結果**:

- `ichiza/new-test-0` ブランチの PR（`event.yaml` + `tasks.yaml`）
- マイルストーン + 開催日から逆算した期限つき Issues 群（ラベルは自動作成されます）
- job summary に connpass にそのまま貼れる募集ページ本文

確認できたら PR をクローズし、ブランチ・Issues・マイルストーンを掃除します。
失敗した場合は手順 2 の Secrets を再確認してください。

## 5. 最初のイベントを作成する

:::caution 開催日は「作成日 + 5 週間以上先」に置く

同梱 lifecycle の最長オフセットは `-35d`（会場確定・確保）。
それより近い日付で作成すると、生成された時点で期限切れのタスクが並びます。

:::

1. Run workflow で本番の slug / title / date を入力して実行
2. 生成された PR の `event.yaml` に**会場名・タイムテーブル・役割分担を記入**して
   マージ — 以降これが SSoT
3. job summary の募集ページ本文を connpass の「コピーして新規作成」→ 本文にペーストして公開し、
   `event.yaml` に `connpass_url` を追記（申込数ウォッチの対象になります）
4. マージ後はマイルストーンビューが「このイベントのやること一覧」になる

あとは毎朝の Slack リマインドと Issue の消化だけで開催日を迎えられます。
続きは [運営サイクルガイド](./operations.md) へ。
