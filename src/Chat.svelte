<script>
  import SendMessage from "./SendMessage.svelte";
  import MessageList from "./MessageList.svelte";
  import Menu from "./Menu.svelte";
  import VideoChat from "./VideoChat.svelte";
  import peerConfig from "../config.json";
  import { getPeerService } from "./peer.service.js";
  import { onMount } from "svelte";
  import queryString from "query-string";

  const debugMode = true;
  const peerService = getPeerService();

  let id;
  let peerServer;
  let peerId;
  let connection;
  let messages = [];
  let connectedToServer = false;
  let connectedToPeer = false;
  $: {
    console.log(peerId);
  }

  peerService.id.subscribe(newId => (id = newId));
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
          {id}
          on:message={event => peerService.sendMessage(event.detail)} />
      </div>
    {:else if connectedToServer && id}
      <div class="col-12">
        <Menu
          bind:id
          bind:peerId
          on:disconnectFromServer={peerService.disconnectFromServer()} />
      </div>
    {:else}
      <div class="col-12">
        <h2 class="text-center">Connecting...</h2>
      </div>
    {/if}
  </div>
  <div class="row">
    <div class="col-12">
      {#if peerServer && connectedToPeer && peerId}
        <VideoChat {peerServer} {peerId} />
      {/if}
    </div>
  </div>
</div>
