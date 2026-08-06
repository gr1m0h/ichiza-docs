---
sidebar_position: 3
title: 設定リファレンス
---

# 設定リファレンス

コミュニティ固有の要件はすべて 2 つの設定ファイルで表現します。コードの変更は不要です。
**要件はすべて設定で表現し、コアはコミュニティ非依存に保つ**のが ichiza の設計原則です。

| ファイル | 役割 |
| --- | --- |
| `ichiza.yaml` | コミュニティの既定値（開催形態・会場・役割・配信など）。イベント作成時に `event.yaml` の雛形へ反映される |
| `templates/lifecycle.yaml` | タスクの雛形。開催日からのオフセットで定義し、イベント作成時に期限つきタスクへ展開される（→ [Lifecycle テンプレート](./lifecycle.md)） |

どちらも省略可能です。`ichiza.yaml` がない場合は内蔵のフォールバック値
（onsite / organizer 1 人 / `templates/lifecycle.yaml`）で動きます。

## 例（フル構成）

```yaml
lifecycle: templates/lifecycle.yaml   # lifecycle テンプレートのパス
events_dir: events                    # イベントディレクトリの生成先

defaults:                             # イベント作成時の event.yaml 雛形に反映される既定値
  mode: hybrid                        # onsite | hybrid | online
  venue:
    name: 〇〇ビル 3F セミナールーム    # 会場名（省略可）
    capacity: 30                      # 定員
    facilities: [wifi, projector, hdmi] # 設備（自由記述のリスト）
    checkin: 名簿                      # 受付方法
  roles: [mc, reception, timekeeper, director, afterparty] # 運営役割
  streaming_role: streaming           # hybrid/online のとき roles に追加される配信担当
  streaming:
    platform: streamyard              # 配信サービス
    camera: [smartphone]              # カメラ機材
  timetable:                          # タイムテーブルの雛形
    - { start: "19:00", title: オープニング }
    - { start: "19:10", title: セッション1, speaker: "" }

notifier:
  type: slack                         # 通知 adapter
registry:
  type: connpass                      # イベント募集ページ adapter
  templates:                          # 募集ページ本文のテンプレ（省略時は内蔵デフォルト）
    page: templates/registry/page.md
    speaker: templates/registry/speaker.md
sns:
  x:
    mode: intent                      # X 告知の方式
```

## トップレベル

| キー | 省略時 | 説明 |
| --- | --- | --- |
| `lifecycle` | `templates/lifecycle.yaml` | [lifecycle テンプレート](./lifecycle.md)のパス |
| `events_dir` | `events` | `events/<slug>/` を生成する場所 |
| `defaults` | 最小構成 | イベント作成時の既定値（下記） |
| `notifier.type` | `slack` | 通知先 adapter。現状 `slack` のみ |
| `registry.type` | `connpass` | 募集ページ adapter。現状 `connpass` のみ |
| `registry.templates.page` | 内蔵デフォルト | 募集ページ本文（全文）のテンプレパス |
| `registry.templates.speaker` | 内蔵デフォルト | 登壇者 1 名分セクションのテンプレパス |
| `sns.x.mode` | `intent` | X 告知の方式。`intent` は remind が announce タスクに投稿画面の intent URL を添付する半自動・無料方式 |

:::note adapter の現状

`notifier.type` / `sns` は現状**宣言のみ**で、値を変えても動作は変わりません
（remind の Slack 通知・announce タスクへの X intent リンクが現在の実装です）。
`registry.type` は `ichiza watch` の adapter 選択に使われます（現状 `connpass` のみ。
それ以外の値はエラー）。discord / doorkeeper / X API など adapter の追加は
[Roadmap](../faq.md#roadmap) 項目です。

:::

## defaults

イベント作成時に `events/<slug>/event.yaml` の雛形へコピーされる値です。
**作成済みのイベントには影響しません**（event.yaml が SSoT。個別イベントの変更は
event.yaml を直接編集します）。

| キー | 説明 |
| --- | --- |
| `mode` | 既定の開催形態。`onsite` / `hybrid` / `online`。Run workflow のフォームで毎回上書き可能 |
| `venue` | 会場情報。`name` / `capacity` / `facilities`（リスト）/ `checkin`。**online のイベントでは雛形から省かれる** |
| `roles` | 運営役割のリスト。雛形では「役割名 → 担当者（空欄）」の割り当て表になる。ワンオペなら `[organizer]` で十分 |
| `streaming_role` | **hybrid / online のとき**だけ `roles` に追加される配信担当の役割名 |
| `streaming` | 配信設定。`platform` / `camera`（リスト）/ `youtube_url` / `audio`。**onsite のイベントでは雛形から省かれる** |
| `timetable` | タイムテーブルの雛形。各行は `start`（時刻文字列）/ `title` / `speaker`（省略可） |

## 募集ページ本文テンプレート（registry.templates）

connpass には書き込み API がないため、ichiza は「connpass の**コピーして新規作成** →
生成された本文をペースト → 公開」まで人間の作業を圧縮するアプローチを取ります。
本文は [`ichiza registry`](./commands.md#ichiza-registry) が `event.yaml`（SSoT）から生成します。

文面はコミュニティごとに違うため、テンプレートは運営リポジトリ側（ichiza-starter 由来）に
置き、`registry.templates` でパスを指定します。省略時は内蔵のニュートラルなデフォルトが
使われます。形式は Go の [text/template](https://pkg.go.dev/text/template) を使った
markdown / テキストです。

### page テンプレートの変数

| 変数 | 内容 |
| --- | --- |
| `{{.Title}}` / `{{.Slug}}` / `{{.Mode}}` | イベント基本情報 |
| `{{.Date}}` | `YYYY-MM-DD` |
| `{{.DateJP}}` | `2026年11月28日（土）`（parse 不能時は `.Date` のまま） |
| `{{.Venue}}` | 会場（`.Name` / `.Capacity` / `.Facilities` / `.Checkin`。ないときは nil） |
| `{{.Streaming}}` | 配信（`.Platform` / `.YouTubeURL` など。ないときは nil） |
| `{{.ConnpassURL}}` | event.yaml の `connpass_url` |
| `{{.TimetableTable}}` | タイムテーブルの markdown 表（合成済み） |
| `{{.SpeakersSection}}` | speaker テンプレートを全登壇者に適用して連結したもの |
| `{{.Timetable}}` / `{{.Speakers}}` | 生データ（`range` で独自レイアウトを組む場合） |

### speaker テンプレートの変数

| 変数 | 内容 |
| --- | --- |
| `{{.Handle}}` / `{{.SNS}}` / `{{.Bio}}` / `{{.SessionTitle}}` / `{{.Remote}}` | event.yaml の `speakers:` の生データ |
| `{{.DisplayName}}` | Handle + リモート登壇の注記 |
| `{{.DisplaySessionTitle}}` | SessionTitle（未定なら「タイトル未定」） |

## フル構成の例

ハイブリッド配信・複数役体制・チェックリスト付き Issue・定期開催サイクルを揃えた
勉強会のフル構成例が本体リポジトリの
[`examples/meetup/`](https://github.com/gr1m0h/ichiza/tree/main/examples/meetup) にあります。
コピーして自分のコミュニティに合わせて書き換えてください。
