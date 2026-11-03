export const createTodo = (title, description, dueDate, priority, notes = '', initialCompleted = false) => {
  let completed = initialCompleted;

  const toggleCompleted = () => {
    completed = !completed;
  };

  const getStatus = () => completed;

  const update = (newData) => {
    if (newData.title !== undefined) todo.title = newData.title;
  };

  // Since properties are returned directly, we can define a clean update method:
  return {
    title,
    description,
    dueDate,
    priority,
    notes,
    toggleCompleted,
    getStatus,
    update(newDetails) {
      this.title = newDetails.title || this.title;
      this.description = newDetails.description !== undefined ? newDetails.description : this.description;
      this.dueDate = newDetails.dueDate || this.dueDate;
      this.priority = newDetails.priority || this.priority;
      this.notes = newDetails.notes !== undefined ? newDetails.notes : this.notes;
    },
  };
};