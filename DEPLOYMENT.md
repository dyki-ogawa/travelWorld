# Netlify デプロイ手順（GitHub連携）

このガイドでは、GitHubリポジトリとNetlifyを連携して、自動デプロイを設定します。

## 前提条件

- ✅ GitHubリポジトリ: `dyki-ogawa/travelWorld`
- ✅ デプロイブランチ: `claude/session-011CUYhpeqMzn7JzffB9TNiP`
- ✅ ビルド済みコード（`dist` フォルダ）

## ステップ1: Netlifyアカウント作成

1. https://app.netlify.com にアクセス
2. "Sign up" → **"GitHub"** でサインアップ（推奨）
   - GitHub認証を使うと連携が簡単です

## ステップ2: 新しいサイトを作成

1. Netlifyダッシュボードで **"Add new site"** をクリック
2. **"Import an existing project"** を選択
3. **"Deploy with GitHub"** を選択

## ステップ3: リポジトリを選択

1. GitHubアカウントの認証を求められたら許可
2. リポジトリ一覧から **`dyki-ogawa/travelWorld`** を検索して選択
   - 見つからない場合: "Configure Netlify on GitHub" で権限を追加

## ステップ4: ビルド設定

以下の通り設定してください：

```
Branch to deploy: claude/session-011CUYhpeqMzn7JzffB9TNiP
Build command:    npm run build
Publish directory: dist
```

### 詳細設定（重要）

- **Branch to deploy**: `claude/session-011CUYhpeqMzn7JzffB9TNiP`
  - ドロップダウンから選択してください
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18 以上（自動検出されます）

すでに `netlify.toml` が設定されているので、これらの設定は自動的に読み込まれます。

## ステップ5: デプロイ開始

1. **"Deploy site"** ボタンをクリック
2. 数分待つとデプロイが完了します
3. 公開URL（例: `https://inspiring-name-123456.netlify.app`）が発行されます

## ステップ6: カスタムドメイン設定（任意）

1. サイトダッシュボードで **"Domain settings"** をクリック
2. **"Options"** → **"Edit site name"** で分かりやすい名前に変更
   - 例: `travel-log-demo` → `https://travel-log-demo.netlify.app`

## 自動デプロイの仕組み

設定完了後、以下の場合に**自動的に再デプロイ**されます：

- ✅ `claude/session-011CUYhpeqMzn7JzffB9TNiP` ブランチに `git push` したとき
- ✅ GitHubでプルリクエストをマージしたとき

変更を反映させたい場合は、単純に `git push` するだけです！

## トラブルシューティング

### ビルドが失敗する場合

1. Netlifyの "Deploys" タブでエラーログを確認
2. ビルドコマンドが `npm run build` になっているか確認
3. Node.jsバージョンが18以上か確認

### リポジトリが見つからない場合

1. https://github.com/settings/installations にアクセス
2. "Netlify" アプリの設定を開く
3. `dyki-ogawa/travelWorld` リポジトリへのアクセスを許可

## 環境変数の設定（必要な場合のみ）

現在のv0では環境変数は不要ですが、将来的に必要になった場合：

1. サイトダッシュボードで **"Site settings"** をクリック
2. **"Environment variables"** セクションで追加

## デプロイ状況の確認

- **Build ログ**: https://app.netlify.com/sites/[your-site-name]/deploys
- **公開URL**: デプロイ完了後に表示されます

## 次のステップ

デプロイが成功したら：

1. 公開URLをブラウザで開いて動作確認
2. 旅行記録を作成してみる
3. URLを友達と共有！

---

**ヒント**: Netlifyの無料プランで十分です。月100GBの帯域幅と300分のビルド時間が含まれています。
