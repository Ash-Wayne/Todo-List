import PubSub from 'pubsub-js';

import { createNewProject, getProject, updateProject, deleteProject } from './projects.js';
import { createTodo, updateTodo, deleteTodo } from './todo.js';
import { addToChecklist, editChecklistItem, changeItemStatus, removeChecklistItem, clearChecklist, reloadChecklistIntoMemory } from './checklist.js';

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

function editProjectNameWrapper(_, projectName) {
	// the identifier is the oldName (the name to be edited)
	let project = getProject(projectName.identifier);
	deleteProject(projectName.identifier);
	updateProject(projectName.newName, project);
}

function deleteProjectWrapper(_, projectName) {
	deleteProject(projectName);
}

function addToChecklistWrapper(_, checklistItem) {
	addToChecklist(checklistItem.uniqueId, checklistItem.itemName, checklistItem.itemStatus);
}

function editChecklistItemWrapper(_, changeData) {
	// the identifier is the uniqueId of the checklist item
	editChecklistItem(changeData.identifier, changeData.newName);
}

function changeItemStatusWrapper(_, changeData) {
	changeItemStatus(changeData.uniqueId, changeData.newStatus);
}

function removeChecklistItemWrapper(_, uniqueId) {
	removeChecklistItem(uniqueId);
}

function reloadChecklistWrapper(_, checklist) {
	reloadChecklistIntoMemory(checklist);
}

function clearChecklistWrapper(_, __) {
	clearChecklist();
}
