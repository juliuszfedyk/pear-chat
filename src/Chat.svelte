<script>
  import SendMessage from "./SendMessage.svelte";
  import MessageList from "./MessageList.svelte";
  import SideMenu from "./SideMenu.svelte";
  import { onMount } from "svelte";

  let id = "";
  let partnerId = "";
  let peer;
  let connection;

  const connect = () => {
    connection = peer.connect(partnerId);
  };
  const closeConnection = () => {
    connection.close();
    connection = null;
  };

  onMount(() => {
    peer = new Peer();
    peer.on("open", newId => {
      id = newId;
    });
    peer.on("connection", newConnection => {
      connection = newConnection;
      connection.on('open', () => {
      })
      partnerId = connection.peer;
    });
  });
</script>

<style>
  .main-window {
    border: 1px solid #e2e2e2;
    padding: 8px;
  }
</style>

<div class="container">
  <div class="row">
    <div class="col-12 col-md-8 main-window">
      <MessageList />
      <SendMessage />
    </div>
    <div class="col-12 col-md-4">
      <SideMenu
        id={id}
        bind:partnerId
        on:connect={connect}
        on:closeConnection={closeConnection}
        connected={!!connection} />
    </div>
  </div>
</div>
