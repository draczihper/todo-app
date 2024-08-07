import './styles.css';

const form = document.querySelector('[data-form]');
const lists = document.querySelector('[data-lists]');
const input = document.querySelector('[data-input]');


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
        <p>${item.todo}</p>
          <span class="remove" data-id=${item.id}>🗑️</span>
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
                e.target.parentElement.remove();
            }
            let btnId = e.target.dataset.id;
            //Remove todo from the array
            DOM.removeTodoFromArray(btnId);
        });
    }

    static removeTodoFromArray(id) {
        todoArr = todoArr.filter((item) => item.id !== +id)
        Storage.addToStorage(todoArr)
    }
}

window.addEventListener('DOMContentLoaded', () => {
    DOM.displayTodo();
    DOM.removeTodo()
});

