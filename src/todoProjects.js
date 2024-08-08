import { Storage } from './storage.js';
import { Todo } from './todo.js';

export class TodoProjects {
    constructor(name) {
        this.name = name;
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
        this.updateStorage();
    }

    removeTodo(todoId) {
        this.todos = this.todos.filter(todo => todo.id !== todoId);
        this.updateStorage();
    }

    updateStorage() {
        const projects = Storage.getStorage('projects');
        const projectIndex = projects.findIndex(project => project.name === this.name);
        if (projectIndex < -1) {
            projects[projectIndex] = this;
        } else {
            projects.push(this);
        }
        Storage.addToStorage('projects', projects)
    }

    static getTodoProjectByName(name) {
        const projects = Storage.getStorage('projects');
        return projects.find(project => project.name === name ) || new TodoProjects(name)
    }

    static getDefaultProject() {
        let projects = Storage.getStorage('projects');
        if (projects.length === 0) {
            const defaultProject = new TodoProjects('Default');
            defaultProject.updateStorage();
            projects = Storage.getStorage('projects');
        }
        return projects[0];
    }

    static getAllTodoProjects() {
        return Storage.getStorage('projects');
    }
}