import {Component, ElementRef, input, ViewChild} from '@angular/core';
import {Pokemon, pokemonColorHexCodes} from '../pokemon';

@Component({
  selector: 'app-pokemon-card',
  imports: [],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.css',
})
export class PokemonCard {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;

  caughtPokemon = input.required({
    transform: (pokemon: Pokemon) => {
      this.drawImageOnCanvas(pokemon.imageUrl, pokemonColorHexCodes[pokemon.color]);
      pokemon.name = this.toTitleCase(pokemon.name);
      pokemon.evolvesFrom = this.toTitleCase(pokemon.evolvesFrom);
      pokemon.abilities = pokemon.abilities.map(ability => this.toTitleCase(ability));
      pokemon.flavorText = this.toTextCase(pokemon.flavorText);
      return pokemon;
    }
  });

  private drawImageOnCanvas(imageUrl: string, fillStyle: string) {
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d');

    const x = canvas.width / 2;
    const y = canvas.height / 2;
    const radius = Math.min(...[canvas.width, canvas.height]) / 2;
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = fillStyle;
    context.fill();

    const image = new Image();
    image.onload = () => {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = imageUrl;
  }

  private toTitleCase(name: string): string {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/F$/, 'female')
      .replace(/M$/, 'male');
  }

  private toTextCase(text: string) {
    let aux = text.replaceAll(/\f/g, ' ');
    for (const match of text.matchAll(/(\b[A-Za-zÀ-Ýà-ÿ]+[A-ZÀ-Ý]\b)/g)) {
      const word = match[0];
      aux = ''.concat(
        aux.slice(0, match.index),
        word.charAt(0) + word.slice(1).toLowerCase(),
        aux.slice(match.index + word.length)
      );
    }
    return aux;
  }
}
