
import { Player } from "./player";
import type { ScoringStrategy } from "../services/scoring.strategy";
import { Constants } from "../constants";

export class Game {
    players: Player[];
    scoringStrategy: ScoringStrategy;

    constructor(players: string[], scoringStrategy: ScoringStrategy) {
        this.players = players.map(p => new Player(p));
        this.scoringStrategy = scoringStrategy;
    }

    roll(playerId: string, pins: number) {
        const player = this.players.find(p => p.id === playerId);
        if (!player) throw new Error("Player not found");

        const currentFrame = player.getCurrentFrame();
        if (!currentFrame) throw new Error("Game over for player " + playerId);

        currentFrame.addRoll(pins);
    }

    getScore(playerId: string): number {
        const player = this.players.find(p => p.id === playerId);
        if (!player) throw new Error("Player not found");

        return this.scoringStrategy.calculateScore(player.frames);
    }

    isGameOver(): boolean {
        return this.players.every(p => p.frames.every(f => f.isFinished()));
    }

    getWinner(): Player | null {
        if (!this.isGameOver()) return null;

        return this.players.reduce((prev, current) => {
            return (this.getScore(prev.id) > this.getScore(current.id)) ? prev : current;
        });
    }
}