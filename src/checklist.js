let checklist = [];

export function addToChecklist(uniqueId, itemName, itemStatus) {
	let item = { uniqueId, itemName, itemStatus };
	// add item with status to checklist
	checklist.push(item);
	// return an object with: item, its index, and the whole checklist
	return { item, checklist };
}

export function editChecklistItem(uniqueId, newName) {
	getItemFromUniqueId(uniqueId).itemName = newName;
	return { newName, checklist };
}

export function changeItemStatus(uniqueId, newStatus) {
	getItemFromUniqueId(uniqueId).itemStatus = newStatus;
	return { newStatus, checklist };
}

export function removeChecklistItem(uniqueId) {
	checklist.splice(checklist.indexOf(getItemFromUniqueId(uniqueId)), 1);
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

function getItemFromUniqueId(uniqueId) {
	for (let item of checklist) {
		if (item.uniqueId === uniqueId) return item;
	}
}
