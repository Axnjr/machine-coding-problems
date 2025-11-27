Problem Statement
You are building an Alert Escalation System for a monitoring platform. When a critical system fails, alerts are raised. If no one acknowledges the alert within a certain time, it should automatically escalate to a higher authority.

Your job is to design and implement this system.

Requirements
Functional Requirements
1. Alert Creation
The system should allow creating an alert with:

alertId (unique string identifier)

serviceName (e.g., "database", "api-server")

severity (enum: LOW, MEDIUM, HIGH, CRITICAL)

message (string describing the issue)

When an alert is created:

Store it in memory.

Immediately send a notification to the first recipient in the escalation policy for that severity.

Alert status becomes TRIGGERED.

2. Alert States
An alert has one of these statuses:

TRIGGERED – just created, waiting for acknowledgment.

ACKNOWLEDGED – someone has taken responsibility, no further escalation.

RESOLVED – issue is fixed.

3. Escalation Policy
For each severity level, define an escalation policy with steps.

Each step has:

delaySeconds (int) – how many seconds after alert creation to trigger this step.

recipient (string) – who to notify (e.g., "oncall_eng", "team_lead", "manager").

channel (enum: EMAIL, SLACK).

Example policy for CRITICAL severity:

Step 1: delay = 0s, recipient = oncall_eng, channel = SLACK

Step 2: delay = 10s, recipient = tech_lead, channel = EMAIL

Step 3: delay = 20s, recipient = manager, channel = SLACK

Behavior:

At t = 0s (alert creation): notify oncall_eng via SLACK.

At t = 10s: if alert still TRIGGERED, notify tech_lead via EMAIL.

At t = 20s: if alert still TRIGGERED, notify manager via SLACK.

4. Acknowledge Alert
API: acknowledgeAlert(alertId, acknowledgedBy)

Behavior:

If status is TRIGGERED, change status to ACKNOWLEDGED.

Record who acknowledged and when.

Stop all further escalation for this alert.

If already ACKNOWLEDGED or RESOLVED, either treat as no-op or error (your choice, but be consistent).

5. Resolve Alert
API: resolveAlert(alertId, resolvedBy)

Behavior:

If status is TRIGGERED or ACKNOWLEDGED, change status to RESOLVED.

Record who resolved and when.

No further notifications after resolution.

6. Notification Channels
Implement at least 2 channels:

EmailHandler – prints: [EMAIL] To: {recipient}, Alert: {alertId}, Message: {message}

SlackHandler – prints: [SLACK] To: {recipient}, Alert: {alertId}, Message: {message}

Each handler is a concrete implementation of a NotificationChannel interface or abstract class.

7. Query APIs (Basic)
getAlert(alertId) – return alert with all details:

alertId, serviceName, severity, status

created/acknowledged/resolved timestamps

last notified recipient (if any)

listAlerts() – print all alerts to console with their status.