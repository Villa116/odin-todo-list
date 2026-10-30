import './style.css';
import { createTodo } from './todo.js';
import { createProject } from './project.js';
import { AppController } from './appController.js';

// 1. Check default state (Inbox project should exist)
console.log('All Projects:', AppController.getProjects());
console.log('Active Project:', AppController.getActiveProject().getName());

// 2. Add a task to the default (Inbox) project
const inboxTodo = createTodo('Buy groceries', 'Milk, eggs, coffee beans', '2026-11-05', 'Low');
AppController.getActiveProject().addTodo(inboxTodo);

// 3. Create a new custom project via the App Controller
const gymProject = AppController.addProject('Fitness Goals');
AppController.setActiveProject(1); // Switch to Fitness Goals

// 4. Add a task to the new active project
const gymTodo = createTodo('Leg Day', 'Squats, lunges, core work', '2026-11-02', 'High');
AppController.getActiveProject().addTodo(gymTodo);

// 5. Inspect the entire global state
console.log('Updated Projects List:', AppController.getProjects());