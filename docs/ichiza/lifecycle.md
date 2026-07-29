---
sidebar_position: 4
title: Lifecycle テンプレート
---

# Lifecycle テンプレート

タスクは**開催日からのオフセット**で定義します。`ichiza new` が開催日を受け取ると、
テンプレートを逆算して期限つきの `tasks.yaml` と GitHub Issues に展開します。

```yaml
tasks:
  - title: イベントページ作成・公開
    due: -30d
    labels: [announce]
  - title: 配信リハーサル
    due: -3d
    labels: [streaming]
    modes: [hybrid, online]
```

| フィールド | 説明 |
| --- | --- |
| `title` | タスク名。Issue のタイトルになる |
| `due` | 開催日からのオフセット。`-30d` = 30 日前、`3d` = 3 日後 |
| `labels` | Issue に付くラベル。`announce` は remind で X intent URL が添付される。**事前にリポジトリへの作成が必要**（[Getting Started](../getting-started.md#3-1-ラベルの事前作成必須)） |
| `modes` | 指定した開催形態（`onsite` / `hybrid` / `online`）のときだけ展開。省略時は常に展開 |

## 同梱テンプレート（最小構成）

starter に同梱される `templates/lifecycle.yaml` は、コミュニティ非依存のニュートラルな最小構成です。

```yaml
tasks:
  - { title: 会場確定・確保, due: -35d, labels: [venue], modes: [onsite, hybrid] }
  - { title: イベントページ作成・公開, due: -30d, labels: [announce] }
  - { title: 登壇者確定・掲載情報の依頼, due: -30d, labels: [speakers] }
  - { title: SNS・コミュニティで告知, due: -21d, labels: [announce] }
  - { title: 配信枠作成, due: -14d, labels: [streaming], modes: [hybrid, online] }
  - { title: 配信リハーサル, due: -3d, labels: [streaming], modes: [hybrid, online] }
  - { title: 参加者数の最終確認, due: -7d, labels: [program] }
  - { title: 直前リマインド, due: -3d, labels: [announce] }
  - { title: 設営・開催・撤収, due: 0d, labels: [ops], modes: [onsite, hybrid] }
  - { title: 開催（配信オペレーション）, due: 0d, labels: [ops], modes: [online] }
  - { title: お礼（登壇者・会場・参加者）, due: 1d, labels: [followup] }
  - { title: アンケート収集, due: 3d, labels: [followup] }
  - { title: 振り返り, due: 10d, labels: [followup] }
```

:::caution 旗揚げは最長オフセットより前に

このテンプレートの最長オフセットは `-35d` です。開催日が旗揚げ日から 5 週間未満だと、
生成された時点で期限切れのタスクが並びます。

:::

## テンプレートを育てる

lifecycle テンプレートは運営リポジトリ側のファイルなので、**振り返りの結果を直接反映**できます。

- 「会場確保は `-35d` では遅い」→ `due: -45d` に変更
- 当日の手順書を残したい → タスクにチェックリストを追加
- 定期開催のサイクルを回したい → 「次回イベントの旗揚げ」タスク（例: `+105d`）を末尾に置く

変更は次回の `ichiza new` から自動で効きます。詳しくは
[運営サイクルガイド](../operations.md#運用しながら機能を育てる) を参照してください。
