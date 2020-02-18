<script>
  import SendMessage from "./SendMessage.svelte";
  import MessageList from "./MessageList.svelte";
  import SideMenu from "./SideMenu.svelte";

	let messages = [
		{ text: 'Hello', type: 'incoming' },
		{ text: 'Hi', type: 'outgoing' },
		{ text: 'How are you?', type: 'incoming' }
  ];

	function handleNewMessage(event) {
    messages = [...messages, {text: event.detail.text, type: 'outgoing'}];
	}
</script>

<div class="container">
  <div class="row">
    <div class="col-12 col-md-8 main-window">
      <MessageList messages="{messages}" />
      <SendMessage on:message={handleNewMessage} />
    </div>
    <div class="col-12 col-md-4">
      <SideMenu />
    </div>
  </div>
</div>

<style>
  .main-window {
    border: 1px solid #e2e2e2;
    padding: 8px;
  }
</style>
