import { Constants } from "../constants";

export interface Strategy {
    calculateScoreForRoll(pointsUntillNow: number): number
    applySpareBonusPoints(totalPoints: number): number
    applyStrikeBonusPoints(firstRoundPoint: number, round: number): number
}

export class RandomStrategy implements Strategy {
    calculateScoreForRoll(pointsUntillNow: number): number {
        return Math.floor(Math.random() * Constants.PINS - pointsUntillNow)
    }
    applySpareBonusPoints(totalPoints: number): number {
        return totalPoints == Constants.SPARE_THRESHOLD ? Constants.SPARE_BONUS_POINTS : 0;
    }
    applyStrikeBonusPoints(firstRoundPoint: number, round: number): number {
        if (round > 1) return 0;
        else return firstRoundPoint == Constants.STRIKE_THRESHOLD ? Constants.STRIKE_BONUS_POINTS : 0
    }
}

export class WinningStrategy implements Strategy {
    calculateScoreForRoll(pointsUntillNow: number): number {
        return pointsUntillNow == 0 ? 10 : 0;
    }
    applySpareBonusPoints(totalPoints: number): number {
        return totalPoints == Constants.SPARE_THRESHOLD ? Constants.SPARE_BONUS_POINTS : 0;
    }
    applyStrikeBonusPoints(firstRoundPoint: number, round: number): number {
        if (round > 1) return 0;
        else return firstRoundPoint == Constants.STRIKE_THRESHOLD ? Constants.STRIKE_BONUS_POINTS : 0
    }
}