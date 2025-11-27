import { PubSub } from "./src/services/pubsub";
import { Message } from "./src/models/message";

// Initialize the PubSub system
const pubsub = new PubSub();

// Create or retrieve a topic
const topic = pubsub.getOrCreateTopic<string>("AI", "ML");

// Set up a subscriber that logs received messages
const subscriber = pubsub.createSubscriber<string>("AI");
subscriber.onChange((msg) => console.log("Subscriber received:", msg));

// Create a publisher for the same topic
const publisher = pubsub.createPublisher<string>("AI");

// Publish a message
(async () => {
    await publisher.publish(new Message("Hello, PubSub!"));
})();