import './css/reset.css';
import './css/styles.css';
import PubSub from 'pubsub-js';

import { setupCustomPubSubListeners } from './fn-wrappers.js';
import { loadProjectsFromDatabase } from './on-load.js';
import { addNewProject, setupAddNewProjectListener } from './main-ui.js';

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

export function getProjectsLoadedFromDatabase() {
	return projects;
}
