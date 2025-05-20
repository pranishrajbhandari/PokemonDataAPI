import { Request, Response } from "express";
import PokemonModel from "../models/Pokemon";

export const addFavorite = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, name, addedBy } = req.body;
  if (!id || !name) {
    res.status(400).json({ error: "Pokemon id and name are required" });
    return;
  }

  try {
    const exists = await PokemonModel.findOne({ id, addedBy });
    if (exists) {
      res.status(409).json({ error: "Pokemon already favorited" });
      return;
    }

    const newFavorite = new PokemonModel({ id, name, addedBy });
    await newFavorite.save();
    res.status(201).json(newFavorite);
  } catch (err) {
    res.status(500).json({ error: "Failed to save favorite", details: err });
  }
};

export const removeFavorite = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, addedBy } = req.query;
  if (!id || !addedBy) {
    res.status(400).json({ error: "id and addedBy are required" });
    return;
  }

  try {
    const deleted = await PokemonModel.findOneAndDelete({
      id: Number(id),
      addedBy,
    });
    if (!deleted) {
      res.status(404).json({ error: "Favorite not found" });
      return;
    }
    res.status(200).json({ message: "Favorite removed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove favorite", details: err });
  }
};

export const getFavorites = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { addedBy } = req.query;
  if (!addedBy) {
    res.status(400).json({ error: "addedBy is required" });
    return;
  }

  try {
    const favorites = await PokemonModel.find({ addedBy }).sort({ _id: -1 });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch favorites", details: err });
  }
};

export const isPokemonFavorited = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { addedBy, pokemonId } = req.query;

  if (!addedBy || !pokemonId) {
    res.status(400).json({ error: "addedBy and pokemonId are required" });
    return;
  }

  try {
    const isFavorited = await PokemonModel.exists({ addedBy, id: pokemonId });
    res.json({ isFavorited: !!isFavorited });
  } catch (err) {
    res.status(500).json({ error: "Failed to check favorite", details: err });
  }
};
