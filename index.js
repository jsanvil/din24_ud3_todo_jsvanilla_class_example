import Task from "./Task.js";
import TaskListView from "./TaskListView.js";

const taskListView = new TaskListView();

if (taskListView.taskList.length === 0) {
    taskListView.addTask(new Task({ title: "Estudiar" }));
    taskListView.addTask(new Task({ title: "Lavar la ropa" }));
    taskListView.addTask(new Task({ title: "Comprar desayuno" }));
} else {
  taskListView.updateFilteredList();
}

// ELEMENTOS DEL DOM

const taskDescriptionInput = document.getElementById("create-task-input");
const newTaskForm = document.getElementById("create-task-form");
const filterSearchInput = document.getElementById("filter-search");
const filterHideCompletedInput = document.getElementById("filter-hide-completed");
const filterResetButton = document.getElementById("filter-reset-button");
const filterSortByStatusInput = document.getElementById("filter-sort-status");
const filterSortByTitle = document.getElementById("filter-sort-title");

// EVENTOS

// capturar el evento submit del formulario
newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskTitle = taskDescriptionInput.value;
  taskListView.addTask(new Task({ title: taskTitle }));

  // usabilidad: limpiar el input y poner el foco en él para seguir añadiendo tareas
  taskDescriptionInput.value = "";
  taskDescriptionInput.focus();
});

filterResetButton.addEventListener("click", () => {
  taskListView.filters = {
    search: "",
    hideCompleted: false,
    orderByTitle: false,
    orderByStatus: false,
  };
  taskListView.updateFilteredList();
});

// evento del filtro de búsqueda
filterSearchInput.addEventListener("input", (e) => {
  const searchText = e.target.value;
  taskListView.filters.search = searchText.trim();
  taskListView.updateFilteredList();
});

// evento del filtro de tareas completadas
filterHideCompletedInput.addEventListener("change", (e) => {
  taskListView.filters.hideCompleted = e.target.checked;
  taskListView.updateFilteredList();
});

// evento del filtro de ordenar por estado
filterSortByStatusInput.addEventListener("change", (e) => {
  taskListView.filters.orderByStatus = e.target.checked ? true : false;
  taskListView.updateFilteredList();
});

// evento del filtro de ordenar por título
filterSortByTitle.addEventListener("change", (e) => {
  taskListView.filters.orderByTitle = e.target.checked ? true : false;
  taskListView.updateFilteredList();
});
