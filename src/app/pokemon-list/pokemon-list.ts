import {Component, ElementRef, signal, ViewChild} from '@angular/core';
import {Pokemon} from '../pokemon';
import {PokemonCard} from '../pokemon-card/pokemon-card';
import {PokemonService} from '../pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  imports: [PokemonCard],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.css',
})
export class PokemonList {
  protected readonly caughtPokemonGroup = signal<Pokemon[]>([]);
  protected readonly catchingPokemon = signal(true);
  protected readonly allCaughtPokemon = signal(false);
  protected readonly pokemonFled = signal(false);

  private readonly numberOfPokeBalls = 20;

  @ViewChild('scrollAnchor', {static: true})
  private scrollAnchor?: ElementRef<HTMLDivElement>;
  private observer?: IntersectionObserver;

  constructor(private readonly pokeService: PokemonService) {
  }

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(entries => {
      const isEnd = entries.some(entry => entry.isIntersecting);
      if (isEnd) void this.gottaCatchEmAll();
    });

    this.observer.observe(this.scrollAnchor!.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  protected async gottaCatchEmAll() {
    if (this.allCaughtPokemon()) return;

    this.catchingPokemon.set(true);

    this.pokeService.gottaCatchEmAll(this.caughtPokemonGroup().length, this.numberOfPokeBalls).then(newlyCaught => {
      if (newlyCaught.length < this.numberOfPokeBalls) this.allCaughtPokemon.set(true);
      this.caughtPokemonGroup.update(current => [...current, ...newlyCaught]);
    }).catch(error => {
      console.error(error);
      this.pokemonFled.set(true);
    }).finally(() =>
      this.catchingPokemon.set(false)
    );
  }
}
