import { Router } from "express";
import { register } from "../controller/auth.controller.js";
import { login } from "../controller/auth.controller.js";
import validateRegister from '../middleware/validators/auth.validator.js'
import { validateLogin } from "../middleware/validators/login.validator.js";

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

export default router;
