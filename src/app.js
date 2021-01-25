import './scss/main.scss';
import $ from 'jquery';
import { Game } from './app/Game';
import playerJet from './assets/images/playerJet.png';
import enemyJet from './assets/images/enemyJet.png';
import missile from './assets/images/missile.png';
import frontTrees from './assets/images/frontTrees.png';
import middleCity from './assets/images/middleCity.png';
import middleCityShadow from './assets/images/middleCityShadow.png';
import middleBackground from './assets/images/middleBackground.png';
import middleBackgroundShadow from './assets/images/middleBackgroundShadow.png';
import farSun from './assets/images/farSun.png';
import farBackground from './assets/images/farBackground.png';
import explosion from './assets/images/explosion.gif';

const gameButtons = $('.game-btn');
const splashScreen = $('.splash-screen');
const menuContainer = $('.menu');
const gameContainer = $('.game');

const gameplayElements = [
    playerJet, enemyJet, missile, explosion,
    frontTrees, middleCity, middleCityShadow, middleBackground, middleBackgroundShadow, farSun, farBackground
];

let game;

$(document).ready(() => {
    game = new Game(gameplayElements);
    gameContainer.fadeOut();
});

gameButtons.on('click', () => {
    splashScreen.fadeOut();
    menuContainer.fadeOut();

    setTimeout(() => {
        gameContainer.append(game.app.view);
        gameContainer.fadeIn();
    }, 500);

    setTimeout(() => {
        game.startGame();
    }, 1500);
});