# ToDoアプリ 設計書

<!-- Approved -->
> **Approved by**: wakaumekenji
> **Date**: 2026-02-07
> **Phase**: Design (v1.1)

## 1. 概要
シンプルでモダンなToDoリストアプリケーションの設計。
Vanilla JavaScriptを使用し、データはLocalStorageで永続化する。

## 2. データ構造 (Data Structure)

### Task Object
```json
{
  "id": "uuid-v4-string",    // 一意なID
  "text": "タスクの内容",      // ユーザー入力
  "completed": false,        // 完了フラグ
  "createdAt": 1672531200000 // 作成日時 (timestamp)
}
```

### User Object (v1.1)
```json
{
  "name": "ユーザー名"
}
```

### LocalStorage Key
- `todo-app-data`: Task Objectの配列をJSON文字列として保存。
- `todo-app-user`: User ObjectをJSON文字列として保存。 (v1.1)

## 3. UI/UX設計

### 画面構成
- **ヘッダー**:
    - アプリタイトル ("Simple ToDo")
    - **[v1.1] ユーザー名表示**: クリックで編集可能なテキスト ("Hello, Guest")。
- **入力エリア**: テキストボックス + 追加ボタン
- **タスクリスト**:
    - 未完了タスク
    - 完了タスク (スタイル: グレーアウト + 取り消し線)
- **各タスクの要素**:
    - チェックボックス (完了切り替え)
    - テキスト
    - 削除ボタン (ゴミ箱アイコン)
- **フッター (v1.1)**:
    - **エクスポート**: 「JSON形式で保存」ボタン
    - **インポート**: 「データ読み込み」ボタン（ファイル選択ダイアログ）

### デザイン方針
- **カラーパレット**:
    - アクセント: Blue-500 (#3B82F6)
    - 背景: Gray-50 (#F9FAFB)
    - テキスト: Gray-900 (#111827)
- **フォント**: Inter, sans-serif

## 4. モジュール構成 (Modules)

- `index.html`: 構造定義
- `style.css`: スタイル定義
- `app.js`: メインロジック
    - `Storage` クラス: LocalStorage操作 (ユーザー名、Export/Import対応)
    - `Task` クラス: タスクデータ管理
    - `User` クラス: ユーザー情報管理 (v1.1)
    - `UI` クラス: DOM操作、イベントハンドリング
        - ユーザー名編集機能
        - ファイル読み込み/書き出し処理

## 5. データ仕様 (JSON Export Format)
```json
{
  "version": "1.1",
  "exportedAt": 1672531200000,
  "user": {
    "name": "User Name"
  },
  "tasks": [
    { ... } // Task Objects
  ]
}
```
