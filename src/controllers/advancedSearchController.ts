import { Request, Response } from "express";
import { pokemonCache } from "../config/cache";
import { PokemonSummary } from "../models/SearchedPokemon";
import { fetchGen1to3PokemonSummary } from "../service";

type AdvancedSearchBody = {
  searchText?: string;
  types?: string[];
  habitats?: string[];
  classification?: "legendary" | "mythical" | "normal";
};

export const advancedSearch = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { searchText, types, habitats, classification } =
    req.body as AdvancedSearchBody;

  console.log(searchText, types, habitats, classification);

  let allData = pokemonCache.get<PokemonSummary[]>("pokemonData");

  if (!allData) {
    allData = await fetchGen1to3PokemonSummary();
  }

  const typeFilter = types?.length
    ? types.map((type) => type.toLowerCase())
    : [];

  const habitatFilter = habitats?.length
    ? habitats.map((habitat) => habitat.toLowerCase())
    : [];

  const classificationFilter = classification?.toLowerCase();

  const filtered = allData.filter((pokemon) => {
    const matchesText = searchText
      ? pokemon.name.toLowerCase().startsWith(searchText.toLowerCase())
      : true;

    const matchesType = typeFilter.length
      ? typeFilter.some((type) =>
          pokemon.types
            .map((pokemonType) => pokemonType.toLowerCase())
            .includes(type)
        )
      : true;

    const matchesHabitat = habitatFilter.length
      ? habitatFilter.some((habitat) =>
          (pokemon.habitat || "").toLowerCase().includes(habitat)
        )
      : true;

    const matchesClassification = classificationFilter
      ? pokemon.classification === classificationFilter
      : true;

    return (
      matchesText && matchesType && matchesHabitat && matchesClassification
    );
  });

  return res.json({
    count: filtered.length,
    results: filtered,
  });
};

export const getFilterOptions = async (
  req: Request,
  res: Response
): Promise<any> => {
  let allData = pokemonCache.get<PokemonSummary[]>("pokemonData");

  if (!allData) {
    allData = await fetchGen1to3PokemonSummary();
  }

  const typesSet = new Set<string>();
  const habitatsSet = new Set<string>();
  const classificationsSet = new Set<string>();

  allData.forEach((pokemon) => {
    pokemon.types.forEach((type) => typesSet.add(type.toLowerCase()));

    if (pokemon.habitat) {
      habitatsSet.add(pokemon.habitat.toLowerCase());
    }

    classificationsSet.add(pokemon.classification.toLowerCase());
  });

  const types = Array.from(typesSet);
  const habitats = Array.from(habitatsSet);
  const classifications = Array.from(classificationsSet);

  return res.json({
    types,
    habitats,
    classifications,
  });
};
