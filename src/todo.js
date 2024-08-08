export class Todo {
    constructor(id, title, description, duedate, priority, notes, checklist) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.duedate = duedate; 
        this.priority = priority;
        this.notes = notes;
        this.checklist = checklist;
    }
}