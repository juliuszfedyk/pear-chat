<script>
  import { onMount } from "svelte";
  import QRCode from 'qrcode/build/qrcode.min'

  export let url;

  onMount(() => {
    const canvas = document.getElementById("qrcode-canvas");
    QRCode.toCanvas(canvas, url);
  });
</script>

<canvas id="qrcode-canvas" />
