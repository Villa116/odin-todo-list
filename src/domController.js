import { AppController } from './appController.js';
import { createTodo } from './todo.js';

export const DOMController = (() => {
  const renderProjects = () => {
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '';

    const projects = AppController.getProjects();
    const activeProject = AppController.getActiveProject();

    projects.forEach((project, index) => {
      const li = document.createElement('li');
      li.textContent = project.getName();
      li.classList.add('project-item');

      if (project === activeProject) {
        li.classList.add('active');
      }

      li.addEventListener('click', () => {
        AppController.setActiveProject(index);
        render();
      });

      projectsList.appendChild(li);
    });
  };

  // Inside src/domController.js (replace your renderTodos function)

  const renderTodos = () => {
    const todosContainer = document.getElementById('todos-container');
    const projectTitle = document.getElementById('project-title');
    todosContainer.innerHTML = '';

    const activeProject = AppController.getActiveProject();
    projectTitle.textContent = activeProject.getName();

    const todos = activeProject.getTodos();

    todos.forEach((todo, index) => {
      const card = document.createElement('div');
      card.classList.add('todo-card');
      if (todo.getStatus()) card.classList.add('completed');

      card.innerHTML = `
        <div class="todo-main">
          <input type="checkbox" ${todo.getStatus() ? 'checked' : ''}>
          <span class="todo-title">${todo.title}</span>
          <span class="due-date">${todo.dueDate}</span>
          <span class="priority ${todo.priority.toLowerCase()}">${todo.priority}</span>
          <button class="expand-btn">▼</button>
        </div>
        <div class="todo-details" style="display: none;">
          <p><strong>Description:</strong> ${todo.description || 'None'}</p>
          <p><strong>Notes:</strong> ${todo.notes || 'None'}</p>
          <div class="todo-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn" data-index="${index}">Delete</button>
          </div>
        </div>
      `;

      // Checkbox listener
      const checkbox = card.querySelector('input[type="checkbox"]');
      checkbox.addEventListener('change', (e) => {
        e.stopPropagation();
        todo.toggleCompleted();
        AppController.save();
        renderTodos();
      });

      // Expand / Collapse listener
      const expandBtn = card.querySelector('.expand-btn');
      const detailsSection = card.querySelector('.todo-details');
      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = detailsSection.style.display === 'block';
        detailsSection.style.display = isExpanded ? 'none' : 'block';
        expandBtn.textContent = isExpanded ? '▼' : '▲';
        card.classList.toggle('expanded', !isExpanded);
      });

      // Edit button listener
      const editBtn = card.querySelector('.edit-btn');
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const newTitle = prompt('Edit title:', todo.title);
        if (newTitle !== null) {
          const newDesc = prompt('Edit description:', todo.description);
          const newDate = prompt('Edit due date (YYYY-MM-DD):', todo.dueDate);
          const newPriority = prompt('Edit priority (Low, Medium, High):', todo.priority);
          const newNotes = prompt('Edit notes:', todo.notes);

          todo.update({
            title: newTitle,
            description: newDesc,
            dueDate: newDate,
            priority: newPriority || todo.priority,
            notes: newNotes,
          });

          AppController.save();
          renderTodos();
        }
      });

      // Delete button listener
      const deleteBtn = card.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        activeProject.removeTodo(index);
        AppController.save();
        renderTodos();
      });

      todosContainer.appendChild(card);
    });
  };

  const render = () => {
    renderProjects();
    renderTodos();
  };

  const init = () => {
    render();

    // Event listener for adding a quick test project
    const addProjectBtn = document.getElementById('add-project-btn');
    addProjectBtn.addEventListener('click', () => {
      const projectName = prompt('Enter project name:');
      if (projectName) {
        AppController.addProject(projectName);
        render();
      }
    });

    // Event listener for adding a quick test todo
    const addTodoBtn = document.getElementById('add-todo-btn');
    addTodoBtn.addEventListener('click', () => {
      const title = prompt('Task title:');
      if (title) {
        const newTodo = createTodo(title, prompt('Description:'), prompt('Due date (YYYY-MM-DD):'), 'Medium');
        AppController.addTodoToActiveProject(newTodo);
        renderTodos();
      }
    });
  };

  return {
    init,
    render,
  };
})();