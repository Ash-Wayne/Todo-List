import { format } from 'date-fns/format.js';

function setStartingIndex() {
	if (localStorage.length > 0) {
		return localStorage.length + 1;
	} else {
		return 1;
	}
}

export function createTodo(title, description = '', dueDate = '', priority = '', notes = '', checklist) {
	// title is mandatory
	if (title === undefined) {
		alert('Title is mandatory!');
		return;
	}

	let due;
	if (dueDate === '') due = '';
	else due = format(dueDate, 'MM/dd/yyyy');

	let todo = {
		todoIndex: setStartingIndex(),
		title,
		description,
		due,
		todoStatus: false,
		priority,
		notes,
		checklist,
	};

	localStorage.setItem(todo.todoIndex, JSON.stringify(todo));

	return todo;
}

export function readTodo(todoIndex) {
	return JSON.parse(localStorage.getItem(todoIndex));
}

export function updateTodo(todoIndex, title, description = '', dueDate = '', todoStatus, priority = '', notes = '', checklist) {
	// title is mandatory
	if (title === undefined) {
		alert('Title is mandatory!');
		return;
	}

	let due;
	if (dueDate === '') due = '';
	else due = format(dueDate, 'MM/dd/yyyy');

	let todo = {
		todoIndex,
		title,
		description,
		due,
		todoStatus,
		priority,
		notes,
		checklist,
	};

	localStorage.setItem(todo.todoIndex, JSON.stringify(todo));

	return todo;
}

export function deleteTodo(todoIndex) {
	localStorage.removeItem(todoIndex);
}
