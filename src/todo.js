import { format } from 'date-fns';

export function createTodo(project, title, description = '', dueDate = '', priority = '', notes = '', checklist) {
	// title is mandatory
	if (title === undefined) {
		alert('Title is mandatory!');
		return;
	}

	let due;
	if (dueDate === '') due = '';
	else due = format(dueDate, 'MM/dd/yyyy');

	let projectToUpdate = JSON.parse(localStorage.getItem(project));

	let todo = {
		todoIndex: projectToUpdate.length,
		title,
		description,
		due,
		todoStatus: false,
		priority,
		notes,
		checklist,
	};

	projectToUpdate.push(todo);
	localStorage.setItem(project, JSON.stringify(projectToUpdate));

	return todo;
}

export function readTodo(project, todoIndex) {
	return JSON.parse(localStorage.getItem(project))[todoIndex];
}

export function updateTodo(project, todoIndex, title, description = '', dueDate = '', todoStatus, priority = '', notes = '', checklist) {
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

	let projectToUpdate = JSON.parse(localStorage.getItem(project));
	projectToUpdate[todoIndex] = todo;
	localStorage.setItem(project, JSON.stringify(projectToUpdate));

	return todo;
}

export function deleteTodo(project, todoIndex) {
	let projectToUpdate = JSON.parse(localStorage.getItem(project));
	projectToUpdate.splice(todoIndex, 1);
	localStorage.setItem(project, JSON.stringify(projectToUpdate));
}
