import './css/reset.css';
import './css/styles.css';
import PubSub from 'pubsub-js';
import { format } from 'date-fns';

import { readTodo } from './todo.js';
import { readChecklistFromMemory } from './checklist.js';
import { eventListenerReferences, getProjectDiv } from './index.js';
import {
	clearChecklistPopup,
	clearChecklistInMemory,
	loadChecklistItemsIntoMemory,
	loadChecklistItemsIntoPopup,
	showChecklistPopup,
	addBaseChecklistPopupListeners,
} from './checklist-ui.js';

export const todoPopupFormElements = (function () {
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

function getTodoFormCheckedStatus() {
	return document.querySelector('input[name="status"]:checked');
}

export function showTodoForm(projectName, isItNewOrEditTodo) {
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

export function setTodoFormListeners(projectName, isItNewOrEditTodo) {
	const onClickChecklistBtn = function (e) {
		// load the checklist into memory (if it has any items)
		loadChecklistItemsIntoMemory();

		// load the checklist popup with all the items (if any)
		loadChecklistItemsIntoPopup();

		showChecklistPopup();

		addBaseChecklistPopupListeners();
	};

	const saveOrEscOrCloseTodoForm = function (e) {
		if (e.type === 'keydown' && e.key !== 'Escape') return;

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

		closeTodoFormPopupAndRemoveListeners();

		// clear the checklist popup and the checklist in memory
		clearChecklistPopup();
		clearChecklistInMemory();
	};

	todoPopupFormElements.checklistBtn.addEventListener('click', onClickChecklistBtn);
	todoPopupFormElements.saveBtn.addEventListener('click', saveOrEscOrCloseTodoForm);
	todoPopupFormElements.closeBtn.addEventListener('click', saveOrEscOrCloseTodoForm);
	todoPopupFormElements.todoPopupForm.addEventListener('keydown', saveOrEscOrCloseTodoForm);

	// save references to functions so listeners can be removed later
	eventListenerReferences.onClickChecklistBtn = onClickChecklistBtn;
	eventListenerReferences.saveOrEscOrCloseTodoForm = saveOrEscOrCloseTodoForm;
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
	const saveOrEscOrCloseTodoForm = eventListenerReferences.saveOrEscOrCloseTodoForm;

	todoPopupFormElements.checklistBtn.removeEventListener('click', onClickChecklistBtn);
	todoPopupFormElements.saveBtn.removeEventListener('click', saveOrEscOrCloseTodoForm);
	todoPopupFormElements.closeBtn.removeEventListener('click', saveOrEscOrCloseTodoForm);
	todoPopupFormElements.todoPopupForm.removeEventListener('keydown', saveOrEscOrCloseTodoForm);
}

function getTodoListInUIToAddTo(projectName) {
	// get the todolist div which is the fourth child of projectDiv
	return getProjectDiv(projectName).children[3];
}

export function buildTodoUIElement(todoNameValue, dueDateValue, priorityValue, statusValue) {
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

export function setListenersForViewEditAndDelete(projectName, todoList, todo, edit, del) {
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
		todoPopupFormElements.setChecklistValue(JSON.parse(JSON.stringify(viewEditChecklist)));

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

function getCorrespondingTodoFormStatus(status) {
	if (status === 'Not Started') return todoPopupFormElements.notStartedStatus;
	else if (status === 'In-Progress') return todoPopupFormElements.inProgressStatus;
	else if (status === 'Complete') return todoPopupFormElements.completeStatus;
}
