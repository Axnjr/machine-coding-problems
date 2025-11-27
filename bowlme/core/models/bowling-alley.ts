import { RandomStrategy } from "../services/strategy";
import { Game } from "./game";

export class BowlingAlley {
    private game: Game;

    constructor(playerNames: string[]) {
        this.game = new Game(new RandomStrategy(), playerNames);
    }

    startGame() {
        this.game.start();
    }

    showScores() {
        const scores = this.game.getAllPlayersScores();
        Object.entries(scores).forEach(([name, scores]) => {
            console.log(`${name}:`);
            scores.forEach((score, index) => {
                console.log(`  Set ${index + 1}: ${score}`);
            });
        });
    }
}