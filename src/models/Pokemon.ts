import mongoose, { Schema, Document } from 'mongoose';

export interface IPokemon extends Document {
  id: number;
  name: string;
  addedBy: string;
}

const PokemonSchema = new Schema<IPokemon>({
  id:      { type: Number, required: true },
  name:    { type: String, required: true },
  addedBy: { type: String, required: true }
}, {
  timestamps: true
});

PokemonSchema.index({ id: 1, addedBy: 1 }, { unique: true });

// third argument is the exact collection name
export default mongoose.model<IPokemon>('Pokemon', PokemonSchema, 'Favorites');
