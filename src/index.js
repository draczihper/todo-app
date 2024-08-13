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

let selectedValue = "low";

selectPriority.addEventListener('change', function() {
     selectedValue = this.value;
});

/* inputCheckbox.addEventListener('change', function () {
    if(!this.checked) {
        this.checked = true;
    } else {
        this.checked = false;
    }
}); */

// Load todos
window.addEventListener('DOMContentLoaded', () => {
    todoContainer.style.display = "none";
    DOM.loadTodos();

    DOM.displayTodo();
    DOM.removeTodo();
    DOM.editTodo();
    DOM.deleteAll();
    DOM.hideBtn();
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
    let id = Math.floor(Math.random() * 1000000)
    const todo = new Todo(id, inputTitle.value, inputDueDate.value, selectedValue, inputDescription.value, inputNotes.value)
    todoArr = [...todoArr, todo];
    DOM.displayTodo();
    DOM.displayDetails();
    DOM.clearInput();
    // Remove todo from DOM
    DOM.removeTodo();
    // Add todo to storage
    TodoStorage.addTodosToStorage(currentProjectId, todoArr);
    DOM.hideBtn();

});

// OOP Todo
class Todo {
    constructor(id, todo, dueDate, priority, checklist, description, notes){
        this.id = id;
        this.todo = todo;
        this.dueDate = dueDate;
        this.priority = priority;
        this.description = description;
        this.notes = notes;
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

    static displayDetails() {
        const showDetailsBtn = document.querySelectorAll('.show-details');
        showDetailsBtn.forEach(item => {
            item.addEventListener('click', (e) => {
                console.log('clicked')
                if (e.target.classList.contains('show-details')) {
                    let displayDetails = todoArr.map(item => {
                        return `<div class="todo-details">
                        <p class="todo-text">${item.description}</p>
                        <p class="todo-text">${item.notes}</p>
                        <div class="icon">
        <span class="remove" data-id=${item.id}>🗑️</span>
        <span class="edit" data-id=${item.id}>✏️</span>
        </div>
        </div>
                        `
                    });
                    document.querySelector('.todo').appendChild(displayDetails);
                }
            });
        });
    }

    static displayTodo() {
        let displayTodo = todoArr.map((item) => {
        return `
            <div class="todo">
        <p class="todo-text">${item.todo}</p>
        <p class="todo-text">${item.dueDate}</p>
        <p class="todo-text">${item.priority}</p>
        <input
        type="checkbox"
        placeholder="" />
        <div class="icon">
        <span class="remove" data-id=${item.id}>🗑️</span>
        <span class="edit" data-id=${item.id}>✏️</span>
        <span class="show-details" data-id=${item.id}>Show Details</span>
        </div>
      </div>
            `
        });
        lists.innerHTML = (displayTodo).join(" ");
    }

    static clearInput() {
        inputTitle.value = "";
        inputDueDate.value = "";
    }

    static removeTodo() {
        lists.addEventListener('click', (e) => {
            if(e.target.classList.contains('remove')) {
                e.target.parentElement.parentElement.remove();
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
                let p = e.target.parentElement.parentElement.firstElementChild;
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

