---
sidebar_position: 2
title: コマンド
---

# コマンド

```text
ichiza new       --slug <slug> --title <title> --date <YYYY-MM-DD>
                 [--mode onsite|hybrid|online] [--lifecycle <path>] [--issues]
ichiza remind    [--notify stdout|slack] [--days 7] [--today <YYYY-MM-DD>]
ichiza speakers  [--label speakers] [--apply --slug <slug>]
ichiza help
```

## 早見表

| コマンド | 使う瞬間 | やること |
| --- | --- | --- |
| `ichiza new` | 旗揚げ（開催 5 週間前） | 開催日から逆算した期限つきタスクを `event.yaml` + `tasks.yaml` + GitHub Issues（マイルストーン付き）として一括生成 |
| `ichiza remind` | 毎朝 9:00 JST（cron が自動実行） | 期限超過 + 7 日以内のタスクを Slack に digest 通知。announce ラベルのタスクには X の投稿画面を開く intent URL を添付 |
| `ichiza speakers` | 登壇者確定〜告知（開催 4〜3 週間前） | 登壇者が Issue Form で提出した情報を集約してイベントページ掲載文を生成 |

## ichiza new

```bash
ichiza new --slug tokyo-3 --title "Your Meetup #3" --date 2026-11-28
ichiza new ... --issues   # gh CLI 経由で期限つき Issues も一括生成
```

| フラグ | 説明 |
| --- | --- |
| `--slug` | イベントの識別子（例: `tokyo-3`）。**必須** |
| `--title` | イベントタイトル。**必須** |
| `--date` | 開催日 `YYYY-MM-DD`。**必須** |
| `--mode` | `onsite` \| `hybrid` \| `online`（既定: `ichiza.yaml` の `defaults.mode`） |
| `--lifecycle` | lifecycle テンプレートのパス（既定: `ichiza.yaml` の `lifecycle`） |
| `--issues` | gh CLI 経由で GitHub Issues も作成 |
| `--config` | root 設定のパス（既定: `ichiza.yaml`） |

**生成物**:

- `events/<スラグ>/event.yaml` — イベント定義の雛形。開催形態・役割・会場・配信設定の既定値は
  `ichiza.yaml` の `defaults` から埋まる
- `events/<スラグ>/tasks.yaml` — lifecycle テンプレートから逆算した期限つきタスク
- （`--issues`）マイルストーン + 期限つき GitHub Issues

## ichiza remind

```bash
ichiza remind                   # stdout に表示
ichiza remind --notify slack    # SLACK_WEBHOOK_URL に通知（cron 用）
ichiza remind --today 2026-11-01  # 日付を偽装してドライラン
```

| フラグ | 説明 |
| --- | --- |
| `--notify` | `stdout`（既定）\| `slack`。`slack` は環境変数 `SLACK_WEBHOOK_URL` を読む |
| `--days` | 先読みする日数（既定: 7） |
| `--today` | 今日の日付を上書き（ドライラン用） |

期限超過と期限接近（`--days` 日以内）のタスクをイベントごとにまとめて通知します。
**announce ラベルのタスクには X の投稿画面を開く intent URL**
（`https://x.com/intent/post?text=...`、タイトルとイベントページ URL 入り）が添付されるので、
通知からワンタップで告知ポストまで済みます。

## ichiza speakers

```bash
ichiza speakers                            # 掲載文を stdout に生成
ichiza speakers --apply --slug tokyo-3     # event.yaml にも反映
```

| フラグ | 説明 |
| --- | --- |
| `--label` | 収集対象の Issue ラベル（既定: `speakers`） |
| `--apply` | 収集結果を `events/<スラグ>/event.yaml` に書き込む |
| `--slug` | 反映先イベントのスラグ（`--apply` 時に必須） |

登壇者が [Issue Form](../ichiza-starter.md#issue-form) で提出した情報
（名前 / SNS / 経歴 / セッションタイトル / 登壇形態）を gh CLI 経由で収集し、
connpass などにそのまま貼れる掲載文を組み立てます。

## Coming soon

`watch` / `draft` / `kpt` は未実装です。[FAQ の Roadmap](../faq.md#roadmap) を参照してください。
