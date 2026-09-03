import {Router} from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/authorize.middlware.js';
import { validateTask } from '../middleware/validators/task.validator.js';
import { createTask } from '../controller/task.controller.js';
import { getTask } from '../controller/task.controller.js';

const router = Router();

router.use(authenticate);

router.post('/create', authorize('ADMIN', 'MANAGER'), validateTask, createTask);
router.get('/find', getTask);

export default router;