import { axiosPokeApiClient } from "../config/axiosClient";
import { pokemonCache } from "../config/cache";
import { PokemonSummary } from "../models/SearchedPokemon";


export const fetchGen1to3PokemonSummary = async (): Promise<PokemonSummary[]> => {
  const cachedData = pokemonCache.get<PokemonSummary[]>("pokemonData");
  if (cachedData) {
    console.log("Returning Pokémon data from cache");
    return cachedData;
  }

  const fetchSinglePokemon = async (id: number): Promise<PokemonSummary | null> => {
    try {
      const [pokemonRes, speciesRes] = await Promise.all([
        axiosPokeApiClient.get(`/pokemon/${id}`),
        axiosPokeApiClient.get(`/pokemon-species/${id}`),
      ]);

      const pokemon = pokemonRes.data;
      const species = speciesRes.data;

      return {
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types.map((type: any) => type.type.name),
        habitat: species.habitat?.name || null,
        classification: species.is_legendary
          ? "legendary"
          : species.is_mythical
          ? "mythical"
          : "normal",
      };
    } catch (err) {
      console.warn(`Failed to fetch Pokémon with ID ${id}`);
      return null;
    }
  };

  const allIds = Array.from({ length: 386 }, (_, i) => i + 1);
  const results: PokemonSummary[] = [];

  const concurrencyLimit = 10;
  for (let i = 0; i < allIds.length; i += concurrencyLimit) {
    const batch = allIds.slice(i, i + concurrencyLimit);
    const batchResults = await Promise.all(batch.map(fetchSinglePokemon));
    results.push(...(batchResults.filter(Boolean) as PokemonSummary[]));
  }

  pokemonCache.set("pokemonData", results);
  console.log("Pokémon data fetched and cached");
  return results;
};
