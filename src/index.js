import './styles.css';
import projectArr from './project.js';

const todoContainer = document.querySelector('.todo-container');
const todoForm = document.querySelector('[data-todo-form]');
const lists = document.querySelector('[data-lists]');
const inputTitle = document.querySelector('[data-input-title]');
const inputDueDate = document.querySelector('[data-input-due-date]');
const selectPriority = document.querySelector('[data-select-priority]');
const inputCheckbox = document.querySelector('[data-input-checklist]');
const inputDescription = document.querySelector('[data-input-description]');
const inputNotes = document.querySelector('[data-input-notes]');
const deleteAllButton = document.querySelector('.delete-all-btn');

// Load todos
window.addEventListener('DOMContentLoaded', () => {
    todoContainer.style.display = "none";
    DOM.loadTodos();
    DOM.displayTodo();
    DOM.removeTodo();
    DOM.editTodo();
    DOM.deleteAll();
    DOM.hideBtn();
    DOM.addCheckboxListeners();
});

// Store todos to localstorage
class TodoStorage {
    static addTodosToStorage(projectId, todos) {
        let storage = localStorage.setItem(`todos-${projectId}`, JSON.stringify(todos));
        return storage;
    }
    
    static getTodosFromStorage(projectId) {
        let storage = localStorage.getItem(`todos-${projectId}`) === null ? [] : JSON.parse(localStorage.getItem(`todos-${projectId}`));
        return storage;
    }
}

// Store todos
let currentProjectId = null;
let todoArr = TodoStorage.getTodosFromStorage(currentProjectId);

// On submit form
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentProjectId) return;
    let id = Math.floor(Math.random() * 1000000);

    const selectedPriority = selectPriority.value;
    const isChecklist = inputCheckbox.checked;

    const todo = new Todo(id, inputTitle.value, inputDueDate.value, selectedPriority, inputDescription.value, inputNotes.value, false, isChecklist)
    todoArr = [...todoArr, todo];
    DOM.displayTodo();
    DOM.clearInput();
    // Remove todo from DOM
    DOM.removeTodo();
    // Add todo to storage
    TodoStorage.addTodosToStorage(currentProjectId, todoArr);
    DOM.hideBtn();

});

// OOP Todo
class Todo {
    constructor(id, todo, dueDate, priority, description, notes, completed = false, checklist = false){
        this.id = id;
        this.todo = todo;
        this.dueDate = dueDate;
        this.priority = priority;
        this.description = description;
        this.notes = notes;
        this.completed = completed;
        this.checklist = checklist;
    }
}

// DOM display 
class DOM {
    static loadTodos() {
        const showTodoBtn = document.querySelectorAll('.show');
        console.log(projectArr);
        showTodoBtn.forEach((item) => {
            item.addEventListener('click', (e) => {
                if (e.target.classList.contains('show')) {
                    currentProjectId = e.target.dataset.projectId;
                    todoArr = TodoStorage.getTodosFromStorage(currentProjectId);
                    this.displayTodo();
                    todoContainer.style.display = "block";
                    this.hideBtn();
                }
            });
        });
    }

    static getPriorityColor(priority) {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'red';
            case 'medium':
                return 'orange';
            case 'low':
                return 'green';
            default:
                return 'black';
        }
    }

    static displayTodo() {
        let displayTodo = todoArr.map((item) => {
            console.log("Todo Item:", item)
            const priorityColor = this.getPriorityColor(item.priority);
        return `
            <div class="todo">
            <div class="todo-text-container">
            <div class="text-container">
        <p class="todo-text">${item.todo}</p>
        <p class="todo-text">${item.dueDate}</p>
        <p class="todo-text" style="color: ${priorityColor};">${item.priority}</p>
        <input
        type="checkbox"
         ${item.checklist ? 'checked' : ''}
        data-id=${item.id} 
        class="todo-checkbox"/>
        </div>
        <div class="icon">
        <span class="remove" data-id=${item.id}>🗑️</span>
        <span class="edit" data-id=${item.id}>✏️</span>
        <span class="show-details" data-id=${item.id}>Show Details</span>
        </div>
        </div>
        <div class="todo-details" style="display: none;">
        <p class="todo-text">Description: ${item.description || "No description"}</p>
        <p class="todo-text">Notes: ${item.notes || "No notes"}</p>
        </div>
        </div>
            `
        });
        lists.innerHTML = (displayTodo).join(" ");
        this.addShowDetailsListeners()
        this.addCheckboxListeners();
    }

    static addCheckboxListeners() {
    const checkboxes = document.querySelectorAll('.todo-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const todoId = parseInt(e.target.dataset.id);
            const todo = todoArr.find(item => item.id === todoId);
            if (todo) {
                todo.checklist = e.target.checked;
                TodoStorage.addTodosToStorage(currentProjectId, todoArr);
            }
        });
    });
}

    static addShowDetailsListeners() {
        const showDetailsBtn = document.querySelectorAll('.show-details');
        showDetailsBtn.forEach(item => {
            item.addEventListener('click', (e) => {
                const todoElement = e.target.closest('.todo');
                const detailsElement = todoElement.querySelector('.todo-details');
                if (detailsElement.style.display === "none") {
                    detailsElement.style.display = "block";
                    e.target.textContent = "Hide details";
                } else {
                    detailsElement.style.display = "none";
                    e.target.textContent = "Show details";
                }
            })
        })
    }

    static clearInput() {
        inputTitle.value = "";
        inputDueDate.value = "";
        inputDescription.value = "";
        inputNotes.value = "";
        inputCheckbox.checked = false;
    }

    static removeTodo() {
        lists.addEventListener('click', (e) => {
            if(e.target.classList.contains('remove')) {
                e.target.parentElement.parentElement.parentElement.remove();
                let btnId = e.target.dataset.id;
                //Remove todo from the array
                DOM.removeTodoFromArray(btnId);
                DOM.hideBtn();
            }
        });
    }

    static removeTodoFromArray(id) {
        todoArr = todoArr.filter((item) => item.id !== +id)
        TodoStorage.addTodosToStorage(currentProjectId, todoArr)
    }

    static editTodo() {
        let iconChange = true;
        lists.addEventListener('click', (e) => {
            if(e.target.classList.contains('edit')) {
                let p = e.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.firstElementChild;
                const btnId = e.target.dataset.id;
                if (iconChange) {
                    p.setAttribute("contenteditable", "true");
                    p.focus();
                    e.target.textContent = "Save";
                    p.style.color = "blue";
                } else {
                    e.target.textContent = "✏️";
                    p.style.color = "black";
                    p.removeAttribute("contenteditable");
                    const newTodoArr = todoArr.findIndex((item) => item.id === +btnId);
                    todoArr[newTodoArr].todo = p.textContent;
                    TodoStorage.addTodosToStorage(currentProjectId, todoArr);
                }
            }
            iconChange = !iconChange
        });
    }

    static deleteAll() {
        deleteAllButton.addEventListener('click', () => {
            todoArr.length = 0;
            localStorage.removeItem(`todos-${currentProjectId}`);
            DOM.displayTodo();
            DOM.hideBtn();        
        });
    }

    static hideBtn() {
        if(todoArr.length <= 0) {
            deleteAllButton.style.display = "none";
        } else {
            deleteAllButton.style.display = "flex";
        }
    }


    
}

