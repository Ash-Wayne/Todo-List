import { format } from 'date-fns';
import { getProject } from './projects';
import { updateProject } from './projects';

export function createTodo(projectName, todoName, description = '', dueDate = '', todoStatus = '', priority = '', notes = '', checklist) {
	let due;
	if (dueDate === '') due = '';
	else due = format(dueDate, 'MM/dd/yyyy');

	let projectToUpdate = getProject(projectName);

	let todo = {
		todoIndex: projectToUpdate.length,
		todoName,
		description,
		due,
		todoStatus,
		priority,
		notes,
		checklist,
	};

	projectToUpdate.listOfTodos.push(todo);
	updateProject(projectName, projectToUpdate);

	return todo;
}

export function readTodo(projectName, todoIndex) {
	return getProject(projectName).listOfTodos[todoIndex];
}

export function updateTodo(projectName, todoIndex, todoName, description = '', dueDate = '', todoStatus, priority = '', notes = '', checklist) {
	let due;
	if (dueDate === '') due = '';
	else due = format(dueDate, 'MM/dd/yyyy');

	let todo = {
		todoIndex,
		todoName,
		description,
		due,
		todoStatus,
		priority,
		notes,
		checklist,
	};

	let projectToUpdate = getProject(projectName);
	projectToUpdate.listOfTodos[todoIndex] = todo;
	updateProject(projectName, projectToUpdate);

	return todo;
}

export function deleteTodo(projectName, todoIndex) {
	let projectToUpdate = getProject(projectName);
	projectToUpdate.listOfTodos.splice(todoIndex, 1);
	updateProject(projectName, projectToUpdate);
}
