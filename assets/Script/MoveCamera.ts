/**
 * 支持相机的拖动（即拖动视角）
 */

import { _decorator, Camera, CCFloat, CCInteger, clamp, Component, EventTouch, Node, Rect, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MoveCamera')
export class MoveCamera extends Component {
    @property({ type: Rect })
    public moveRange: Rect = new Rect(-100, -100, 200, 200)

    @property(CCInteger)
    public moveThreshold: number = 3   //每一帧移动速度的阈值

    @property(CCFloat)
    public moveSpeed: Number = 1        //移动的速度

    @property(Camera)
    public camera: Camera = null

    private inDrag: boolean = false
    private lastTouchPosition: Vec2 = null
    private startTouchPosition: Vec2 = null //开始拖动时的手指位置

    /**
     * 设置相机移动范围
     * @param range 移动范围
     */
    setMoveRange(range: Rect) {
        // this.camera.or
    }

    onLoad() {
        //注册拖动相机相关的回调函数
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this)
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
    }

    onTouchStart(event: EventTouch) {
        //避免点击事件被相机移动给吞掉，以下亦然
        event.preventSwallow = true
        this.inDrag = true
        this.lastTouchPosition = event.getLocation()
        this.startTouchPosition = event.getLocation()
    }

    onTouchMove(event: EventTouch) {
        event.preventSwallow = true
        if (!this.inDrag) return
        let currentPosition = event.getLocation()
        let delta = currentPosition.subtract(this.lastTouchPosition)
        this.lastTouchPosition = event.getLocation()
        if (delta.length() > this.moveThreshold) {
            this.moveCamera(delta)
        }
    }

    onTouchEnd(event: EventTouch) {
        //如果移动范围小于阈值，说明用户的目的是点击，继续传播点击事件
        //否则用户的目的就是移动，防止误点击
        if (this.startTouchPosition.subtract(event.getLocation()).length() < 2 * this.moveThreshold)
            event.preventSwallow = true
        this.inDrag = false
    }

    onTouchCancel(event: EventTouch) {
        event.preventSwallow = true
        this.inDrag = false
    }

    moveCamera(delta: Vec2) {
        let cameraPosition = this.camera.node.position
        let newPosition = new Vec3(cameraPosition.x - delta.x, cameraPosition.y - delta.y, 0)
        newPosition.x = clamp(newPosition.x, this.moveRange.xMin, this.moveRange.xMax)
        newPosition.y = clamp(newPosition.y, this.moveRange.yMin, this.moveRange.yMax)
        this.camera.node.setPosition(newPosition)
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


