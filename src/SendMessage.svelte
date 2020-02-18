<script> 
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
  
  let newMessage = '';

	function sendMessage() {
    if (newMessage === '') { return }
    
		dispatch('message', {
			text: newMessage
    });
    newMessage = '';
  }
  
	function handleInputKeydown(event) {
    if (event.key === 'Enter') {
      sendMessage()
    }
	}

</script>

<div class="type-message">
  <div class="input-message-wrapper">
    <input bind:value={newMessage} on:keydown={handleInputKeydown} type="text" class="write-message" placeholder="Type a message" />
    <button on:click={sendMessage} class="message-send-btn" type="button">
      <i class="fa fa-paper-plane-o" aria-hidden="true" />
    </button>
  </div>
</div>

<style>
  .input-message-wrapper input {
    background: #fff;
    border: none;
    color: #4c4c4c;
    font-size: 15px;
    min-height: 48px;
    width: 100%;
  }

  .type-message {
    margin-top: 20px;
    border-top: 1px solid #c4c4c4;
    position: relative;
  }

  .message-send-btn {
    background: #05728f;
    border: none;
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    height: 40px;
    position: absolute;
    right: 0;
    top: 10px;
    width: 40px;
  }
</style>
