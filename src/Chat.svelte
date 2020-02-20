<script>
  import SendMessage from "./SendMessage.svelte";
  import MessageList from "./MessageList.svelte";
  import SideMenu from "./SideMenu.svelte";
  import VideoChat from "./VideoChat.svelte";
  import peerConfig from "../config.json";
  import { peerStore } from "../peer.store.js";

  import { onMount } from "svelte";

  peerStore.connect();

  const debugMode = true;
  let id;
  let partnerId = "";
  let peer;
  let connection;
  let messages = [];

  function connectToServer() {
    debugMsg("peerId:", id);
    peer = new Peer(id, peerConfig);
    peer.on("error", error => {
      addMessage(error, "admin");
    });
    peer.on("open", newId => {
      debugMsg("connection to server opened, id is", newId);
      id = newId;
    });
    peer.on("connection", newConnection => {
      debugMsg("got connection from server", newConnection);

      newConnection.on("open", () => {
        debugMsg("incoming connection 'open'", newConnection);
        setConnection(newConnection);
        addMessage(`${partnerId} has joined`, "admin");
      });
    });
  }

  function disconnectFromServer() {
    peer.disconnect();
    peer = null;
  }

  function debugMsg(msg, obj) {
    if (debugMode) {
      console.log(msg, obj);
      addMessage(msg, "admin");
    }
  }

  function connectToPeer() {
    const connection = peer.connect(partnerId);
    debugMsg("requested connection", connection);
    connection.on("open", () => {
      debugMsg("outgoing connection open", connection);
      setConnection(connection);
    });
  }
  const disconnectFromPeer = () => {
    connection.close();
  };

  function addMessage(text, type) {
    messages = [...messages, { text, type }];
  }

  function setConnection(newConnection) {
    debugMsg("setting up connection", newConnection);
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
        bind:id
        bind:partnerId
        on:connectToServer={connectToServer}
        on:connectToPeer={connectToPeer}
        on:disconnectFromPeer={disconnectFromPeer}
        connectedToPeer={!!connection}
        connectedToServer={!!peer}
        on:disconnectFromServer={disconnectFromServer} />
    </div>
  </div>
  <div class="row">
    <div class="col-12">
      {#if peer}
        <VideoChat {peer} {partnerId} />
      {:else}
        <div>Please connect to see video chat</div>
      {/if}
    </div>
  </div>
</div>
