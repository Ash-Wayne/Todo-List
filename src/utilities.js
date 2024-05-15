import PubSub from 'pubsub-js';

export function editName(nameLabel) {
	let oldName = nameLabel.textContent;
	nameLabel.contentEditable = true;
	nameLabel.setAttribute('spellcheck', 'false');
	window.getSelection().selectAllChildren(nameLabel);
	return oldName;
}

export function confirmEditName(nameLabel, identifier, elementToEdit) {
	function confirm(e) {
		if (e.key === 'Enter' || e.key === 'Escape') {
			e.stopPropagation();
			e.preventDefault();
			nameLabel.contentEditable = false;
			window.getSelection().removeAllRanges();
			let newName = nameLabel.textContent;

			// updating the names on the data attributes on the divs themselves
			if (elementToEdit === 'editProjectName') nameLabel.parentNode.dataset.project = newName;
			else if (elementToEdit === 'editChecklistItem') nameLabel.parentNode.dataset.itemName = newName;

			// the identifier is the oldName when the elementToEdit is "editProjectName"
			// the identifier is the uniqueID when the elementToEdit is "editChecklistItem"
			PubSub.publish(elementToEdit, { identifier, newName });

			nameLabel.removeEventListener('keydown', confirm);
		}
	}

	nameLabel.addEventListener('keydown', confirm);
}
