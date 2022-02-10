const cubeList = ["L", "J", "S", "Z", "T", "O", "I"]; // 方块列表
const colorType = ["#fffb14", "#ff9914", "#ff5e14", "#a914ff", "#143fff", "#14fff3", "#57ff14"]; // 方块颜色
const tetris = document.getElementById("tetris"); // 游戏的棋盘框

let elementType = [];   // 俄罗斯方块类型集合,俄罗斯方块的形状为类型
let squareSet;          // 小方块的集合
let nextElement = null; // 下一个出现的俄罗斯方块类型
let dynamicElement = null; // 当前下落的俄罗斯方块
let score = 0; // 分数
let level = 0; // 游戏级别
let lines = 0; // 当前消除行数
let interval = 1000; // 刷新时间
let timer; // 游戏总定时器

// 创建单个小方块
function createSquare(color, x, y) {
    let temp = document.createElement("div");  // 创建 div 元素
    temp.classList.add("square");    // 添加 square 类名
    temp.style.background = color;   // 设置背景颜色
    temp.style.left = 30 * x + "px"; // 设置 left 值
    temp.style.top = 30 * y + "px";  // 设置 top 值
    // temp.x = x;
    // temp.y = y;
    return temp;
}

// 创建公共类
class TetrisElement {
    constructor(x, y, nowStatus, elementType) {
        // 设置元素在界面的显示位置, 如果不设置默认为界面的左上角顶点
        this.basePoint = { x: x, y: y };

        // 存储组成俄罗斯方块的四个方块元素
        this.squareList = [];

        // 当前俄罗斯方块的位置状态(即初始状态与旋转 90 180 270 度后的位置信息), 
        this.status = [];

        // 当前俄罗斯方块的状态码 以 0 1 2 3 表示
        this.nowStatus = nowStatus;

        // 俄罗斯方块的类型: 分别为 I J L O S Z T 
        this.elementType = elementType;
    }

    // 方块旋转 默认为 1; 反向旋转可传入 -1
    rotate(val) {
        val = val ? val : 1;
        this.nowStatus = (this.nowStatus + val) % 4; // 改变当前的状态值
        this.refresh(); // 刷新所有小方块位置
    }

    // 方块下落
    drop() {
        this.basePoint.y += 1;  // 改变方块渲染位置
        this.refresh();  // 刷新页面
    }

    // 刷新方块显示位置
    refresh() {
        for (let i = 0; i < this.squareList.length; i++) {
            this.squareList[i].x = this.basePoint.x + this.status[this.nowStatus][i].offsetX;
            this.squareList[i].y = this.basePoint.y + this.status[this.nowStatus][i].offsetY;
        }
    }
    
    // 将方块渲染到游戏界面里
    show(parent) { 
        for (let i = 0; i < this.squareList.length; i++) {
            parent.appendChild(this.squareList[i]);
        }
    }
}

// 将游戏界面分为 20 * 10 份的方格
function initSquareSet() {
    squareSet = new Array(20);
    for (let i = 0; i < 20; i++) {
        squareSet[i] = new Array(10);
    }
}


// 随机生成一个类型的俄罗斯方块
function randomGenerateElement() {
    let elementTypeNum = Math.floor(Math.random() * elementType.length);  // 生成的方块类型
    let statusNum = Math.floor(Math.random() * 4);  // 生成的位置状态
    let colorTypeNum = Math.floor(Math.random() * colorType.length); // 生成的颜色
    return new elementType[elementTypeNum](4, -1, statusNum, colorType[colorTypeNum]); // 通过构造函数创建方块
}

// 将下落元素渲染到界面, 30 为当前每一行的高度
function render(all) {
    if (dynamicElement) {
        for (let k = 0; k < dynamicElement.squareList.length; k++) {
            dynamicElement.squareList[k].style.left = 30 * dynamicElement.squareList[k].x + "px";
            dynamicElement.squareList[k].style.top = 30 * dynamicElement.squareList[k].y + "px";
        }
    }
    // 当传入 true 的时候, 渲染页面
    if (all) {
        for (let i = 0; i < squareSet.length; i++) {
            for (let j = 0; j < squareSet[i].length; j++) {
                if (squareSet[i][j] != null) {
                    squareSet[i][j].x = j;
                    squareSet[i][j].y = i;
                    squareSet[i][j].style.left = 30 * squareSet[i][j].x + "px";
                    squareSet[i][j].style.top = 30 * squareSet[i][j].y + "px";
                }
            }
        }
    }
}



// 检查当前下落元素左右移动时是否出界
function checkOutOfRange() {
    let max = 0;
    for (let i = 0; i < dynamicElement.squareList.length; i++) {
        if ((dynamicElement.squareList[i].x < 0 || dynamicElement.squareList[i].x > 9) // 有小方块出界
            && Math.abs(dynamicElement.squareList[i].x - 5) - 4 > Math.abs(max)) {// 记录出界最大的那个小方块
            max = dynamicElement.squareList[i].x < 0 ? 0 - dynamicElement.squareList[i].x : 9 - dynamicElement.squareList[i].x;
        }
    }
    dynamicElement.basePoint.x += max;// 将基准点校正
    dynamicElement.refresh();
}

// 判断当前游戏是否已结束
function checkFinish() {
    for (let i = 0; i < 10; i++) {
        if (squareSet[0] && squareSet[0][i]) {
            return true;
        }
    }
    return false;
}


