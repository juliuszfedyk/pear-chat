<script>
  import SendMessage from "./SendMessage.svelte";
  import MessageList from "./MessageList.svelte";
  import SideMenu from "./SideMenu.svelte";
  import VideoChat from "./VideoChat.svelte";
  import peerConfig from "../config.json";
  import { getPeerService } from "./peer.service.js";
  import { onMount } from "svelte";

  const debugMode = true;
  let id;
  let peerId = "";
  let peer;
  let connection;
  let messages = [];
  let connectedToServer = false;
  let connectedToPeer = false;
  const peerService = getPeerService();

  peerService.id.subscribe(newId => (id = newId));
  peerService.peerId.subscribe(newPeerId => (peerId = newPeerId));
  peerService.server.subscribe(server => (connectedToServer = !!server));
  peerService.dataConnection.subscribe(
    dataConnection => (connectedToPeer = !!dataConnection)
  );

  onMount(() => {
    peerService.connectToServer()
    console.log(id)
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
    <div class="col-12 col-md-8 main-window">
      <MessageList {messages} />
      <SendMessage
        on:message={event => peerService.sendMessage(event.detail.text)} />
    </div>
    <div class="col-12 col-md-4">
      <SideMenu
        bind:id
        bind:peerId
        on:connectToServer={peerService.connectToServer(id)}
        on:connectToPeer={peerService.connectToPeer(peerId)}
        on:disconnectFromPeer={peerService.disconnectFromPeer(peerId)}
        {connectedToPeer}
        {connectedToServer}
        on:disconnectFromServer={peerService.disconnectFromServer()} />
    </div>
  </div>
  <div class="row">
    <div class="col-12">
      {#if peer}
        <VideoChat {peer} {peerId} />
      {/if}
    </div>
  </div>
</div>
