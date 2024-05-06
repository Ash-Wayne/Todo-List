import { format } from 'date-fns';
import { getProject } from './projects';
import { updateProject } from './projects';

export function createTodo(projectName, todoName, description = '', dueDate = '', priority = '', todoStatus = '', notes = '', checklist) {
	let due;
	if (dueDate === '') due = '';
	else due = format(dueDate, 'MM/dd/yyyy');

	let projectToUpdate = getProject(projectName);

	let todo = {
		todoName,
		description,
		due,
		priority,
		todoStatus,
		notes,
		checklist,
	};

	projectToUpdate.listOfTodos.push(todo);
	updateProject(projectName, projectToUpdate);

	return todo;
}

export function readTodo(projectName, todoName) {
	let todoToFind;

	for (let todo of getProject(projectName).listOfTodos) {
		if (todo.todoName === todoName) {
			todoToFind = todo;
			return todoToFind;
		}
	}

	// return false if todo isn't found
	return false;
}

export function updateTodo(projectName, todoName, description = '', dueDate = '', priority = '', todoStatus, notes = '', checklist) {
	let due;
	if (dueDate === '') due = '';
	else due = format(dueDate, 'MM/dd/yyyy');

	let todo = {
		todoName,
		description,
		due,
		priority,
		todoStatus,
		notes,
		checklist,
	};

	let projectToUpdate = getProject(projectName);

	let indexOfTodoToUpdate = projectToUpdate.listOfTodos.findIndex(todo => {
		if (todo.todoName === todoName) return true;
	});

	projectToUpdate.listOfTodos[indexOfTodoToUpdate] = todo;

	updateProject(projectName, projectToUpdate);

	return todo;
}

export function deleteTodo(projectName, todoName) {
	let projectToUpdate = getProject(projectName);

	let indexOfTodoToDelete = projectToUpdate.listOfTodos.findIndex(todo => {
		if (todo.todoName === todoName) return true;
	});

	projectToUpdate.listOfTodos.splice(indexOfTodoToDelete, 1);
	updateProject(projectName, projectToUpdate);
}
