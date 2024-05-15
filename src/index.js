import './reset.css';
import './styles.css';
import './toggle-switch.css';
import EditImage from './edit.png';
import DeleteImage from './delete.png';
import PubSub from 'pubsub-js';

import { setupCustomPubSubListeners } from './fn-wrappers.js';
import { loadProjectsFromDatabase } from './on-load.js';
import { editName, confirmEditName } from './utilities.js';
import { showTodoForm, setTodoFormListeners, buildTodoUIElement, setListenersForViewEditAndDelete } from './todo-ui.js';

const baseElements = (function () {
	const mainDiv = document.querySelector('main');
	const addNewProjectDiv = document.querySelector('main > div:first-child');

	return { mainDiv, addNewProjectDiv };
})();

const projectDelConfirmDialogElem = (function () {
	const confirmDialog = document.querySelector('dialog:has(.confirmation-dialog)');
	const yesBtn = document.getElementById('yes-button');
	const noBtn = document.getElementById('no-button');

	return { confirmDialog, yesBtn, noBtn };
})();

// these are used to capture event listener variables in one area so they can be removed in another area later
export const eventListenerReferences = (function () {
	let onClickChecklistBtn;
	let saveOrEscOrCloseTodoForm;
	let closeChecklistPopup;
	let saveNewChecklistItem;
	let confirmProjectDeletion;
	let rejectProjectDeletion;

	return {
		onClickChecklistBtn,
		saveOrEscOrCloseTodoForm,
		closeChecklistPopup,
		saveNewChecklistItem,
		confirmProjectDeletion,
		rejectProjectDeletion,
	};
})();

setupCustomPubSubListeners();
PubSub.subscribe('createTodo', moveLatestUpdatedProjectToTop);
PubSub.subscribe('updateTodo', moveLatestUpdatedProjectToTop);
PubSub.subscribe('projectPositionChange', reassignToolTipPositions);

let projects = loadProjectsFromDatabase();

initializeApp();
setupAddNewProjectListener();

function initializeApp() {
	if (projects.length === 0) {
		addNewProject('Default');
	} else {
		renderProjectsFromDatabase();
	}

	projects = [];
}

function renderProjectsFromDatabase() {
	projects.forEach(project => {
		addNewProject(project.projectName);
	});
}

