import { createProject } from './project.js';
import { Storage } from './storage.js';

export const AppController = (() => {
  // Try loading from storage, otherwise start with a default "Inbox" project
  let projects = Storage.loadProjects() || [];
  let activeProject = null;

  const init = () => {
    if (projects.length === 0) {
      const defaultProject = createProject('Inbox');
      projects.push(defaultProject);
      activeProject = defaultProject;
      Storage.saveProjects(projects);
    } else {
      activeProject = projects[0]; // Set first project as active by default
    }
  };

  const getProjects = () => projects;

  const addProject = (name) => {
    const newProject = createProject(name);
    projects.push(newProject);
    Storage.saveProjects(projects);
    return newProject;
  };

  const deleteProject = (index) => {
    projects.splice(index, 1);
    Storage.saveProjects(projects);
  };

  const getActiveProject = () => activeProject;

  const setActiveProject = (index) => {
    if (projects[index]) {
      activeProject = projects[index];
    }
  };

  // Call save whenever a task is modified or added
  const save = () => {
    Storage.saveProjects(projects);
  };

  const addTodoToActiveProject = (todo) => {
    if (activeProject) {
      activeProject.addTodo(todo);
      save(); // Automatically save whenever a todo is added!
    }
  };

  init();

  return {
    getProjects,
    addProject,
    deleteProject,
    getActiveProject,
    setActiveProject,
    save,
    addTodoToActiveProject,
  };
})();