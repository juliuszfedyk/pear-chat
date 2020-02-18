<script>
  import Message from "./Message.svelte";
  export let messages;
</script>

<div class="message-list-wrapper">
  <div class="message-list">
    {#each messages as { text, type }}
      <Message
        text="{text}"
        type="{type}"
      />
    {/each}
  </div>
</div>

<style>
  .message-list-wrapper {
    height: 400px;
    overflow-y: scroll;
  }
</style>
