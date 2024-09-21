const video = document.getElementById('vid')

const bodyPixProperties = {
  architecture: 'MobileNetV1',
  outputStride: 16,
  multiplier: 0.75,
  quantBytes: 4
};

navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )

video.addEventListener('play', async () => {
  const context = CanvasRenderingContext2D.prototype;
  
  const canvas = document.createElement("canvas");
  canvas.classList.add("canvas");
  const ctx = canvas.getContext("2d");
  document.body.append(canvas)

  const tempCanvas = document.createElement("canvas");
  tempCanvas.classList.add("tempCanvas");
  const ctx2 = tempCanvas.getContext("2d");
  document.body.append(tempCanvas)

  
  canvas.width = ctx.width = video.videoWidth;
  canvas.height = ctx.height = video.videoHeight;
  tempCanvas.width = video.videoWidth;
  tempCanvas.height = video.videoHeight;
  // ctx2.width = video.videoWidth;
  // ctx2.height = video.videoHeight;
  ctx2.backgroundSize = "cover";

  
  const net = await bodyPix.load();
  
  setInterval(async function drawVirtual() {       
    const segmentation = await net.segmentPerson(video);
    const mask = bodyPix.toMask(segmentation);
    ctx2.save();
    // ctx2.clearRect(0, 0, canvas.width, canvas.height)
    ctx2.putImageData(mask, 0, 0,);
    ctx2.globalCompositeOperation = "source-out";
    ctx2.drawImage(video, 50, 20, canvas.width, canvas.height);
    ctx2.restore();
  }, 100)
})

const back = document.querySelector(".icon-link");

back.addEventListener("click", function() {
  window.location.href = `/array`;
})