<script>
  import { createEventDispatcher } from "svelte";

  import QRCode from './QRCode.svelte'
  
  const dispatch = createEventDispatcher();
  const BASE_URL = window.location.origin

  export let myId;
  let urlInput;
  let urlInputText;
  let copyText = 'Copy'

  $: urlInputText = myId ? BASE_URL + '?token=' + myId : 'loading';

  const copyUrl = () => {
    urlInput.select();
    urlInput.setSelectionRange(0, 99999);
    document.execCommand("copy");
    copyText = 'Copied!';
    setTimeout(() => copyText = 'Copy', 2000)
  }
</script>

<style>
  button {
    display: block;
    width: 100%;
  }

  .menu {
    max-width: 500px;
    margin: auto;
    padding: 8px;
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
    on:click={copyUrl}
  >
    {copyText}
  </button>
  {#if myId}
    <div class="text-center">
      <QRCode url={urlInputText}/>
    </div>
  {/if}
</div>
