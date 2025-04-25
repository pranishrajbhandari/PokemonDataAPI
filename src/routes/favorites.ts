import { Router } from 'express';
import { addFavorite, removeFavorite, getFavorites } from '../controllers/favoritesController';

const router = Router();

router.post('/', addFavorite);
router.delete('/', removeFavorite);
router.get('/', getFavorites);

export default router;
