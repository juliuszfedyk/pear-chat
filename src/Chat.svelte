<script>
  import SendMessage from "./SendMessage.svelte";
  import MessageList from "./MessageList.svelte";
  import SideMenu from "./SideMenu.svelte";
  import VideoChat from "./VideoChat.svelte"

  import { onMount } from "svelte";

  let id = "";
  let partnerId = "";
  let peer;
  let connection;
  let messages = [];

  onMount(() => {
    peer = new Peer({
      config: {'iceServers': [
        { url: 'stun:stun3.l.google.com:19302' },
        { 
          url: 'turn:numb.viagenie.ca',
          credential: 'muazkh',
          username: 'webrtc@live.com'
        }
      ]}
    });
    peer.on("open", newId => {
      id = newId;
    });
    peer.on("connection", newConnection => {
      newConnection.on("open", () => {
        setConnection(newConnection);
        addMessage(`${partnerId} has joined`, "admin");
      });
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
    partnerId = newConnection.peer;
    connection = newConnection;
    connection.on("data", text => {
      addMessage(text, "incoming");
    });
    connection.on("close", () => {
      addMessage("connection closed", "admin");
      connection = null;
    });
    connection.on("error", error => {
      addMessage(error, "admin");
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
  <div class="row">
    <div class="col-12">
      {#if peer}
        <VideoChat
          {peer}
          {partnerId}
        />
      {:else}
        <div>Please connect to see video chat</div>
      {/if}
    </div>
  </div>
</div>
