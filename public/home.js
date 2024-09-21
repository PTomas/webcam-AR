const video = document.getElementById('vid')
const carousel = document.querySelector(".infinite-carousel")
const prev = document.querySelector(".previous")
const next = document.querySelector(".next");

startVideo()

function startVideo() {
    navigator.getUserMedia(
      { video: {} },
      stream => video.srcObject = stream,
      err => console.error(err)
    )
}

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


faceRec.addEventListener("click", function() {
  window.location.href = "/face-recognition"
})

coolGuy.addEventListener("click", function() {
  window.location.href = "/cool-guy"
})

underwater.addEventListener("click", function() {
  window.location.href = "/underwater"
})