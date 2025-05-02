export type PokemonSummary = {
  id: number;
  name: string;
  types: string[];
  habitat: string | null;
  classification: "legendary" | "mythical" | "normal";
};
