<script>
  import SendMessage from "./SendMessage.svelte";
  import MessageList from "./MessageList.svelte";
  import SideMenu from "./SideMenu.svelte";
  import { onMount } from "svelte";

  let id = "";
  let partnerId = "";
  let peer;
  let connection;
  let messages = [];

  onMount(() => {
    peer = new Peer();
    peer.on("open", newId => {
      id = newId;
    });
    peer.on("connection", newConnection => {
      setConnection(newConnection);
      addMessage(`${connection.peer} has joined`, "admin");
      partnerId = connection.peer;
    });
  });

  const connect = () => {
    setConnection(peer.connect(partnerId));
  };
  const closeConnection = () => {
    connection.close();
  };

  function addMessage(text, type) {
    messages = [...messages, { text, type }];
  }

  function setConnection(newConnection) {
    connection = newConnection;
    connection.on("data", text => {
      addMessage(text, "incoming");
    });
    connection.on("close", () => {
      addMessage("connection closed", "admin");
      connection = null;
    });
  }

  function handleNewMessage(event) {
    addMessage(event.detail.text, "outgoing");
    connection.send(event.detail.text);
  }
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
      <MessageList {messages} />
      <SendMessage on:message={handleNewMessage} />
    </div>
    <div class="col-12 col-md-4">
      <SideMenu
        {id}
        bind:partnerId
        on:connect={connect}
        on:closeConnection={closeConnection}
        connected={!!connection} />
    </div>
  </div>
</div>
