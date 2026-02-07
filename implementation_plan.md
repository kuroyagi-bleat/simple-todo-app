# ToDoアプリ 実装計画書 (v1.1)

<!-- Approved -->
> **Approved by**: wakaumekenji
> **Date**: 2026-02-07
> **Phase**: Plan (v1.1)

## 概要 (Goal Description)
`docs/requirements.md` (v1.1) および `docs/design.md` (v1.1) に基づき、以下の機能を追加します。
1.  **ユーザー設定**: 利用者の名前を登録・変更・表示する機能。
2.  **データ管理**: タスクのJSON形式でのエクスポート・インポート機能。

## ユーザーレビュー事項 (User Review Required)
> [!NOTE]
> 既存の `src/` 配下のファイルを直接修正します。
> インポート機能は、現在のタスクリストを「上書き」するのではなく「結合（マージ）」する仕様とします（ID重複時はスキップ）。

## 変更内容 (Proposed Changes)

### フロントエンド (Frontend)

#### [MODIFY] [index.html](file:///Users/wakaumekenji/Desktop/work/test-project/src/index.html)
- **Header**: ユーザー名表示領域（`<span id="user-name-display">`）を追加。
- **Footer**: エクスポートボタン、インポートボタン、非表示のファイル入力要素を追加。

#### [MODIFY] [style.css](file:///Users/wakaumekenji/Desktop/work/test-project/src/style.css)
- ユーザー名表示エリアのスタイル（クリッカブルな見た目）を追加。
- フッターのボタンスタイル（セカンダリアクション用）を追加。

#### [MODIFY] [app.js](file:///Users/wakaumekenji/Desktop/work/test-project/src/app.js)
- **User Class**: `User` クラスを追加。
- **Storage Class**:
    - `getUser()`, `saveUser()` メソッドを追加。
    - `importData(jsonData)` メソッドを追加（バリデーション含む）。
- **UI Class**:
    - `renderUser()`: ユーザー名の表示更新。
    - `setupEventListeners()`:
        - ユーザー名クリック時の編集プロンプト。
        - エクスポートボタンクリック時のJSONダウンロード処理。
        - インポートボタンクリック時のファイル読み込み処理。

## 検証計画 (Verification Plan)

### 手動検証 (Manual Verification)
1.  **ユーザー名機能**
    - 初期表示が "Guest" であること。
    - クリックして名前を変更でき、リロード後も維持されること。
2.  **エクスポート機能**
    - ボタンクリックで `todo-data.json` がダウンロードされ、中身が正しいJSON形式であること。
3.  **インポート機能**
    - エクスポートしたファイルを読み込み、タスクが復元（または追加）されること。
    - 不正なファイル（画像など）を読み込んだ際にエラーにならないこと（コンソールログ等）。
