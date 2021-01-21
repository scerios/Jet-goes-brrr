import './scss/main.scss';
import $ from 'jquery';
import { Game } from './app/Game';

const gameButtons = $('.game-btn');

gameButtons.on('click', () => {
    let game = new Game();
    console.log(game.hello);

    for (let gameButton of gameButtons) {
        $(gameButton).prop('disabled', true);
    }
});