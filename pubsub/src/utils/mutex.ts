export class Mutex {
    private _queue: (() => void)[] = [];
    private _locked = false;

    async lock(): Promise<() => void> {
        return new Promise<() => void>((resolve) => {
            const unlock = () => {
                if (this._queue.length > 0) {
                    const nextResolve = this._queue.shift();
                    if (nextResolve) nextResolve();
                } else {
                    this._locked = false;
                }
            };

            if (!this._locked) {
                this._locked = true;
                resolve(unlock);
            } else {
                this._queue.push(() => resolve(unlock));
            }
        });
    }
}
