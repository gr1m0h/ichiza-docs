---
sidebar_position: 3
title: 設定リファレンス
---

# 設定リファレンス（ichiza.yaml）

コミュニティ固有の既定値はすべて運営リポジトリ直下の `ichiza.yaml` で定義します。
**要件はすべて設定で表現し、コアはコミュニティ非依存に保つ**のが ichiza の設計原則です。

`ichiza.yaml` が存在しない場合はニュートラルな最小既定値（ゼロコンフィグ）で動作します。

## 例

```yaml
lifecycle: templates/lifecycle.yaml
events_dir: events
defaults:
  mode: hybrid # onsite | hybrid | online
  venue:
    capacity: 30
    facilities: [wifi, projector, hdmi]
  roles: [mc, reception, timekeeper, director, afterparty]
  streaming_role: streaming
  streaming:
    platform: streamyard
  timetable:
    - { start: "19:00", title: オープニング }
notifier:
  type: slack # slack | discord (adapter)
registry:
  type: connpass # connpass | doorkeeper | meetup (adapter)
sns:
  x:
    mode: intent # intent(半自動・無料) | api(従量課金・全自動)
```

## キー一覧

| キー | 既定値 | 説明 |
| --- | --- | --- |
| `lifecycle` | `templates/lifecycle.yaml` | [lifecycle テンプレート](./lifecycle.md)のパス |
| `events_dir` | `events` | イベント定義を置くディレクトリ |
| `defaults.mode` | `onsite` | 旗揚げ時の既定の開催形態。`hybrid` にすると配信系タスク（配信枠・リハ）が自動展開される |
| `defaults.venue` | — | 会場要件の雛形（capacity など）。`event.yaml` に既定値としてコピーされる |
| `defaults.roles` | `[organizer]` | 役割の一覧。`event.yaml` に空欄が生成され、担当決めの ToDo が可視化される |
| `defaults.streaming_role` | `streaming` | `mode` が hybrid / online のとき `roles` に追加される配信担当 |
| `defaults.streaming` | — | 配信設定の雛形（platform など） |
| `defaults.timetable` | — | タイムテーブルの雛形 |
| `notifier.type` | `slack` | 通知先 adapter |
| `registry.type` | `connpass` | イベント登録サービス adapter |
| `sns.x.mode` | `intent` | X 告知の方式。`intent` は remind が announce タスクに投稿画面の intent URL を添付する半自動・無料方式 |

:::note adapter の現状

adapter は差し替え可能な設計ですが、現在の実装は notifier = Slack webhook、
X 告知 = intent URL のみです。registry adapter（connpass API 連携）と
`sns.x.mode: api` は未実装で、[Roadmap](../faq.md#roadmap) に載っています。

:::

## フル構成の例

5 役体制 + 配信担当・チェックリスト付きライフサイクル・X intent 告知を揃えた
ハイブリッド勉強会のフル構成例が本体リポジトリの
[`examples/meetup/`](https://github.com/gr1m0h/ichiza/tree/main/examples/meetup) にあります。
コピーして自分のコミュニティに合わせて書き換えてください。
