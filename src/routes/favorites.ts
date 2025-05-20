import { Router } from "express";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
  isPokemonFavorited,
} from "../controllers/favoritesController";

const router = Router();

router.post("/", addFavorite);
router.delete("/", removeFavorite);
router.get("/", getFavorites);
router.get("/isFavorite", isPokemonFavorited);

export default router;
