import './reset.css';
import './styles.css';
import EditImage from './edit.png';
import DeleteImage from './delete.png';
import { format } from 'date-fns';
import PubSub from 'pubsub-js';
import { loadProjectsFromDatabase } from './on-load.js';
import { setupCustomPubSubListeners } from './background-logic.js';
import { readTodo } from './todo.js';

const addNewProjectDiv = document.querySelector('main > div:first-child');

let projects = loadProjectsFromDatabase();

setupCustomPubSubListeners();
PubSub.subscribe('createTodo', moveLatestUpdatedProjectToTop);
PubSub.subscribe('updateTodo', moveLatestUpdatedProjectToTop);

const todoPopupFormElements = (function () {
	const todoPopupForm = document.querySelector('dialog:has(.todo-popup-form)');
	const closeBtn = document.getElementById('close-todo-popup-form-btn');
	const project = document.getElementById('todo-form-project-name');
	const todoNameField = document.getElementById('todo-name');
	const description = document.getElementById('description');
	const dueDateField = document.getElementById('due-date');
	const notStartedStatus = document.getElementById('not-started');
	const inProgressStatus = document.getElementById('in-progress');
	const completeStatus = document.getElementById('complete');
	const priorityField = document.getElementById('priority');
	const notes = document.getElementById('notes');
	const checklistBtn = document.getElementById('checklist-btn');
	const saveBtn = document.getElementById('todo-save-btn');

	function getTodoFormInputFieldValues() {
		return {
			todoName: todoNameField.value,
			description: description.value,
			due: dueDateField.value,
			priority: priorityField.value,
			todoStatus: getTodoFormCheckedStatus().value,
			notes: notes.value,
			checklist: [],
		};
	}

	return {
		getTodoFormInputFieldValues,
		todoPopupForm,
		closeBtn,
		project,
		todoNameField,
		description,
		dueDateField,
		notStartedStatus,
		inProgressStatus,
		completeStatus,
		priorityField,
		notes,
		checklistBtn,
		saveBtn,
	};
})();

const projectDelConfirmDialogElem = (function () {
	const confirmDialog = document.querySelector('dialog:has(.confirmation-dialog)');
	const yesBtn = document.getElementById('yes-button');
	const noBtn = document.getElementById('no-button');

	return { confirmDialog, yesBtn, noBtn };
})();

// these are used to capture event listener variables in one area so they can be removed in another area later
const eventListenerReferences = (function () {
	let saveTodoAndCloseForm;
	let onCloseTodoPopupForm;
	let onEscapeTodoPopupForm;

	return { saveTodoAndCloseForm, onCloseTodoPopupForm, onEscapeTodoPopupForm };
})();

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
	const plusBtn = document.getElementById('plus');
	const newProjectInputDialog = document.querySelector('dialog:has(.new-project-input-dialog)');
	const inputFieldInDialog = document.getElementById('input-field-project-name');
	const addBtnInDialog = document.getElementById('add-button');
	const closeBtnInDialog = document.getElementById('close-new-project-input-dialog-btn');

	plusBtn.addEventListener('click', e => {
		newProjectInputDialog.showModal();
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
		if (inputFieldInDialog.value === '') {
			alert('Project name cannot be empty!');
			return;
		}
		addNewProject(inputFieldInDialog.value);
		closeDialog();
	}

	function closeDialog() {
		newProjectInputDialog.close();
		inputFieldInDialog.value = '';
	}
}

