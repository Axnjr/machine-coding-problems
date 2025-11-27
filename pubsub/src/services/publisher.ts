import { Message } from "../models/message";
import { Topic } from "../models/topic";
import { Mutex } from "../utils/mutex";

/**
 * Publisher is responsible for publishing messages to a specific Topic.
 * It follows the Single Responsibility Principle – it only knows how to
 * publish. Thread‑safety is delegated to a Mutex which can be shared across
 * publishers (Dependency Inversion).
 */
export class Publisher<T> {
    constructor(private readonly topic: Topic<T>, private readonly mutex: Mutex) { }

    /**
     * Publish a message to the underlying topic. The operation is protected by
     * an async mutex to guarantee exclusive access when multiple publishers are
     * active concurrently (Open/Closed – we can change the locking strategy
     * without touching the publishing logic).
     */
    async publish(message: Message<T>): Promise<void> {
        const release = await this.mutex.lock();
        try {
            this.topic.notify(message.getContent());
        } finally {
            release();
        }
    }
}
