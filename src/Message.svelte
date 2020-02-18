<script>
  export let text;
  export let type;
</script>

<div class="message {type === 'incoming' ? 'incoming-message' : 'outgoing-message'}">
  <p>{text}</p>
  <span class="time-date">11:01 AM | June 9</span>
</div>

<style>
  .message {
    margin-bottom: 30px;
  }

  .outgoing-message p {
    background: #05728f;
    border-radius: 3px;
    font-size: 14px;
    margin: 0;
    color: #fff;
    padding: 5px 10px 5px 12px;
    width: 100%;
  }

  .incoming-message p {
    background: #ebebeb;
    border-radius: 3px;
    color: #646464;
    font-size: 14px;
    margin: 0;
    padding: 5px 10px 5px 12px;
    width: 100%;
  }
</style>
