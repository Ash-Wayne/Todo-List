import './reset.css';
import './styles.css';
import { format } from 'date-fns';
import PubSub from 'pubsub-js';
import { loadProjectsFromDatabase } from './on-load.js';
import { setupCustomPubSubListeners } from './background-logic.js';
import { readTodo } from './todo.js';

let projects = loadProjectsFromDatabase();

setupCustomPubSubListeners();
PubSub.subscribe('createTodo', moveLatestUpdatedProjectToTop);
PubSub.subscribe('updateTodo', moveLatestUpdatedProjectToTop);

initializeApp();
setupAddNewProjectListener();

function initializeApp() {
	if (projects.length === 0) {
		addNewProject('Default');
	} else {
		renderProjectsFromDatabase();
	}
}

function renderProjectsFromDatabase() {
	projects.forEach(project => {
		addNewProject(project.projectName);
	});
}

const addNewProjectDiv = (function () {
	return document.querySelector('main > div:first-child');
})();

function setupAddNewProjectListener() {
	const plusBtn = document.getElementById('plus');
	const newProjectInputDialog = document.querySelector('.new-project-input-dialog');
	const inputFieldInDialog = document.getElementById('input-field-project-name');
	const addBtnInDialog = document.getElementById('add-button');
	const closeBtnInDialog = document.getElementById('close-new-project-input-dialog-btn');

	plusBtn.addEventListener('click', e => {
		newProjectInputDialog.classList.remove('hidden');
		inputFieldInDialog.focus();
	});

	addBtnInDialog.addEventListener('click', addProjectCloseDialog);

	inputFieldInDialog.addEventListener('keydown', e => {
		if (e.key === 'Enter') addProjectCloseDialog();
	});

	closeBtnInDialog.addEventListener('click', e => {
		closeDialog();
	});

	newProjectInputDialog.addEventListener('keydown', e => {
		if (e.key === 'Escape') closeDialog();
	});

	function addProjectCloseDialog() {
		addNewProject(inputFieldInDialog.value);
		closeDialog();
	}

	function closeDialog() {
		newProjectInputDialog.classList.add('hidden');
		inputFieldInDialog.value = '';
	}
}

function addNewProject(projectName) {
	const projectDiv = document.createElement('div');
	projectDiv.dataset.project = projectName;

	const name = document.createElement('h2');
	name.textContent = projectName;
	name.classList.add('project-name');

	const todoList = document.createElement('div');
	todoList.classList.add('todo-list');

	const newTodoBtn = document.createElement('button');
	newTodoBtn.textContent = 'Add New Todo';
	newTodoBtn.classList.add('new-todo-btn');
	newTodoBtn.addEventListener('click', e => {
		showTodoForm(projectName, 'New');
		setTodoFormListeners(projectName, 'New');
	});

	projectDiv.appendChild(name);
	projectDiv.appendChild(todoList);
	projectDiv.appendChild(newTodoBtn);
	addNewProjectDiv.insertAdjacentElement('afterend', projectDiv);

	// this will only add new project to database if it doesn't already exist
	// if this function is being used merely to add projects (to UI) that you've loaded from database...
	// and they're not actually brand new projects, then don't run this
	if (isProjectNotInDatabase(projectName) === true) PubSub.publish('addNewProject', projectName);
}

function isProjectNotInDatabase(projectName) {
	if (projects.length === 0) return true;

	for (let project of projects) {
		if (project.projectName === projectName) return false;
	}

	return true;
}

const todoPopupFormElements = (function () {
	const todoPopupForm = document.querySelector('.todo-popup-form');
	const closeBtn = document.getElementById('close-todo-popup-form-btn');
	const project = document.getElementById('todo-form-project-name');
	const todoNameField = document.getElementById('todo-name');
	const description = document.getElementById('description');
	const dueDateField = document.getElementById('due-date');
	const notStartedStatus = document.getElementById('not-started');
	const priorityField = document.getElementById('priority');
	const notes = document.getElementById('notes');
	const checklistBtn = document.getElementById('checklist-btn');
	const saveBtn = document.getElementById('todo-save-btn');

	return {
		todoPopupForm,
		closeBtn,
		project,
		todoNameField,
		description,
		dueDateField,
		notStartedStatus,
		priorityField,
		notes,
		checklistBtn,
		saveBtn,
	};
})();

function getTodoFormCheckedStatus() {
	return document.querySelector('input[name="status"]:checked');
}

