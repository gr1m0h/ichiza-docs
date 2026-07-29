---
sidebar_position: 1
slug: /intro
title: はじめに
---

# はじめに

**ichiza（一座）** は、勉強会・ミートアップの運営を「一座の公演」に見立てて、
イベント定義（`event.yaml`）から告知・リマインド・タスク管理を派生させる
**ワンオペ向け運営プラットフォーム**です。サーバー不要、GitHub Actions が唯一のランタイムです。

| プロジェクト | 役割 |
| --- | --- |
| [**ichiza**](./ichiza/overview.md) | 本体。Go 製 CLI（`new` / `remind` / `speakers`）+ composite actions（`setup` / `new` / `remind`）。 |
| [**ichiza-starter**](./ichiza-starter.md) | コミュニティが複製するテンプレートリポジトリ。workflows / Issue Form / 設定が配線済み。 |

## 思想

- **Single Source of Truth** — すべては `events/<スラグ>/event.yaml` から派生する
- **判断だけを人間に残す** — 記憶と定型作業はシステムへ、意思決定だけ運営へ
- **サーバーを持たない** — 運用対象を増やさないことが持続可能性

## 何が楽になるか

3 つのコマンドは、運営サイクルの別々の摩擦を消します。

| コマンド | 消える摩擦 |
| --- | --- |
| `ichiza new` | 毎回「やることリスト」を記憶から復元して手で Issue を切る作業（抜け漏れの主因） |
| `ichiza remind` | Issue を作っても見に行かないと忘れる問題。毎朝の Slack digest が「今週の締切」を運ぶ |
| `ichiza speakers` | 登壇者への聞き取り → イベントページ掲載文への転記という定型コピペ |

共同運営者は CLI を触らず、**Run workflow ボタンと Issue の消化だけ**で運営に参加できます
（スマホの GitHub アプリからも実行可能）。

まずは [Getting Started](./getting-started.md) で、運営リポジトリの作成から
最初の旗揚げまでをひととおり体験してください。
