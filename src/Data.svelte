<script context="module">
  const { ipcRenderer } = require("electron");
  import { writable } from "svelte/store";

  export const IPC = ipcRenderer;

  export const UserData = writable({});

  UserData.subscribe((v) => {
    IPC.send("config:save", v);
  });
</script>
