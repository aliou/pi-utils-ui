import { ProcessTerminal, TuiMainScreen } from "@earendil-works/pi-tui";
import { ShowcaseApp } from "./app/showcase-app";

const terminal = new ProcessTerminal();
const tui = new TuiMainScreen(terminal, false);

const app = new ShowcaseApp();
tui.addChild(app);
tui.setFocus(app);

app.onQuit = () => {
  tui.stop();
  process.exit(0);
};

tui.start();
