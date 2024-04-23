export function createDefaultProject() {
	localStorage.setItem('Default', JSON.stringify([]));
}

export function createNewProject(name) {
	localStorage.setItem(name, JSON.stringify([]));
}

export function getProject(name) {
	return JSON.parse(localStorage.getItem(name));
}

export function deleteProject(name) {
	localStorage.removeItem(name);
}
