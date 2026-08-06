---
sidebar_position: 2
title: コマンド
---

# コマンド

```text
ichiza new       --slug <slug> --title <title> --date <YYYY-MM-DD>
                 [--mode onsite|hybrid|online] [--lifecycle <path>] [--issues]
ichiza remind    [--notify stdout|slack] [--days 7] [--today <YYYY-MM-DD>]
ichiza registry  --slug <slug>
ichiza watch     [--notify stdout|slack] [--slug <slug>] [--today <YYYY-MM-DD>]
ichiza help
```

## 早見表

| コマンド | 使う瞬間 | やること |
| --- | --- | --- |
| `ichiza new` | イベント作成（開催 5 週間前） | 開催日から逆算した期限つきタスクを `event.yaml` + `tasks.yaml` + GitHub Issues（マイルストーン付き）として一括生成 |
| `ichiza remind` | 毎朝 9:00 JST（cron が自動実行） | 期限超過 + 7 日以内のタスクを Slack に digest 通知。close 済み Issue のタスクは対象外 |
| `ichiza registry` | 募集ページの公開・更新時 | `event.yaml` から募集ページ本文を生成（connpass コピペ用） |
| `ichiza watch` | 毎朝 9:00 JST（cron が自動実行） | 開催前イベントの申込数 / 補欠 / 受付状態を connpass API v2 で取得して通知 |

## ichiza new

```bash
ichiza new --slug tokyo-3 --title "Your Meetup #3" --date 2026-11-28
ichiza new ... --issues   # gh CLI 経由で期限つき Issues も一括生成
```

| フラグ | 説明 |
| --- | --- |
| `--slug` | イベントの識別子（例: `tokyo-3`。小文字英数字とハイフン）。**必須** |
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
- （`--issues`）マイルストーン + 期限つき GitHub Issues。
  リポジトリに存在しないラベルは自動作成される

## ichiza remind

```bash
ichiza remind                     # stdout に表示
ichiza remind --notify slack      # SLACK_WEBHOOK_URL に通知（cron 用）
ichiza remind --today 2026-11-01  # 日付を偽装してドライラン
```

| フラグ | 説明 |
| --- | --- |
| `--notify` | `stdout`（既定）\| `slack`。`slack` は環境変数 `SLACK_WEBHOOK_URL` を読む |
| `--days` | 先読みする日数（既定: 7） |
| `--today` | 今日の日付を上書き（ドライラン用） |

期限超過と期限接近（`--days` 日以内）のタスクをイベントごとにまとめて通知します。

- **完了状態は GitHub Issue の open / close が持ちます**。gh CLI 経由で close 済み Issue を
  照合し、閉じたタスクはリマインドから外れます（Issue のタイトルを変更すると照合できなく
  なります）。gh がない・照合に失敗した環境では警告を出して全タスクを表示します
- **announce ラベルのタスクには X の投稿画面を開く intent URL**
  （`https://x.com/intent/post?text=...`、タイトルとイベントページ URL 入り）が添付されるので、
  通知からワンタップで告知ポストまで済みます

## ichiza registry

```bash
ichiza registry --slug tokyo-3   # 募集ページ本文を stdout に生成
```

| フラグ | 説明 |
| --- | --- |
| `--slug` | 対象イベントのスラグ。**必須** |
| `--config` | root 設定のパス（既定: `ichiza.yaml`） |

`event.yaml`（SSoT）から募集ページ本文を組み立てます。connpass には書き込み API が
ないため、「connpass の**コピーして新規作成** → 生成された本文をペースト → 公開」まで
人間の作業を圧縮する設計です。登壇者を追加したときも全文を再生成して
**公開済みページの本文へまるごと貼り直します**（connpass の編集は本文の全置換のため）。

GitHub Actions では job summary に出力されます（イベント作成時の `actions/new` と、
`event.yaml` 更新後の `actions/registry` の両方）。本文テンプレートは運営リポジトリ側の
[`registry.templates`](./configuration.md#募集ページ本文テンプレートregistrytemplates) で
カスタマイズできます。

## ichiza watch

```bash
export CONNPASS_API_KEY=...      # connpass サポートへの申請制
ichiza watch                     # stdout に表示
ichiza watch --notify slack      # SLACK_WEBHOOK_URL に通知（cron 用）
ichiza watch --slug tokyo-3      # 特定イベントのみ（開催済みも可）
```

| フラグ | 説明 |
| --- | --- |
| `--notify` | `stdout`（既定）\| `slack` |
| `--slug` | 対象を 1 イベントに絞る（開催済みイベントも指定可） |
| `--today` | 今日の日付を上書き（ドライラン用） |
| `--config` | root 設定のパス（既定: `ichiza.yaml`） |

開催前イベントの申込数 / 定員（充足率）・補欠数・受付状態を connpass API v2
（読み取り専用）で取得します。adapter は `ichiza.yaml` の `registry.type` で選択します
（現状 `connpass` のみ）。

- 対象は `events/*/event.yaml` のうち**開催日が今日以降**かつ `connpass_url` が
  設定されているイベント
- `connpass_url` 未設定のイベントは通知内で ⚠️ として報告されます
  （静かに落とすと「全部見えている」ように誤読されるため）
- **公開中のイベントが 1 件もない間は実質休止**: cron は動きますが Slack へは送らず、
  実行ログにだけ状況を残します。`connpass_url` を追記した翌朝から自動で通知が始まります

## Coming soon

`draft`（告知記事・開催記事・司会資料の下書き）と `kpt`（アンケート集計 → KPT 下書き）は
未実装です。[FAQ の Roadmap](../faq.md#roadmap) を参照してください。
