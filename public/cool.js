const video = document.getElementById('vid')
var img = new Image()
img.src = "assets/coolGuyGlasses.png"

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const allDetections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(allDetections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

    
    resizedDetections.forEach(detection => {
      const box = detection.detection.box;
      const x = box.x
      const y = box.y
      const width = box.width
      const height = box.height
      canvas.getContext("2d").drawImage(img, x, y, width+40, height)
    })
  }, 100)
})

const back = document.querySelector(".icon-link");

back.addEventListener("click", function() {
  window.location.href = `/array`;
})