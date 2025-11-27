import { ChannelType, type Alert } from "./models";

export interface NotificationChannel {
    send(recipient: string, alert: Alert): void;
}

export class EmailChannel implements NotificationChannel {
    send(recipient: string, alert: Alert): void {
        console.log(`[EMAIL] To: ${recipient}, Alert: ${alert.id}, Message: ${alert.message}`);
    }
}

export class SlackChannel implements NotificationChannel {
    send(recipient: string, alert: Alert): void {
        console.log(`[SLACK] To: ${recipient}, Alert: ${alert.id}, Message: ${alert.message}`);
    }
}

export class ChannelFactory {
    static getChannel(type: ChannelType): NotificationChannel {
        switch (type) {
            case ChannelType.EMAIL:
                return new EmailChannel();
            case ChannelType.SLACK:
                return new SlackChannel();
            default:
                throw new Error(`Unknown channel type: ${type}`);
        }
    }
}
