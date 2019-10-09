## React Circular Slider Component

### Installation

`npm install --save circular-slider-react`

### How To Use

First import this component where you want to use it

`import ReactCircularSlider from "circular-slider-react"`

Then just renders it

`<ReactCircularSlider />`

### Props

| _Prop_ |     _Description_     | _Default value_ |
| ------ | :-------------------: | :-------------: |
| circleColor  | Sets background color |      black       |
| knobColor  |      Sets knob color       |       blue       |
| radius |      Sets circle radius      |       100       |
| halfCircle   |    Sets if circle is half or not    |  false   |
| min   |    Sets min value    |  0   |
| max   |    Sets max value    |  100   |
| stepSize   |    Sets step size    |  1   |
| value   |    Sets initial value   |  0   |
| onChange   |    callback function on value change   |  null   |

### Example

```
import React, { Component } from "react";
import ReactCircularSlider from "circular-slider-react";

class App extends Component {
  render() {
    return (
        <ReactCircularSlider size={500} circleColor="black" value={10} stepSize={2} />
    );
  }
}

export default App;
```
