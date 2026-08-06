---
sidebar_position: 6
title: FAQ
---

# FAQ

## イベント作成 workflow は成功したのに PR がない

Settings → Actions → General → Workflow permissions の
**「Allow GitHub Actions to create and approve pull requests」が OFF** になっています。
workflow は失敗せず、job summary に PR の手動作成リンク（タイトル・本文入力済み）が
出ています。恒久対応は権限を ON にすることです
（[Getting Started](./getting-started.md#2-1-actions-の-pr-作成許可推奨)）。

## リマインドが来ない

`SLACK_WEBHOOK_URL` secret を確認してください。対象タスクがゼロの日は通知なしです。

## 申込数の通知が来ない

`CONNPASS_API_KEY` secret と、対象イベントの `event.yaml` に `connpass_url` が
入っているかを確認してください（watch の実行ログに状況が出ます）。
公開中のイベントが 1 件もない間は、cron は動いていても Slack 通知は自動で休止します。

## 生成された時点で期限切れのタスクが並ぶ

開催日が近すぎます。同梱 lifecycle の最長オフセットは `-35d`（会場確定・確保）なので、
**開催日はイベント作成日から 5 週間以上先**に置いてください。
自分の lifecycle をカスタマイズしている場合は、その最長オフセットが基準です。

## タスクの完了はどう表現する？

**終わったタスクは Issue を閉じるだけ**です。remind が close 済み Issue を gh 経由で
照合し、翌朝のリマインドから外れます。`tasks.yaml` は「何をいつまでに」の定義のみで
完了状態を持ちません。

注意: Issue のタイトルを変更すると照合できなくなります。やらないと決めたタスクは、
Issue を閉じるか `events/<slug>/tasks.yaml` の該当行を削除してコミットしてください。

## `invalid slug` で失敗する

slug は小文字英数字とハイフンのみです（例: `tokyo-1`）。

## 登壇者を追加したら募集ページはどう更新する？

1. `events/<slug>/event.yaml` の `speakers:` に登壇者情報を追記
2. Actions タブ → **ichiza registry** → Run workflow（slug を入力）
3. summary に出た本文を、公開済みの connpass ページの本文に**まるごと貼り直す**

タイムテーブルや会場の変更も同じ流れです（[運営サイクルガイド](./operations.md)）。

## 共同運営者に CLI のインストールは必要？

不要です。運営リポジトリの Write 権限があれば、
**Run workflow ボタン（イベント作成）と Issue の消化**だけで運営に参加できます。
スマホの GitHub アプリからも実行可能です。CLI は Actions とローカルで
同じロジックを呼ぶための実装形態にすぎません。

## 運営リポジトリは public でもいい？

動作はしますが **private を推奨**します。タスク Issue に会場の入館情報や
登壇者の連絡先といった非公開情報が載ることがあるためです。

## X の告知は自動投稿される？

いいえ。`sns.x.mode: intent` は**半自動・無料**の方式で、remind の通知に
X の投稿画面を開く intent URL（本文入り）が添付されます。投稿ボタンを押すのは人間です。
API 経由の全自動投稿（`mode: api`）は未実装です。

## Roadmap {#roadmap}

未実装の機能のみ載せています。

| 項目 | 内容 |
| --- | --- |
| `ichiza draft` | 告知記事・開催記事・司会資料の下書き生成 |
| `ichiza kpt` | アンケート集計 → KPT 下書き |
