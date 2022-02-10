// 创建方块I
class SquareI extends TetrisElement {
    constructor(x, y, nowStatus,color) {
        super(x, y, nowStatus, SquareI);
        this.status = [
            [{offsetX: 0, offsetY: 0},{offsetX: 0, offsetY: -1},{offsetX: 0, offsetY: -2},{offsetX: 0, offsetY: -3}],
            [{offsetX: 0, offsetY: 0},{offsetX: 1, offsetY: 0},{offsetX: 2, offsetY: 0},{offsetX: 3, offsetY: 0}],
            [{offsetX: 0, offsetY: 0},{offsetX: 0, offsetY: -1},{offsetX: 0, offsetY: -2},{offsetX: 0, offsetY: -3}],
            [{offsetX: 0, offsetY: 0},{offsetX: 1, offsetY: 0},{offsetX: 2, offsetY: 0},{offsetX: 3, offsetY: 0}],
        ];
        for (let i = 0 ; i < 4 ; i ++) {
            let temp = createSquare( color,this.basePoint.x + this.status[this.nowStatus][i].offsetX, this.basePoint.y + this.status[this.nowStatus][i].offsetY);
            this.squareList.push(temp);
        }
    }
}

elementType.push(SquareI);