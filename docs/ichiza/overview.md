---
sidebar_position: 1
title: 概要
---

# 概要

[ichiza](https://github.com/gr1m0h/ichiza) は、Go 製 CLI、GitHub composite actions、
任意の Web コックピットを提供する、技術勉強会向けの運営ツールです。

## 設計の中心

- **1 イベント = 1 Dashboard Issue**
- **最上位チェックボックス = タスクの完了状態**
- **event.yaml / tasks.yaml = イベントとタスクの設定**
- **GitHub = データの保存先**
- **Web = GitHub 上のデータを表示・更新する任意の画面**

タスクごとに Issue を作らないため、Issue 数と GitHub Projects のカード数を抑えられます。
Projects では Dashboard Issue をイベント単位のカードとして扱えます。

## 配布モデル

ichiza は CLI のほか、starter から導入できる GitHub Actions を提供します。

```text
gr1m0h/ichiza
├── actions/setup        # CLI インストール
├── actions/new          # イベント定義、Dashboard、募集ページ本文
├── actions/dashboard    # Dashboard Issue の close / reopen
├── actions/remind       # 期限リマインド
├── actions/registry     # 募集ページ本文の再生成
├── actions/watch        # connpass 申込数ウォッチ
├── actions/web-deploy   # Cloudflare Workers への Web デプロイ
└── web/                 # Hono + Cloudflare Workers の共通実装

gr1m0h/ichiza-starter
├── .github/workflows/ichiza-new.yml
├── .github/workflows/ichiza-dashboard.yml
├── .github/workflows/ichiza-remind.yml
├── .github/workflows/ichiza-registry.yml
├── .github/workflows/ichiza-watch.yml
├── .github/workflows/ichiza-web.yml
├── ichiza.yaml
└── templates/
```

運営リポジトリは `gr1m0h/ichiza/actions/*@v0` を参照します。
本体の互換リリースは `v0` タグの更新で配信されます。

## CLI 単体で使う

```bash
go install github.com/gr1m0h/ichiza@latest

ichiza new --slug tokyo-3 --title "Your Meetup #3" --date 2026-11-28 --dashboard
ichiza remind --notify stdout
ichiza registry --slug tokyo-3
ichiza watch --notify stdout
```

Dashboard の作成・照合には `gh` CLI と対象リポジトリへの権限が必要です。
詳しくは [コマンド](./commands.md) を参照してください。

## Web コックピット

Web は Hono + Cloudflare Workers の DB なし構成です。Cloudflare Access の認証済みメールと
`ichiza.yaml` の `members` を照合し、許可された運営者だけが利用できます。

GitHub API から Dashboard Issue を読み、開催日つきのイベント一覧、イベント詳細、My Page を表示します。
更新前に Issue の `updated_at` を確認し、画面を表示したあとに変更されていた場合は 409 を返します。
ただし、GitHub API の制約上、確認してから更新するまでの間に行われた同時編集は検出できません。

## セキュリティ

- composite actions の入力はシェルへ直接展開せず、環境変数経由で渡す
- slug と task ID は小文字英数字・ハイフンへ制限する
- Web は Access 設定や許可メンバーが不足している場合、アクセスを許可しない
- alpha 版の GitHub PAT は対象リポジトリ 1 件、Issues read/write、Metadata read-only に限定する