function showTodoForm(projectName, isItNewOrEditTodo) {
	todoPopupFormElements.project.textContent = `Project: ${projectName}`;

	todoPopupFormElements.todoPopupForm.classList.remove('hidden');

	// if new todo, focus on the todoName field and make it read-write, but if editing, then make it readonly
	if (isItNewOrEditTodo === 'New') {
		todoPopupFormElements.todoNameField.removeAttribute('readonly');
		todoPopupFormElements.todoNameField.classList.remove('lightgraybg');
		todoPopupFormElements.todoNameField.focus();
	} else if (isItNewOrEditTodo === 'Edit') {
		todoPopupFormElements.todoNameField.setAttribute('readonly', true);
		todoPopupFormElements.todoNameField.classList.add('lightgraybg');
	}
}

function setTodoFormListeners(projectName, isItNewOrEditTodo) {
	todoPopupFormElements.saveBtn.addEventListener('click', e => {
		// if form validation checks fail, return and keep the form from saving and closing
		if (runTodoFormValidationChecks(projectName, isItNewOrEditTodo) === false) return;
		saveTodoToUI(projectName, isItNewOrEditTodo);
		saveTodoToDatabase(projectName, isItNewOrEditTodo);
		closeFormPopup();
	});

	todoPopupFormElements.closeBtn.addEventListener('click', closeFormPopup);

	todoPopupFormElements.todoPopupForm.addEventListener('keydown', e => {
		if (e.key === 'Escape') closeFormPopup();
	});
}

function runTodoFormValidationChecks(projectName, isItNewOrEditTodo) {
	if (todoPopupFormElements.todoNameField.value === '') {
		alert('Title is mandatory!');
		return false;
	}

	// if todo already exists, alert user and return false
	if (isItNewOrEditTodo === 'New') {
		if (readTodo(projectName, todoPopupFormElements.todoNameField.value).todoName === todoPopupFormElements.todoNameField.value) {
			alert('Todo already exists');
			return false;
		}
	}
}

function saveTodoToUI(projectName, isItNewOrEditTodo) {
	const todoList = getTodoListInUIToAddTo(projectName);

	const todo = buildTodoUIElement();

	// todo's childNodes 2 and 5 are its edit and del button elements
	setListenersForViewEditAndDelete(projectName, todoList, todo.childNodes[2], todo.childNodes[5]);

	// if new todo: add it to the list, if editing: replace the existing/old todo with the edited one
	if (isItNewOrEditTodo === 'New') {
		todoList.appendChild(todo);
	} else if (isItNewOrEditTodo === 'Edit') {
		let oldTodo;
		for (let todo of todoList.childNodes) {
			if (todo.dataset.name === todoPopupFormElements.todoNameField.value) oldTodo = todo;
		}
		todoList.replaceChild(todo, oldTodo);
	}
}

function getTodoListInUIToAddTo(projectName) {
	const projectDivs = Array.from(document.querySelectorAll('main > div'));

	let projectDiv;
	for (let project_Div of projectDivs) {
		if (project_Div.dataset.project === projectName) {
			projectDiv = project_Div;
		}
	}

	// get the todolist div which is the second child of projectDiv
	return projectDiv.childNodes[1];
}

function buildTodoUIElement() {
	const todo = document.createElement('div');
	const todoName = document.createElement('h3');
	const dueDate = document.createElement('p');
	const priority = document.createElement('p');
	const status = document.createElement('p');
	const edit = document.createElement('button');
	const del = document.createElement('button');

	todo.classList.add('todo');
	todo.dataset.name = todoPopupFormElements.todoNameField.value;

	todoName.classList.add('todo-name');
	todoName.textContent = todoPopupFormElements.todoNameField.value;

	if (todoPopupFormElements.dueDateField.value !== '') {
		dueDate.textContent = `Due: ${format(todoPopupFormElements.dueDateField.value + 'T00:00:00', 'MM/dd/yyyy')}`;
	} else if (todoPopupFormElements.dueDateField.value === '') {
		dueDate.textContent = 'Due: Not Specified';
	}

	priority.textContent = todoPopupFormElements.priorityField.value;
	priority.classList.add('priority-and-status');
	status.textContent = getTodoFormCheckedStatus().value;
	status.classList.add('priority-and-status');
	colorPriorityAndStatus(priority, status);

	edit.textContent = 'View/Edit';
	edit.classList.add('edit-and-delete');
	del.textContent = 'Delete';
	del.classList.add('edit-and-delete');

	todo.append(todoName, priority, edit, dueDate, status, del);

	return todo;
}

