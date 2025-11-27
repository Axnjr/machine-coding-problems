export class Message<T> {
    constructor(private content: T) {}
    getContent() {
        return this.content
    }
    setContent(newContent: T) {
        this.content = newContent
    }
}