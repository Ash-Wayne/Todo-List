let checklist = [];

export function addToChecklist(rawItem) {
	// set initial item status to incomplete (false)
	let item = { [rawItem]: false };
	// add item with status to checklist
	checklist.push(item);
	// return an object with: item, its index, and the whole checklist
	return { item, index: checklist.length - 1, checklist };
}

export function editChecklistItem(index, uneditedItem, editedItem) {
	let itemStatus = checklist[index][uneditedItem];
	checklist[index] = { [editedItem]: itemStatus };
	// return an object with: item, its index, and the whole checklist
	return { editedItem, index, checklist };
}

export function changeItemStatus(index, newStatus) {
	let item = Object.keys(checklist[index])[0];
	checklist[index][item] = newStatus;
	// return an object with: item, its status, its index, and the whole checklist
	return { item, newStatus, index, checklist };
}

export function removeChecklistItem(index) {
	checklist.splice(index, 1);
	return checklist;
}

export function readChecklistFromMemory() {
	return checklist;
}

// you pass this into the checklist parameter of createTodo function when it's called
export function returnFinalChecklist() {
	let finalChecklist = checklist;
	// can clear checklist in memory now for next use
	checklist = [];
	return finalChecklist;
}

export function deleteChecklist() {
	checklist = [];
}

export function reloadChecklistIntoMemory(checklistFromDatabase) {
	checklist = checklistFromDatabase;
}
