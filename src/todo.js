export const createTodo = (title, description, dueDate, priority, notes = '') => {
  let completed = false;

  const toggleCompleted = () => {
    completed = !completed;
  }

  const getStatus = () => completed;

  return {
    title,
    description,
    dueDate,
    priority,
    notes,
    toggleCompleted,
    getStatus,
  };
};