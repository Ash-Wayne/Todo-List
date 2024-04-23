import './reset.css';
import './styles.css';
import { createDefaultProject } from './projects.js';
import { createNewProject } from './projects.js';
import { getProject } from './projects.js';
import { deleteProject } from './projects.js';
import { loadProjectsFromDatabase } from './on-load.js';
import { createTodo } from './todo.js';
import { readTodo } from './todo.js';
import { updateTodo } from './todo.js';
import { deleteTodo } from './todo.js';
import { addToChecklist } from './checklist.js';
import { editChecklistItem } from './checklist.js';
import { changeItemStatus } from './checklist.js';
import { removeChecklistItem } from './checklist.js';
import { readChecklistFromMemory } from './checklist.js';
import { returnFinalChecklist } from './checklist.js';
import { deleteChecklist } from './checklist.js';
import { reloadChecklistIntoMemory } from './checklist.js';

// createDefaultProject();
// createNewProject('daily');

// addToChecklist('wake up');
// addToChecklist('pee');
// addToChecklist('brush');

// createTodo('daily', 'task', 'this is the task', new Date('2014, 1, 11'), 'high', 'no notes', returnFinalChecklist());

// console.log(readTodo('daily', 0));

// updateTodo('daily', 0, 'task', 'first task', new Date('2014, 1, 11'), true, 'high', 'no notes');

// deleteTodo('daily', 0);

// console.log(loadProjectsFromDatabase());

// console.log(getProject('Default'));
// deleteProject('daily');

// reloadChecklistIntoMemory(readTodo(1).checklist);

// console.log(readChecklistFromMemory());

// editChecklistItem(1, 'pee', 'pee and poop');
// changeItemStatus(0, true);

// updateTodo(1, 'task', 'first task', new Date('2014, 1, 11'), 'high', 'no notes', returnFinalChecklist());

// console.log(readChecklistFromMemory());

// deleteTodo(1);

// removeChecklistItem(1);

// console.log(returnFinalChecklist());

// reloadChecklistIntoMemory(['start', 'keep going', 'finish']);
// console.log(readChecklistFromMemory());

// console.log(readTodo(1));

// deleteTodo(1);

// , ['start', 'keep going', 'finish']
