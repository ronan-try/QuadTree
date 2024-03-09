(function () {
    console.error('This is function for.')
    console.log('')

    // 二维矩阵
    /****
     * [(1,1), (2,1), (3,1)]
     * [(1,2), (2,2), (3,2)]
     * 
     * 分析特点
     * 第一个维度 是y=1，x=1~3
     * 第二个维度 是y=2，x=1~3
     */

    const rangeX = new Array(14).fill(0).map((val,index) => index+1); // [1,2,3,4,5,6]
    const rangeY = new Array(9).fill(0).map((val,index) => index+1); // [1,2,3,4]

    const resultArray = [];
    const tbody = [];

    rangeY.forEach(y => {
        
        const tds = [];
        rangeX.forEach(x=> {
            resultArray.push({x,y})
            tds.push(`<td id="id_${x}_${y}">${x}, ${y}</td>`)
        })

        const tr = `<tr>${tds.join('')}</tr>`;
        tbody.push(tr);
    })

    // console.info(resultArray);
    // console.log(tbody);

    // const consoleFlag = rangeX[rangeX.length -1];
    // resultArray.forEach((item, idx) => {
    //   console.log(item);

    //   const toCansole = (idx+1) % consoleFlag === 0;
    //   toCansole && console.error('<<<---')
    // })

    const elTable = document.getElementById('tableId');
    elTable.innerHTML=tbody.join('')

    // Target: 找出 (2,3) (7,8) 范围内的点
    const targetPointLeftTop = {x:4, y:3};
    const targetPointRightBottom = {x:7, y:8};
    const targetXMin = targetPointLeftTop.x, targetXMax = targetPointRightBottom.x;
    const targetYMin = targetPointLeftTop.y, targetYMax = targetPointRightBottom.y;
    const resultFilter = resultArray.filter(({x, y}) => {
        if(x < targetXMin || x > targetXMax) return false;
        if(y < targetYMin || y > targetYMax) return false;
        return true;
    })
    console.info(resultFilter);
    resultFilter.forEach(({x, y}) => {
        const id = `id_${x}_${y}`;
        const el = document.getElementById(id)
        el && (el.style.backgroundColor = 'red')
    })

})();