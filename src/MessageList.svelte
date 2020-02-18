<script>
  import Message from "./Message.svelte";
  import { afterUpdate } from 'svelte';
  export let messages;

  let messageListWrapper

	afterUpdate(() => {
		messageListWrapper.scrollTo(0, messageListWrapper.scrollHeight);
	});
</script>

<div bind:this={messageListWrapper} class="message-list-wrapper">
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
