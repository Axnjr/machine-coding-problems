// /Users/radha_govind/Desktop/machines/elevator/index.ts

import { Building } from "./models/building";

/**
 * Simple demo that spins up a building with the default
 * number of floors (10) and elevators (4), then starts the
 * simulation loop.
 *
 * External requests are generated every few seconds to showcase
 * the system in action.
 */
async function main() {
  const building = new Building();               // defaults: 10 floors, 4 elevators
  const controller = building.getController();   // controller holds the scheduler

  // Generate random external calls every 3 seconds
  setInterval(() => {
    const floor = Math.floor(Math.random() * 10);          // 0‑9
    const direction = Math.random() > 0.5 ? "UP" : "DOWN";
    console.log(`📞 External request: floor ${floor} ${direction}`);
    controller.handleIncomingRequest(floor, direction);
  }, 3000);

  // Start the async tick‑driven simulation (runs forever)
  await controller.start();
}

// Run the demo
main().catch((err) => console.error("❌ Simulation error:", err));