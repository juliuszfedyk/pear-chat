<script>
  import Message from "./Message.svelte";
  export let messages;
</script>

<div class="messages-list-wrapper">
  <div class="messages-list">
    {#each messages as { text, type }}
      <Message
        text="{text}"
        type="{type}"
      />
    {/each}
  </div>
</div>
