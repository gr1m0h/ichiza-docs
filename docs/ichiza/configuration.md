---
sidebar_position: 3
title: 設定リファレンス
---

# 設定リファレンス

コミュニティごとの設定は `ichiza.yaml` と `templates/lifecycle.yaml` に記述します。

| ファイル | 役割 |
| --- | --- |
| `ichiza.yaml` | タイムゾーン、運営メンバー、開催形態・会場・役割などの既定値 |
| `templates/lifecycle.yaml` | task ID、期限オフセット、担当者、対象 mode、手順の雛形 |

`ichiza.yaml` がない場合は、Asia/Tokyo、onsite、organizer 1人、
`templates/lifecycle.yaml` を既定値として使います。

## フル構成例

```yaml
lifecycle: templates/lifecycle.yaml
events_dir: events
timezone: Asia/Tokyo

members:
  - github: alice
    email: alice@example.com
    slack_user_id: U0123456789
  - github: bob
    email: bob@example.com

defaults:
  mode: hybrid
  venue:
    name: 〇〇ビル 3F セミナールーム
    capacity: 30
    facilities: [wifi, projector, hdmi]
    checkin: 名簿
  roles: [mc, reception, timekeeper, director, afterparty]
  streaming_role: streaming
  streaming:
    platform: streamyard
    camera: [smartphone]
  timetable:
    - { start: "19:00", title: オープニング }
    - { start: "19:10", title: セッション1, speaker: "" }

notifier:
  type: slack
registry:
  type: connpass
  templates:
    page: templates/registry/page.md
    speaker: templates/registry/speaker.md
```

## トップレベル

| キー | 省略時 | 説明 |
| --- | --- | --- |
| `lifecycle` | `templates/lifecycle.yaml` | lifecycle テンプレートのパス |
| `events_dir` | `events` | `events/<slug>/` の生成先 |
| `timezone` | `Asia/Tokyo` | IANA time zone。remind の「今日」と期限判定に使用 |
| `members` | 空 | 運営者と GitHub、Slack、Web 認証メールの対応 |
| `defaults` | 最小構成 | イベント作成時の既定値 |
| `notifier.type` | `slack` | 通知 adapter。現在は Slack のみ |
| `registry.type` | `connpass` | 募集ページ adapter。現在は connpass のみ |
| `registry.templates.page` | 内蔵 | 募集ページ本文テンプレート |
| `registry.templates.speaker` | 内蔵 | 登壇者セクションのテンプレート |

## members

```yaml
members:
  - github: alice
    email: alice@example.com
    slack_user_id: U0123456789
```

| キー | 必須 | 用途 |
| --- | --- | --- |
| `github` | はい | lifecycle の `assignee`、Dashboard 表示、My Page の照合 |
| `email` | はい | Cloudflare Access の認証メールと照合し、Web 利用者を許可 |
| `slack_user_id` | いいえ | remind の担当者メンション |

GitHub login とメールアドレスは重複不可です。メールは読み込み時に小文字化されます。
`slack_user_id` は `U` または `W` から始まる Slack member ID を指定します。

Cloudflare Access policy と `members.email` の両方を通過した人だけが Web を利用できます。
`ichiza web-config` は期限判定に使う `timezone` と、Web に必要な `email` / `github` を
JSON で出力します。

## defaults

`events/<slug>/event.yaml` の雛形へコピーされます。あとから既定値を変えても、作成済みの
イベントには反映されません。作成済みイベントを変更する場合は event/tasks ファイルを PR で更新します。
main へマージすると、`dashboard sync` が完了状態と Notes を残したまま Dashboard を更新します。

| キー | 説明 |
| --- | --- |
| `mode` | `onsite` / `hybrid` / `online` |
| `venue` | `name`、`capacity`、`facilities`、`checkin`。online では省略 |
| `roles` | 運営役割。雛形では担当者が空の割当表になる |
| `streaming_role` | hybrid / online のとき追加する配信担当 |
| `streaming` | `platform`、`camera`、`youtube_url`、`audio`。onsite では省略 |
| `timetable` | `start`、`title`、任意の `speaker` を持つ行 |

## 募集ページ本文テンプレート

`ichiza registry` が `event.yaml` から生成する Markdown / text の Go
`text/template` です。connpass へ生成全文を貼り付けます。

### page テンプレートの変数

| 変数 | 内容 |
| --- | --- |
| `{{.Title}}` / `{{.Slug}}` / `{{.Mode}}` | イベント基本情報 |
| `{{.Date}}` | `YYYY-MM-DD` |
| `{{.DateJP}}` | 日本語表記の日付 |
| `{{.Venue}}` | 会場情報 |
| `{{.Streaming}}` | 配信情報 |
| `{{.ConnpassURL}}` | connpass URL |
| `{{.TimetableTable}}` | Markdown のタイムテーブル |
| `{{.SpeakersSection}}` | 全登壇者の生成済みセクション |
| `{{.Timetable}}` / `{{.Speakers}}` | 独自レイアウト向け生データ |

### speaker テンプレートの変数

| 変数 | 内容 |
| --- | --- |
| `{{.Handle}}` / `{{.SNS}}` / `{{.Bio}}` / `{{.SessionTitle}}` / `{{.Remote}}` | event.yaml の生データ |
| `{{.DisplayName}}` | handle とリモート登壇注記 |
| `{{.DisplaySessionTitle}}` | セッション名。未定時は「タイトル未定」 |

## フル構成の例

本体リポジトリの
[examples/meetup](https://github.com/gr1m0h/ichiza/tree/main/examples/meetup) を参照してください。
