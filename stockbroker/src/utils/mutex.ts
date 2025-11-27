export class Mutex {
    private _isLocked: boolean = false;
    private _waiters: (() => void)[] = [];
    async acquire(): Promise<void> {
        if (!this._isLocked) {
            this._isLocked = true;
            return;
        }
        return new Promise((resolve) => this._waiters.push(() => {
            this._isLocked = true;
            resolve();
        }));
    }

    release() {
        // release the lock in FIFO order
        if (this._waiters.length > 0) {
            const next = this._waiters.shift();
            if (next) next();
        } else {
            this._isLocked = false;
        }
    }
}