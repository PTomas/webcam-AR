const video = document.getElementById('vid')
const carousel = document.querySelector(".infinite-carousel")
const prev = document.querySelector(".previous")
const next = document.querySelector(".next");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(startVideo).catch((err) => {
  console.log(err)
})

function startVideo() {
    navigator.getUserMedia(
      { video: {} },
      stream => video.srcObject = stream,
      err => console.error(err)
    )
}

var toggle = document.getElementById("toggle");
var optView = document.querySelector(".container");
toggle.addEventListener("click", () => {
  optView.classList.toggle("goDown")
})

const carouselInner = carousel.querySelector('.infinite-carousel div');
const carouselContent = Array.from(carouselInner.children);

let distR = 0;
let distL = 0;

next.addEventListener("click", function() {
  distR = distR - 70;

  const moveRight = [
    { transform: `translate(${distR}px)`}
  ]

  const moveTimeing = {
    duration: 50,
    iterations: 1,
    fill: "forwards",
  }
  carouselInner.animate(moveRight, moveTimeing);
  console.log("hello")

})

prev.addEventListener("click", function() {
  distR = distR + 70;

  const moveLeft = [
    { transform: `translate(${distR}px)`}
  ]

  const moveTimeing = {
    duration: 50,
    iterations: 1,
    fill: "forwards",
  }
  carouselInner.animate(moveLeft, moveTimeing);
  console.log("hello")
})

const faceRec = document.getElementById("faceRec");
const coolGuy = document.getElementById("coolGuy");
const underwater = document.getElementById("underwater");

video.addEventListener('play', () => {
  faceRec.addEventListener("click", function() {
    // window.location.href = "/face-recognition"
    faceMap()
  })

  coolGuy.addEventListener("click", function() {
    // window.location.href = "/cool-guy"
    cool()
  })

  underwater.addEventListener("click", function() {
    // window.location.href = "/underwater"
    scuba()
  })
})
let faceInt = null;
let coolInt = null;
let waterInt = null;
function faceMap() {
  clearInterval(faceInt)
  clearInterval(coolInt)
  clearInterval(waterInt)

  var allCanvas = document.querySelectorAll("canvas");

  Array.prototype.forEach.call( allCanvas, function( node ) {
    node.parentNode.removeChild( node );
  });
  
  const canvas = faceapi.createCanvasFromMedia(video)
  canvas.classList.add("faceMap");
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    resizedDetections.forEach(detection => {
      faceapi.draw.drawDetections(canvas, detection)
      faceapi.draw.drawFaceLandmarks(canvas, detection)
      faceapi.draw.drawFaceExpressions(canvas, detection)
    })
  }, 100)
}

var img = new Image()
img.src = "assets/coolGuyGlasses.png"

function cool() {
  clearInterval(faceInt)
  clearInterval(coolInt)
  clearInterval(waterInt)

  var allCanvas = document.querySelectorAll("canvas");

  Array.prototype.forEach.call( allCanvas, function( node ) {
    node.parentNode.removeChild( node );
  });
  
  const cool = faceapi.createCanvasFromMedia(video)
  cool.classList.add("cool")
  document.body.append(cool)
  const displaySize = { width: video.videoWidth, height: video.videoHeight }
  faceapi.matchDimensions(cool, displaySize)
  coolInt = setInterval(async () => {
    const allDetections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(allDetections, displaySize)
    cool.getContext('2d').clearRect(0, 0, cool.width, cool.height)

    
    resizedDetections.forEach(detection => {
      const box = detection.detection.box;
      const x = box.x
      const y = box.y
      const width = box.width
      const height = box.height
      cool.getContext("2d").drawImage(img, x-20, y, width+40, height)
    })
  }, 100)
}

async function scuba() {
  clearInterval(faceInt)
  clearInterval(coolInt)
  clearInterval(waterInt)
  var allCanvas = document.querySelectorAll("canvas");

  Array.prototype.forEach.call( allCanvas, function( node ) {
    node.parentNode.removeChild( node );
  });

  const background = document.createElement("canvas");
  background.classList.add("canvas");
  const ctx = background.getContext("2d");
  document.body.append(background)

  const tempCanvas = document.createElement("canvas");
  tempCanvas.classList.add("tempCanvas");
  const ctx2 = tempCanvas.getContext("2d");
  document.body.append(tempCanvas)

  
  background.width = ctx.width = video.videoWidth;
  background.height = ctx.height = video.videoHeight;
  tempCanvas.width = video.videoWidth;
  tempCanvas.height = video.videoHeight;
  ctx2.backgroundSize = "cover";

  
  const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
  const segmenterConfig = {
    runtime: 'mediapipe', // or 'tfjs'
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation',
    modelType: 'general'
  }
  const segmenter = await bodySegmentation.createSegmenter(model, segmenterConfig);
  
  waterInt = setInterval(async function drawVirtual() {       
    const segmentation = await segmenter.segmentPeople(video);
    const mask = await bodySegmentation.toBinaryMask(segmentation);

    ctx2.save();
    ctx2.putImageData(mask, 0, 0, 0, 0, video.videoWidth, video.videoHeight);
    ctx2.globalCompositeOperation = "source-out";
    ctx2.drawImage(video, 0, 0, background.width, background.height);
    ctx2.restore();
  }, 100)
}