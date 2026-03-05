export interface Pokemon {
  id: number;
  imageUrl: string;
  name: string;
  abilities: string[];
  types: string[];
  stats: Record<string, number>;
  flavorText: string;
  evolutionStage: number;
  evolvesFrom: string;
  color: string
}

export const pokemonColorHexCodes: Record<string, string> = {
  black: '#DADADA',
  blue: '#B8B8FF',
  brown: '#F0C6C6',
  gray: '#DBDBDB',
  green: '#B8FFB8',
  pink: '#FFC0CB',
  purple: '#FFB8FF',
  red: '#FFB8B8',
  white: '#E7E7E7',
  yellow: '#FFFFB8',
}
