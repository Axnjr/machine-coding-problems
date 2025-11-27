import { Constants } from "../constants";
import { Set } from "./sets";
import type { Strategy } from "../services/strategy";

export class Player {
    private totalSets: number = Constants.GAME_SETS;
    private sets: Set[] = [];
    private totalPoints: number = 0;
    private name: string;

    constructor(strategy: Strategy, name: string) {
        this.name = name;
        for (let i = 0; i < this.totalSets; i++) {
            this.sets.push(new Set(strategy, i == this.totalSets - 1));
        }
    }

    startSets() {
        this.sets.forEach(set => {
            let totalPoints = set.start();
            this.totalPoints += totalPoints;
        });
    }

    getTotalPoints(): number {
        return this.totalPoints;
    }

    getName(): string {
        return this.name;
    }

    getAllSetScore(): string[] {
        return this.sets.reduce((acc: string[], set) => {
            return acc.concat(set.getSetScore());
        }, [] as string[])
    }
}