function addNewProject(projectName) {
	const projectDiv = document.createElement('div');
	projectDiv.dataset.project = projectName;

	const nameLabel = document.createElement('h2');
	nameLabel.textContent = projectName;
	nameLabel.classList.add('project-name');

	const editIconDiv = buildProjectNameEditIcon(projectDiv);
	const deleteIconDiv = buildProjectDeleteIcon(projectDiv);

	const todoList = document.createElement('div');
	todoList.classList.add('todo-list');
	todoList.classList.add('relative-position');

	// if project is being added from the database, this will add todos to the todolist of that project in the UI
	// if project is being added by the user and not being added from the database, the if-statement won't trigger
	for (let project of projects) {
		if (project.projectName === projectName) {
			project.projectTodos.forEach(todo => {
				const todoUIElement = buildTodoUIElement(todo.todoName, 'from database:' + todo.due, todo.priority, todo.todoStatus);
				setListenersForViewEditAndDelete(projectName, todoList, todo, todoUIElement.children[2], todoUIElement.children[5]);
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

	projectDiv.append(nameLabel, editIconDiv, deleteIconDiv, todoList, newTodoBtn);
	baseElements.addNewProjectDiv.insertAdjacentElement('afterend', projectDiv);

	PubSub.publish('projectPositionChange', null);

	// this will only add new project to database if it doesn't already exist
	// if this function is being used merely to add projects (to UI) that you've loaded from database...
	// and they're not actually brand new projects, then don't run this
	if (isProjectNotInDatabase(projectName) === true) PubSub.publish('addNewProject', projectName);
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

function buildProjectNameEditIcon(projectDiv) {
	const editDiv = document.createElement('div');
	editDiv.classList.add('edit-icon-div', 'absolute-position');

	const editIcon = new Image();
	editIcon.src = EditImage;
	editIcon.classList.add('edit-icon');

	editDiv.append(editIcon, buildToolTip(editIcon, 'Edit project name'));

	editIcon.addEventListener('click', e => {
		let nameLabel = projectDiv.children[0];
		let oldName = editName(nameLabel);
		confirmEditName(nameLabel, oldName, 'editProjectName');
	});

	return editDiv;
}

function buildProjectDeleteIcon(projectDiv) {
	const delDiv = document.createElement('div');
	delDiv.classList.add('del-icon-div', 'absolute-position');

	const deleteIcon = new Image();
	deleteIcon.src = DeleteImage;
	deleteIcon.classList.add('delete-icon');

	delDiv.append(deleteIcon, buildToolTip(deleteIcon, 'Delete project'));

	deleteIcon.addEventListener('click', e => {
		showOrCloseDeleteProjectConirmation('Show');
		addProjectDeleteConfirmDialogListeners(projectDiv);
	});

	return delDiv;
}

function isProjectNotInDatabase(projectName) {
	if (projects.length === 0) return true;

	for (let project of projects) {
		if (project.projectName === projectName) return false;
	}

	return true;
}

function buildToolTip(hoveredElement, toolTipText) {
	const toolTipElement = document.createElement('p');
	toolTipElement.textContent = toolTipText;
	toolTipElement.setAttribute('style', `width: ${toolTipText.length - 2}ch;`);
	toolTipElement.classList.add('tooltip', 'absolute-position', 'hidden');

	let refToSetTimeout;

	hoveredElement.addEventListener('mouseenter', e => {
		refToSetTimeout = setTimeout(makeToolTipVisible, 500);
	});

	hoveredElement.addEventListener('mouseleave', e => {
		toolTipElement.classList.add('hidden');
		clearTimeout(refToSetTimeout);
	});

	function makeToolTipVisible() {
		toolTipElement.classList.remove('hidden');
	}

	return toolTipElement;
}

function showOrCloseDeleteProjectConirmation(showOrClose) {
	if (showOrClose === 'Show') projectDelConfirmDialogElem.confirmDialog.showModal();
	else if (showOrClose === 'Close') projectDelConfirmDialogElem.confirmDialog.close();
}

function addProjectDeleteConfirmDialogListeners(projectDiv) {
	function confirmProjectDeletion(e) {
		if (e.type === 'keydown' && e.key !== 'Enter') return;

		removeProjectFromUI(projectDiv);
		deleteProjectFromDatabase(projectDiv.dataset.project);

		closeProjectDeleteConfirmDialog_RemoveListeners();
	}

	function rejectProjectDeletion(e) {
		if (e.type === 'keydown' && e.key !== 'Escape') return;

		closeProjectDeleteConfirmDialog_RemoveListeners();
	}

	projectDelConfirmDialogElem.yesBtn.addEventListener('click', confirmProjectDeletion);
	projectDelConfirmDialogElem.confirmDialog.addEventListener('keydown', confirmProjectDeletion);
	projectDelConfirmDialogElem.noBtn.addEventListener('click', rejectProjectDeletion);
	projectDelConfirmDialogElem.confirmDialog.addEventListener('keydown', rejectProjectDeletion);

	eventListenerReferences.confirmProjectDeletion = confirmProjectDeletion;
	eventListenerReferences.rejectProjectDeletion = rejectProjectDeletion;
}

// close project delete dialog and remove its listeners
function closeProjectDeleteConfirmDialog_RemoveListeners() {
	showOrCloseDeleteProjectConirmation('Close');
	removeProjectDeleteConfirmDialogListeners();
}

function removeProjectDeleteConfirmDialogListeners() {
	const confirmProjectDeletion = eventListenerReferences.confirmProjectDeletion;
	const rejectProjectDeletion = eventListenerReferences.rejectProjectDeletion;

	projectDelConfirmDialogElem.yesBtn.removeEventListener('click', confirmProjectDeletion);
	projectDelConfirmDialogElem.confirmDialog.removeEventListener('keydown', confirmProjectDeletion);
	projectDelConfirmDialogElem.noBtn.removeEventListener('click', rejectProjectDeletion);
	projectDelConfirmDialogElem.confirmDialog.removeEventListener('keydown', rejectProjectDeletion);
}

export function getProjectDiv(projectName) {
	for (let projectDiv of getProjectDivs()) {
		if (projectDiv.dataset.project === projectName) {
			return projectDiv;
		}
	}
}

function getProjectDivs() {
	return Array.from(document.querySelectorAll('main > div')).toSpliced(0, 1);
}

function removeProjectFromUI(projectDiv) {
	baseElements.mainDiv.removeChild(projectDiv);
}

function deleteProjectFromDatabase(projectName) {
	PubSub.publish('deleteProject', projectName);
}

// this gets called, via PubSub subscription, when a project has a new todo or updated todo
function moveLatestUpdatedProjectToTop(_, todo) {
	let latestUpdatedProjectName = todo.projectName;
	let divToMoveUp = getProjectDiv(latestUpdatedProjectName);

	baseElements.addNewProjectDiv.insertAdjacentElement('afterend', divToMoveUp);

	PubSub.publish('projectPositionChange', null);
}

// this gets called via PubSub whenever the project divs change positions so that those on the rightmost edge
// can have their tooltips positioned in a way that they don't overflow to the right of the viewport
function reassignToolTipPositions(_, __) {
	for (let projectDiv of getProjectDivs()) {
		if (projectDiv.offsetLeft > 1000) {
			for (let tooltip of Array.from(projectDiv.querySelectorAll('.tooltip'))) {
				tooltip.classList.remove('tooltip-regular');
				tooltip.classList.add('tooltip-rightmost');
			}
		} else if (projectDiv.offsetLeft <= 1000) {
			for (let tooltip of Array.from(projectDiv.querySelectorAll('.tooltip'))) {
				tooltip.classList.remove('tooltip-rightmost');
				tooltip.classList.add('tooltip-regular');
			}
		}
	}
}
