/**
 * Simple Observable/Subject implementation for the Observer pattern.
 * Allows multiple listeners to subscribe to events of a generic payload type.
 */
export class Subject<T = any> {
    private listeners: Set<(payload: T) => void> = new Set();

    /** Register a listener. Returns a function to unsubscribe. */
    subscribe(listener: (payload: T) => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    /** Notify all registered listeners with the given payload. */
    notify(payload: T): void {
        for (const listener of this.listeners) {
            try {
                listener(payload);
            } catch (e) {
                // Swallow errors so one faulty listener does not break others.
                console.error('Observer error:', e);
            }
        }
    }
}
