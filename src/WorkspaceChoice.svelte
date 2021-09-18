<script>
  import { get } from "svelte/store";

  import { IPC, UserData } from "./Data.svelte";

  if (!("workspace" in get(UserData))) {
    UserData.update((v) => {
      v["workspace"] = {
        skip: -1,
        list: [],
      };
      return v;
    });
  }

  const OnLocal = () => {
    IPC.invoke("dir:select")
      .then((v) => IPC.invoke("workspace:local", v))
      .then((v) => console.dir(v))
      .catch((err) => console.error(err));
  };
</script>

<div on:click={OnLocal}>a</div>
