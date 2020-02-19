<script>
  import { createEventDispatcher } from "svelte";
  export let id;
  export let partnerId;
  export let connectedToPeer;
  export let connectedToServer;
  const dispatch = createEventDispatcher();
</script>

<style>
  .side-menu {
    padding: 8px;
  }

  button {
    display: block;
    width: 100%;
  }
</style>

<div class="side-menu">
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
    Log in.
  </button>
    {:else}
      <button
    type="button"
    class="btn btn-primary"
    on:click|preventDefault = {() => dispatch('disconnectFromServer')}>
    Log Out.
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
</div>
