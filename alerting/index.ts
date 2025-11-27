import { AlertSystem } from "./src/AlertSystem";
import { Severity, ChannelType, type EscalationPolicy } from "./src/models";

const system = new AlertSystem();

// 1. Define Policy
const criticalPolicy: EscalationPolicy = {
    severity: Severity.CRITICAL,
    steps: [
        { delaySeconds: 0, recipient: "oncall_eng", channel: ChannelType.SLACK },
        { delaySeconds: 3, recipient: "tech_lead", channel: ChannelType.EMAIL },
        { delaySeconds: 6, recipient: "manager", channel: ChannelType.SLACK },
    ]
};
system.addPolicy(criticalPolicy);

console.log("Starting Simulation...");

// 2. Create Alert
system.createAlert("alert-1", "database", Severity.CRITICAL, "DB Connection Timeout");

// Helper to wait
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function runSimulation() {
    // Wait 2 seconds. Should see "oncall_eng" (immediate)
    await wait(2000);

    // Wait another 2 seconds (total 4s). Should see "tech_lead" (at 3s)
    await wait(2000);

    // Acknowledge alert before manager is notified (at 6s)
    console.log("\nAcking alert...");
    system.acknowledgeAlert("alert-1", "Alice");

    // Wait to ensure manager is NOT notified
    await wait(3000);

    system.listAlerts();

    // Resolve
    console.log("\nResolving alert...");
    system.resolveAlert("alert-1", "Bob");

    system.listAlerts();
}

runSimulation();