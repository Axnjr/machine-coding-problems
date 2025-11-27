
import { BowlingAlley } from "./services/bowling.alley";

console.log("Testing Perfect Game (All Strikes)...");
const alley = new BowlingAlley(["Pro Bowler"]);
const game = alley.game;

// 10 frames.
// Frames 1-9: Strike (1 roll)
// Frame 10: Strike, Strike, Strike (3 rolls)
// Total rolls: 9 + 3 = 12.

for (let i = 1; i <= 9; i++) {
    alley.play("Pro Bowler", 10);
}
// 10th frame
alley.play("Pro Bowler", 10);
alley.play("Pro Bowler", 10);
alley.play("Pro Bowler", 10);

alley.printScores();
// Expected Score (Simplified):
// 1-9: 20 points each = 180.
// 10: 10+10 (bonus) + 10+10 (bonus) + 10+10 (bonus)? 
// Wait, my SimplifiedScoringStrategy sums the frame.
// Frame 10 rolls: [10, 10, 10]. Sum = 30.
// isStrike is true (first roll 10).
// Bonus = 10.
// Total Frame 10 score = 30 + 10 = 40.
// Total Score = 9 * 20 + 40 = 180 + 40 = 220.
// (Standard bowling perfect score is 300).

console.log("\nTesting Spare Game (All Spares)...");
const alley2 = new BowlingAlley(["Spare Master"]);
// Frames 1-9: 5, 5 (Spare)
// Frame 10: 5, 5, 5
for (let i = 1; i <= 9; i++) {
    alley2.play("Spare Master", 5);
    alley2.play("Spare Master", 5);
}
// 10th frame
alley2.play("Spare Master", 5);
alley2.play("Spare Master", 5);
alley2.play("Spare Master", 5);

alley2.printScores();
// Expected Score (Simplified):
// 1-9: 5+5=10. Spare bonus 5. Total 15. 9*15 = 135.
// 10: 5+5+5=15. Spare bonus 5. Total 20.
// Total = 135 + 20 = 155.

console.log("\nTesting Random Game...");
const alley3 = new BowlingAlley(["Rookie"]);
// Frame 1: 3, 4 (7)
alley3.play("Rookie", 3);
alley3.play("Rookie", 4);
// Frame 2: 10 (Strike) -> 20
alley3.play("Rookie", 10);
// Frame 3: 5, 5 (Spare) -> 15
alley3.play("Rookie", 5);
alley3.play("Rookie", 5);

alley3.printScores();
// Score: 7 + 20 + 15 = 42.
