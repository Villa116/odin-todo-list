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
      li.classList.add('project-item');

      if (project === activeProject) {
        li.classList.add('active');
      }

      // Project name text / click handler to switch view
      const nameSpan = document.createElement('span');
      nameSpan.textContent = project.getName();
      nameSpan.style.flex = '1';
      nameSpan.addEventListener('click', () => {
        AppController.setActiveProject(index);
        render();
      });
      li.appendChild(nameSpan);

      // Delete project button (show for all, or ensure at least one remains handled by appController)
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '×';
      deleteBtn.classList.add('delete-project-btn');
      deleteBtn.title = 'Delete project';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering the li click
        if (confirm(`Are you sure you want to delete "${project.getName()}"?`)) {
          AppController.deleteProject(index);
          render();
        }
      });
      li.appendChild(deleteBtn);

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

    // Event listener for adding a project (keeping prompt for quick creation, or you can modalize this too)
    const addProjectBtn = document.getElementById('add-project-btn');
    addProjectBtn.addEventListener('click', () => {
      const projectName = prompt('Enter project name:');
      if (projectName) {
        AppController.addProject(projectName);
        render();
      }
    });

    // --- Modal Logic for Tasks ---
    const todoModal = document.getElementById('todo-modal');
    const todoForm = document.getElementById('todo-form');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const cancelTodoBtn = document.getElementById('cancel-todo-btn');

    // Open modal
    addTodoBtn.addEventListener('click', () => {
      todoForm.reset();
      todoModal.showModal();
    });

    // Close modal on cancel
    cancelTodoBtn.addEventListener('click', () => {
      todoModal.close();
    });

    // Handle form submission
    todoForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('todo-title').value;
      const description = document.getElementById('todo-description').value;
      const dueDate = document.getElementById('todo-duedate').value;
      const priority = document.getElementById('todo-priority').value;
      const notes = document.getElementById('todo-notes').value;

      const newTodo = createTodo(title, description, dueDate, priority, notes);
      AppController.addTodoToActiveProject(newTodo);

      todoModal.close();
      renderTodos();
    });
  };

  return {
    init,
    render,
  };
})();