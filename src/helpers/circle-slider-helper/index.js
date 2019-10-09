/*
interface INumber {
    EPSILON: any;
}
declare var Number: INumber;
*/
export class CircleSliderHelper {
    constructor(stepsArray, initialValue, halfCircle) {
        this.stepsArray = stepsArray;
        this.countSteps = this.stepsArray.length - 1;
        this.stepIndex = 0;
        this.halfCircle = halfCircle;
        this.setCurrentStepIndexFromArray(Number(initialValue));
    }

    getEpsilon() {
        let epsilon = 1.0;
        while (1.0 + 0.5 * epsilon !== 1.0) {
            epsilon *= 0.5;
        }
        return epsilon;
    }

    getAngle() {
        const accuracy = 0.00001;
        const epsilon = Number.EPSILON || this.getEpsilon();
        const median = this.halfCircle ? 1 : 2;
        return (
            Math.min(
                this.getAnglePoint() * this.stepIndex,
                median * Math.PI - epsilon,
            ) - accuracy
        );
    }

     getCurrentStep() {
        return this.stepsArray[this.stepIndex];
    }

    updateStepIndexFromAngle(angle) {

        const stepIndex = Math.round(angle / this.getAnglePoint());
        if (stepIndex < this.countSteps) {
            this.stepIndex = stepIndex;
            return;
        }
        this.stepIndex = this.countSteps;
    }

    updateStepIndexFromValue(value) {
        const isSetValue = this.setCurrentStepIndexFromArray(value);
        if (isSetValue) {
            return;
        }
        this.stepIndex = this.countSteps;
    }

    setCurrentStepIndexFromArray(value) {
        for (let i = 0; i < this.countSteps; i++) {
            if (value <= this.stepsArray[i]) {
                this.stepIndex = i;
                return true;
            }
        }
        this.stepIndex = this.countSteps;
        return false;
    }

    getAnglePoint() {
      const median = this.halfCircle ? 1 : 2;
      return (median * Math.PI) / this.countSteps;
    }
}
