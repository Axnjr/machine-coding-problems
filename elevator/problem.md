# Goal: Design an elevator system that supports multiple elevators across multiple floors.

## Each elevator should be able to:

Accept floor requests from inside the elevator
Respond to external up/down calls from floors
Move up or down one floor at a time
Open/close doors when it reaches a destination floor

## The system should also:

Decide which elevator to assign for each external request
Optimize for minimum wait time and efficient movement
Handle requests even while elevators are in motion”
You’ll model it in object-oriented design, write fully working code, and simulate how elevators behave under different inputs

## Constraints

Number of elevators: 4
Number of floors: 10
Each elevator has a current floor, direction (UP/DOWN/IDLE), and a queue of requests
Requests can come in any order, at any time
Each elevator can only move one floor per tick (we’ll simulate time in discrete steps)

<!-- My strategy -->

## Entities:
- Elevator - Should accept request from itslef as well!
- Floor - Requests elevators to come to them.
- Queue - Store the incomming requests.
- SchedulingPolicy - Plugin for elevators / queue to influence how the scheduling should work.
- Controller -  Controls the elevators based on the incomming requests & previous requests stored in queues.
- Door - The door should only open when the elevator reaches the destination floor.
- Building - Entry point, interaction layer.
- Ticker - To keep track of wait time.