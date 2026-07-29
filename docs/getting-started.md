---
sidebar_position: 2
title: Getting Started
---

# Getting Started

運営リポジトリの作成から、最初のイベントの旗揚げまで。

## 1. 運営リポジトリを作る

[ichiza-starter](./ichiza-starter.md) は template repository として公開されています。

```bash
gh repo create <owner>/<repo> --template gr1m0h/ichiza-starter --private --clone
```

**private 推奨**: タスク Issue に会場の入館情報や登壇者の連絡先が載ることがあるためです。

既存のリポジトリを運営リポジトリにする場合は、starter の中身
（`.github/workflows/` / `.github/ISSUE_TEMPLATE/` / `ichiza.yaml` / `templates/lifecycle.yaml`）を
直接コピーしてください。

## 2. コミュニティ仕様に設定する

`ichiza.yaml`（既定値）と `templates/lifecycle.yaml`（タスク定義）を編集します。
最小構成のままでも動くので、まずはそのまま進めても構いません。

- 設定キーの一覧は [設定リファレンス](./ichiza/configuration.md)
- タスク定義の書き方は [Lifecycle テンプレート](./ichiza/lifecycle.md)
- フル構成の実例は本体リポジトリの [`examples/meetup/`](https://github.com/gr1m0h/ichiza/tree/main/examples/meetup)

## 3. 前提条件を潰す

旗揚げ workflow が一発で通るために、3 点だけ先に済ませます。

### 3-1. ラベルの事前作成（必須）

`ichiza new --issues` は `gh issue create --label ...` を実行しますが、
gh は**リポジトリに存在しないラベルを指定するとエラーで止まります**。
`lifecycle.yaml` で使う全ラベルを先に作成してください。同梱テンプレートなら次の 7 種です。

```bash
for l in venue program speakers announce streaming ops followup; do
  gh label create "$l" --repo <owner>/<repo> || true
done
```

### 3-2. Actions の PR 作成許可（必須）

Settings → Actions → General → Workflow permissions で
**「Allow GitHub Actions to create and approve pull requests」を ON** にします。
OFF のままだと `gh pr create` が 403 で失敗します
（workflow 側の `permissions:` 宣言だけでは足りません）。

### 3-3. Slack Webhook

Slack App の Incoming Webhook で URL を発行し、
Settings → Secrets and variables → Actions に `SLACK_WEBHOOK_URL` として登録します
（YAML に直書きしない）。毎朝 9:00 JST の cron で「今週の締切」digest が届くようになります。

## 4. 導通テスト

Actions タブ → **ichiza new** → **Run workflow** をテスト値で実行します。

| 入力 | 値の例 |
| --- | --- |
| slug | `test-0` |
| title | 導通テスト |
| date | 2〜3 ヶ月先の日付 |
| mode | `hybrid` |

**期待結果**: `ichiza/new-test-0` ブランチの PR + マイルストーン + 期限つき Issues 群。

確認できたら PR をクローズし、ブランチ・Issues・マイルストーンを掃除します。
失敗した場合は手順 3 の 3 点（ラベル / PR 作成許可 / Secrets）を再確認してください。

## 5. 本番の旗揚げ

:::caution 開催日は「旗揚げ日 + 5 週間以上先」に置く

同梱 lifecycle の最長オフセットは `-35d`（会場確定・確保）。
それより近い日付で旗揚げすると、生成された時点で期限切れのタスクが並びます。

:::

1. Run workflow で本番の slug / title / date を入力して実行
2. 生成された PR の `event.yaml` に**会場・役割分担を記入**してマージ
3. マージ後はマイルストーンビューが「このイベントのやること一覧」になる

あとは毎朝の Slack リマインドと Issue の消化だけで開催日を迎えられます。
続きは [運営サイクルガイド](./operations.md) へ。
