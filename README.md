# Taskly 本番環境リボン

Taskly と企業ガイダンスの画面右上に、赤い「本番環境」のたすき掛けを表示する Chrome 拡張機能です。Manifest V3 のコンテンツスクリプトのみで動作し、追加の権限や通信はありません。

| 対象 | URL |
| --- | --- |
| Taskly | https://taskly.iy0306.com/ |
| 企業ガイダンス | https://nnct-corp-guidance-2026.taskly.iy0306.com/ |

## インストール

1. このリポジトリをローカルに clone する。
2. Chrome の `chrome://extensions` を開き、右上の「デベロッパーモード」を有効にする。
3. 「パッケージ化されていない拡張機能を読み込む」を押し、このリポジトリのフォルダを選ぶ。
4. 上記の対象サイトを再読み込みする。

画面の右上に「本番環境」が表示されます。別のドメインや HTTP のページには表示されません。拡張機能を更新した場合は `chrome://extensions` で拡張機能を再読み込みし、サイトも再読み込みしてください。

## 検証

Node.js 24 で、対象の両サイトへの表示、対象外の origin の拒否、重複表示の防止を確認します。GitHub Actions もすべてのPRとmainへの変更で同じテストを実行し、スクリプトの行・関数カバレッジ80%以上を要求します。

```sh
node --test --experimental-test-coverage \
  --test-coverage-include=production-ribbon.js \
  --test-coverage-lines=80 --test-coverage-functions=80 test/*.test.js
```
