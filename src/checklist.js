let checklist = [];

export function addToChecklist(itemName, itemStatus) {
	let item = { itemName, itemStatus };
	// add item with status to checklist
	checklist.push(item);
	// return an object with: item, its index, and the whole checklist
	return { item, index: checklist.length - 1, checklist };
}

export function editChecklistItem(index, uneditedItem, editedItem) {
	checklist[index].itemName = editedItem;

	// return an object with: item, its index, and the whole checklist
	return { editedItem, index, checklist };
}

export function changeItemStatus(index, newStatus) {
	checklist[index].itemStatus = newStatus;

	// return an object with: item, its status, its index, and the whole checklist
	return { newStatus, index, checklist };
}

export function removeChecklistItem(index) {
	checklist.splice(index, 1);
	return checklist;
}

export function readChecklistFromMemory() {
	return checklist;
}

export function clearChecklist() {
	checklist = [];
}

export function reloadChecklistIntoMemory(checklistFromDatabase) {
	checklist = checklistFromDatabase;
}
