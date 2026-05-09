import express from 'express';
import { getExperts, getExpert } from '../controllers/expertController';

const router = express.Router();

router.get('/', getExperts);
router.get('/:id', getExpert);

export default router;
