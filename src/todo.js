export const createTodo = (title, description, dueDate, priority, notes = '', initialCompleted = false) => {
  let completed = initialCompleted;

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