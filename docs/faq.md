---
sidebar_position: 6
title: FAQ
---

# FAQ

## イベント作成 workflow は成功したのに PR がない

Settings → Actions → General → Workflow permissions の
**Allow GitHub Actions to create and approve pull requests** を有効にします。
無効でも job summary に手動作成リンクが表示されます。
[Getting Started](./getting-started.md#2-1-pr-作成許可)も参照してください。

## タスクの完了はどう表現する？

Dashboard Issue の管理対象となる最上位チェックボックスをチェックします。
タスク本文や Notes の入れ子チェックボックスは完了判定に含まれません。

全タスクを完了すると Dashboard Issue は自動で閉じます。チェックを戻すと再度開きます。
`tasks.yaml` は定義であり、完了状態は Dashboard が持ちます。

## Dashboard Issue が閉じない、または再度開かない

- `ichiza-dashboard.yml` に `issues: write` があるか
- Issue 本文の先頭に `ichiza-dashboard` marker があるか
- 管理対象の開始・終了 marker と task metadata を削除していないか
- workflow の実行ログで `dashboard reconcile` が成功しているか

を確認してください。

## リマインドが来ない

`SLACK_WEBHOOK_URL`、Dashboard の未完了チェック、workflow の実行ログを確認します。
期限超過または指定日数以内の未完了タスクがない日は通知しません。
Webhook 未設定なら starter の workflow はスキップします。

## 担当者へ Slack メンションされない

lifecycle の `assignee` が `ichiza.yaml` の `members.github` と一致し、
そのメンバーに `slack_user_id` があるか確認してください。

## Web を利用できる運営者は誰？

Cloudflare Access policy で許可され、かつ `ichiza.yaml` の `members.email` に
一致する人だけです。片方だけに登録しても利用できません。

## Web が 401 または 500 になる

- 対象 Worker が Cloudflare Access で保護されているか
- `CF_ACCESS_TEAM_DOMAIN` と `CF_ACCESS_AUD` が正しいか
- 認証メールが `members.email` にあるか
- 初回デプロイ後に Access Variables を設定して再デプロイしたか

を確認します。必要な設定が足りない場合、アクセスは許可されません。

## Web のチェック操作が 409 になる

ページを表示したあとに、GitHub 側で Issue が更新されています。
ページを再読み込みし、最新のチェック状態を確認してから再操作してください。

Web は送信前に更新の有無を確認します。ただし、GitHub API では更新時の条件を指定できないため、
確認してから更新するまでのわずかな間に行われた同時編集は検出できません。

## GitHub PAT は誰が発行する？

alpha 版では、運営リポジトリの所有者または代表者が fine-grained PAT を発行します。
対象はその運営リポジトリ 1 件、Issues は read/write、Metadata は read-only に限定し、
有効期限を設定します。Contents 権限は不要です。

個人用 PAT を複数人で使い回す運用ではなく、Worker の secret として保管します。
今後、GitHub App への移行を予定しています。

## 申込数の通知が来ない

`CONNPASS_API_KEY` と `event.yaml` の `connpass_url` を確認してください。
公開中イベントがなければ cron は動いても Slack 通知を送りません。

## 生成直後から期限超過になる

開催日が lifecycle の最長マイナスオフセットより近いためです。
同梱テンプレートの `-35d` なら、5週間以上前に作成します。

## `invalid slug` または task ID のエラーになる

slug と task ID は、小文字英数字で始まり、小文字英数字とハイフンだけを使います。
task ID はイベント内で重複できず、省略もできません。

## 登壇者を追加したら募集ページはどう更新する？

1. `events/<slug>/event.yaml` の `speakers` を更新
2. **ichiza registry** を実行
3. job summary の本文で connpass の本文全体を置き換える

タイムテーブルや会場の変更も同じ流れです。

## 共同運営者に CLI は必要？

不要です。GitHub の Run workflow、Dashboard Issue、または任意の Web コックピットから
運営できます。ローカル CLI は開発や手動実行に使います。

## 運営リポジトリは public でもいい？

動作しますが private を推奨します。会場の入館情報や連絡先など、運営限定情報を
Dashboard に書くことがあるためです。

## X の告知は自動投稿される？

いいえ。`announce` ラベルのタスクに X intent URL を添える半自動方式です。
投稿を確定するのは人間です。

## Roadmap {#roadmap}

| 項目 | 内容 |
| --- | --- |
| GitHub App | Web のリポジトリアクセスを個人 PAT から移行 |
| `ichiza draft` | 告知記事、開催記事、司会資料の下書き生成 |
| `ichiza kpt` | アンケート集計から KPT 下書きを生成 |
