---
sidebar_position: 1
slug: /intro
title: はじめに
---
# はじめに

**ichiza（一座）** は、技術勉強会の運営を GitHub 上で組み立て、続けやすくするためのツールです。
イベント定義から運営タスク、募集ページ本文、期限リマインドを生成し、
**1 イベント = 1 Dashboard Issue** に集約します。

| プロジェクト | 役割 |
| --- | --- |
| [**ichiza**](./ichiza/overview.md) | Go 製 CLI、GitHub Actions、任意の Web コックピットを提供する本体 |
| [**ichiza-starter**](./ichiza-starter.md) | コミュニティが複製する運営リポジトリの雛形。workflows、設定、テンプレートを配線済み |

## 何が楽になるか

| 機能 | 消える摩擦 |
| --- | --- |
| `ichiza new` | 毎回、過去の記憶から運営タスクを復元する作業。イベント定義と Dashboard Issue をまとめて生成する |
| Dashboard Issue | タスクごとに Issue を増やさず、イベントの状態とチェックリストを 1 画面に集約する |
| `ichiza remind` | Dashboard を見に行かないと期限を忘れる問題。Slack が期限超過・期限接近を担当者へ運ぶ |
| `ichiza registry` | `event.yaml` から connpass 掲載文へ転記する作業 |
| `ichiza watch` | connpass を毎日開く申込数チェック |
| Web コックピット | イベント一覧、My Page、期限状態、チェック操作を運営者向け画面にまとめる（任意・alpha） |

共同運営者は CLI を触らず、**Run workflow ボタンと Dashboard のチェック操作だけ**でも参加できます。
GitHub Projects を使う場合は、Dashboard Issue をイベント単位のカードとして置き、
詳細タスクは Issue 内のチェックボックスに保てます。

まずは [Getting Started](./getting-started.md) で、運営リポジトリの作成から
最初のイベント作成までを体験してください。
