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
      messages = messages = [...messages, {
        text: `${connection.peer} has joined`,
        type: "admin"
      }];
      connection.on("data", text => {
        console.log(text);
        messages = [...messages, { text, type: "incoming" }];
      });
      partnerId = connection.peer;
    });
  });

  function handleNewMessage(event) {
    messages = [...messages, { text: event.detail.text, type: "outgoing" }];
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
