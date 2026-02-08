import type { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

// Define paths
// AIGestion/backend/src/controllers -> AIGestion/task/data/tasks.json
// runtime: AIGestion/backend/dist/controllers -> ...
// Standardizing on process.cwd() being AIGestion/backend
const TASKS_FILE_PATH = path.resolve(process.cwd(), '../task/data/tasks.json');

export interface Task {
  id: number;
  title: string;
  type: string;
  priority: string;
  priorityValue: number;
  status: string;
  description: string;
  tags: string;
  dueDate: string;
  created: string;
  updated: string;
  completed: string | null;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  assignee: string;
  dependencies: number[];
  notes: string[];
}

export interface TaskData {
  metadata: {
    version: string;
    created: string;
    lastUpdated: string;
    totalTasks: number;
    completedTasks: number;
    activeTasks: number;
  };
  tasks: Task[];
}

/**
 * Helper to read tasks
 */
async function readTasksData(): Promise<TaskData> {
  try {
    const data = await fs.readFile(TASKS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    logger.error(`Error reading tasks file at ${TASKS_FILE_PATH}`, error);
    throw new Error('Failed to read tasks data');
  }
}

/**
 * Helper to write tasks
 */
async function writeTasksData(data: TaskData): Promise<void> {
  try {
    // Update metadata
    data.metadata.lastUpdated = new Date().toISOString();
    data.metadata.totalTasks = data.tasks.length;
    data.metadata.completedTasks = data.tasks.filter(t => t.status === 'done').length;
    data.metadata.activeTasks = data.tasks.filter(
      t => t.status !== 'done' && t.status !== 'cancelled',
    ).length;

    await fs.writeFile(TASKS_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    logger.error(`Error writing tasks file at ${TASKS_FILE_PATH}`, error);
    throw new Error('Failed to write tasks data');
  }
}

/**
 * Get all tasks
 */
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await readTasksData();
    res.json(data);
  } catch (error) {
    logger.error('Error fetching tasks', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

/**
 * Create a new task
 */
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await readTasksData();

    const newTask: Task = {
      id: Math.max(...data.tasks.map(t => t.id), 0) + 1,
      title: req.body.title,
      type: req.body.type || 'feature',
      priority: req.body.priority || 'medium',
      priorityValue: req.body.priorityValue || 3, // Simplistic validation, should rely on schema
      status: req.body.status || 'todo',
      description: req.body.description || '',
      tags: req.body.tags || '',
      dueDate: req.body.dueDate || '',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      completed: null,
      estimatedHours: req.body.estimatedHours || 0,
      actualHours: 0,
      progress: 0,
      assignee: req.body.assignee || 'Alejandro',
      dependencies: req.body.dependencies || [],
      notes: [],
    };

    data.tasks.push(newTask);
    await writeTasksData(data);

    res.status(201).json(newTask);
  } catch (error) {
    logger.error('Error creating task', error);
    res.status(500).json({ message: 'Error creating task' });
  }
};

/**
 * Update a task
 */
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = parseInt((req.params as any).id);
    if (isNaN(taskId)) {
      res.status(400).json({ message: 'Invalid task ID' });
      return;
    }

    const data = await readTasksData();
    const taskIndex = data.tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const updatedTask = {
      ...data.tasks[taskIndex],
      ...req.body,
      id: taskId, // Ensure ID doesn't change
      updated: new Date().toISOString(),
    };

    // Check if status changed to done
    if (req.body.status === 'done' && data.tasks[taskIndex].status !== 'done') {
      updatedTask.completed = new Date().toISOString();
      updatedTask.progress = 100;
    } else if (req.body.status && req.body.status !== 'done') {
      updatedTask.completed = null;
    }

    data.tasks[taskIndex] = updatedTask;
    await writeTasksData(data);

    res.json(updatedTask);
  } catch (error) {
    logger.error('Error updating task', error);
    res.status(500).json({ message: 'Error updating task' });
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = parseInt((req.params as any).id);
    if (isNaN(taskId)) {
      res.status(400).json({ message: 'Invalid task ID' });
      return;
    }

    const data = await readTasksData();
    const initialLength = data.tasks.length;
    data.tasks = data.tasks.filter(t => t.id !== taskId);

    if (data.tasks.length === initialLength) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    await writeTasksData(data);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    logger.error('Error deleting task', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
};
