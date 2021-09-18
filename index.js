const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
require("electron-reload")(path.join(__dirname, "public"));
const pino = require("pino")();

const store = require("electron-json-storage");
const { stat, mkdir, readdir, readFile } = require("fs/promises");

const CheckWorkspaceLocal = (workspace) => {
  const workspace_config_local = path.join(workspace, ".hinoki-orange");
  return stat(workspace_config_local).then(
    (stats) => {
      // has config
      if (!stats.isDirectory()) {
        return Promise.reject(`[${workspace_config_local}] not a directory`);
      } else {
        return Promise.resolve();
      }
    },
    () => {
      // no config
      return readdir(workspace)
        .then((dirs) => {
          if (dirs.length > 0) {
            return dialog
              .showMessageBox(BrowserWindow.getFocusedWindow(), {
                buttons: ["OK", "Cancel"],
                defaultId: 0,
                cancelId: 1,
                title: "Local Workspace Check",
                message: `Folder [${workspace}] not empty, sure to use as workspace?`,
              })
              .then((response) =>
                response == 0 ? Promise.resolve() : Promise.reject()
              );
          } else {
            return Promise.resolve();
          }
        })
        .then(() => mkdir(workspace_config_local));
    }
  );
};

const LoadWorkspaceLocalArticles = (workspace) => {
  const workspace_articles = path.join(workspace, "articles");
  return /** check folder */ stat(workspace_articles)
    .then(
      (stats) => {
        // exists
        if (!stats.isDirectory()) {
          return Promise.reject(`${workspace_articles} not a directory`);
        } else {
          return Promise.resolve();
        }
      },
      () => {
        // not exist
        return mkdir(workspace_articles);
      }
    ) /** scan */
    .then(() => readdir(workspace_articles))
    .then((paths) =>
      paths
        .filter((v) => new RegExp(".[md]$").test(v))
        .map((v) => ({
          filename: v,
          filepath: path.join(workspace_articles, v),
        }))
        .reduce(
          (promise, { filename, filepath }) =>
            promise.then((old) =>
              readFile(filepath).then((buf) => {
                old[filename] = {
                  filename,
                  filepath,
                  content: buf,
                };
                return Promise.resolve(old);
              })
            ),
          Promise.resolve({})
        )
    );
};

ipcMain.handle(
  "dir:select",
  (_, { defaultPath = app.getPath("documents") } = {}) => {
    return dialog
      .showOpenDialog({
        properties: ["openDirectory", "promptToCreate"],
        defaultPath,
      })
      .then(({ filePaths: [workspace, ..._] }) =>
        workspace ? Promise.resolve(workspace) : Promise.reject()
      );
  }
);

ipcMain.handle("workspace:local", (_, workspace) =>
  CheckWorkspaceLocal(workspace).then(() =>
    LoadWorkspaceLocalArticles(workspace)
  )
);

ipcMain.handle(
  "config:load",
  () =>
    new Promise((resolve) => {
      store.get("config", (err, data) => {
        if (err) {
          store.set("config", {});
          data = {};
        }
        resolve(data);
      });
    })
);

ipcMain.on("config:save", (_, config) => {
  store.set("config", config);
});

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    title: "Hinoki Orange",
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      nativeWindowOpen: true,
    },
  });
  mainWindow.loadFile(path.join(__dirname, "public/index.html"));
  mainWindow.webContents.openDevTools();
});
