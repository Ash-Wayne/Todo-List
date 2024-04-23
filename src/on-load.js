import { getProject } from './projects';

export function loadProjectsFromDatabase() {
	let projects = [];

	for (let i = 0; i < localStorage.length; i++) {
		const name = localStorage.key(i);
		projects.push(getProject(name));
	}

	return projects;
}
