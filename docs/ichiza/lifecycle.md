---
sidebar_position: 4
title: Lifecycle テンプレート
---

# Lifecycle テンプレート

タスクの期限は、開催日を基準にした日数または週数で指定します。`ichiza new` を実行すると、
期限を設定した `tasks.yaml` と Dashboard Issue のチェックリストが作成されます。

```yaml
tasks:
  - id: secure-venue
    title: 会場確定・確保
    due: -35d
    assignee: alice
    labels: [venue]
    modes: [onsite, hybrid]
    body: |
      確認項目:
      - [ ] 収容人数
      - [ ] Wi-Fi
  - { id: publish-page, title: イベントページ作成・公開, due: -30d, labels: [announce] }
  - { id: thank-you, title: お礼, due: 1d, labels: [followup] }
```

| フィールド | 必須 | 説明 |
| --- | --- | --- |
| `id` | はい | イベント内で一意な識別子。小文字英数字とハイフン |
| `title` | はい | Dashboard に表示するタスク名 |
| `due` | はい | `-30d`、`-2w`、`0d`、`3d` 形式の開催日オフセット |
| `assignee` | いいえ | 担当者の GitHub login。members と対応させる |
| `labels` | いいえ | タスク分類。`announce` は remind に X intent URL を付ける |
| `modes` | いいえ | `onsite` / `hybrid` / `online`。省略時は全 mode |
| `body` | いいえ | タスク直下へ表示する手順や補足 |

`id` は Dashboard の更新と Web のチェック操作に使うため必須です。
タイトルを変えても同じタスクとして扱えるよう、一度決めた ID は安定させてください。

`body` 内のチェックボックスは作業手順として使えますが、タスクの完了判定には含まれません。
完了判定に使うのは、最上位の管理対象チェックボックスだけです。
作成後にタスク定義を変える場合は、`events/<slug>/tasks.yaml` を PR で更新します。
main へマージすると、`dashboard sync` が同じ ID の完了状態と Notes を残したまま更新します。

## 同梱テンプレート

starter のテンプレートは、次のように全タスクへ ID を持たせています。

```yaml
tasks:
  - { id: secure-venue, title: 会場確定・確保, due: -35d, labels: [venue], modes: [onsite, hybrid] }
  - { id: publish-event-page, title: イベントページ作成・公開, due: -30d, labels: [announce] }
  - { id: confirm-speakers, title: 登壇者確定・掲載情報の依頼, due: -30d, labels: [speakers] }
  - { id: announce-event, title: SNS・コミュニティで告知, due: -21d, labels: [announce] }
  - { id: create-stream, title: 配信枠作成, due: -14d, labels: [streaming], modes: [hybrid, online] }
  - { id: check-attendees, title: 参加者数の最終確認, due: -7d, labels: [program] }
  - { id: rehearse-stream, title: 配信リハーサル, due: -3d, labels: [streaming], modes: [hybrid, online] }
  - { id: final-reminder, title: 直前リマインド, due: -3d, labels: [announce] }
  - { id: run-onsite, title: 設営・開催・撤収, due: 0d, labels: [ops], modes: [onsite, hybrid] }
  - { id: run-online, title: 開催（配信オペレーション）, due: 0d, labels: [ops], modes: [online] }
  - { id: thank-participants, title: お礼（登壇者・会場・参加者）, due: 1d, labels: [followup] }
  - { id: collect-survey, title: アンケート収集, due: 3d, labels: [followup] }
  - { id: retrospective, title: 振り返り, due: 10d, labels: [followup] }
```

:::caution 最長オフセットより前に作成する

最長オフセットが `-35d` なら、開催日の5週間以上前にイベントを作るのが目安です。
それより遅いと、生成時点で期限超過になるタスクがあります。

:::

## 用途別テンプレート

通常回、LT会、オンライン回などで `templates/` 配下に複数の lifecycle を置けます。
CLI は `--lifecycle`、composite action は `lifecycle` input で切り替えます。
starter のフォームから選ばせる場合は `ichiza-new.yml` に input を追加します。

## 振り返りをテンプレートへ反映する

- 「会場確保は遅い」→ `due` を前倒し
- 「担当が曖昧」→ `assignee` または役割分担を追加
- 「毎回忘れる確認がある」→ 新しい ID のタスクを追加
- 「手順に抜けがある」→ `body` を更新
- 「次回イベントの準備をタスクに入れたい」→ 正のオフセットで追加

テンプレート変更は次回の `ichiza new` から効きます。詳しくは
[運営サイクルガイド](../operations.md#運用中に設定を見直す)を参照してください。
