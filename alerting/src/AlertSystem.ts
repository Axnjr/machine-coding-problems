import { AlertStatus, Severity, type Alert, type EscalationPolicy, type EscalationStep } from "./models";
import { ChannelFactory } from "./channels";

export class AlertSystem {
    private alerts: Map<string, Alert> = new Map();
    private policies: Map<Severity, EscalationPolicy> = new Map();
    private timeouts: Map<string, ReturnType<typeof setTimeout>[]> = new Map();

    addPolicy(policy: EscalationPolicy) {
        this.policies.set(policy.severity, policy);
    }

    createAlert(id: string, serviceName: string, severity: Severity, message: string) {
        // If alert exists and is not resolved, we might want to ignore or update.
        // For this problem, we'll assume a new alert creation resets the state if the ID is reused,
        // or simply creates a new one. Given "unique string identifier", let's assume it's a new event.
        // However, if we overwrite, we should clear old timers.
        if (this.timeouts.has(id)) {
            this.clearTimers(id);
        }

        const alert: Alert = {
            id,
            serviceName,
            severity,
            message,
            status: AlertStatus.TRIGGERED,
            createdAt: new Date(),
            history: []
        };

        this.alerts.set(id, alert);
        this.triggerEscalation(alert);
        console.log(`Alert Created: ${alert.id} [${alert.severity}]`);
    }

    private triggerEscalation(alert: Alert) {
        const policy = this.policies.get(alert.severity);
        if (!policy) {
            console.warn(`No escalation policy found for severity: ${alert.severity}`);
            return;
        }

        const timers: ReturnType<typeof setTimeout>[] = [];

        policy.steps.forEach((step: EscalationStep) => {
            const timer = setTimeout(() => {
                this.handleEscalationStep(alert.id, step);
            }, step.delaySeconds * 1000);
            timers.push(timer);
        });

        this.timeouts.set(alert.id, timers);
    }

    private handleEscalationStep(alertId: string, step: EscalationStep) {
        const alert = this.alerts.get(alertId);
        if (!alert) return;

        // Double check status, though clearing timers should prevent this mostly.
        if (alert.status !== AlertStatus.TRIGGERED) {
            return;
        }

        const channel = ChannelFactory.getChannel(step.channel);
        channel.send(step.recipient, alert);

        alert.lastNotifiedRecipient = step.recipient;
        const log = `Notified ${step.recipient} via ${step.channel} at ${new Date().toISOString()}`;
        alert.history.push(log);
    }

    acknowledgeAlert(id: string, user: string) {
        const alert = this.alerts.get(id);
        if (!alert) {
            console.log(`Alert ${id} not found.`);
            return;
        }

        if (alert.status === AlertStatus.TRIGGERED) {
            alert.status = AlertStatus.ACKNOWLEDGED;
            alert.acknowledgedBy = user;
            alert.acknowledgedAt = new Date();
            this.clearTimers(id);
            console.log(`Alert ${id} ACKNOWLEDGED by ${user}`);
        } else {
            console.log(`Alert ${id} is already ${alert.status}, cannot acknowledge.`);
        }
    }

    resolveAlert(id: string, user: string) {
        const alert = this.alerts.get(id);
        if (!alert) {
            console.log(`Alert ${id} not found.`);
            return;
        }

        if (alert.status === AlertStatus.TRIGGERED || alert.status === AlertStatus.ACKNOWLEDGED) {
            alert.status = AlertStatus.RESOLVED;
            alert.resolvedBy = user;
            alert.resolvedAt = new Date();
            this.clearTimers(id);
            console.log(`Alert ${id} RESOLVED by ${user}`);
        } else {
            console.log(`Alert ${id} is already ${alert.status}, cannot resolve.`);
        }
    }

    private clearTimers(alertId: string) {
        const timers = this.timeouts.get(alertId);
        if (timers) {
            timers.forEach(t => clearTimeout(t));
            this.timeouts.delete(alertId);
        }
    }

    getAlert(id: string): Alert | undefined {
        return this.alerts.get(id);
    }

    listAlerts() {
        console.log("\n--- Current Alerts ---");
        this.alerts.forEach(alert => {
            console.log(`ID: ${alert.id} | Service: ${alert.serviceName} | Severity: ${alert.severity} | Status: ${alert.status} | Last Notified: ${alert.lastNotifiedRecipient || 'None'}`);
        });
        console.log("----------------------\n");
    }
}
