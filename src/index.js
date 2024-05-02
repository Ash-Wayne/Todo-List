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

function setupAddNewProjectListener() {
	const plusBtn = document.querySelector('main > div:first-child > img');
	const newProjectInputDialog = document.querySelector('.new-project-input-dialog');
	const inputFieldInDialog = document.querySelector('.new-project-input-dialog > input');
	const addBtnInDialog = document.querySelector('.new-project-input-dialog > button');
	const closeBtnInDialog = document.querySelector('.new-project-input-dialog > img');

	plusBtn.addEventListener('click', e => {
		newProjectInputDialog.setAttribute('style', 'visibility: visible;');
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
		newProjectInputDialog.setAttribute('style', 'visibility: hidden;');
		inputFieldInDialog.value = '';
	}
}

function addNewProject(projectName) {
	const addNewProjectDiv = document.querySelector('main > div:first-child');

	const projectDiv = document.createElement('div');
	projectDiv.dataset.project = projectName;

	const name = document.createElement('h2');
	name.textContent = projectName;
	name.setAttribute('style', 'font-weight: bold; text-align: center; font-size: 1.3rem;');

	const todoList = document.createElement('div');
	todoList.setAttribute('style', 'padding: 0 1em 1em 1em; height: 60%; display: flex; flex-direction: column; gap: .8em; overflow-y: auto;');

	const newTodoBtn = document.createElement('button');
	newTodoBtn.textContent = 'Add New Todo';
	newTodoBtn.setAttribute('style', 'width: 50%; align-self: center; padding: .5em 0; cursor: pointer;');
	newTodoBtn.addEventListener('click', e => {
		showTodoForm(projectName, 'New');
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

function showTodoForm(projectName, isItNewOrEditTodo) {
	const todoPopupForm = document.querySelector('.todo-popup-form');
	const closeBtn = document.querySelector('.todo-popup-form > img');
	const project = document.querySelector('.todo-popup-form > h2');
	const todoNameField = document.querySelector('.todo-name > input');
	const description = document.querySelector('.description > textarea');
	const dueDateField = document.querySelector('.due-date > input');
	const notStartedStatus = document.querySelector('.status input[value="Not Started"]');
	const priorityField = document.querySelector('.priority > select');
	const notes = document.querySelector('.notes > textarea');
	const checklistBtn = document.querySelector('.todo-popup-form > button:first-of-type');
	const saveBtn = document.querySelector('.todo-popup-form > button:last-of-type');

	project.textContent = `Project: ${projectName}`;

	todoPopupForm.setAttribute('style', 'visibility: visible;');

	// if new todo, focus on the todoName field and make it read-write, but if editing, then make it readonly
	if (isItNewOrEditTodo === 'New') {
		todoNameField.removeAttribute('readonly');
		todoNameField.setAttribute('style', 'background-color: white;');
		todoNameField.focus();
	} else if (isItNewOrEditTodo === 'Edit') {
		todoNameField.setAttribute('readonly', true);
		todoNameField.setAttribute('style', 'background-color: lightgray;');
	}

	saveBtn.addEventListener('click', saveTodo_CloseForm);

	closeBtn.addEventListener('click', closeFormPopup);

	todoPopupForm.addEventListener('keydown', e => {
		if (e.key === 'Escape') closeFormPopup();
	});

	function saveTodo_CloseForm() {
		// if a field is not entered properly, saveToDo will return false and keep the popup from closing
		if (saveTodo() === false) return;
		closeFormPopup();
	}

	function saveTodo() {
		const projectDivs = Array.from(document.querySelectorAll('main > div'));

		const checkedStatus = document.querySelector('.status input[name="status"]:checked');

		let projectDiv;
		for (let project_Div of projectDivs) {
			if (project_Div.dataset.project === projectName) {
				projectDiv = project_Div;
			}
		}

		// get the todolist div which is the second child of projectDiv
		const todoList = projectDiv.childNodes[1];

		const todo = document.createElement('div');
		const todoName = document.createElement('h3');
		const dueDate = document.createElement('p');
		const priority = document.createElement('p');
		const status = document.createElement('p');
		const edit = document.createElement('button');
		const del = document.createElement('button');

		todo.setAttribute(
			'style',
			'display: grid; grid-template-columns: 1.7fr .9fr .8fr; grid-template-rows: 1fr 1fr; height: 25%; gap: .3em; flex-shrink: 0;'
		);
		todo.dataset.name = todoNameField.value;

		todoName.setAttribute('style', 'width: 85%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;');

		if (todoNameField.value !== '') {
			todoName.textContent = todoNameField.value;
		} else if (todoNameField.value === '') {
			alert('Title is mandatory!');
			return false;
		}

		if (dueDateField.value !== '') {
			dueDate.textContent = `Due: ${format(dueDateField.value + 'T00:00:00', 'MM/dd/yyyy')}`;
		} else if (dueDateField.value === '') {
			dueDate.textContent = 'Due: Not Specified';
		}

		priority.textContent = priorityField.value;
		priority.setAttribute('style', 'text-align: center;');
		status.textContent = checkedStatus.value;
		status.setAttribute('style', 'text-align: center;');
		colorPriorityAndStatus();

		edit.textContent = 'View/Edit';
		edit.setAttribute('style', 'cursor: pointer;');
		del.textContent = 'Delete';
		del.setAttribute('style', 'cursor: pointer;');

		setViewEdit_DeleteListeners();

		todo.append(todoName, priority, edit, dueDate, status, del);

		// if new todo: add it to the list, if editing: replace the existing/old todo with the edited one
		if (isItNewOrEditTodo === 'New') {
			alertUserIfTodoAlreadyExists();
			todoList.appendChild(todo);
		} else if (isItNewOrEditTodo === 'Edit') {
			let oldTodo;
			for (let todo of todoList.childNodes) {
				if (todo.dataset.name === todoNameField.value) oldTodo = todo;
			}
			todoList.replaceChild(todo, oldTodo);
		}

		function colorPriorityAndStatus() {
			switch (priorityField.value) {
				case 'Low':
					priority.setAttribute('style', 'background-color: lightgreen;');
					break;
				case 'Medium':
					priority.setAttribute('style', 'background-color: yellow;');
					break;
				case 'High':
					priority.setAttribute('style', 'background-color: red;');
					break;
			}

			switch (checkedStatus.value) {
				case 'Not Started':
					status.setAttribute('style', 'background-color: red;');
					break;
				case 'In-Progress':
					status.setAttribute('style', 'background-color: yellow;');
					break;
				case 'Complete':
					status.setAttribute('style', 'background-color: lightgreen;');
					break;
			}
		}

		function setViewEdit_DeleteListeners() {
			// save field values so that they can be loaded later when "View/Edit" button is clicked
			let viewEditTodoName = todoNameField.value;
			let viewEditDescription = description.value;
			let viewEditDueDate = dueDateField.value;
			let viewEditPriority = priorityField.value;
			let viewEditNotes = notes.value;
			let viewEditChecklist = [];

			// repopulate fields of todo for editing
			edit.addEventListener('click', e => {
				todoNameField.value = viewEditTodoName;
				description.value = viewEditDescription;
				dueDateField.value = viewEditDueDate;
				checkedStatus.checked = true;
				priorityField.value = viewEditPriority;
				notes.value = viewEditNotes;
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

		function alertUserIfTodoAlreadyExists() {
			// if todo already exists, alert user and return false
			if (readTodo(projectName, todoNameField.value).todoName === todoNameField.value) {
				alert('Todo already exists');
				return false;
			}
		}

		// IIFE to save todo to database
		(function saveToDatabase() {
			let dueDate = '';
			if (dueDateField.value !== '') dueDate = dueDateField.value + 'T00:00:00';

			if (isItNewOrEditTodo === 'New') {
				alertUserIfTodoAlreadyExists();
				PubSub.publish('createTodo', {
					projectName,
					todoName: todoNameField.value,
					description: description.value,
					dueDate,
					status: checkedStatus.value,
					priority: priorityField.value,
					notes: notes.value,
					checklist: [],
				});
			} else if (isItNewOrEditTodo === 'Edit') {
				PubSub.publish('updateTodo', {
					projectName,
					todoName: todoNameField.value,
					description: description.value,
					dueDate,
					status: checkedStatus.value,
					priority: priorityField.value,
					notes: notes.value,
					checklist: [],
				});
			}
		})();
	}

	function closeFormPopup() {
		// hide the popup form
		todoPopupForm.setAttribute('style', 'visibility: hidden;');

		// clear the field values
		todoNameField.value = '';
		description.value = '';
		dueDateField.value = '';
		notStartedStatus.checked = true;
		priorityField.value = 'Medium';
		notes.value = '';

		saveBtn.removeEventListener('click', saveTodoCloseForm);

		closeBtn.removeEventListener('click', closeFormPopup);

		todoPopupForm.removeEventListener('keydown', e => {
			if (e.key === 'Escape') closeFormPopup();
		});
	}
}

// this gets called, via PubSub subscription, when a project has a new todo or updated todo
function moveLatestUpdatedProjectToTop(_, todo) {
	let latestUpdatedProject = todo.projectName;
	let projectDivs = Array.from(document.querySelectorAll('main > div')).toSpliced(0, 1);
	const addNewProjectDiv = document.querySelector('main > div:first-child');
	for (let projectDiv of projectDivs) {
		if (projectDiv.dataset.project === latestUpdatedProject) {
			addNewProjectDiv.insertAdjacentElement('afterend', projectDiv);
		}
	}
}
