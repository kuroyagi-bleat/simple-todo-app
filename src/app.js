/**
 * Simple ToDo App Logic
 */

// --- Model: Task ---
class Task {
    constructor(text, id = null, completed = false, createdAt = null) {
        this.id = id || crypto.randomUUID();
        this.text = text;
        this.completed = completed;
        this.createdAt = createdAt || Date.now();
    }
}

// --- Model: User (v1.1) ---
class User {
    constructor(name) {
        this.name = name || "Guest";
    }
}

// --- Service: Storage ---
class Storage {
    static KEY_TASKS = 'todo-app-data';
    static KEY_USER = 'todo-app-user';

    static getTasks() {
        const tasks = localStorage.getItem(this.KEY_TASKS);
        return tasks ? JSON.parse(tasks) : [];
    }

    static saveTasks(tasks) {
        localStorage.setItem(this.KEY_TASKS, JSON.stringify(tasks));
    }

    static getUser() {
        const user = localStorage.getItem(this.KEY_USER);
        return user ? JSON.parse(user) : new User();
    }

    static saveUser(user) {
        localStorage.setItem(this.KEY_USER, JSON.stringify(user));
    }

    static addTask(task) {
        const tasks = this.getTasks();
        tasks.push(task);
        this.saveTasks(tasks);
    }

    static removeTask(id) {
        const tasks = this.getTasks();
        const updatedTasks = tasks.filter(t => t.id !== id);
        this.saveTasks(updatedTasks);
    }

    static toggleTask(id) {
        const tasks = this.getTasks();
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks(tasks);
        }
    }

    static exportData() {
        const data = {
            version: "1.1",
            exportedAt: Date.now(),
            user: this.getUser(),
            tasks: this.getTasks()
        };
        return JSON.stringify(data, null, 2);
    }

    static importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);

            // Validate basic structure
            if (!data.tasks || !Array.isArray(data.tasks)) {
                throw new Error("Invalid data format");
            }

            // User Import (Overwrite if present)
            if (data.user && data.user.name) {
                this.saveUser(new User(data.user.name));
            }

            // Task Import (Merge)
            const currentTasks = this.getTasks();
            const newTasks = data.tasks;

            let addedCount = 0;
            newTasks.forEach(t => {
                // Skip duplication by ID
                if (!currentTasks.some(ct => ct.id === t.id)) {
                    // Reconstruct to ensure valid data structure
                    const task = new Task(t.text, t.id, t.completed, t.createdAt);
                    currentTasks.push(task);
                    addedCount++;
                }
            });

            this.saveTasks(currentTasks);
            return { success: true, added: addedCount };

        } catch (e) {
            console.error("Import Error:", e);
            return { success: false, error: e.message };
        }
    }
}

// --- View/Controller: UI ---
class UI {
    static init() {
        this.renderUser();
        this.renderTasks();
        this.setupEventListeners();
    }

    static setupEventListeners() {
        const form = document.getElementById('task-form');
        const list = document.getElementById('task-list');
        const userNameDisplay = document.getElementById('user-name-display');
        const exportBtn = document.getElementById('export-btn');
        const importBtn = document.getElementById('import-btn');
        const importFile = document.getElementById('import-file');

        // Add Task
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('task-input');
            const text = input.value.trim();

            if (text) {
                const newTask = new Task(text);
                Storage.addTask(newTask);
                UI.addTaskToDOM(newTask);
                UI.checkEmptyState();
                input.value = '';
            }
        });

        // Task Actions (Delegation)
        list.addEventListener('click', (e) => {
            const target = e.target;
            const li = target.closest('.task-item');
            if (!li) return;

            const id = li.dataset.id;

            // Delete
            if (target.closest('.delete-btn')) {
                Storage.removeTask(id);
                li.remove();
                UI.checkEmptyState();
                return;
            }

            // Toggle
            if (target.classList.contains('task-checkbox')) {
                Storage.toggleTask(id);
                li.classList.toggle('completed');
            }
        });

        // Edit User Name
        userNameDisplay.addEventListener('click', () => {
            const curName = Storage.getUser().name;
            const newName = prompt("新しいユーザー名を入力してください:", curName);
            if (newName && newName.trim() !== "") {
                const user = new User(newName.trim());
                Storage.saveUser(user);
                UI.renderUser();
            }
        });

        // Export Data
        exportBtn.addEventListener('click', () => {
            const jsonStr = Storage.exportData();
            const blob = new Blob([jsonStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `todo-backup-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        // Import Data
        importBtn.addEventListener('click', () => {
            importFile.click();
        });

        importFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const result = Storage.importData(e.target.result);
                if (result.success) {
                    alert(`${result.added} 件のタスクを読み込みました。`);
                    UI.renderUser();
                    UI.renderTasks();
                } else {
                    alert("ファイルの読み込みに失敗しました。形式を確認してください。");
                }
                importFile.value = ''; // Reset
            };
            reader.readAsText(file);
        });
    }

    static renderUser() {
        const user = Storage.getUser();
        document.getElementById('user-name-display').textContent = user.name;
    }

    static baseTaskHTML(task) {
        return `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} aria-label="完了にする">
                <span class="task-text">${this.escapeHTML(task.text)}</span>
                <button class="delete-btn" aria-label="削除">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </li>
        `;
    }

    static escapeHTML(str) {
        return str.replace(/[&<>'"]/g,
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag]));
    }

    static addTaskToDOM(task) {
        const list = document.getElementById('task-list');
        list.insertAdjacentHTML('beforeend', this.baseTaskHTML(task));
    }

    static renderTasks() {
        const tasks = Storage.getTasks();
        const list = document.getElementById('task-list');
        list.innerHTML = tasks.map(task => this.baseTaskHTML(task)).join('');
        this.checkEmptyState();
    }

    static checkEmptyState() {
        const emptyState = document.getElementById('empty-state');
        const list = document.getElementById('task-list');
        if (list.children.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => UI.init());
