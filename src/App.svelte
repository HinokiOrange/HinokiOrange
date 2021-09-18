<script>
  import { IPC, UserData } from "./Data.svelte";
  import WorkspaceChoice from "./WorkspaceChoice.svelte";
  import Router from "svelte-spa-router";

  //   read user config
  IPC.invoke("config:load").then((v) => UserData.set(v));

  //   routes
  const routes = {
    "/": WorkspaceChoice,
  };
</script>

<Router {routes} />

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
