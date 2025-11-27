import { Topic } from "../models/topic";
import { Publisher } from "./publisher";
import { Subscriber } from "./subscriber";
import { Mutex } from "../utils/mutex";

/**
 * PubSub is the high‑level façade that coordinates topics, publishers and
 * subscribers. It follows the Dependency Inversion Principle – the concrete
 * implementations of Topic, Publisher and Mutex are injected, making the
 * system easy to extend (e.g., swapping a distributed broker).
 */
export class PubSub {
    private topics: Map<string, Topic<any>> = new Map();
    private mutex: Mutex = new Mutex();

    /** Create or retrieve a topic by name. */
    getOrCreateTopic<T>(name: string, description: string = ""): Topic<T> {
        if (!this.topics.has(name)) {
            this.topics.set(name, new Topic<T>(name, description));
        }
        // The cast is safe because we store the same generic type per name.
        return this.topics.get(name) as Topic<T>;
    }

    /** Create a publisher for a specific topic identified by its name. */
    createPublisher<T>(topicName: string, description: string = ""): Publisher<T> {
        const topic = this.getOrCreateTopic<T>(topicName, description);
        return new Publisher<T>(topic, this.mutex);
    }

    /** Create a subscriber for a specific topic identified by its name. */
    createSubscriber<T>(topicName: string, description: string = ""): Subscriber<T> {
        const topic = this.getOrCreateTopic<T>(topicName, description);
        return new Subscriber<T>(topic);
    }
}
