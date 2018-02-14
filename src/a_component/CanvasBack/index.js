/** Canvas背景效果，变化的线条 **/
import React from 'react';
import css from './index.scss';

class CanvasBack extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            point: 18, // 生成35个点
            context: null,
        };
        this.context = null;
        this.circleArr = [];
        this.animateTimer = null;
    }

    componentDidMount() {
        this.init();
    }

    componentWillUnmount() {
        window.cancelAnimationFrame(this.animateTimer);
    }

    init() {
        const canvas = this.myCanvas;
        console.log('获取到了吗canvas：', canvas);
        canvas.width = screen.availWidth;
        canvas.height = canvas.offsetHeight;
        canvas.style.width = `${screen.availWidth}px`;
        const c2d = canvas.getContext('2d');

        c2d.strokeStyle = 'rgba(0,0,0,0.01)';
        c2d.strokeWidth = 1;
        c2d.fillStyle = 'rgba(0,0,0,0.01)';

        this.setState({
            context: canvas.getContext('2d'),
        });

        for (let i = 0; i < this.state.point; i++) {
            this.circleArr.push(this.drawCricle(c2d, this.num(canvas.width * 1.5, -canvas.width * 0.5), this.num(canvas.height * 1.5, -canvas.height * 0.5), this.num(25, 8), this.num(30, -30)/40, this.num(30, -30)/40));
        }
        this.animate();
    }

    animate() {
        this.draw();
        for (let i = 0; i < this.state.point; i++) {
            const cir = this.circleArr[i];
            cir.x += cir.moveX;
            cir.y += cir.moveY;
            if (cir.x > this.myCanvas.width * 1.2) cir.x = -this.myCanvas.width * 0.2;
            else if (cir.x < -this.myCanvas.width * 0.2) cir.x = this.myCanvas.width * 1.2;
            if (cir.y > this.myCanvas.height * 1.2) cir.y = -this.myCanvas.height * 0.2;
            else if (cir.y < -this.myCanvas.height * 0.2) cir.y = this.myCanvas.height * 1.2;
            
        }
        this.animateTimer = requestAnimationFrame(this.animate);
    }

//线条：开始xy坐标，结束xy坐标，线条透明度
    Line (x, y, _x, _y, o) {
        let line = {};
        line.beginX = x;
        line.beginY = y;
        line.closeX = _x;
        line.closeY = _y;
        line.o = o;
        return line;
    }
    //点：圆心xy坐标，半径，每帧移动xy的距离
    Circle (x, y, r, moveX, moveY) {
        let circle = {};
        circle.x = x;
        circle.y = y;
        circle.r = r;
        circle.moveX = moveX;
        circle.moveY = moveY;
        return circle;
    }
    //生成max和min之间的随机数
    num (max, _min) {
        const min = arguments[1] || 0;
        return Math.floor(Math.random()*(max-min)+min);
    }
    // 绘制圆点
    drawCricle (cxt, x, y, r, moveX, moveY) {
        const circle = this.Circle(x, y, r, moveX, moveY);
        cxt.beginPath();
        cxt.arc(circle.x, circle.y, circle.r, 0, 2*Math.PI);
        cxt.closePath();
        cxt.fill();
        return circle;
    }
    //绘制线条
    drawLine (cxt, x, y, _x, _y, o) {
        const line = this.Line(x, y, _x, _y, o);
        cxt.beginPath();
        cxt.strokeStyle = 'rgba(0,0,0.02,'+ o +')';
        cxt.moveTo(line.beginX, line.beginY);
        cxt.lineTo(line.closeX, line.closeY);
        cxt.closePath();
        cxt.stroke();

    }

    //每帧绘制
    draw () {
        this.state.context.clearRect(0,0,this.myCanvas.width , this.myCanvas.height);
        for (let i = 0; i < this.state.point; i++) {
            this.drawCricle(this.state.context, this.circleArr[i].x, this.circleArr[i].y, this.circleArr[i].r);
        }
        for (let i = 0; i < this.state.point; i++) {
            for (let j = 0; j < this.state.point; j++) {
                if (i + j < this.state.point) {
                    const A = Math.abs(this.circleArr[i+j].x - this.circleArr[i].x),
                        B = Math.abs(this.circleArr[i+j].y - this.circleArr[i].y);
                    const lineLength = Math.sqrt(A*A + B*B);
                    const C = 1/lineLength*7 + 0.005;
                    const lineOpacity = C > 0.05 ? 0.05 : C;
                    if (lineOpacity > 0) {
                        this.drawLine(this.state.context, this.circleArr[i].x, this.circleArr[i].y, this.circleArr[i+j].x, this.circleArr[i+j].y, lineOpacity);
                    }
                }
            }
        }
    }

    render() {
        return (
            <div className={css['canvas-back']}>
                <canvas ref={(c) => this.myCanvas = c}/>
            </div>
        );
    }
}

CanvasBack.propTypes = {
};

export default CanvasBack;
