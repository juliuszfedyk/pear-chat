<script>
  import { createEventDispatcher } from "svelte";
  export let id;
  export let partnerId;
  export let connected;
  const dispatch = createEventDispatcher();
</script>

<style>
  .side-menu {
    padding: 8px;
  }
</style>

<div class="side-menu">
  <h2>
    <span class="badge badge-secondary">{id}</span>
  </h2>
  {#if !connected}
    <input
      type="text"
      bind:value={partnerId}
      class="form-control"
      id="partner_id" />
    <button
      class="btn btn-primary"
      on:click={() => dispatch('connect')}
      disabled={!partnerId}>
      Connect
    </button>
  {:else}
    <h2>
      <span class="badge badge-secondary">{partnerId}</span>
    </h2>
    <button class="btn btn-primary" on:click={() => dispatch('closeConnection')}>
      Disconnect
    </button>
  {/if}
</div>
