import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/authorize.middlware.js';
import { validateTask } from '../middleware/validators/task.validator.js';
import { createTask } from '../controller/task.controller.js';
import { getTask } from '../controller/task.controller.js';
import { getTaskById } from '../controller/task.controller.js';
import { updateTask } from '../controller/task.controller.js';
import { deleteTask } from '../controller/task.controller.js';
import { assignTaskToUser } from '../controller/task.controller.js';
import { updateTaskStatus } from '../controller/task.controller.js'

const router = Router();

router.use(authenticate);

router.post('/create', authorize('ADMIN', 'MANAGER'), validateTask, createTask);
router.get('/find', getTask);
router.get('/findOne/:id', getTaskById);
router.patch('/update/:id', updateTask);
router.patch('/assign/:taskId', assignTaskToUser);
router.patch('/:taskId/status', updateTaskStatus);
router.delete('/delete/:id', deleteTask);

export default router;