// 判断当前下落元素是否与其他元素接触
function checkCrash() {
    for (let i = 0; i < dynamicElement.squareList.length; i++) {
        let tempX = dynamicElement.squareList[i].x;
        let tempY = dynamicElement.squareList[i].y;
        if (squareSet[tempY] && squareSet[tempY][tempX] != null) {
            return true;
        }
    }
    return false;
}


// 消除行 arr 为当前可以消除的行数组
function clear(arr) {

    // 根据传入的参数将游戏界面对应的行消除
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < squareSet[arr[i]].length; j++) {
            tetris.removeChild(squareSet[arr[i]][j]);// 将小方块从界面上删除
        }
        squareSet.splice(arr[i], 1);// 数组的整行删除
    }

    // 将对应的空数组添加界面
    for (let i = 0; i < arr.length; i++) {
        let tempArr = new Array(10);
        squareSet.unshift(tempArr);
    }

    // 根据消除的行数获得分数
    score += arr.length * 50;

    // 重新渲染界面
    render(true)
}

// 判断是否存在需要消除的行
function checkClear() {
    // 将需要消除的行存储到 result 数组内
    let result = [];

    // 检查二位数组内是否存在不包含空值的数组
    for (let i = 0; i < squareSet.length; i++) {
        let flag = true;
        for (let j = 0; j < squareSet[i].length; j++) {
            if (!squareSet[i][j]) {// 任何一个位置是空位就不能消除
                flag = false;
                break;
            }
        }
        if (flag) {
            result.unshift(i); // 完全填充的行
        }
    }

    lines += result.length; // 统计消除的行数
    return result;
}

// 键盘事件
function keyEvent(event) {
    if (dynamicElement == null) {// 如果动态元素为空则什么都不需要做
        return;
    }
    if (event.key == "ArrowUp") {// 向上 进行旋转
        dynamicElement.rotate();// 执行旋转
        dynamicElement.refresh();// 刷新小方块数据
        checkOutOfRange();// 检查是否会出界，并进行校正
        if (checkCrash()) {// 检查是否会碰撞，如果会碰撞，则状态返回，因为没有进行刷新，用户视觉无影响
            dynamicElement.rotate(-1);
            dynamicElement.refresh();
        }
    } else if (event.key == "ArrowLeft") {// 向左
        dynamicElement.basePoint.x -= 1;// 将基准点左移
        dynamicElement.refresh();// 刷新小方块位置数据
        checkOutOfRange();// 判断出界
        if (checkCrash()) {// 判断碰撞，如果碰撞，将数据还原并刷新数据
            dynamicElement.basePoint.x += 1;
            dynamicElement.refresh();
        }
    } else if (event.key == "ArrowRight") {// 向右
        dynamicElement.basePoint.x += 1;// 将基准点右移
        dynamicElement.refresh();// 刷新小方块位置数据
        checkOutOfRange();// 判断出界
        if (checkCrash()) {// 检查碰撞，如果碰撞，将数据还原并刷新数据
            dynamicElement.basePoint.x -= 1;
            dynamicElement.refresh();
        }
    } else if (event.key == "ArrowDown") {// 向下
        if (isDrop()) {// 判断是否已经碰撞，如果碰撞则结束
            return;
        }
        dynamicElement.drop();// 不会碰撞则下降
    }
    render();// 刷新界面，将改变的数据显示在界面上
};

// 将动态的元素进行固定，并且置空
function fixed() {
    try {
        for (let i = 0; i < dynamicElement.squareList.length; i++) {
            squareSet[dynamicElement.squareList[i].y][dynamicElement.squareList[i].x] = dynamicElement.squareList[i];
        }
        dynamicElement = null;
        clear(checkClear());// 消除掉需要清除的行

        if (checkFinish()) {// 检查是否需要结束
            clearInterval(timer);
            window.removeEventListener("keydown", keyEvent); // 清除绑定事件
            alert("游戏结束，分数为：" + score);
        }
    } catch (e) {
        clearInterval(timer);
        window.removeEventListener("keydown", keyEvent); // 清除绑定事件
        alert("游戏结束，分数为：" + score);
    }
}

// 判断方块是否可以继续下落
function isDrop() {
    for (let i = 0; i < dynamicElement.squareList.length; i++) {
        if (squareSet[dynamicElement.squareList[i].y + 1]
            && squareSet[dynamicElement.squareList[i].y + 1][dynamicElement.squareList[i].x] // 下个位置有小方块，需要停止
            || dynamicElement.squareList[i].y == 19) {// 到达最后一行需要停止
            fixed();
            return true;
        }
    }
    return false;
}

// 方块下落速度
function speed(interval) {
    if (level < 9 && score < 4500) {
        level = Math.floor(score / 500)
        interval = 1000 - 100 * level;
    }
    return interval
}

// 初始化函数
function init() {

    // 初始化游戏界面
    initSquareSet();

    // 判断是否存在当前下落方块
    timer = setInterval(function () {

        // console.log(elementType)
        // 如果下一个方块值为空，则创建新的元素
        if (nextElement == null) {
            nextElement = randomGenerateElement();
            showElement(nextElement)
        }

        // 如果当前下落方块值为空，则把下一个方块变为当前下落方块
        if (dynamicElement == null) {
            dynamicElement = nextElement;
            nextElement = randomGenerateElement();
            dynamicElement.show(tetris);
            showElement(nextElement)
        }

        // 判断当前方块是否可以继续下落
        if (!isDrop()) {
            dynamicElement.drop();
        }
        render();

    }, speed(interval));

    // 添加监听事件,当鼠标按下时触发
    window.addEventListener("keydown", keyEvent)
}

// 当页面加载完成时触发
window.onload = function () {
    init();
}



