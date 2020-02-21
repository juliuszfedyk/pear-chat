<script>
  export let message;
  export let type;

  let typeDictionary = {
    'incoming': 'incoming-message',
    'outgoing': 'outgoing-message',
    'admin': 'admin-message',
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }
</script>

<div class="message {typeDictionary[type] ? typeDictionary[type] : 'default-message'}">
  <p>{message.text}</p>
  <span class="time-date">{formatDate(message.timestamp)}</span>
</div>

<style>
  .message {
    margin-bottom: 30px;
  }

  .time-date {
    font-size: 12px;
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

  .default-message p,
  .incoming-message p {
    background: #ebebeb;
    border-radius: 3px;
    color: #646464;
    font-size: 14px;
    margin: 0;
    padding: 5px 10px 5px 12px;
    width: 100%;
  }

  .admin-message p {
    background: #ffa652;
    border-radius: 3px;
    color: #fff;
    font-size: 14px;
    margin: 0;
    padding: 5px 10px 5px 12px;
    width: 100%;
  }
</style>
