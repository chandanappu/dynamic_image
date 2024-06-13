import React, { Component } from 'react';
import { findDOMNode } from 'react-dom'; // Import findDOMNode for accessing DOM element
import PropTypes from 'prop-types'; // Import PropTypes for prop type validation
import './TiltPhaseOne.css'; // Import CSS file for styling
import dogBackground from "./dogBackground.jpg"

class TiltPhaseOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {},
    };
    // Define default settings
    const defaultSettings = {
      reverse: false,
      max: 35,
      perspective: 1000,
      easing: 'cubic-bezier(.03,.98,.52,.99)',
      scale: 1.1,
      speed: 1000,
      transition: true,
      axis: null,
      reset: true,
    };
    this.width = null;
    this.height = null;
    this.left = null;
    this.top = null;
    this.transitionTimeout = null;
    this.updateCall = null;
    this.element = null;
    // Merge default settings with provided options
    this.settings = {
      ...defaultSettings,
      ...this.props.options,
    };
    this.reverse = this.settings.reverse ? -1 : 1;
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentDidMount() {
    this.element = findDOMNode(this);
    this.updateElementPosition();
  }

  componentWillUnmount() {
    clearTimeout(this.transitionTimeout);
    cancelAnimationFrame(this.updateCall);
  }

  handleMouseEnter(e) {
    this.updateElementPosition();
    this.setState(prevState => ({
      style: {
        ...prevState.style,
      },
    }));
    this.setTransition();
    if (this.props.handleMouseEnter) {
      this.props.handleMouseEnter(e);
    }
  }

  reset() {
    window.requestAnimationFrame(() => {
      console.log(
        'RESETTING TRANSFORM STATE',
        `perspective(${this.settings.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
      );
      this.setState(prevState => ({
        style: {
          ...prevState.style,
          transform: `perspective(${this.settings.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        },
      }));
    });
  }

  handleMouseMove(e) {
    e.persist();
    if (this.updateCall !== null) {
      window.cancelAnimationFrame(this.updateCall);
    }
    this.event = e;
    this.updateCall = requestAnimationFrame(this.update.bind(this, e));
    if (this.props.handleMouseMove) {
      this.props.handleMouseMove(e);
    }
  }

  setTransition() {
    clearTimeout(this.transitionTimeout);
    console.log('SET TRANSITION', `Speed: ${this.settings.speed}ms Easing: ${this.settings.easing}`);
    this.setState(prevState => ({
      style: {
        ...prevState.style,
        transition: `${this.settings.speed}ms ${this.settings.easing}`,
      },
    }));
    this.transitionTimeout = setTimeout(() => {
      console.log('TRANSITION COMPLETE');
      this.setState(prevState => ({
        style: {
          ...prevState.style,
          transition: '',
        },
      }));
    }, this.settings.speed);
  }

  handleMouseLeave(e) {
    this.setTransition();
    if (this.settings.reset) {
      this.reset();
    }
    if (this.props.handleMouseLeave) {
      this.props.handleMouseLeave(e);
    }
  }

  getValues(e) {
    const x = (e.nativeEvent.clientX - this.left) / this.width;
    const y = (e.nativeEvent.clientY - this.top) / this.height;
    const _x = Math.min(Math.max(x, 0), 1);
    const _y = Math.min(Math.max(y, 0), 1);
    const tiltX = (this.reverse * (this.settings.max / 2 - _x * this.settings.max)).toFixed(2);
    const tiltY = (this.reverse * (_y * this.settings.max - this.settings.max / 2)).toFixed(2);
    const percentageX = _x * 100;
    const percentageY = _y * 100;
    console.log(
      'JUST GOT NEW VALUES',
      `X: ${x} Y: ${y} -- TILT X: ${tiltX} TILT Y: ${tiltY} -- TILT X%: ${percentageX} TILT Y%: ${percentageY}`
    );
    console.log('Notice how X turned into percentageX.');
    return {
      tiltX,
      tiltY,
      percentageX,
      percentageY,
    };
  }

  updateElementPosition() {
    const rect = this.element.getBoundingClientRect();
    this.width = this.element.offsetWidth;
    this.height = this.element.offsetHeight;
    this.left = rect.left;
    this.top = rect.top;
  }

  update(e) {
    const values = this.getValues(e);
    console.log(
      'NEW CSS TRANSFORM VALUES',
      `perspective(${this.settings.perspective}px) rotateX(${this.settings.axis === 'x' ? 0 : values.tiltY}deg) rotateY(${
        this.settings.axis === 'y' ? 0 : values.tiltX
      }deg) scale3d(${this.settings.scale}, ${this.settings.scale}, ${this.settings.scale})`
    );
    this.setState(prevState => ({
      style: {
        ...prevState.style,
        transform: `perspective(${this.settings.perspective}px) rotateX(${
          this.settings.axis === 'x' ? 0 : values.tiltY
        }deg) rotateY(${this.settings.axis === 'y' ? 0 : values.tiltX}deg) scale3d(${this.settings.scale}, ${
          this.settings.scale
        }, ${this.settings.scale})`,
      },
    }));
    this.updateCall = null;
  }

  render() {
    const { style } = this.state;
    return (
      <div className="tilt-phase-one" onMouseEnter={this.handleMouseEnter} onMouseMove={this.handleMouseMove} onMouseLeave={this.handleMouseLeave}>
        <h1>Mouse over the photo:</h1>
        <div style={style} className="tilt-content">
          <img src={dogBackground} alt="" />
        </div>
      </div>
    );
  }
}

TiltPhaseOne.propTypes = {
  options: PropTypes.object, // Prop for passing tilt options
  handleMouseEnter: PropTypes.func, // Prop for handling mouse enter event
  handleMouseMove: PropTypes.func, // Prop for handling mouse move event
  handleMouseLeave: PropTypes.func, // Prop for handling mouse leave event
};

export default TiltPhaseOne;
