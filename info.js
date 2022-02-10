const socreText = document.getElementsByClassName("number")[0]; // 得分
const levelText = document.getElementsByClassName("number")[1]; // 等级
const linesText = document.getElementsByClassName("number")[2]; // 消除行数
const nextTetris = document.getElementsByClassName("show")[0]; // 存储下一个方块

setInterval(() => {
    socreText.innerText = score;
    linesText.innerText = lines;
    levelText.innerText = level;
    if (level < 9) {
        level = Math.floor(score / 1000)
        interval = 1000 - 100 * level;
    }
}, 16);

// 将下一个出现的方块渲染到预展示区域
function showElement(nextElement) {
    for (let i = 0; i < nextElement.squareList.length; i++) {
        console.log(nextElement);
        nextTetris.appendChild(nextElement.squareList[i]);
    }
}