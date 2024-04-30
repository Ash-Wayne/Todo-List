import { getProject } from './projects.js';

export function loadProjectsFromDatabase() {
	const projects = [];

	for (let i = 0; i < localStorage.length; i++) {
		const projectName = localStorage.key(i);
		projects.push({ projectName, lastUpdated: getProject(projectName).lastUpdated, projectTodos: getProject(projectName).listOfTodos });
	}

	const projectsSortedEarlyToLate = projects.sort((projectA, projectB) => {
		if (projectA.lastUpdated > projectB.lastUpdated) return 1;
		else return -1;
	});

	return projectsSortedEarlyToLate;
}
