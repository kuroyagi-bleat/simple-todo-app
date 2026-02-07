# Test Project Configuration

このファイルは、プロジェクト固有の設定を定義するローカル設定ファイルです。
`~/.gemini/GEMINI.md` のグローバル設定を継承しつつ、以下のローカルルールを適用します。

## プロジェクト概要
Antigravityの標準開発フロー（要件定義 -> 設計 -> 実装 -> テスト）を実践するためのサンプルプロジェクトです。
簡単な「ToDoリストアプリ」を作成しながら、各工程のアーティファクト作成をテストします。

## 技術スタック (Tech Stack)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (フレームワークなしでシンプルに)
- **Testing**: Jest (Unit Test)

## ディレクトリ構成
- `src/`: ソースコード
- `tests/`: テストコード
- `docs/`: ドキュメント (requirements.md, design.md 等)

## 開発フロー
1. `docs/requirements.md` で要件を定義 (`[要件定義書](docs/requirements.md)`)
2. `docs/design.md` で設計
3. `implementation_plan.md` で実装計画
4. 実装
5. `tests/` にテスト作成・実行
