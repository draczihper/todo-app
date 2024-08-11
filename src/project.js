import './styles.css';

const todoContainer = document.querySelector('.todo-container')
const projectForm = document.querySelector('[data-project-form]');
const projects = document.querySelector('[data-projects]');
const projectInput = document.querySelector('[data-project-input]');
const deleteAllButton = document.querySelector('.delete-all-btn');

// Load saved todos in localStorage when app is loaded
window.addEventListener('DOMContentLoaded', () => {
    todoContainer.style.display = "none";
    DOM.displayProject();
    DOM.removeProject();
    DOM.editProject();
    DOM.deleteAll();
    DOM.hideBtn();
    console.log(projectArr.length);
    DOM.loadTodos();
});


// Store projects to localStorage ***DRY LATER***
class ProjectStorage {
    static addProjectToStorage(projectArr) {
        let projectStorage = localStorage.setItem('project', JSON.stringify(projectArr));
        return projectStorage;
    }

    static getProjectStorage() {
        let projectStorage = localStorage.getItem('project') === null ? [] : JSON.parse(localStorage.getItem('project'));
        return projectStorage;
    }
}

// Store projects 
let projectArr = ProjectStorage.getProjectStorage();


// On submit form
projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let projectId = Math.floor(Math.random() * 1000)
    const project = new Project(projectId, projectInput.value)
    projectArr = [...projectArr, project];
    DOM.displayProject();
    DOM.clearInput();
    // Remove todo from DOM
    DOM.removeProject();
    // Add todo to storage
    ProjectStorage.addProjectToStorage(projectArr);
    DOM.hideBtn();

});

// OOP Project
class Project {
    constructor(projectId, project){
        this.projectId = projectId;
        this.project = project;
    }
}

// DOM display 
class DOM {
    static displayProject() {
        let displayProject = projectArr.map(item => {
            return `
            <div class="project">
        <p class="project-text">${item.project}</p>
        <div class="icon">
        <span class="remove" data-project-id=${item.projectId}>🗑️</span>
        <span class="edit" data-project-id=${item.projectId}>✏️</span>
        </div>
      </div>
            `
        });
        projects.innerHTML = (displayProject).join(" ");
    }

    static clearInput() {
        projectInput.value = "";
    }

    static removeProject() {
        projects.addEventListener('click', (e) => {
            if(e.target.classList.contains('remove')) {
                e.target.parentElement.parentElement.remove();
                let btnId = e.target.dataset.projectId;
                //Remove todo from the array
                DOM.removeProjectFromArray(btnId);
                DOM.hideBtn();
            }
        });
    }

    static removeProjectFromArray(projectId) {
        projectArr = projectArr.filter((item) => item.projectId !== +projectId)
        ProjectStorage.addProjectToStorage(projectArr);
    }

    static editProject() {
        let iconChange = true;
        projects.addEventListener('click', (e) => {
            if(e.target.classList.contains('edit')) {
                let p = e.target.parentElement.parentElement.firstElementChild;
                const btnId = e.target.dataset.projectId;
                if (iconChange) {
                    p.setAttribute("contenteditable", "true");
                    p.focus();
                    e.target.textContent = "Save";
                    p.style.color = "blue";
                } else {
                    e.target.textContent = "✏️";
                    p.style.color = "black";
                    p.removeAttribute("contenteditable");
                    const newProjectArr = projectArr.findIndex((item) => item.projectId === +btnId);
                    projectArr[newProjectArr].project = p.textContent;
                    ProjectStorage.addProjectToStorage(projectArr);
                }
            }
            iconChange = !iconChange
        });
    }

    static deleteAll() {
        deleteAllButton.addEventListener('click', () => {
            projectArr.length = 0;
            localStorage.clear();
            DOM.displayProject();
            DOM.hideBtn();        
        });
    }

    static hideBtn() {
        if(projectArr.length <= 0) {
            deleteAllButton.style.display = "none";
        } else {
            deleteAllButton.style.display = "flex";
        }
    }

    static loadTodos() {
        projects.addEventListener('click', (e) => {
            // Load todos found in this clicked project and if there are no todos just keep showing the add todo button and add todos in this project if added 
        });
    }
    
}


