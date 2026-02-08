import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/task.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// Protect all task routes
router.use(protect);

router.get('/', getTasks);
router.post('/', authorize('admin', 'editor'), createTask); // Only allow certain roles to create? Defaulting to authenticated for now, but authorize adds safety
router.put('/:id', authorize('admin', 'editor'), updateTask);
router.delete('/:id', authorize('admin'), deleteTask);

export default router;
