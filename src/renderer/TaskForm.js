import Task from "./Task.js";

class TaskForm {
  isEditing = false;

  constructor(task, taskList) {
    if (taskList.includes(task)) {
      this.isEditing = true;
      this.task = task;
    } else {
      this.task = new Task();
    }
    this.taskList = taskList;
  }

  createTaskForm() {
    const taskForm = document.createElement("form");

    taskForm.innerHTML = `
      <h2>${this.isEditing ? "Editar tarea '" + this.task.title + "'" : "Nueva tarea"}</h2>
      <p>
        <label for="task-title">Título</label>
        <input id="task-title" type="text" name="task" placeholder="título" value="${this.task.title}" required>
        <span class="error"></span>
      </p>
      <p>
        <label for="task-status">Estado</label>
        <input id="task-status" type="checkbox" name="completed" ${this.task.done ? "checked" : ""}>
      </p>
      <p>
        <label for="task-priority">Prioridad</label>
        <select name="priority" id="task-priority">
          <option value="low" ${this.task.priority === 0 ? "selected" : ""}>Baja</option>
          <option value="medium" ${this.task.priority === 1 ? "selected" : ""}>Media</option>
          <option value="high" ${this.task.priority === 2 ? "selected" : ""}>Alta</option>
        </select>
      </p>
      <p>
        <label for="task-description">Descripción</label>
        <br>
        <textarea id="task-description" name="description" placeholder="descripción" value="${this.task.description}"></textarea>
      </p>
      <button id="submit" type="submit">${this.isEditing ? "Guardar cambios" : "Crear"}</button>
      <button id="cancel" type="button">Cancelar</button>
    `;

    this.input = taskForm.querySelector("#task-title");
    this.status = taskForm.querySelector("#task-status");
    this.priority = taskForm.querySelector("#task-priority");
    this.description = taskForm.querySelector("#task-description");
    this.submit = taskForm.querySelector("#submit");
    this.cancel = taskForm.querySelector("#cancel");

    this.submit.addEventListener("click", (e) => {
      e.preventDefault();

      // validar título
      if (!this.input.value) {
        this.input.nextElementSibling.textContent = "El título es requerido";
        return;
      }
      else {
        this.input.nextElementSibling.textContent = "";
      }
      
      // guardar tarea
      this.task.title = this.input.value;
      this.task.done = this.status.checked;
      this.task.priority = this.priority.selectedIndex;
      this.task.description = this.description.value;

      if (this.isEditing) {
        this.taskList.save();
      } else {
        this.taskList.addTask(this.task);
      }
    })

    this.cancel.addEventListener("click", (e) => {
      e.preventDefault();
      const modal = document.getElementById("modal");
      modal.style.display = "none";
      modal.querySelector(".modal-body").innerHTML = "";
    })

    return taskForm;
  }
}

export default TaskForm;
