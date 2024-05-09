import { createNewProject, getProject, updateProject } from './projects.js';
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
import { clearChecklist } from './checklist.js';
import { reloadChecklistIntoMemory } from './checklist.js';
import PubSub from 'pubsub-js';

export function setupCustomPubSubListeners() {
	PubSub.subscribe('addNewProject', createNewProjectWrapper);
	PubSub.subscribe('createTodo', createTodoWrapper);
	PubSub.subscribe('updateTodo', updateTodoWrapper);
	PubSub.subscribe('deleteTodo', deleteTodoWrapper);
	PubSub.subscribe('editProjectName', editProjectNameWrapper);
	PubSub.subscribe('deleteProject', deleteProjectWrapper);
	PubSub.subscribe('addToChecklist', addToChecklistWrapper);
	PubSub.subscribe('editChecklistItem', editChecklistItemWrapper);
	PubSub.subscribe('changeItemStatus', changeItemStatusWrapper);
	PubSub.subscribe('removeChecklistItem', removeChecklistItemWrapper);
	PubSub.subscribe('reloadChecklist', reloadChecklistWrapper);
	PubSub.subscribe('clearChecklist', clearChecklistWrapper);
}

function createNewProjectWrapper(_, projectName) {
	createNewProject(projectName);
}

function createTodoWrapper(_, todo) {
	createTodo(todo.projectName, todo.todoName, todo.description, todo.dueDate, todo.priority, todo.status, todo.notes, todo.checklist);
}

function updateTodoWrapper(_, todo) {
	updateTodo(todo.projectName, todo.todoName, todo.description, todo.dueDate, todo.priority, todo.status, todo.notes, todo.checklist);
}

function deleteTodoWrapper(_, todo) {
	deleteTodo(todo.projectName, todo.todoName);
}

function editProjectNameWrapper(_, projectNames) {
	let project = getProject(projectNames.oldName);
	deleteProject(projectNames.oldName);
	updateProject(projectNames.newName, project);
}

function deleteProjectWrapper(_, projectName) {
	deleteProject(projectName);
}

function addToChecklistWrapper(_, checklistItem) {
	addToChecklist(checklistItem.itemName, checklistItem.itemStatus);
}

function editChecklistItemWrapper(_, changeData) {
	editChecklistItem(changeData.index, changeData.oldName, changeData.newName);
}

function changeItemStatusWrapper(_, changeData) {
	changeItemStatus(changeData.index, changeData.newStatus);
}

function removeChecklistItemWrapper(_, index) {
	removeChecklistItem(index);
}

function reloadChecklistWrapper(_, checklist) {
	reloadChecklistIntoMemory(checklist);
}

function clearChecklistWrapper(_, __) {
	clearChecklist();
}
