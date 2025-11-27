
import type { ScoringStrategy } from "./scoring.strategy";
import { Frame } from "../models/frame";
import { Constants } from "../constants";

export class SimplifiedScoringStrategy implements ScoringStrategy {
    calculateScore(frames: Frame[]): number {
        let totalScore = 0;

        for (const frame of frames) {
            const rolls = frame.getRolls();
            const frameSum = rolls.reduce((a, b) => a + b, 0);

            let frameScore = frameSum;

            // Apply bonuses
            // Note: We need to check if the frame is actually a Strike or Spare
            // The Frame class has logic for this, but we should expose it or recalculate
            // Assuming Frame.isStrike / isSpare are accessible or we use getters

            if (frame.getIsStrike()) {
                frameScore += Constants.STRIKE_BONUS_POINTS;
            } else if (frame.getIsSpare()) {
                frameScore += Constants.SPARE_BONUS_POINTS;
            }

            totalScore += frameScore;
        }

        return totalScore;
    }
}
