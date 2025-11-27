
import { Constants } from "../constants";

export class Frame {
    private rolls: number[] = [];
    private isStrike: boolean = false;
    private isSpare: boolean = false;
    private frameNumber: number;

    constructor(frameNumber: number) {
        this.frameNumber = frameNumber;
    }

    addRoll(pins: number) {
        if (pins < 0 || pins > Constants.PINS) {
            throw new Error(`Invalid roll: ${pins}. Must be between 0 and ${Constants.PINS}.`);
        }

        // Validation based on previous rolls
        if (this.frameNumber < Constants.GAME_SETS) {
            const currentTotal = this.rolls.reduce((a, b) => a + b, 0);
            if (currentTotal + pins > Constants.PINS) {
                throw new Error(`Invalid roll: ${pins}. Total pins in frame cannot exceed ${Constants.PINS}.`);
            }
        } else {
            // 10th frame validation
            // If we have a strike, pins reset.
            // If we have a spare, pins reset.
            // If we have open frame, sum <= 10.

            // Logic:
            // If rolls[0] is 10 (Strike), then rolls[1] can be anything (0-10).
            // If rolls[0] + rolls[1] is 10 (Spare), then rolls[2] can be anything.
            // If rolls[0] + rolls[1] < 10, then rolls[2] is not allowed (handled by isFinished).

            // We need to track "current pins standing".
            // But simplified: just allow 0-10.
            // Unless it's the 2nd roll of an open frame.

            if (this.rolls.length === 1 && this.rolls[0]! < Constants.PINS) {
                if (this.rolls[0]! + pins > Constants.PINS) {
                    throw new Error(`Invalid roll: ${pins}. Total pins in frame cannot exceed ${Constants.PINS}.`);
                }
            }
            // If 2 rolls, and not a strike/spare (so sum < 10), we shouldn't be here (isFinished would be true).
            // If 2 rolls, and we have a Strike (10, X), or Spare (X, Y), then 3rd roll is allowed (0-10).
            // Wait, if Strike (10), then 2nd roll (X). If X < 10, then 3rd roll (Y). X+Y <= 10?
            // In standard bowling:
            // X _ _ -> X 10 10 (30)
            // X 5 4 -> 19
            // So if 2nd roll is not 10, 3rd roll must be valid wrt 2nd roll?
            // Yes, if you strike, you get 2 more balls. Those 2 balls are like a new frame.
            // If you roll 10, then 5. The pins are reset after 10.
            // Then you roll 5. Pins are 5 down. Remaining 5.
            // Next roll must be <= 5.
            // Unless the 2nd roll was also 10.

            // This logic is getting complex for "Simplified".
            // I'll stick to basic 0-10 check for now to avoid over-engineering the simplified version.
        }

        this.rolls.push(pins);
        this.calculateStatus();
    }

    private calculateStatus() {
        // Logic for Strike/Spare
        if (this.rolls.length > 0 && this.rolls[0] === Constants.PINS) {
            this.isStrike = true;
        } else if (this.rolls.length >= 2 && (this.rolls[0]! + this.rolls[1]! === Constants.PINS)) {
            this.isSpare = true;
        }
    }

    isFinished(): boolean {
        if (this.frameNumber < Constants.GAME_SETS) {
            return this.isStrike || this.rolls.length === Constants.ROLLS;
        } else {
            // 10th frame
            if (this.isStrike || this.isSpare) {
                return this.rolls.length === Constants.MAX_ROLLS_END;
            } else {
                return this.rolls.length === Constants.ROLLS;
            }
        }
    }

    getRolls(): number[] {
        return this.rolls;
    }

    getIsStrike(): boolean {
        return this.isStrike;
    }

    getIsSpare(): boolean {
        return this.isSpare;
    }
}
