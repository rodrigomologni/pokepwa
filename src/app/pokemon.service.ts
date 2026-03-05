import {Injectable} from '@angular/core';
import * as pokenode from 'pokenode-ts';
import {Pokemon} from './pokemon';

@Injectable({providedIn: 'root'})
export class PokemonService {
  private readonly client = new pokenode.MainClient();

  async gottaCatchEmAll(offset: number, limit: number) {
    const resources = await this.client.pokemon.listPokemons(offset, limit);
    return await Promise.all(resources.results.map(resource => this.pokeBallGo(resource.name)));
  }

  private async pokeBallGo(name: string): Promise<Pokemon> {
    const pokemon = await this.client.pokemon.getPokemonByName(name);
    const pokemonStats = this.loadPokemonStats(pokemon);
    const pokemonSpecies = await this.client.pokemon.getPokemonSpeciesByName(pokemon.species.name);
    const evolutionChain = await this.client.evolution.getEvolutionChainById(
      this.extractIdFromResourceUrl(pokemonSpecies.evolution_chain.url)
    );

    return {
      id: pokemon.id,
      name: pokemon.name,
      imageUrl: pokemon.sprites.other?.['official-artwork'].front_default ?? 'none.png',
      abilities: pokemon.abilities.map(pokemonAbility => pokemonAbility.ability.name),
      types: pokemon.types.map(pokemonType => pokemonType.type.name),
      stats: pokemonStats,
      flavorText: pokemonSpecies.flavor_text_entries
        .find(flavorText => flavorText.language.name === 'en')?.flavor_text ?? '',
      evolutionStage: this.findEvolutionStage(evolutionChain.chain, pokemon),
      evolvesFrom: this.findEvolvesFrom(evolutionChain.chain, pokemon),
      color: pokemonSpecies.color.name,
    }
  }

  private loadPokemonStats(pokemon: pokenode.Pokemon) {
    const pokemonStats: Record<string, number> = {};

    for (const key of ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed']) {
      pokemonStats[key] = pokemon.stats.find(pokemonStat => pokemonStat.stat.name === key)?.base_stat ?? 0;
    }

    return pokemonStats;
  }

  private findEvolutionStage(chain: pokenode.ChainLink, pokemon: pokenode.Pokemon, stage: number = 0): number {
    if (chain.species.name === pokemon.name) return stage;

    for (const evolvesTo of chain.evolves_to) {
      const evolutionStage = this.findEvolutionStage(evolvesTo, pokemon, stage + 1);
      if (evolutionStage) return evolutionStage;
    }

    return 1;
  }

  private findEvolvesFrom(
    currentChain: pokenode.ChainLink,
    pokemon: pokenode.Pokemon,
    previousChain: pokenode.ChainLink | undefined = undefined
  ): string {
    if (currentChain.species.name === pokemon.name) return previousChain?.species.name ?? '';

    for (const nextChain of currentChain.evolves_to) {
      const evolvesFrom = this.findEvolvesFrom(nextChain, pokemon, currentChain);
      if (evolvesFrom) return evolvesFrom;
    }

    return '';
  }

  private extractIdFromResourceUrl(url: string): number {
    return Number(url.match(/\/(?<id>\d+)\/$/)?.groups?.['id']) ?? 0;
  }
}
