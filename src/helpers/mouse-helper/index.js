export class MouseHelper {
    constructor(container) {
        this.container = container;
        this.center = 0;
        this.relativeX = 0;
        this.relativeY = 0;
    }
    setPosition(event) {
        if (!this.container) {
            return;
        }
        const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
        const rectSize = this.container.getBoundingClientRect();
        const width = rectSize.width;
        this.center = width / 2;
        this.relativeX = clientX - rectSize.left;
        this.relativeY = clientY - rectSize.top;
    }

     getNewSliderAngle() {
        const angleBetweenTwoVectors = Math.atan2(
            this.relativeY - this.center,
            this.relativeX - this.center,
        );
        return (angleBetweenTwoVectors + (3 * Math.PI) / 2) % (2 * Math.PI);
    }
}
