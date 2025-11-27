export enum Severity {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL",
}

export enum AlertStatus {
    TRIGGERED = "TRIGGERED",
    ACKNOWLEDGED = "ACKNOWLEDGED",
    RESOLVED = "RESOLVED",
}

export enum ChannelType {
    EMAIL = "EMAIL",
    SLACK = "SLACK",
}

export interface EscalationStep {
    delaySeconds: number;
    recipient: string;
    channel: ChannelType;
}

export interface EscalationPolicy {
    severity: Severity;
    steps: EscalationStep[];
}

export interface Alert {
    id: string;
    serviceName: string;
    severity: Severity;
    message: string;
    status: AlertStatus;
    createdAt: Date;
    acknowledgedAt?: Date;
    resolvedAt?: Date;
    acknowledgedBy?: string;
    resolvedBy?: string;
    lastNotifiedRecipient?: string;
    history: string[];
}
