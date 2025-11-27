import { createInterface } from "readline";
import { BowlingAlley } from "./core/models/bowling-alley";

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
    alley.startGame();
    alley.showScores();

    rl.close();
}

main();