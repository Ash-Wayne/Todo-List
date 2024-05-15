import './reset.css';
import './styles.css';
import './toggle-switch.css';
import PubSub from 'pubsub-js';
import EditImage from './edit.png';
import DeleteImage from './delete.png';

import { editName, confirmEditName } from './utilities.js';
import { eventListenerReferences } from './index.js';
import { todoPopupFormElements } from './todo-ui.js';

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

export function clearChecklistPopup() {
	while (checklistElements.checklistItemsDiv.children.length > 1) {
		checklistElements.checklistItemsDiv.removeChild(checklistElements.checklistItemsDiv.firstElementChild);
	}
}

export function clearChecklistInMemory() {
	PubSub.publish('clearChecklist', null);
}

export function loadChecklistItemsIntoMemory() {
	if (todoPopupFormElements.getTodoFormInputFieldValues().checklist.length > 0) {
		PubSub.publish('reloadChecklist', todoPopupFormElements.getTodoFormInputFieldValues().checklist);
	}
}

export function loadChecklistItemsIntoPopup() {
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

export function showChecklistPopup() {
	checklistElements.checklistPopup.showModal();
}

export function addBaseChecklistPopupListeners() {
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

function saveNewChecklistItemToUI(uniqueId, itemName, itemStatus) {
	const checklistItemDiv = document.createElement('div');
	checklistItemDiv.classList.add('checklist-item-div');
	checklistItemDiv.dataset.uniqueId = uniqueId;
	checklistItemDiv.dataset.itemName = itemName;

	const checklistItemNameLabel = document.createElement('p');
	checklistItemNameLabel.textContent = itemName;
	checklistItemNameLabel.setAttribute('spellcheck', 'false');

	const checklistStatusToggleSwitch = buildChecklistStatusToggleSwitch(uniqueId, itemStatus);
	const checklistItemEditIcon = buildChecklistItemEditIcon(checklistItemNameLabel);
	const checklistItemDelIcon = buildChecklistItemDelIcon(uniqueId);

	checklistItemDiv.append(checklistItemNameLabel, checklistStatusToggleSwitch, checklistItemEditIcon, checklistItemDelIcon);

	checklistElements.checklistItemsDiv.lastElementChild.insertAdjacentElement('beforebegin', checklistItemDiv);
}

function saveNewChecklistItemToMemory(uniqueId, itemName, itemStatus) {
	PubSub.publish('addToChecklist', { uniqueId, itemName, itemStatus });
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

function hideInputFieldForNewItem() {
	checklistElements.inputFieldDivForNewItem.classList.add('display-none');
}

function clearinputFieldForNewItem() {
	checklistElements.inputFieldForNewItem.value = '';
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
