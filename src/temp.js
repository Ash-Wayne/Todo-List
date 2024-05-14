import './reset.css';
import './styles.css';
import './toggle-switch.css';
import EditImage from './edit.png';
import DeleteImage from './delete.png';
import { format } from 'date-fns';
import PubSub from 'pubsub-js';
import { loadProjectsFromDatabase } from './on-load.js';
import { setupCustomPubSubListeners } from './background-logic.js';
import { readTodo } from './todo.js';
import { readChecklistFromMemory } from './checklist.js';

const baseElements = (function () {
	const mainDiv = document.querySelector('main');
	const addNewProjectDiv = document.querySelector('main > div:first-child');

	return { mainDiv, addNewProjectDiv };
})();

let projects = loadProjectsFromDatabase();

setupCustomPubSubListeners();
PubSub.subscribe('createTodo', moveLatestUpdatedProjectToTop);
PubSub.subscribe('updateTodo', moveLatestUpdatedProjectToTop);
PubSub.subscribe('projectPositionChange', reassignToolTipPositions);

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

	let checklist = [];

	function setChecklistValue(checklistValue) {
		checklist = checklistValue;
	}

	function getTodoFormInputFieldValues() {
		return {
			todoName: todoNameField.value,
			description: description.value,
			due: dueDateField.value,
			priority: priorityField.value,
			todoStatus: getTodoFormCheckedStatus().value,
			notes: notes.value,
			checklist,
		};
	}

	return {
		setChecklistValue,
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

const checklistElements = (function () {
	const checklistPopup = document.querySelector('dialog:has(.checklist)');
	const checklistBottomBtnsDiv = document.querySelector('.checklist-bottom-buttons-div');
	const addNewItemBtn = document.getElementById('add-new-item-btn');
	const doneChecklistBtn = document.getElementById('done-checklist-btn');
	const closeBtn = document.getElementById('close-checklist-btn');
	const inputFieldDivForNewItem = document.querySelector('.input-field-div-for-new-item');
	const inputFieldForNewItem = document.getElementById('input-field-for-new-item');
	const saveNewChecklistItemBtn = document.getElementById('save-new-checklist-item-btn');
	const checklistItemsDiv = document.querySelector('.checklist-items-div');

	return {
		checklistPopup,
		checklistBottomBtnsDiv,
		addNewItemBtn,
		doneChecklistBtn,
		closeBtn,
		inputFieldDivForNewItem,
		inputFieldForNewItem,
		saveNewChecklistItemBtn,
		checklistItemsDiv,
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
	let onClickChecklistBtn;
	let closeTodoFormPopup;
	let showInputFieldForNewChecklistItem;
	let closeChecklistPopup;
	let saveNewChecklistItem;

	return {
		onClickChecklistBtn,
		closeTodoFormPopup,
		showInputFieldForNewChecklistItem,
		closeChecklistPopup,
		saveNewChecklistItem,
	};
})();

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

	const nameLabel = document.createElement('h2');
	nameLabel.textContent = projectName;
	nameLabel.classList.add('project-name');

	const editIconDiv = buildProjectNameEditIcon(projectName);
	const deleteIconDiv = buildProjectDeleteIcon(projectName);

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

function buildProjectNameEditIcon(projectName) {
	const editDiv = document.createElement('div');
	editDiv.classList.add('edit-icon-div', 'absolute-position');

	const editIcon = new Image();
	editIcon.src = EditImage;
	editIcon.classList.add('edit-icon');

	editDiv.append(editIcon, buildToolTip(editIcon, 'Edit project name'));

	editIcon.addEventListener('click', e => {
		let nameLabel = getProjectDiv(projectName).children[0];
		let oldName = editName(nameLabel);
		confirmEditName(nameLabel, oldName, 'editProjectName');
	});

	return editDiv;
}

function buildProjectDeleteIcon(projectName) {
	const delDiv = document.createElement('div');
	delDiv.classList.add('del-icon-div', 'absolute-position');

	const deleteIcon = new Image();
	deleteIcon.src = DeleteImage;
	deleteIcon.classList.add('delete-icon');

	delDiv.append(deleteIcon, buildToolTip(deleteIcon, 'Delete project'));

	deleteIcon.addEventListener('click', e => {
		showOrCloseDeleteProjectConirmation('Show');
		addProjDelYesNoListeners(projectName);
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

function editName(nameLabel) {
	let oldName = nameLabel.textContent;
	nameLabel.contentEditable = true;
	window.getSelection().selectAllChildren(nameLabel);
	return oldName;
}

function confirmEditName(nameLabel, identifier, elementToEdit) {
	function onConfirm(e) {
		if (e.key === 'Enter' || e.key === 'Escape') {
			e.stopPropagation();
			e.preventDefault();
			nameLabel.contentEditable = false;
			window.getSelection().removeAllRanges();
			let newName = nameLabel.textContent;

			// the identifier is the oldName when the project name is to be edited
			// the identifier is the uniqueID when the checklist name is to be edited
			PubSub.publish(elementToEdit, { identifier, newName });

			nameLabel.removeEventListener('keydown', onConfirm);
		}
	}

	nameLabel.addEventListener('keydown', onConfirm);
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

function getProjectDiv(projectName) {
	for (let projectDiv of getProjectDivs()) {
		if (projectDiv.dataset.project === projectName) {
			return projectDiv;
		}
	}
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
	const onClickChecklistBtn = function (e) {
		// load the checklist into memory (if it has any items)
		loadChecklistItemsIntoMemory();

		// load the checklist popup with all the items (if any)
		loadChecklistItemsIntoPopup();

		showChecklistPopup();

		addBaseChecklistPopupListeners();
	};

	const closeTodoFormPopup = function (e) {
		if (e.target.id === 'todo-save-btn') {
			// if form validation checks fail, return and keep the form from saving and closing
			if (runTodoFormValidationChecks(projectName, isItNewOrEditTodo) === false) return;

			// get the checklist from memory and associate it with the current todo in the UI
			// so that the next time edit todo button is clicked, this can be loaded into memory
			todoPopupFormElements.setChecklistValue(readChecklistFromMemory());

			let { todoList, todo } = saveTodoToUI(projectName, isItNewOrEditTodo);

			scrollNewTodoIntoView(todoList, todo);

			saveTodoToDatabase(projectName, isItNewOrEditTodo);
		}

		if (e.type === 'keydown' && e.key !== 'Escape') return;

		closeTodoFormPopupAndRemoveListeners();

		// clear the checklist popup and the checklist in memory
		clearChecklistPopup();
		clearChecklistInMemory();
	};

	todoPopupFormElements.checklistBtn.addEventListener('click', onClickChecklistBtn);
	todoPopupFormElements.saveBtn.addEventListener('click', closeTodoFormPopup);
	todoPopupFormElements.closeBtn.addEventListener('click', closeTodoFormPopup);
	todoPopupFormElements.todoPopupForm.addEventListener('keydown', closeTodoFormPopup);

	// save references to functions so listeners can be removed later
	eventListenerReferences.onClickChecklistBtn = onClickChecklistBtn;
	eventListenerReferences.closeTodoFormPopup = closeTodoFormPopup;
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

	// todo's children 2 and 5 are its edit and del button elements
	setListenersForViewEditAndDelete(projectName, todoList, todoPopupFormElements.getTodoFormInputFieldValues(), todo.children[2], todo.children[5]);

	// if new todo: add it to the list, if editing: replace the existing/old todo with the edited one
	if (isItNewOrEditTodo === 'New') {
		todoList.appendChild(todo);
	} else if (isItNewOrEditTodo === 'Edit') {
		let oldTodo;
		for (let todo of todoList.children) {
			if (todo.dataset.name === todoPopupFormElements.todoNameField.value) oldTodo = todo;
		}
		todoList.replaceChild(todo, oldTodo);
	}

	return { todoList, todo };
}

function getTodoListInUIToAddTo(projectName) {
	// get the todolist div which is the fourth child of projectDiv
	return getProjectDiv(projectName).children[3];
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

function setListenersForViewEditAndDelete(projectName, todoList, todo, edit, del) {
	// If called when new todo is being created, save input field values so that they can be loaded later when "View/Edit" button is clicked
	// If called when todos are being loaded from the database, save todo property values so they can be loaded later when "View/Edit" button is clicked
	let viewEditTodoName = todo.todoName;
	let viewEditDescription = todo.description;
	let viewEditDueDate = todo.due;
	let viewEditPriority = todo.priority;
	let viewEditStatus = todo.todoStatus;
	let viewEditNotes = todo.notes;
	let viewEditChecklist = todo.checklist;

	// repopulate fields of todo for editing
	edit.addEventListener('click', e => {
		todoPopupFormElements.todoNameField.value = viewEditTodoName;
		todoPopupFormElements.description.value = viewEditDescription;
		todoPopupFormElements.dueDateField.value = viewEditDueDate;
		todoPopupFormElements.priorityField.value = viewEditPriority;
		getCorrespondingTodoFormStatus(viewEditStatus).checked = true;
		todoPopupFormElements.notes.value = viewEditNotes;
		todoPopupFormElements.setChecklistValue(viewEditChecklist);

		showTodoForm(projectName, 'Edit');
		setTodoFormListeners(projectName, 'Edit');
	});

	// delete todo from both the UI and from the database
	del.addEventListener('click', e => {
		for (let todo of todoList.children) {
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
		checklist: todoPopupFormElements.getTodoFormInputFieldValues().checklist,
	});
}

function closeTodoFormPopupAndRemoveListeners() {
	closeTodoFormPopup();
	removeTodoFormListeners();
}

function closeTodoFormPopup() {
	// hide the popup form
	todoPopupFormElements.todoPopupForm.close();

	// clear the field values
	todoPopupFormElements.todoNameField.value = '';
	todoPopupFormElements.description.value = '';
	todoPopupFormElements.dueDateField.value = '';
	todoPopupFormElements.notStartedStatus.checked = true;
	todoPopupFormElements.priorityField.value = 'Medium';
	todoPopupFormElements.notes.value = '';
	todoPopupFormElements.setChecklistValue([]);
}

function removeTodoFormListeners() {
	const onClickChecklistBtn = eventListenerReferences.onClickChecklistBtn;
	const closeTodoPopupForm = eventListenerReferences.closeTodoPopupForm;

	todoPopupFormElements.checklistBtn.removeEventListener('click', onClickChecklistBtn);
	todoPopupFormElements.saveBtn.removeEventListener('click', closeTodoPopupForm);
	todoPopupFormElements.closeBtn.removeEventListener('click', closeTodoPopupForm);
	todoPopupFormElements.todoPopupForm.removeEventListener('keydown', closeTodoPopupForm);
}

function showChecklistPopup() {
	checklistElements.checklistPopup.showModal();
}

function addBaseChecklistPopupListeners() {
	const closeChecklistPopup = function (e) {
		if (e.type === 'keydown' && e.key !== 'Escape') return;
		if (e.type === 'keydown' && e.key === 'Escape') e.preventDefault();

		hideInputFieldForNewItem();
		clearinputFieldForNewItem();
		closeChecklistPopupAndRemoveListeners();
	};

	const saveNewChecklistItem = function (e) {
		if (e.type === 'keydown' && e.key !== 'Enter') return;
		if (e.type === 'keydown' && e.key === 'Enter') e.preventDefault();

		let uniqueId = Math.random();
		saveNewChecklistItemToUI(uniqueId, checklistElements.inputFieldForNewItem.value, false);
		saveNewChecklistItemToMemory(uniqueId, checklistElements.inputFieldForNewItem.value, false);
		hideInputFieldForNewItem();
		clearinputFieldForNewItem();
	};

	checklistElements.addNewItemBtn.addEventListener('click', showInputFieldForNewChecklistItem);
	checklistElements.doneChecklistBtn.addEventListener('click', closeChecklistPopup);
	checklistElements.closeBtn.addEventListener('click', closeChecklistPopup);
	checklistElements.checklistPopup.addEventListener('keydown', closeChecklistPopup);
	checklistElements.saveNewChecklistItemBtn.addEventListener('click', saveNewChecklistItem);
	checklistElements.inputFieldForNewItem.addEventListener('keydown', saveNewChecklistItem);

	// save references to functions so listeners can be removed later
	eventListenerReferences.closeChecklistPopup = closeChecklistPopup;
	eventListenerReferences.saveNewChecklistItem = saveNewChecklistItem;
}

function showInputFieldForNewChecklistItem() {
	checklistElements.inputFieldDivForNewItem.classList.remove('display-none');
	checklistElements.inputFieldForNewItem.focus();
}

function closeChecklistPopupAndRemoveListeners() {
	closeChecklistPopup();
	removeChecklistPopupListeners();
}

function closeChecklistPopup() {
	checklistElements.checklistPopup.close();
}

function removeChecklistPopupListeners() {
	const closeChecklistPopup = eventListenerReferences.closeChecklistPopup;
	const saveNewChecklistItem = eventListenerReferences.saveNewChecklistItem;

	checklistElements.addNewItemBtn.removeEventListener('click', showInputFieldForNewChecklistItem);
	checklistElements.doneChecklistBtn.removeEventListener('click', closeChecklistPopup);
	checklistElements.closeBtn.removeEventListener('click', closeChecklistPopup);
	checklistElements.checklistPopup.removeEventListener('keydown', closeChecklistPopup);
	checklistElements.saveNewChecklistItemBtn.removeEventListener('click', saveNewChecklistItem);
	checklistElements.inputFieldForNewItem.removeEventListener('keydown', saveNewChecklistItem);
}

function saveNewChecklistItemToUI(uniqueId, itemName, itemStatus) {
	const checklistItemDiv = document.createElement('div');
	checklistItemDiv.classList.add('checklist-item-div');
	checklistItemDiv.dataset.uniqueId = uniqueId;

	const checklistItemNameLabel = document.createElement('p');
	checklistItemNameLabel.textContent = itemName;
	checklistItemNameLabel.setAttribute('spellcheck', 'false');

	const checklistStatusToggleSwitch = buildChecklistStatusToggleSwitch(uniqueId, itemStatus);
	const checklistItemEditIcon = buildChecklistItemEditIcon(checklistItemNameLabel);
	const checklistItemDelIcon = buildChecklistItemDelIcon(uniqueId);

	checklistItemDiv.append(checklistItemNameLabel, checklistStatusToggleSwitch, checklistItemEditIcon, checklistItemDelIcon);

	checklistElements.checklistItemsDiv.lastElementChild.insertAdjacentElement('beforebegin', checklistItemDiv);
}

function loadChecklistItemsIntoPopup() {
	let checklist = todoPopupFormElements.getTodoFormInputFieldValues().checklist;
	if (checklist.length > 0) {
		// first clear the checklist popup if there's any uncleared items on it
		// they're usually there when the checklist is loaded from the database
		// and when the user closes the checklist but reopens it again before
		// clicking Save on the todo form. this was deliberately designed that way.
		clearChecklistPopup();

		// add each item
		checklist.forEach(item => {
			saveNewChecklistItemToUI(item.uniqueId, item.itemName, item.itemStatus);
		});
	}
}

function loadChecklistItemsIntoMemory() {
	if (todoPopupFormElements.getTodoFormInputFieldValues().checklist.length > 0) {
		PubSub.publish('reloadChecklist', todoPopupFormElements.getTodoFormInputFieldValues().checklist);
	}
}

function hideInputFieldForNewItem() {
	checklistElements.inputFieldDivForNewItem.classList.add('display-none');
}

function clearinputFieldForNewItem() {
	checklistElements.inputFieldForNewItem.value = '';
}

function buildChecklistStatusToggleSwitch(uniqueId, itemStatus) {
	const checklistItemStatusContainer = document.createElement('label');
	checklistItemStatusContainer.classList.add('switch');

	const checklistItemStatusCheckbox = document.createElement('input');
	checklistItemStatusCheckbox.setAttribute('id', Math.random().toString());
	checklistItemStatusCheckbox.setAttribute('type', 'checkbox');

	if (itemStatus === false) checklistItemStatusCheckbox.checked = false;
	else if (itemStatus === true) checklistItemStatusCheckbox.checked = true;

	const checklistItemStatusSlider = document.createElement('span');
	checklistItemStatusSlider.classList.add('slider', 'round');

	checklistItemStatusCheckbox.addEventListener('change', e => {
		changeChecklistItemStatusInMemory(uniqueId, checklistItemStatusCheckbox.checked);
	});

	checklistItemStatusContainer.append(checklistItemStatusCheckbox, checklistItemStatusSlider);

	return checklistItemStatusContainer;
}

function buildChecklistItemEditIcon(nameLabel) {
	const checklistItemEditIcon = new Image();
	checklistItemEditIcon.src = EditImage;
	checklistItemEditIcon.classList.add('edit-icon');

	checklistItemEditIcon.addEventListener('click', e => {
		editName(nameLabel);
		confirmEditName(nameLabel, parseFloat(nameLabel.parentNode.dataset.uniqueId), 'editChecklistItem');
	});

	return checklistItemEditIcon;
}

function buildChecklistItemDelIcon(uniqueId) {
	const checklistItemDelIcon = new Image();
	checklistItemDelIcon.src = DeleteImage;
	checklistItemDelIcon.classList.add('delete-icon');

	checklistItemDelIcon.addEventListener('click', e => {
		removeChecklistItemFromUI(uniqueId);
		removeChecklistItemFromMemory(uniqueId);
	});

	return checklistItemDelIcon;
}

function saveNewChecklistItemToMemory(itemName, itemStatus) {
	PubSub.publish('addToChecklist', { itemName, itemStatus });
}

function changeChecklistItemStatusInMemory(uniqueId, newStatus) {
	PubSub.publish('changeItemStatus', { uniqueId, newStatus });
}

function removeChecklistItemFromUI(uniqueId) {
	for (let item of checklistElements.checklistItemsDiv.children) {
		if (item.dataset.uniqueId === uniqueId.toString()) {
			checklistElements.checklistItemsDiv.removeChild(item);
			break;
		}
	}
}

function removeChecklistItemFromMemory(uniqueId) {
	PubSub.publish('removeChecklistItem', uniqueId);
}

function clearChecklistPopup() {
	while (checklistElements.checklistItemsDiv.children.length > 1) {
		checklistElements.checklistItemsDiv.removeChild(checklistElements.checklistItemsDiv.firstElementChild);
	}
}

function clearChecklistInMemory() {
	PubSub.publish('clearChecklist', null);
}

function removeProjectFromUI(projectName) {
	baseElements.mainDiv.removeChild(getProjectDiv(projectName));
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

// this gets called whenever the project divs change positions so that those on the rightmost edge
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
