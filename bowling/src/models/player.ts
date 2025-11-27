
import { Frame } from "./frame";
import { Constants } from "../constants";

export class Player {
    id: string;
    frames: Frame[] = [];
    totalScore: number = 0;

    constructor(id: string) {
        this.id = id;
        this.initializeFrames();
    }

    private initializeFrames() {
        for (let i = 1; i <= Constants.GAME_SETS; i++) {
            this.frames.push(new Frame(i));
        }
    }

    getCurrentFrame(): Frame {
        return this.frames.find(f => !f.isFinished()) || this.frames[this.frames.length - 1]!;
    }

    getFrame(index: number): Frame {
        return this.frames[index]!;
    }
}
