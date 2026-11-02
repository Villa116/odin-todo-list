import './style.css';
import { createTodo } from './todo.js';
import { createProject } from './project.js';
import { AppController } from './appController.js';

console.log('Current Projects:', AppController.getProjects());

AppController.addProject('Grocery List');
AppController.save();