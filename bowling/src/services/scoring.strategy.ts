
import { Frame } from "../models/frame";

export interface ScoringStrategy {
    calculateScore(frames: Frame[]): number;
}
