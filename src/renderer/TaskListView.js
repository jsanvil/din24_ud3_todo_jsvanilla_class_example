import TaskList from "./TaskList.js";
import TaskView from "./TaskView.js";

class TaskListView {
  #htmlElement;

  constructor(taskList) {
    this.taskList = taskList || new TaskList();
    this.taskListContainer = document.querySelector("#task-list");

    this.filteredTaskList = [];

    this.filters = {
      search: "",
      hideCompleted: false,
      orderByTitle: false,
      orderByStatus: false,
    };

  }

  createElement() {
    if (this.#htmlElement) {
      return this.#htmlElement;
    }

    const newTaskList = document.createElement("ul");
    newTaskList.id = "task-list";

    this.#htmlElement = newTaskList;

    return this.#htmlElement;
  }

  addTask(task) {
    this.taskList.push(task);
    this.taskList.save();
    this.updateFilteredList();
  }

  async removeTask(taskToRemove) {
    const confirmDelete = await window.bridge.confirmDeleteTask(taskToRemove);

    if (confirmDelete.response === 1) {
      this.taskList.splice(this.taskList.indexOf(taskToRemove), 1);
      this.taskList.save();
      this.updateFilteredList();
    }
  }

  renderTaskList() {
    this.taskListContainer.innerHTML = "";
    const ul = document.createElement("ul");
    this.taskListContainer.appendChild(ul);
    this.filteredTaskList.forEach((task) => {
      let taskView = new TaskView(task, this);
      ul.appendChild(taskView.createElement());
    });
  }

  updateFilteredList() {
    this.filteredTaskList = [...this.taskList];

    // hide completed
    if (this.filters.hideCompleted) {
      this.filteredTaskList = [];
      this.taskList.forEach((task) => {
        if (task.done) {
          return;
        }
        this.filteredTaskList.push(task);
      });
    }

    // search
    this.filteredTaskList = this.filteredTaskList.filter((task) =>
      task.title.toLowerCase().includes(this.filters.search.toLowerCase())
    );

    // order by title
    if (this.filters.orderByTitle) {
      this.filteredTaskList = this.filteredTaskList.sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
    }

    // order by status
    if (this.filters.orderByStatus) {
      this.filteredTaskList = this.filteredTaskList.sort((a, b) => a.done - b.done);
    }

    this.renderTaskList();
  }
}

export default TaskListView;
