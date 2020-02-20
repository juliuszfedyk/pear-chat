<script>
  import { createEventDispatcher } from "svelte";
  export let id;
  export let peerId;
  export let connectedToPeer;
  export let connectedToServer;
  const dispatch = createEventDispatcher();

  const BASE_URL = 'https://pear-chat.io'

  let urlInput;

  let urlInputText;

  let copyText = 'Copy'

  $: urlInputText = BASE_URL + id;

  const copyUrl = () => {
    urlInput.select();
    urlInput.setSelectionRange(0, 99999);
    document.execCommand("copy");
    copyText = 'Copied!';
    setTimeout(() => copyText = 'Copy', 2000)
  }
</script>

<style>
  .side-menu {
    padding: 8px;
  }

  button {
    display: block;
    width: 100%;
  }

  .menu {
    max-width: 500px;
    margin: auto;
  }

  .welcome-message {
    font-size: 26px;
    font-weight: 300;
    text-align: center;
    margin-top: 20px;
    margin-bottom: 30px;
  }
</style>

<div class="menu">
  <h3 class="welcome-message">Welcome to the PearChat copy the link and share it with your friend</h3>
  <input
    type="text"
    class="form-control"
    id="my_id"
    bind:this={urlInput}
    value="{urlInputText}"
    readonly
  />
  <button
    type="button"
    class="btn btn-primary"
    on:click={copyUrl}>
    {copyText}
  </button>
</div>

<!-- <div class="side-menu">
  <input
    type="text"
    class="form-control"
    id="my_id"
    bind:value={id}
    placeholder="choose your name"
    disabled={connectedToServer} />
    {#if !connectedToServer}
  <button
    type="button"
    class="btn btn-primary"
    on:click|preventDefault = {() => dispatch('connectToServer')}>
    Log in
  </button>
    {:else}
      <button
    type="button"
    class="btn btn-primary"
    on:click|preventDefault = {() => dispatch('disconnectFromServer')}>
    Log Out
  </button>
    {/if}
  {#if !connectedToPeer}
    <input
      type="text"
      bind:value={partnerId}
      class="form-control"
      id="partner_id"
      disabled={connectedToPeer && connectedToServer}
      placeholder="find a friend" />
    <button
      class="btn btn-primary"
      type="button"
      on:click|preventDefault ={() => dispatch('connectToPeer')}
      disabled={!partnerId}>
      Connect
    </button>
  {:else }
    <h2>
      <span class="badge badge-secondary">{partnerId}</span>
    </h2>
    <button
    type="button"
      class="btn btn-primary"
      on:click|preventDefault ={() => dispatch('disconnectFromPeer')}>
      Disconnect
    </button>
  {/if}
</div> -->
