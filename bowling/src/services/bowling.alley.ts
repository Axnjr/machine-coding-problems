
import { Game } from "../models/game";
import { SimplifiedScoringStrategy } from "./simplified.scoring";

export class BowlingAlley {
    game: Game;

    constructor(playerNames: string[]) {
        this.game = new Game(playerNames, new SimplifiedScoringStrategy());
    }

    play(playerId: string, pins: number) {
        this.game.roll(playerId, pins);
        console.log(`Player ${playerId} rolled ${pins}. Score: ${this.game.getScore(playerId)}`);
    }

    printScores() {
        this.game.players.forEach(p => {
            console.log(`${p.id}: ${this.game.getScore(p.id)}`);
        });
    }
}
