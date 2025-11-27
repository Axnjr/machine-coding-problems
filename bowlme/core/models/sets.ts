import { Constants } from "../constants";
import type { Strategy } from "../services/strategy";

export class Set {
    private readonly attempts: number = Constants.ROLLS;
    private points: number[] = [];
    private strategy: Strategy;
    private isLastSet: boolean = false;

    constructor(strategy: Strategy, isLast: boolean = false) {
        this.strategy = strategy;
        this.isLastSet = isLast;
        for (let i = 0; i < this.attempts; i++) {
            this.points.push(0);
        }
    }

    start(): number {
        // the index of the points array is the attempt number
        let totalPoints = 0, isSpareOrStrike = false;
        for (let i = 1; i <= this.attempts; i++) {
            let score = this.strategy.calculateScoreForRoll(totalPoints)
            // check for strike
            if (i == 1) {
                score = this.strategy.applyStrikeBonusPoints(score, i)
                if (score == Constants.STRIKE_THRESHOLD) {
                    totalPoints += score;
                    isSpareOrStrike = true;
                    break;
                }
            }
            this.points[i - 1] = score;
            totalPoints += score
        }
        let spareBonusPoints = this.strategy.applySpareBonusPoints(totalPoints);
        totalPoints += spareBonusPoints;
        // user has either scored a spare or a strike
        isSpareOrStrike = isSpareOrStrike || spareBonusPoints > 0;
        // if the last set and the user has scored a spare or a strike, then the user can roll 3 times
        if (this.isLastSet && isSpareOrStrike) {
            // last set can have 3 rolls; for 3rd roll all pins might be knocked down so we assume all pins are restored for the final roll
            totalPoints += this.strategy.calculateScoreForRoll(0);
        }
        return totalPoints;
    }

    getSetScore(): string {
        return this.points.join(", ");
    }

    getTotalScore(): string {
        return this.points.reduce((total, point) => total + point, 0).toString();
    }
}