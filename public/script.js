
const video = document.getElementById('vid')

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

video.addEventListener('play', async () => {
    const LabeledFaceDescriptors = await authorize()
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withFaceDescriptors()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        const faceMatcher = new faceapi.FaceMatcher(LabeledFaceDescriptors, 0.6)
        if(faceMatcher.distanceThreshold >= 0.6){
            console.log('hello world');
            switchPages();
        }
    }, 100)
})

function authorize() {
    const names = ['patrick']
    return Promise.all(
        names.map(async names => {
            const descriptions = [];
            for(let i = 0; i <= 2; i++){
                const img = await faceapi.fetchImage(`http://localhost:3000/assets/${names}.jpg`)

                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                descriptions.push(detections.descriptor)
            }
            console.log(descriptions)
            return new faceapi.LabeledFaceDescriptors(names, descriptions)
        })
    )
}

function switchPages() {
    window.location.href = `/array`;
  
}