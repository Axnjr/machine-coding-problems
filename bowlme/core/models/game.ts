import { Player } from "./players";
import type { Strategy } from "../services/strategy";

export class Game {
    private players: Player[] = [];
    private strategy: Strategy;

    constructor(strategy: Strategy, playerNames: string[]) {
        this.strategy = strategy;
        playerNames.forEach(name => {
            this.players.push(new Player(this.strategy, name));
        });
    }

    start() {
        this.players.forEach(player => {
            player.startSets();
        });
    }

    getTotalPoints(): number {
        return this.players.reduce((total, player) => total + player.getTotalPoints(), 0);
    }

    getPlayers(): Player[] {
        return this.players;
    }

    getAllPlayersScores(): Record<string, string[]> {
        return this.players.reduce((scores: Record<string, string[]>, player) => {
            scores[player.getName()] = player.getAllSetScore();
            return scores;
        }, {} as Record<string, string[]>);
    }
}