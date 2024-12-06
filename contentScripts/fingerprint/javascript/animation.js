const element = document.createElement("div");
let start, previousTimeStamp;
let done = false;

function step(timeStamp) {
  if (start === undefined) {
    start = timeStamp;
  }
  const elapsed = timeStamp - start;

  if (previousTimeStamp !== timeStamp) {
    // Math.min() is used here to make sure the element stops at exactly 200px
    const count = Math.min(0.1 * elapsed, 200);
    element.style.transform = `translateX(${count}px)`;
    if (count === 200) done = true;
  }

  if (elapsed < 2000) {
    // Stop the animation after 2 seconds
    previousTimeStamp = timeStamp;
    if (!done) {
      window.requestAnimationFrame(step);
    }
  }
}

window.requestAnimationFrame(step);