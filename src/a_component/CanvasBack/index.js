/** Canvas背景效果，变化的线条 **/
import React from "react";
import "./index.scss";
import P from "prop-types";

export default class CanvasBack extends React.PureComponent {
  static propTypes = {
    row: P.number, // 纵向密集度
    col: P.number // 横向密集度
  };

  constructor(props) {
    super(props);
    this.state = {
      context: null
    };
    this.ctx = null;
    this.dots = []; // 所有的点
    this.mouseXY = null; // 当前鼠标所在位置
    this.animateTimer = null;
  }

  componentDidMount() {
    this.ctx = this.myCanvas.getContext("2d");
    this.ctx.strokeStyle = "rgba(255,255,255,1)";
    this.width = this.myCanvas.clientWidth;
    this.height = this.myCanvas.clientHeight;
    this.myCanvas.width = this.width;
    this.myCanvas.height = this.height;
    this.init(this.props.row, this.props.col, this.width, this.height);
    this.animate();
  }

  componentWillUnmount() {
    //this.myCanvas.removeEventListener("click");
    window.cancelAnimationFrame(this.animateTimer);
  }

  /** 初始化canvas **/
  init(row, col, width, height) {
    const step_row = height / (row - 2);
    const step_col = width / (col - 2);
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        const temp = {
          x: j * step_col - step_col / 2, // 原始坐标x
          y: i * step_row - step_row / 2, // 原始坐标y
          sx: this.random(-step_row / 2, step_row / 2), // 当前偏移量x
          sy: this.random(-step_col / 2, step_col / 2), // 当前偏移量y
          dx: !!Math.round(this.random(0, 1)), // 当前方向x
          dy: !!Math.round(this.random(0, 1)), // 当前方向y
          color: this.random(80, 255), // b通道颜色值
          dcolor: !!Math.round(this.random(0, 1)) // 颜色改变向量
        };
        this.dots.push(temp);
      }
    }

    // 绑定鼠标事件
    this.myCanvas.addEventListener("mousemove", e => this.initEvent(e), false);
  }

  /** 鼠标绑定事件 **/
  initEvent(e) {
    this.mouseXY = [e.offsetX, e.offsetY];
  }

  /** 工具 - 获取范围随机数 **/
  random(min, max) {
    return Math.random() * (max - min) + min;
  }

  /** 绘制一帧 **/
  drow(dots, row, col, ctx, width, height) {
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col - 1; j++) {
        const k = i * col + j;
        const k1 = k + 1;
        const k2 = k + col;
        const k3 = k - col + 1;
        if (i <= row - 2) {
          ctx.beginPath();
          ctx.moveTo(dots[k].x + dots[k].sx, dots[k].y + dots[k].sy);
          ctx.lineTo(dots[k1].x + dots[k1].sx, dots[k1].y + dots[k1].sy);
          ctx.lineTo(dots[k2].x + dots[k2].sx, dots[k2].y + dots[k2].sy);
          ctx.closePath();
          const c = Math.round(
            (dots[k].color + dots[k1].color + dots[k2].color) / 3
          );
          ctx.fillStyle = `rgb(0,${Math.round(c / 1.15)},${c})`;
          ctx.fill();
        }
        if (i > 0) {
          ctx.beginPath();
          ctx.moveTo(dots[k].x + dots[k].sx, dots[k].y + dots[k].sy);
          ctx.lineTo(dots[k1].x + dots[k1].sx, dots[k1].y + dots[k1].sy);
          ctx.lineTo(dots[k3].x + dots[k3].sx, dots[k3].y + dots[k3].sy);
          ctx.closePath();
          const c = Math.round(
            (dots[k].color + dots[k1].color + dots[k3].color) / 3
          );
          ctx.fillStyle = `rgb(0, ${Math.round(c / 1.15)},${c})`;
          ctx.fill();
        }
      }
    }
  }

  /** 动画函数 **/
  animate() {
    const row = this.props.row;
    const col = this.props.col;
    const width = this.width;
    const height = this.height;
    const mouseXY = this.mouseXY;
    const step_row = height / (row - 2);
    const step_col = width / (col - 2);

    this.dots.forEach(function(item, index) {
      if (item.dx) {
        // 增
        if (item.sx < step_col / 3) {
          item.sx += 0.1;
        } else {
          item.dx = !item.dx;
        }
      } else {
        // 减
        if (item.sx > -(step_col / 3)) {
          item.sx -= 0.1;
        } else {
          item.dx = !item.dx;
        }
      }

      if (item.dy) {
        // 增
        if (item.sy < step_row / 3) {
          item.sy += 0.1;
        } else {
          item.dy = !item.dy;
        }
      } else {
        // 减
        if (item.sy > -(step_row / 3)) {
          item.sy -= 0.1;
        } else {
          item.dy = !item.dy;
        }
      }

      /** 计算当前点与鼠标之间的距离比例 **/
      let m = 0;
      if (mouseXY) {
        const x1 = item.x + item.sx;
        const y1 = item.y + item.sy;
        m = Math.min(
          Math.sqrt(
            Math.pow(x1 - mouseXY[0], 2) + Math.pow(y1 - mouseXY[1], 2)
          ),
          100
        );
        m = (100 - m) / 200;
      }

      /** 处理颜色变化 **/
      if (item.dcolor) {
        // 颜色变亮
        if (m !== 0 ? item.color < 255 : item.color < 180) {
          item.color += 1;
        } else {
          item.dcolor = !item.dcolor;
        }
      } else {
        if (m !== 0 ? item.color > 250 : item.color > 100) {
          item.color -= 1;
        } else {
          item.dcolor = !item.dcolor;
        }
      }
    });

    this.drow(this.dots, row, col, this.ctx, width, height);
    this.animateTimer = requestAnimationFrame(() => this.animate());
  }

  render() {
    return (
      <div className="canvas-back">
        <canvas ref={c => (this.myCanvas = c)} />
      </div>
    );
  }
}
