import {
  Accessor,
  createContext,
  createEffect,
  createSignal,
  onMount,
  Setter,
  useContext,
} from "solid-js";
import { createStore, DeepReadonly, SetStoreFunction } from "solid-js/store";

class UserConfigFile {
  static Root: string = "HinokiOrange";

  path: string;

  constructor(rpath: string) {
    this.path = `${UserConfigFile.Root}/${rpath}`;
  }

  Read() {
    return window.go.main.App.ReadUserConfig(this.path);
  }

  Write(data: any) {
    window.go.main.App.WriteUserConfig(this.path, JSON.stringify(data));
  }
}

export interface UserConfigSchema {
  machineId?: string;
  workspace?: {
    recently?: Array<string>;
    last?: string;
  };
}

export interface GlobalStateSchema {
  UserConfig: {
    data: DeepReadonly<UserConfigSchema>;
    readonly isReady: boolean;
    readonly set: SetStoreFunction<UserConfigSchema>;
  };
  Workspace: {
    data: Accessor<string>;
    readonly set: Setter<string>;
  };
}

const GlobalState = createContext<GlobalStateSchema>();
const configFile = new UserConfigFile("config.json");

export function GlobalStateProvider(props: { children: any }) {
  const [config, setConfig] = createStore({} as UserConfigSchema);
  const [workspace, setWorkspace] = createSignal("");

  const provide: GlobalStateSchema = {
    UserConfig: {
      data: config,
      get isReady() {
        return !!config.machineId;
      },
      set: setConfig,
    },
    Workspace: {
      data: workspace,
      set: setWorkspace,
    },
  };

  onMount(async () => {
    try {
      setConfig(JSON.parse((await configFile.Read()) as string));
      if (!config.machineId) {
        throw Error();
      }
    } catch {
      console.error("creat new configurations...");
      setConfig({
        machineId: (await window.go.main.App.GetMachineId()) as string,
      } as UserConfigSchema);
    } finally {
      createEffect(() => {
        configFile.Write(config);
      });
    }
  });

  return (
    <GlobalState.Provider value={provide}>
      {props.children}
    </GlobalState.Provider>
  );
}

export function getGlobalState() {
  return useContext(GlobalState);
}
