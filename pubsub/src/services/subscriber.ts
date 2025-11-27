import type { GenericTopicListner, Topic } from "../models/topic";

export class Subscriber<Event> {
    constructor(private topic: Topic<Event>) {}
    onChange(callback: GenericTopicListner<Event>) {
        this.topic.subscribe(callback);
    }
}