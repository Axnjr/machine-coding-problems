import { BowlingAlley } from "./services/bowling.alley";
import { createInterface } from "readline";

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
};

async function main() {
    console.log("Welcome to the Multiplayer Bowling Alley!");

    const playerCountStr = await question("Enter number of players: ");
    const playerCount = parseInt(playerCountStr);

    if (isNaN(playerCount) || playerCount <= 0) {
        console.log("Invalid number of players.");
        rl.close();
        return;
    }

    const playerNames: string[] = [];
    for (let i = 0; i < playerCount; i++) {
        const name = await question(`Enter name for Player ${i + 1}: `);
        playerNames.push(name || `Player ${i + 1}`);
    }

    const alley = new BowlingAlley(playerNames);
    const game = alley.game;

    // Game Loop
    // We iterate through 10 sets (frames)
    // But wait, each player plays their frame fully? Or turn by turn?
    // Standard bowling: Player 1 Frame 1, Player 2 Frame 1...

    // We can iterate frames 1 to 10
    for (let frameIdx = 1; frameIdx <= 10; frameIdx++) {
        console.log(`\n--- Frame ${frameIdx} ---`);

        for (const player of game.players) {
            console.log(`\n${player.id}'s turn:`);

            // A player might have 1, 2, or 3 rolls depending on the frame and result
            // We need to check the frame status
            const frame = player.getFrame(frameIdx - 1); // 0-indexed in array

            while (!frame.isFinished()) {
                const rollNum = frame.getRolls().length + 1;
                const input = await question(`  Roll ${rollNum} (0-10): `);
                const pins = parseInt(input);

                if (isNaN(pins) || pins < 0 || pins > 10) {
                    console.log("  Invalid input. Please enter 0-10.");
                    continue;
                }

                // Validate logic (e.g. can't knock more than remaining pins)
                // Simplified validation:
                const currentRolls = frame.getRolls();
                const currentTotal = currentRolls.reduce((a, b) => a + b, 0);

                // Validation is tricky for 10th frame with bonuses
                // For normal frames: sum <= 10.
                // For 10th frame: 
                // If Strike, next rolls can be anything (reset pins).
                // If Spare, next roll can be anything.
                // This logic is usually inside Frame or Game.
                // For now, let's just trust the user or add basic check.

                try {
                    alley.play(player.id, pins);
                } catch (e) {
                    console.log(`  Error: ${e}`);
                }
            }
        }
    }

    console.log("\n--- Game Over ---");
    alley.printScores();
    const winner = game.getWinner();
    if (winner) {
        console.log(`Winner: ${winner.id} with ${game.getScore(winner.id)} points!`);
    } else {
        console.log("It's a tie!");
    }

    rl.close();
}

main();
