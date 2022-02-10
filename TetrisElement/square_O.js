// 创建方块O
class SquareO extends TetrisElement {
    constructor(x, y, nowStatus,color) {
        super(x, y, nowStatus, SquareO);
        this.status = [
            [{ offsetX: 0, offsetY: 0 }, { offsetX: 1, offsetY: 0 }, { offsetX: 0, offsetY: -1 }, { offsetX: 1, offsetY: -1 }],
            [{ offsetX: 0, offsetY: 0 }, { offsetX: 1, offsetY: 0 }, { offsetX: 0, offsetY: -1 }, { offsetX: 1, offsetY: -1 }],
            [{ offsetX: 0, offsetY: 0 }, { offsetX: 1, offsetY: 0 }, { offsetX: 0, offsetY: -1 }, { offsetX: 1, offsetY: -1 }],
            [{ offsetX: 0, offsetY: 0 }, { offsetX: 1, offsetY: 0 }, { offsetX: 0, offsetY: -1 }, { offsetX: 1, offsetY: -1 }]
        ];
        for (let i = 0; i < 4; i++) {
            let x =  this.basePoint.x + this.status[this.nowStatus][i].offsetX;
            let y =  this.basePoint.y + this.status[this.nowStatus][i].offsetY;
            let temp = createSquare(color,x, y);
            // temp.classList.add("square_" + this.colorType);
            this.squareList.push(temp);
        }
    }
}

elementType.push(SquareO);