function colorPriorityAndStatus(priority, status) {
	switch (todoPopupFormElements.priorityField.value) {
		case 'Low':
			priority.classList.add('lightgreenbg');
			break;
		case 'Medium':
			priority.classList.add('yellowbg');
			break;
		case 'High':
			priority.classList.add('redbg');
			break;
	}

	switch (getTodoFormCheckedStatus().value) {
		case 'Not Started':
			status.classList.add('redbg');
			break;
		case 'In-Progress':
			status.classList.add('yellowbg');
			break;
		case 'Complete':
			status.classList.add('lightgreenbg');
			break;
	}
}

function setListenersForViewEditAndDelete(projectName, todoList, edit, del) {
	// save field values so that they can be loaded later when "View/Edit" button is clicked
	let viewEditTodoName = todoPopupFormElements.todoNameField.value;
	let viewEditDescription = todoPopupFormElements.description.value;
	let viewEditDueDate = todoPopupFormElements.dueDateField.value;
	let viewEditPriority = todoPopupFormElements.priorityField.value;
	let viewEditNotes = todoPopupFormElements.notes.value;
	let viewEditChecklist = [];

	// repopulate fields of todo for editing
	edit.addEventListener('click', e => {
		todoPopupFormElements.todoNameField.value = viewEditTodoName;
		todoPopupFormElements.description.value = viewEditDescription;
		todoPopupFormElements.dueDateField.value = viewEditDueDate;
		getTodoFormCheckedStatus().checked = true;
		todoPopupFormElements.priorityField.value = viewEditPriority;
		todoPopupFormElements.notes.value = viewEditNotes;
		// placeholder to handle checklist later //
		showTodoForm(projectName, 'Edit');
	});

	// delete todo from both the UI and from the database
	del.addEventListener('click', e => {
		for (let todo of todoList.childNodes) {
			if (todo.dataset.name === viewEditTodoName) {
				todoList.removeChild(todo);
				PubSub.publish('deleteTodo', { projectName, todoName: viewEditTodoName });
			}
		}
	});
}

function saveTodoToDatabase(projectName, isItNewOrEditTodo) {
	let dueDate = '';
	if (todoPopupFormElements.dueDateField.value !== '') dueDate = todoPopupFormElements.dueDateField.value + 'T00:00:00';

	if (isItNewOrEditTodo === 'New') {
		PubSub.publish('createTodo', {
			projectName,
			todoName: todoPopupFormElements.todoNameField.value,
			description: todoPopupFormElements.description.value,
			dueDate,
			status: getTodoFormCheckedStatus().value,
			priority: todoPopupFormElements.priorityField.value,
			notes: todoPopupFormElements.notes.value,
			checklist: [],
		});
	} else if (isItNewOrEditTodo === 'Edit') {
		PubSub.publish('updateTodo', {
			projectName,
			todoName: todoPopupFormElements.todoNameField.value,
			description: todoPopupFormElements.description.value,
			dueDate,
			status: getTodoFormCheckedStatus().value,
			priority: todoPopupFormElements.priorityField.value,
			notes: todoPopupFormElements.notes.value,
			checklist: [],
		});
	}
}

function closeFormPopup() {
	// hide the popup form
	todoPopupFormElements.todoPopupForm.classList.add('hidden');

	// clear the field values
	todoPopupFormElements.todoNameField.value = '';
	todoPopupFormElements.description.value = '';
	todoPopupFormElements.dueDateField.value = '';
	todoPopupFormElements.notStartedStatus.checked = true;
	todoPopupFormElements.priorityField.value = 'Medium';
	todoPopupFormElements.notes.value = '';

	todoPopupFormElements.saveBtn.removeEventListener('click', saveTodo_CloseForm);

	todoPopupFormElements.closeBtn.removeEventListener('click', closeFormPopup);

	todoPopupFormElements.todoPopupForm.removeEventListener('keydown', e => {
		if (e.key === 'Escape') closeFormPopup();
	});
}

// this gets called, via PubSub subscription, when a project has a new todo or updated todo
function moveLatestUpdatedProjectToTop(_, todo) {
	let latestUpdatedProject = todo.projectName;
	let projectDivs = Array.from(document.querySelectorAll('main > div')).toSpliced(0, 1);
	let divToMoveUp;

	for (let projectDiv of projectDivs) {
		if (projectDiv.dataset.project === latestUpdatedProject) {
			divToMoveUp = projectDiv;
			break;
		}
	}

	addNewProjectDiv.insertAdjacentElement('afterend', divToMoveUp);
}
