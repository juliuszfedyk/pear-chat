<script>
  import { onMount } from "svelte";
  import queryString from "query-string";

  import SendMessage from "./SendMessage.svelte";
  import MessageList from "./MessageList.svelte";
  import Menu from "./Menu.svelte";
  import VideoChat from "./VideoChat.svelte";
  import peerConfig from "../config.json";
  import { getPeerService } from "./peer.service.js";

  window.debugMode = true;
  const peerService = getPeerService();
  peerService.server.subscribe(server => {
    console.log("getting server inside chat", server);
  });

  let myId;
  let peerServer;
  let peerId;
  let connection;
  let messages = [];
  let connectedToServer = false;
  let connectedToPeer = false;
  $: {
    console.log(peerId);
  }

  peerService.myId.subscribe(newId => (myId = newId));
  peerService.peerId.subscribe(newPeerId => (peerId = newPeerId));
  peerService.server.subscribe(server => {
    peerServer = server ? server : peerServer;
    connectedToServer = !!peerServer;
  });
  peerService.dataConnection.subscribe(
    dataConnection => (connectedToPeer = !!dataConnection)
  );

  peerService.messages.subscribe(newMessages => {
    messages = newMessages;
  });

  onMount(() => {
    peerService.connectToServer();
    let queryParams = queryString.parse(window.location.search);
    let token = queryParams["token"];
    if (token) {
      peerService.connectToPeer(token);
    }
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
    {#if connectedToPeer}
      <div class="col-12 main-window">
        <MessageList {messages} />
        <SendMessage
          {myId}
          on:message={event => peerService.sendMessage(event.detail)} />
      </div>
    {:else if connectedToServer && myId}
      <div class="col-12">
        <Menu bind:myId bind:peerId />
      </div>
    {:else}
      <div class="col-12">
        <h2 class="text-center">Connecting...</h2>
      </div>
    {/if}
  </div>
  <div class="row">
    <div class="col-12">
      {#if peerServer && connectedToPeer}
        <VideoChat {peerService} />
      {/if}
    </div>
  </div>
</div>
