---
sidebar_position: 4
title: Lifecycle テンプレート
---

# Lifecycle テンプレート

タスクは**開催日からのオフセット**で定義します。`ichiza new` が開催日を受け取ると、
テンプレートを逆算して期限つきの `tasks.yaml` と GitHub Issues に展開します。

```yaml
tasks:
  - title: 会場確定・確保
    due: -35d
    labels: [venue]
    modes: [onsite, hybrid]
    body: |
      確認項目:
      - [ ] 収容人数
      - [ ] Wi-Fi
  - { title: イベントページ作成・公開, due: -30d, labels: [announce] }
  - { title: お礼, due: 1d, labels: [followup] }
```

| フィールド | 説明 |
| --- | --- |
| `title` | タスク名。Issue は `【〜MM/DD】タスク名` の形式で作られる |
| `due` | 開催日からのオフセット。`-30d`（30 日前）/ `-2w`（2 週間前）/ `0d`（当日）/ `3d`（3 日後）。`d` = 日、`w` = 週 |
| `labels` | Issue に付くラベル。**`announce` は特別扱い**: リマインド通知に X の投稿画面を開くリンクが付く。リポジトリに存在しないラベルは Issue 作成時に自動作成される |
| `modes` | 展開条件。指定した開催形態（`onsite` / `hybrid` / `online`）のときだけタスク化される。省略時は常に展開 |
| `body` | Issue 本文（markdown・省略可）。当日チェックリストや確認項目を書いておくと Issue がそのまま作業手順書になる |

展開されたタスクは期限順にソートされ、1 イベント = 1 マイルストーンで Issues 化されます。

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

:::caution イベント作成は最長オフセットより前に

このテンプレートの最長オフセットは `-35d` です。開催日がイベント作成日から 5 週間未満だと、
生成された時点で期限切れのタスクが並びます。
**最長オフセットがイベント作成の締切を決めます。**

:::

## 用途別に複数置く

lifecycle は設定（`ichiza.yaml`）ではなくイベント作成のたびに展開される**テンプレート**なので、
`templates/` 配下に用途別に複数置けます（例: 通常回と LT 大会）。
切り替えは `ichiza new --lifecycle templates/lt-night.yaml`。GitHub Actions では
composite action（`actions/new`）に `lifecycle` input がありますが、starter の
`ichiza-new.yml` はフォーム入力に含めていないため、使う場合は workflow に
input を追加して `actions/new` へ渡してください。

## テンプレートを育てる

lifecycle テンプレートは運営リポジトリ側のファイルなので、**振り返りの結果を直接反映**できます。

- 「会場確保は `-35d` では遅い」→ `due: -45d` に変更
- 当日の手順書を残したい → `body` にチェックリストを追加
- 定期開催のサイクルを回したい → 「次回イベントの作成」タスク（例: `due: 105d` の
  正のオフセット）を末尾に置くと、開催サイクル自体がリマインドに乗る

変更は次回の `ichiza new` から自動で効きます。詳しくは
[運営サイクルガイド](../operations.md#運用しながら機能を育てる) を参照してください。
