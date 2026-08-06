---
sidebar_position: 1
title: 概要
---

# 概要

[ichiza](https://github.com/gr1m0h/ichiza) は Go 製の CLI と、それを包む
GitHub composite actions のセットです。

## 配布モデル（tfaction スタイル）

ichiza は「インストールする CLI」ではなく「導入する GitHub Actions プラットフォーム」です。

1. **starter テンプレートから運営リポジトリを作成**
   （`gh repo create <owner>/<repo> --template gr1m0h/ichiza-starter`）
2. 生成されたリポジトリには workflows / `ichiza.yaml` / 募集ページテンプレートが配線済み
3. イベント作成は GitHub UI の **Run workflow ボタン**から
   （スマホの GitHub アプリからも実行可能 — CLI 知識ゼロの共同運営者でも使える）
4. バージョンは `gr1m0h/ichiza/actions/*@v0` のタグ参照で固定し、Renovate で追従

```text
gr1m0h/ichiza          # 本体: CLI + composite actions
├── actions/setup      # CLI インストール
├── actions/new        # イベント作成（scaffold → PR + Issues + 募集ページ本文）
├── actions/remind     # 期限リマインド（cron）
├── actions/registry   # 募集ページ本文の再生成（event.yaml 更新時）
└── actions/watch      # 申込数ウォッチ（cron / connpass API v2）

gr1m0h/ichiza-starter  # コミュニティが複製するテンプレート（template repository）
├── .github/workflows/ichiza-new.yml      # イベント作成（Run workflow ボタン）
├── .github/workflows/ichiza-remind.yml   # 毎朝の期限チェック（cron）
├── .github/workflows/ichiza-registry.yml # 募集ページ本文の再生成（Run workflow ボタン）
├── .github/workflows/ichiza-watch.yml    # 毎朝の申込数ウォッチ（cron）
├── ichiza.yaml                           # コミュニティの既定値
├── templates/lifecycle.yaml              # タスク雛形
└── templates/registry/                   # 募集ページ本文のテンプレート
```

CLI として独立しているのは、GitHub Actions（composite action）からもローカルからも
同じロジックを呼ぶためです。本体側の改善はタグ付け → `v0` の付け替えで配信されるため、
運営リポジトリ側は何も変えずに追従できます（`@v0` 参照の利点）。

## CLI 単体で使う

ローカルで試したいときや、Actions を使わない運用でも CLI 単体で動きます。

```bash
go install github.com/gr1m0h/ichiza@latest

ichiza new --slug tokyo-3 --title "Your Meetup #3" --date 2026-11-28
ichiza new ... --issues         # gh CLI 経由で期限つき Issues も一括生成

ichiza remind [--notify slack]  # 期限超過 + 7日以内のタスクを表示 / Slack 通知
ichiza registry --slug tokyo-3  # 募集ページ本文を生成（connpass コピペ用）

export CONNPASS_API_KEY=...     # connpass サポートへの申請制
ichiza watch [--notify slack]   # 開催前イベントの申込数 / 補欠 / 受付状態
```

各コマンドの詳細は [コマンド](./commands.md) を参照してください。

## セキュリティ

- composite actions は inputs をシェルへ直接展開せず **env 経由で渡す**（script injection 対策）
- slug は `^[a-z0-9][a-z0-9-]*$` でバリデーション
