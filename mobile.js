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
        const startDrag = (x, y) => {
            this.holdingpaper = true;

            // Bring this paper to the top layer
            paper.style.zIndex = highestZ;
            highestZ += 1;

            // Store the initial mouse/touch position
            this.prevMouseX = x;
            this.prevMouseY = y;

            // Get current position of the paper
            const transform = window.getComputedStyle(paper).transform;

            // If paper is already transformed, get the X and Y translation values
            if (transform !== 'none') {
                const matrix = new DOMMatrix(transform);
                this.currentPaperX = matrix.m41;
                this.currentPaperY = matrix.m42;
            }

            console.log('Start drag:', this.prevMouseX, this.prevMouseY);
        };

        const moveDrag = (x, y) => {
            if (this.holdingpaper) {
                this.mouseX = x;
                this.mouseY = y;

                // Calculate the difference between the new mouse/touch position and the previous one
                const dx = this.mouseX - this.prevMouseX;
                const dy = this.mouseY - this.prevMouseY;

                // Update the current position of the paper based on the difference
                this.currentPaperX += dx;
                this.currentPaperY += dy;

                // Apply the translation to the paper
                paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px)`;

                // Update the previous positions for the next move event
                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;
            }
        };

        const endDrag = () => {
            if (this.holdingpaper) {
                console.log('End drag');
                this.holdingpaper = false;
            }
        };

        // Mouse Events
        paper.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                startDrag(e.clientX, e.clientY);
            }
        });

        document.addEventListener('mousemove', (e) => {
            moveDrag(e.clientX, e.clientY);
        });

        window.addEventListener('mouseup', () => {
            endDrag();
        });

        // Touch Events
        paper.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startDrag(touch.clientX, touch.clientY);
        });

        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            moveDrag(touch.clientX, touch.clientY);
        });

        window.addEventListener('touchend', () => {
            endDrag();
        });
    }
}

// Select all paper elements and initialize the drag behavior
const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
    const p = new Paper();
    p.init(paper);
});
