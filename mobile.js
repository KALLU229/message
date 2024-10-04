let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  touchEndX = 0;
  touchEndY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Add passive: false to ensure preventDefault works
    paper.addEventListener(
      'touchmove',
      (e) => {
        if (!this.holdingPaper) return;

        if (e.touches.length === 1 && !this.rotating) {
          e.preventDefault(); // Prevent scrolling behavior on touchmove

          this.touchMoveX = e.touches[0].clientX;
          this.touchMoveY = e.touches[0].clientY;

          this.velX = this.touchMoveX - this.prevTouchX;
          this.velY = this.touchMoveY - this.prevTouchY;
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;

          this.prevTouchX = this.touchMoveX;
          this.prevTouchY = this.touchMoveY;

          paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
        }
      },
      { passive: false } // To allow preventDefault to work
    );

    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;

      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;
    });

    paper.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    paper.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault(); // Prevent unintended behaviors during rotation

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        const dirX = touch2.clientX - touch1.clientX;
        const dirY = touch2.clientY - touch1.clientY;
        const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
        const dirNormalizedX = dirX / dirLength;
        const dirNormalizedY = dirY / dirLength;

        const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
        let degrees = (angle * 180) / Math.PI;
        degrees = (360 + Math.round(degrees)) % 360;

        this.rotation = degrees;
        this.rotating = true;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
