import { createProject } from './project.js';
import { createTodo } from './todo.js';

const STORAGE_KEY = 'odin_todo_projects';

export const Storage = (() => {
  const saveProjects = (projects) => {
    const dataToSave = projects.map(project => ({
      name: project.getName(),
      todos: project.getTodos().map(todo => ({
        title: todo.title,
        description: todo.description,
        dueDate: todo.dueDate,
        priority: todo.priority,
        notes: todo.notes,
        completed: todo.getStatus(),
      })),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  };

  const loadProjects = () => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) return null;

    try {
      const parsedData = JSON.parse(storedData);
      // Rehydrate plain objects back into full factory instances
      return parsedData.map(projData => {
        const project = createProject(projData.name);
        projData.todos.forEach(todoData => {
          const todo = createTodo(
            todoData.title,
            todoData.description,
            todoData.dueDate,
            todoData.priority,
            todoData.notes,
            todoData.completed // Pass the saved completion state
          );
          project.addTodo(todo);
        });
        return project;
      });
    } catch (e) {
      console.error('Error loading from localStorage:', e);
      return null;
    }
  };

  return {
    saveProjects,
    loadProjects,
  };
})();