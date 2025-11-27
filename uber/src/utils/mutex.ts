export class Mutex {
    private _locked = false;
    private _waiters: (() => void)[] = [];

    async lock(): Promise<() => void> {
        return new Promise<() => void>(resolve => {
            const unlock = async () => {
                if (this._waiters.length > 0){
                    const nextResolve = this._waiters.shift();
                    if (nextResolve) nextResolve()
                }
            }
            if (!this._locked){
                this._locked = true;
                resolve(unlock)
            } else {
                this._waiters.push(() => resolve(unlock))
            }
        })
    }

    async acquire(): Promise<void> {
        if (!this._locked) {
            this._locked = true;
            return;
        }
        return new Promise<void>((resolve) => {
            this._waiters.push(() => {
                this._locked = true;
                resolve();
            });
        });
    }

    release(): void {
        if (this._waiters.length > 0) {
            const next = this._waiters.shift();
            if (next) next();
        } else {
            this._locked = false;
        }
    }
}
