let highestZ = 1;
class Paper {
    holdingpaper = false;

    prevMouseX = 0;
    prevMouseY = 0;

    mouseX = 0;
    mouseY = 0;

    currentPaperX = 0;
    currentPaperY = 0;

    offsetX = 0;
    offsetY = 0;

    init(paper) {
        // When the user starts dragging the paper
        paper.addEventListener('mousedown', (e) => {
            // Only consider left mouse button (button == 0)
            if (e.button === 0) {
                this.holdingpaper = true;

                // Bring this paper to the top layer
                paper.style.zIndex = highestZ;
                highestZ += 1;

                // Store the initial mouse position
                this.prevMouseX = e.clientX;
                this.prevMouseY = e.clientY;

                // Get current position of the paper
                const transform = window.getComputedStyle(paper).transform;

                // If paper is already transformed, get the X and Y translation values
                if (transform !== 'none') {
                    const matrix = new DOMMatrix(transform);
                    this.currentPaperX = matrix.m41;
                    this.currentPaperY = matrix.m42;
                }

                console.log('Mouse down:', this.prevMouseX, this.prevMouseY);
            }
        });

        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            if (this.holdingpaper) {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;

                // Calculate the difference between the new mouse position and the previous one
                const dx = this.mouseX - this.prevMouseX;
                const dy = this.mouseY - this.prevMouseY;

                // Update the current position of the paper based on the difference
                this.currentPaperX += dx;
                this.currentPaperY += dy;

                // Apply the translation to the paper
                paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px)`;

                // Update the previous mouse positions for the next move event
                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;
            }
        });

        // When the user releases the mouse button
        window.addEventListener('mouseup', () => {
            if (this.holdingpaper) {
                console.log('Mouse is released');
                this.holdingpaper = false;
            }
        });
    }
}

// Select all paper elements and initialize the drag behavior
const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
    const p = new Paper();
    p.init(paper);
});
