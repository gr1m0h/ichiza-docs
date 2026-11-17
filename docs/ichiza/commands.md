---
sidebar_position: 2
title: コマンド
---

# コマンド

```text
ichiza new       --slug <slug> --title <title> --date <YYYY-MM-DD>
                 [--mode onsite|hybrid|online] [--lifecycle <path>] [--dashboard]
ichiza remind    [--notify stdout|slack] [--days 7] [--today <YYYY-MM-DD>]
ichiza dashboard reconcile --issue <number>
ichiza dashboard sync --slug <slug> [--config ichiza.yaml]
ichiza web-config [--config ichiza.yaml]
ichiza registry  --slug <slug>
ichiza watch     [--notify stdout|slack] [--slug <slug>] [--today <YYYY-MM-DD>]
ichiza help
```

## 早見表

| コマンド | 使う場面 | やること |
| --- | --- | --- |
| `ichiza new` | イベント作成時 | event.yaml、tasks.yaml、任意で Dashboard Issue を生成 |
| `ichiza remind` | 毎朝 | Dashboard の未完了タスクから期限超過・期限接近を通知 |
| `ichiza dashboard reconcile` | Dashboard 編集時 | 全件完了なら Issue を閉じ、未完了なら再度開く |
| `ichiza dashboard sync` | event/tasks 定義のマージ時 | 完了状態と Notes を保持して Dashboard を再生成 |
| `ichiza web-config` | Web デプロイ時 | timezone と許可メンバーの JSON を生成 |
| `ichiza registry` | 募集ページ公開・更新時 | event.yaml から connpass 用本文を生成 |
| `ichiza watch` | 毎朝 | connpass の申込数、補欠、受付状態を取得 |

## ichiza new

```bash
ichiza new --slug tokyo-3 --title "Your Meetup #3" --date 2026-11-28
ichiza new --slug tokyo-3 --title "Your Meetup #3" --date 2026-11-28 --dashboard
```

| フラグ | 説明 |
| --- | --- |
| `--slug` | イベント識別子。小文字英数字とハイフン。必須 |
| `--title` | イベントタイトル。必須 |
| `--date` | 開催日 `YYYY-MM-DD`。必須 |
| `--mode` | `onsite` / `hybrid` / `online` |
| `--lifecycle` | lifecycle テンプレートのパス |
| `--dashboard` | `gh` CLI で Dashboard Issue を 1 件作成 |
| `--config` | root 設定のパス。既定は `ichiza.yaml` |

生成物は `events/<slug>/event.yaml` と `tasks.yaml` です。`--dashboard` を付けると、
`ichiza:event` ラベルを持つ「`<イベント名> 運営Dashboard`」Issue も作ります。
各タスクは期限順の最上位チェックボックスとして表示されます。task ID などは
HTML コメントに記録されるため、このコメントは削除しないでください。

## ichiza remind

```bash
ichiza remind
ichiza remind --notify slack
ichiza remind --today 2026-11-01
```

| フラグ | 説明 |
| --- | --- |
| `--notify` | `stdout`（既定）または `slack` |
| `--days` | 先読み日数。既定は 7 |
| `--today` | 今日の日付の上書き |
| `--config` | root 設定のパス |

`gh` CLI で Dashboard Issue を読み、未完了の期限超過・期限接近タスクをイベントごとにまとめます。
Dashboard の取得に失敗した場合は、誤った通知を送らずエラーで停止します。

担当者が `ichiza.yaml` の `members` にあり、`slack_user_id` が設定されていれば
Slack でメンションします。announce ラベルのタスクには X intent URL を付けます。
`--notify slack` では `SLACK_WEBHOOK_URL` が必要です。

## ichiza dashboard reconcile

```bash
ichiza dashboard reconcile --issue 123
```

指定 Issue の管理対象チェックボックスを解析します。

- 1 件以上の全タスクが完了 → `completed` reason で Issue を close
- 1 件でも未完了 → Issue を open に保つ、または reopen
- タスクが 0 件 → open のまま
- Dashboard marker がない Issue → エラー

`gh` CLI と Issue の read/write 権限が必要です。通常は
`ichiza-dashboard.yml` が Issue 編集イベントから実行します。

## ichiza dashboard sync

```bash
ichiza dashboard sync --slug tokyo-3
```

`events/<slug>/event.yaml` と `tasks.yaml` を Dashboard Issue へ再反映します。
同じ task ID のチェック状態と Notes は保持し、追加タスクは未完了、削除タスクは管理領域から除外します。
同期後に close / reopen も再判定します。starter では main への定義変更時に自動実行されます。

管理対象行のタイトル、期限、担当者、HTML コメントは Issue 上で直接変更せず、
定義ファイルを PR で更新してください。

## ichiza web-config

```bash
ichiza web-config
ichiza web-config --config path/to/ichiza.yaml
```

`timezone` と、`members` の `email` / `github` を JSON として標準出力します。
Web デプロイ workflow が期限判定と許可リストを Worker へ渡すためのコマンドで、
`slack_user_id` や secret は出力しません。

## ichiza registry

```bash
ichiza registry --slug tokyo-3
```

`event.yaml` から募集ページ本文を生成します。connpass には書き込み API がないため、
生成した全文を connpass へ貼り付けます。登壇者や会場を変更した場合も再生成して
公開済み本文を置き換えます。

| フラグ | 説明 |
| --- | --- |
| `--slug` | 対象イベント。必須 |
| `--config` | root 設定のパス |

## ichiza watch

```bash
export CONNPASS_API_KEY=...
ichiza watch
ichiza watch --notify slack
ichiza watch --slug tokyo-3
```

| フラグ | 説明 |
| --- | --- |
| `--notify` | `stdout`（既定）または `slack` |
| `--slug` | 対象を 1 イベントに限定 |
| `--today` | 今日の日付の上書き |
| `--config` | root 設定のパス |

開催日が今日以降で `connpass_url` のあるイベントについて、connpass API v2 から
申込数、定員、補欠、受付状態を取得します。`--slug` 指定時は開催済みも対象にできます。
公開中イベントがなければ Slack 通知は送らず、実行ログだけを残します。

## Coming soon

`draft` と `kpt` は未実装です。[FAQ の Roadmap](../faq.md#roadmap) を参照してください。
