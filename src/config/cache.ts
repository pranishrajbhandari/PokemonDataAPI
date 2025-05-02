import NodeCache from "node-cache";

export const pokemonCache = new NodeCache({ stdTTL: 3600 });