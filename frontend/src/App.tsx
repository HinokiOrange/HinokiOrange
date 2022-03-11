import { Match, Switch } from "solid-js";
import { getGlobalState, GlobalStateProvider } from "./globalState";

function Main() {
  const { UserConfig } = getGlobalState();

  return (
    <div class="grid w-screen h-screen grid-cols-1 grid-rows-1 justify-items-center items-center text-white">
      <Switch fallback={<div>Initializing...</div>}>
        <Match when={!UserConfig.isReady}>
          <div>Loading User Configuration...</div>
        </Match>
      </Switch>
    </div>
  );
}

function App() {
  return (
    <GlobalStateProvider>
      <Main />
    </GlobalStateProvider>
  );
}

export default App;
