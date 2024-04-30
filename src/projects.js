export function createNewProject(name) {
	localStorage.setItem(name, JSON.stringify({ lastUpdated: new Date(), listOfTodos: [] }));
}

export function getProject(name) {
	return JSON.parse(localStorage.getItem(name));
}

export function updateProject(name, project) {
	project.lastUpdated = new Date();
	localStorage.setItem(name, JSON.stringify(project));
}

export function deleteProject(name) {
	localStorage.removeItem(name);
}
