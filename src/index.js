import './styles.css';

const form = document.querySelector('[data-form]');
const lists = document.querySelector('[data-lists]');
const input = document.querySelector('[data-input]');
const deleteAllButton = document.querySelector('.delete-all-btn');

// Store todos to localstorage
class Storage {
    static addToStorage(todoArr) {
        let storage = localStorage.setItem('todo', JSON.stringify(todoArr));
        return storage;
    }
    
    static getStorage() {
        let storage = localStorage.getItem('todo') === null ? [] : JSON.parse(localStorage.getItem('todo'));
        return storage;
    }
}

// Store todos
let todoArr = Storage.getStorage();

// On submit form
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let id = Math.floor(Math.random() * 1000000)
    const todo = new Todo(id, input.value)
    todoArr = [...todoArr, todo];
    DOM.displayTodo();
    DOM.clearInput();
    // Remove todo from DOM
    DOM.removeTodo();
    // Add todo to storage
    Storage.addToStorage(todoArr);
    DOM.hideBtn();

});

// OOP Todo
class Todo {
    constructor(id, todo){
        this.id = id;
        this.todo = todo;
    }
}

// DOM display 
class DOM {
    static displayTodo() {
        let displayTodo = todoArr.map(item => {
            return `
            <div class="todo">
        <p class="todo-text">${item.todo}</p>
        <div class="icon">
        <span class="remove" data-id=${item.id}>🗑️</span>
        <span class="edit" data-id=${item.id}>✏️</span>
        </div>
      </div>
            `
        });
        lists.innerHTML = (displayTodo).join(" ");
    }

    static clearInput() {
        input.value = "";
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
        Storage.addToStorage(todoArr)
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
                    Storage.addToStorage(todoArr);
                }
            }
            iconChange = !iconChange
        });
    }

    static deleteAll() {
        deleteAllButton.addEventListener('click', () => {
            todoArr.length = 0;
            localStorage.clear();
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

// Load saved todos in localStorage when app is loaded
window.addEventListener('DOMContentLoaded', () => {
    DOM.displayTodo();
    // Remove from the DOM
    DOM.removeTodo();

    DOM.editTodo();

    DOM.deleteAll();

    DOM.hideBtn();
});