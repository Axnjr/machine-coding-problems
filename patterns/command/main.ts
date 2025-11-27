import { LightOnCommand } from "./commands";
import { Executor } from "./executor";
import { Aplliance } from "./models/appliance";

const light = new Aplliance('light');
const lightOn = new LightOnCommand(light)
const remote = new Executor(lightOn);
remote.pressButton()