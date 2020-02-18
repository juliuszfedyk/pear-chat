<script>
  import Chat from "./Chat.svelte";
</script>

<main>
  <div class="logo">
    <img src="pear.svg" alt="Pear">
  </div>
  <h1 class="heading">PearChat</h1>
  <Chat />
</main>

<style>
  .logo {
    text-align: center;
    margin-top: 20px;
  }

  .logo img {
    max-width: 100px;
  }

  .heading {
    text-align: center;
    margin-bottom: 20px;
  }
</style>
