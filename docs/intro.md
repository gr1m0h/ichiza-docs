---
sidebar_position: 1
slug: /intro
title: はじめに
---
# はじめに

**ichiza（一座）** は、技術勉強会の運営を GitHub 上で管理するためのツールです。
イベント定義から運営タスク、募集ページ本文、期限リマインドを生成し、
**1 イベント = 1 Dashboard Issue** に集約します。

| プロジェクト | 役割 |
| --- | --- |
| [**ichiza**](./ichiza/overview.md) | Go 製 CLI、GitHub Actions、任意の Web コックピットを提供する本体 |
| [**ichiza-starter**](./ichiza-starter.md) | 運営リポジトリの雛形。workflows、設定ファイル、テンプレートをあらかじめ用意 |

## できること

| 機能 | 用途 |
| --- | --- |
| `ichiza new` | イベントの定義ファイルと Dashboard Issue をまとめて作成する |
| Dashboard Issue | イベントの情報とチェックリストを 1 画面で管理する |
| `ichiza remind` | 期限を過ぎたタスクや期限が近いタスクを Slack で担当者へ通知する |
| `ichiza registry` | `event.yaml` から connpass 掲載文へ転記する作業 |
| `ichiza watch` | connpass の申込数を定期的に確認する |
| Web コックピット | イベント一覧、My Page、期限、チェック操作を表示する（任意・alpha） |

共同運営者は CLI を触らず、**Run workflow ボタンと Dashboard のチェック操作だけ**でも参加できます。
GitHub Projects を使う場合は、Dashboard Issue をイベント単位のカードとして置き、
詳細タスクは Issue 内のチェックボックスに保てます。

まずは [Getting Started](./getting-started.md) で、運営リポジトリの作成から
最初のイベント作成までを体験してください。
