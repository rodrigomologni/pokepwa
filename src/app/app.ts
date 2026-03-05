import {Component} from '@angular/core';
import {PokemonList} from './pokemon-list/pokemon-list';

@Component({
  selector: 'app-root',
  imports: [PokemonList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
