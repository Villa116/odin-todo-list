import { createProject } from "./project.js";

export const AppController = (() => {
  let projects = [];
  let activeProject = null;

  // Initialize with a default project if none exist
  const init = () => {
    if (projects.length === 0) {
      const defaultProject = createProject('Inbox');
      projects.push(defaultProject);
      activeProject = defaultProject;
    }
  };

  const getProjects = () => projects;

  const addProject = (name) => {
    const newProject = createProject(name);
    projects.push(newProject);
    return newProject;
  };

  const deleteProject = (index) => {
    projects.splice(index, 1);
  };

  const getActiveProject = () => activeProject;

  const setActiveProject = (index) => {
    if (projects[index]) {
      activeProject = projects[index];
    }
  };

  init();

  return {
    getProjects,
    addProject,
    deleteProject,
    getActiveProject,
    setActiveProject,
  };
})();