function addNewProject(projectName) {
	const projectDiv = document.createElement('div');
	projectDiv.dataset.project = projectName;

	const name = document.createElement('h2');
	name.textContent = projectName;
	name.classList.add('project-name');

	const editIcon = new Image();
	editIcon.src = EditImage;
	editIcon.classList.add('edit-icon');
	editIcon.addEventListener('click', e => {
		editProjectName(name);
		confirmEditProjectName(name, editProjectName(name));
	});

	const deleteIcon = new Image();
	deleteIcon.src = DeleteImage;
	deleteIcon.classList.add('delete-icon');
	deleteIcon.addEventListener('click', e => {
		showOrCloseDeleteProjectConirmation('Show');
		addProjDelYesNoListeners(projectName);
	});

	const todoList = document.createElement('div');
	todoList.classList.add('todo-list');
	todoList.classList.add('relative-position');

	// if project is being added from the database, this will add todos to the todolist of that project in the UI
	// if project is being added by the user and not being added from the database, the if-statement won't trigger
	for (let project of projects) {
		if (project.projectName === projectName) {
			project.projectTodos.forEach(todo => {
				const todoUIElement = buildTodoUIElement(todo.todoName, 'from database:' + todo.due, todo.priority, todo.todoStatus);
				setListenersForViewEditAndDelete(projectName, todoList, todo, todoUIElement.childNodes[2], todoUIElement.childNodes[5]);
				todoList.appendChild(todoUIElement);
			});

			break;
		}
	}

	const newTodoBtn = document.createElement('button');
	newTodoBtn.textContent = 'Add New Todo';
	newTodoBtn.classList.add('new-todo-btn');
	newTodoBtn.addEventListener('click', e => {
		showTodoForm(projectName, 'New');
		setTodoFormListeners(projectName, 'New');
	});

	projectDiv.append(name, editIcon, deleteIcon, todoList, newTodoBtn);
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

function editProjectName(nameLabel) {
	let oldName = nameLabel.textContent;
	nameLabel.contentEditable = true;
	window.getSelection().selectAllChildren(nameLabel);
	return oldName;
}

function confirmEditProjectName(nameLabel, oldName) {
	nameLabel.addEventListener('keydown', e => {
		if (e.key === 'Enter') {
			e.preventDefault();
			nameLabel.contentEditable = false;
			let newName = nameLabel.textContent;
			PubSub.publish('editProjectName', { oldName, newName });
		}
	});
}

function showOrCloseDeleteProjectConirmation(showOrClose) {
	if (showOrClose === 'Show') projectDelConfirmDialogElem.confirmDialog.showModal();
	else if (showOrClose === 'Close') projectDelConfirmDialogElem.confirmDialog.close();
}

function addProjDelYesNoListeners(projectName) {
	projectDelConfirmDialogElem.yesBtn.addEventListener(
		'click',
		e => {
			removeProjectFromUI(projectName);
			deleteProjectFromDatabase(projectName);
			showOrCloseDeleteProjectConirmation('Close');
		},
		{ once: true }
	);

	projectDelConfirmDialogElem.noBtn.addEventListener(
		'click',
		e => {
			showOrCloseDeleteProjectConirmation('Close');
		},
		{ once: true }
	);
}

function getProjectDivs() {
	return Array.from(document.querySelectorAll('main > div')).toSpliced(0, 1);
}

function getTodoFormCheckedStatus() {
	return document.querySelector('input[name="status"]:checked');
}

function getCorrespondingTodoFormStatus(status) {
	if (status === 'Not Started') return todoPopupFormElements.notStartedStatus;
	else if (status === 'In-Progress') return todoPopupFormElements.inProgressStatus;
	else if (status === 'Complete') return todoPopupFormElements.completeStatus;
}

function showTodoForm(projectName, isItNewOrEditTodo) {
	todoPopupFormElements.project.textContent = `Project: ${projectName}`;

	todoPopupFormElements.todoPopupForm.showModal();

	// if new todo, focus on the todoName field and make it read-write, but if editing, then make it readonly
	if (isItNewOrEditTodo === 'New') {
		todoPopupFormElements.todoNameField.removeAttribute('readonly');
		todoPopupFormElements.todoNameField.classList.remove('lightgraybg');
		todoPopupFormElements.todoNameField.focus();
	} else if (isItNewOrEditTodo === 'Edit') {
		todoPopupFormElements.todoNameField.setAttribute('readonly', true);
		todoPopupFormElements.todoNameField.classList.add('lightgraybg');
		todoPopupFormElements.todoPopupForm.focus();
	}
}

function setTodoFormListeners(projectName, isItNewOrEditTodo) {
	const saveTodoAndCloseForm = function (e) {
		// if form validation checks fail, return and keep the form from saving and closing
		if (runTodoFormValidationChecks(projectName, isItNewOrEditTodo) === false) return;
		let { todoList, todo } = saveTodoToUI(projectName, isItNewOrEditTodo);
		scrollNewTodoIntoView(todoList, todo);
		saveTodoToDatabase(projectName, isItNewOrEditTodo);
		closeFormUpAndRemoveListeners();
	};

	const onEscapeTodoPopupForm = function (e) {
		if (e.key === 'Escape') {
			closeFormUpAndRemoveListeners();
		}
	};

	const onCloseTodoPopupForm = function (e) {
		closeFormUpAndRemoveListeners();
	};

	todoPopupFormElements.saveBtn.addEventListener('click', saveTodoAndCloseForm);
	todoPopupFormElements.closeBtn.addEventListener('click', onCloseTodoPopupForm);
	todoPopupFormElements.todoPopupForm.addEventListener('keydown', onEscapeTodoPopupForm);

	// save references to functions so listeners can be removed later
	eventListenerReferences.saveTodoAndCloseForm = saveTodoAndCloseForm;
	eventListenerReferences.onCloseTodoPopupForm = onCloseTodoPopupForm;
	eventListenerReferences.onEscapeTodoPopupForm = onEscapeTodoPopupForm;
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

	const todo = buildTodoUIElement(
		todoPopupFormElements.todoNameField.value,
		todoPopupFormElements.dueDateField.value,
		todoPopupFormElements.priorityField.value,
		getTodoFormCheckedStatus().value
	);

	// todo's childNodes 2 and 5 are its edit and del button elements
	setListenersForViewEditAndDelete(
		projectName,
		todoList,
		todoPopupFormElements.getTodoFormInputFieldValues(),
		todo.childNodes[2],
		todo.childNodes[5]
	);

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

	return { todoList, todo };
}

function getTodoListInUIToAddTo(projectName) {
	let projectDiv;
	for (let project_Div of getProjectDivs()) {
		if (project_Div.dataset.project === projectName) {
			projectDiv = project_Div;
		}
	}

	// get the todolist div which is the fourth child of projectDiv
	return projectDiv.childNodes[3];
}

function buildTodoUIElement(todoNameValue, dueDateValue, priorityValue, statusValue) {
	const todo = document.createElement('div');
	const todoName = document.createElement('h3');
	const dueDate = document.createElement('p');
	const priority = document.createElement('p');
	const status = document.createElement('p');
	const edit = document.createElement('button');
	const del = document.createElement('button');

	todo.classList.add('todo');
	todo.dataset.name = todoNameValue;

	todoName.classList.add('todo-name');
	todoName.textContent = todoNameValue;

	dueDate.textContent = formatDate(dueDateValue);

	priority.textContent = priorityValue;
	priority.classList.add('priority-and-status');
	status.textContent = statusValue;
	status.classList.add('priority-and-status');
	colorPriorityAndStatus(priority, priorityValue, status, statusValue);

	edit.textContent = 'View/Edit';
	edit.classList.add('edit-and-delete');
	del.textContent = 'Delete';
	del.classList.add('edit-and-delete');

	todo.append(todoName, priority, edit, dueDate, status, del);

	return todo;
}

function formatDate(dueDateValue) {
	let dueDateText;

	if (dueDateValue.includes('from database:')) {
		// if the date is coming straight from the database, it's already in the right format, so use it directly
		dueDateText = `Due: ${dueDateValue.split(':')[1]}`;
		// if the date from the database is empty, then append 'Not Specified' to it
		if (dueDateValue.split(':')[1] === '') dueDateText += 'Not Specified';
	} else {
		if (dueDateValue !== '') {
			dueDateText = `Due: ${format(dueDateValue + 'T00:00:00', 'MM/dd/yyyy')}`;
		} else if (dueDateValue === '') {
			dueDateText = 'Due: Not Specified';
		}
	}

	return dueDateText;
}

function colorPriorityAndStatus(priority, priorityValue, status, statusValue) {
	switch (priorityValue) {
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

	switch (statusValue) {
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

function setListenersForViewEditAndDelete(projectName, todoList, todoFormInputFieldValues, edit, del) {
	// save field values so that they can be loaded later when "View/Edit" button is clicked
	let viewEditTodoName = todoFormInputFieldValues.todoName;
	let viewEditDescription = todoFormInputFieldValues.description;
	let viewEditDueDate = todoFormInputFieldValues.due;
	let viewEditPriority = todoFormInputFieldValues.priority;
	let viewEditStatus = todoFormInputFieldValues.todoStatus;
	let viewEditNotes = todoFormInputFieldValues.notes;
	let viewEditChecklist = todoFormInputFieldValues.checklist;

	// repopulate fields of todo for editing
	edit.addEventListener('click', e => {
		todoPopupFormElements.todoNameField.value = viewEditTodoName;
		todoPopupFormElements.description.value = viewEditDescription;
		todoPopupFormElements.dueDateField.value = viewEditDueDate;
		todoPopupFormElements.priorityField.value = viewEditPriority;
		getCorrespondingTodoFormStatus(viewEditStatus).checked = true;
		todoPopupFormElements.notes.value = viewEditNotes;
		// placeholder to handle checklist later //
		showTodoForm(projectName, 'Edit');
		setTodoFormListeners(projectName, 'Edit');
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

function scrollNewTodoIntoView(todoList, todo) {
	setTimeout(() => {
		todoList.scrollTop = todo.offsetTop;
	}, 10);
}

function saveTodoToDatabase(projectName, isItNewOrEditTodo) {
	let dueDate = '';
	if (todoPopupFormElements.dueDateField.value !== '') dueDate = todoPopupFormElements.dueDateField.value + 'T00:00:00';

	let createOrUpdate;

	if (isItNewOrEditTodo === 'New') createOrUpdate = 'createTodo';
	else if (isItNewOrEditTodo === 'Edit') createOrUpdate = 'updateTodo';

	PubSub.publish(createOrUpdate, {
		projectName,
		todoName: todoPopupFormElements.todoNameField.value,
		description: todoPopupFormElements.description.value,
		dueDate,
		priority: todoPopupFormElements.priorityField.value,
		status: getTodoFormCheckedStatus().value,
		notes: todoPopupFormElements.notes.value,
		checklist: [],
	});
}

function closeFormUpAndRemoveListeners() {
	closeFormPopup();
	removeTodoFormListeners();
}

function closeFormPopup() {
	// hide the popup form
	todoPopupFormElements.todoPopupForm.close();

	// clear the field values
	todoPopupFormElements.todoNameField.value = '';
	todoPopupFormElements.description.value = '';
	todoPopupFormElements.dueDateField.value = '';
	todoPopupFormElements.notStartedStatus.checked = true;
	todoPopupFormElements.priorityField.value = 'Medium';
	todoPopupFormElements.notes.value = '';
}

function removeTodoFormListeners() {
	const saveTodoAndCloseForm = eventListenerReferences.saveTodoAndCloseForm;
	const onCloseTodoPopupForm = eventListenerReferences.onCloseTodoPopupForm;
	const onEscapeTodoPopupForm = eventListenerReferences.onEscapeTodoPopupForm;

	todoPopupFormElements.saveBtn.removeEventListener('click', saveTodoAndCloseForm);

	todoPopupFormElements.closeBtn.removeEventListener('click', onCloseTodoPopupForm);

	todoPopupFormElements.todoPopupForm.removeEventListener('keydown', onEscapeTodoPopupForm);
}

function removeProjectFromUI(projectName) {
	const main = document.querySelector('main');
	for (let projectDiv of getProjectDivs()) {
		if (projectDiv.dataset.project === projectName) {
			main.removeChild(projectDiv);
			return;
		}
	}
}

function deleteProjectFromDatabase(projectName) {
	PubSub.publish('deleteProject', projectName);
}

// this gets called, via PubSub subscription, when a project has a new todo or updated todo
function moveLatestUpdatedProjectToTop(_, todo) {
	let latestUpdatedProject = todo.projectName;
	let divToMoveUp;

	for (let projectDiv of getProjectDivs()) {
		if (projectDiv.dataset.project === latestUpdatedProject) {
			divToMoveUp = projectDiv;
			break;
		}
	}

	addNewProjectDiv.insertAdjacentElement('afterend', divToMoveUp);
}
