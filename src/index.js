import React from "react";
import autoBind from 'react-autobind';
import { CircleSliderHelper } from './helpers/circle-slider-helper';
import { MouseHelper } from './helpers/mouse-helper';

class ReactCircularSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        angle: 0,
        currentStepValue: 0,
    };
    autoBind(this);
    this.mouseHelper = null;
    let {
        min,
        max,
        stepSize,
        value,
        size,
        knobRadius,
        halfCircle,
        radius
    } = this.props;
    this.radius = radius;
    this.angle = halfCircle ? 0 : Math.PI;
    this.countSteps = 1 + (max - min) / stepSize;
    this.stepsArray = this.getStepsArray(min, stepSize);
    this.circleSliderHelper = new CircleSliderHelper(
        this.stepsArray,
        value,
        halfCircle
    );
    this.circleSliderHelper.updateStepIndexFromValue(value);
    this.center = this.getCenter();
    this.knobRadius = knobRadius;
    this.w = halfCircle ?
    this.generateHalfCircle(this.center, this.radius):
    this.generateFullCircle(this.center, this.center, this.radius);
  }

  setInitialAngle(angle) {
    this.angle = angle;
  }

  getCenter() {
    if(this.props.size) {
      return this.props.size / 2;
    }
  }

  getAngle() {
      return this.state.angle + Math.PI / 2;
  }

  getPointPosition() {
      const center = this.getCenter();
      const angle = this.getAngle();
      return {
          x: center + this.radius * Math.cos(angle),
          y: center + this.radius * Math.sin(angle)
      };
  }

  updateAngle(angle) {
      const newAngle = this.props.halfCircle ? Math.abs(angle - Math.PI) : angle;
      this.circleSliderHelper.updateStepIndexFromAngle(newAngle);
      const currentStep = this.circleSliderHelper.getCurrentStep();
      this.setState({
            angle:angle,
            currentStepValue: currentStep,
        });
      this.props.onChange(currentStep);
  }

  getStepsArray(min, stepSize) {
      const stepArray = [];
      for (let i = 0; i < this.countSteps; i++) {
          stepArray.push(min + i * stepSize);
      }
      return stepArray;
  }

   handleMouseMove(event) {
     event.preventDefault();
    if (!this.disabled) {
        this.mouseHelper.setPosition(event);
        this.updateSlider();
        event.preventDefault();
    }
  }

   updateSlider() {
      const angle = this.mouseHelper.getNewSliderAngle();
      if (!this.props.halfCircle) {
        this.updateAngle(angle);
      } else if (angle >= Math.PI) {
        this.updateAngle(angle);
      }
  }

   handleMouseUp(event) {
     event.preventDefault();
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('mouseup', this.handleMouseUp);
      window.removeEventListener('touchmove', this.handleMouseMove);
      window.removeEventListener('touchend', this.handleMouseUp);
  }

   handleMouseDown(event) {
     event.preventDefault();
     window.addEventListener('mousemove', this.handleMouseMove);
     window.addEventListener('mouseup', this.handleMouseUp);
     window.addEventListener('touchmove', this.handleMouseMove);
     window.addEventListener('touchend', this.handleMouseUp);
  }

  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  describeArc(x, y, radius, startAngle, endAngle) {
      const start = this.polarToCartesian(x, y, radius, endAngle);
      const end = this.polarToCartesian(x, y, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
      const d = [
          'M', start.x, start.y,
          'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
      ].join(' ');

      return d;
  }

   generateFullCircle(centerX, centerY, radius) {
    const points = [];
    points.push('M' + (centerX - radius));
    points.push(centerY + ' a ' + radius);
    points.push(radius + ' 0 ' + '1');
    points.push('0 ' + (radius * 2));
    points.push('0 a ' + radius);
    points.push(radius + ' 0 1');
    points.push('0 ' + (-(radius * 2)));
    points.push('0');
    return points.join(',');
  }

  generateHalfCircle(centerY, radius) {
    return this.describeArc(centerY, centerY, radius, 0, 180);
  }

  componentDidMount() {
    this.mouseHelper = new MouseHelper(this.svg);
        if (!this.props.halfCircle) {
        this.angle = this.circleSliderHelper.getAngle();
        this.updateAngle(this.angle);
      } else {
        this.angle = this.circleSliderHelper.getAngle();
        const initialAngle = Math.PI + this.angle;
        this.updateAngle(initialAngle);
      }
    }

  render() {
        const { currentStepValue } = this.state;
        const { size, knobColor, circleColor } = this.props;
        const { x, y } = this.getPointPosition();
        const center = this.getCenter();
    return (
      <svg style={{zIndex: 2}} className="slider" ref={svg => (this.svg = svg)} width={`${size}px`}
                height={`${size}px`}
                viewBox={`0 0 ${size} ${size}`}
                onMouseDown={this.handleMouseDown}
                style={{
                    boxSizing: "border-box",
                }}>
          <defs>
            <radialGradient id="gradOuter" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style={{stopColor: circleColor, stopOpacity: -2}} />
              <stop offset="100%" style={{stopColor: circleColor, stopOpacity: 10}} />
            </radialGradient>
          </defs>
          <svg id="innerCircle">
            <path fill="none" stroke="url(#gradOuter)" strokeWidth={6} d={this.w} />
          </svg>
          <radialGradient id="enabledKnob" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{stopColor: knobColor, stopOpacity:'0.5'}} />
            <stop offset="100%" style={{stopColor: knobColor, stopOpacity:'1'}} />
          </radialGradient>
          <radialGradient id="disabledKnob" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style={{stopColor: 'gray', stopOpacity:'0.5'}} />
          <stop offset="100%" style={{stopColor: 'gray', stopOpacity:'1'}} />
          </radialGradient>
          <circle r={this.knobRadius} cx={x} cy={y} fill={this.disabled ? 'url(#disabledKnob)' : 'url(#enabledKnob)'}  />
        </svg>
    );
  }
}
ReactCircularSlider.defaultProps = {
  min:0,
  max:100,
  stepSize:1,
  value:0,
  size:500,
  knobRadius:20,
  halfCircle:true,
  radius:100,
  knobColor:'blue',
  circleColor:'black'
}

export default ReactCircularSlider;
