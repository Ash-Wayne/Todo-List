import { createNewProject } from './projects.js';
import { deleteProject } from './projects.js';
import { createTodo } from './todo.js';
import { updateTodo } from './todo.js';
import { deleteTodo } from './todo.js';
import { addToChecklist } from './checklist.js';
import { editChecklistItem } from './checklist.js';
import { changeItemStatus } from './checklist.js';
import { removeChecklistItem } from './checklist.js';
import { readChecklistFromMemory } from './checklist.js';
import { returnFinalChecklist } from './checklist.js';
import { deleteChecklist } from './checklist.js';
import { reloadChecklistIntoMemory } from './checklist.js';
import PubSub from 'pubsub-js';

export function setupCustomPubSubListeners() {
	PubSub.subscribe('addNewProject', createNewProjectWrapper);
	PubSub.subscribe('createTodo', createTodoWrapper);
	PubSub.subscribe('updateTodo', updateTodoWrapper);
	PubSub.subscribe('deleteTodo', deleteTodoWrapper);
}

function createNewProjectWrapper(_, projectName) {
	createNewProject(projectName);
}

function createTodoWrapper(_, todo) {
	createTodo(todo.projectName, todo.todoName, todo.description, todo.dueDate, todo.status, todo.priority, todo.notes, todo.checklist);
}

function updateTodoWrapper(_, todo) {
	updateTodo(todo.projectName, todo.todoName, todo.description, todo.dueDate, todo.status, todo.priority, todo.notes, todo.checklist);
}

function deleteTodoWrapper(_, todo) {
	deleteTodo(todo.projectName, todo.todoName);
}
