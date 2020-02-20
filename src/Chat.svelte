<script>
  import SendMessage from "./SendMessage.svelte";
  import MessageList from "./MessageList.svelte";
  import SideMenu from "./SideMenu.svelte";
  import VideoChat from "./VideoChat.svelte";
  import peerConfig from "../config.json";
  import { getPeerService } from "./peer.service.js";
  import { onMount } from "svelte";
  import queryString from "query-string";

  const debugMode = true;
  let id;
  let peerServer
  let peerId;
  let connection;
  let messages = [];
  let connectedToServer = false;
  let connectedToPeer = false;
  const peerService = getPeerService();

  peerService.id.subscribe(newId => (id = newId));
  peerService.peerId.subscribe(newPeerId => (peerId = newPeerId));
  peerService.server.subscribe(server => {
    peerServer = server
    connectedToServer = !!server
  });
  peerService.dataConnection.subscribe(
    dataConnection => (connectedToPeer = !!dataConnection)
  );

  peerService.messages.subscribe(newMessages => {
    messages = newMessages
  });

  onMount(() => {
    peerService.connectToServer()
    let queryParams = queryString.parse(window.location.search);
    let token = queryParams['token'];
    if (token) {
      peerService.connectToPeer(token)
    }
  })
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
        <SendMessage on:message={event => peerService.sendMessage(event.detail.text)}/>
      </div>
    {:else}
      <div class="col-12">
        <SideMenu
          bind:id
          bind:peerId
          on:disconnectFromServer={peerService.disconnectFromServer()} />
      </div>
    {/if}
  </div>
  <div class="row">
    <div class="col-12">
      {#if peerServer && connectedToPeer}
        <VideoChat {peerServer} {peerId} />
      {/if}
    </div>
  </div>
</div>
