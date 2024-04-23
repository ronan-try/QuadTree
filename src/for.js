(function () {
  console.error("This is function for.");
  console.log("");

  class QuadtreeNode {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.points = [];
      this.children = [];
    }

    insert(point) {
      // 如果当前节点有子节点，递归插入
      if (this.children.length > 0) {
        this.children[this.getQuadrant(point)].insert(point);
        return;
      }

      // 将点添加到当前节点
      this.points.push(point);

      // 检查是否需要分裂节点
      if (this.points.length > 1 && this.level < 5) {
        // 假设最大层级为5
        this.split();
        for (let p of this.points) {
          this.children[this.getQuadrant(p)].insert(p);
        }
        this.points = [];
      }
    }

    query(range, found) {
      // 如果当前节点与查询范围不相交，返回
      //   if (!this.intersects(range)) return;

      // 检查当前节点的点是否在查询范围内
      for (let p of this.points) {
        if (range.contains(p)) {
          found.push(p);
        }
      }

      // 如果有子节点，递归查询
      if (this.children.length > 0) {
        for (let child of this.children) {
          child.query(range, found);
        }
      }
    }

    // 其他辅助方法（如 intersects, contains, getQuadrant, split）...
  }
  class Quadtree {
    constructor(boundary) {
      this.root = new QuadtreeNode(boundary.x, boundary.y);
    }

    insert(point) {
      this.root.insert(point);
    }

    query(range, found = []) {
      this.root.query(range, found);
      return found;
    }
  }

  // 创建一个边界为1000x1000的矩形
  const boundary = { x: 0, y: 0 };
  const quadtree = new Quadtree(boundary);

  // 辅助方法（如 Point 和 Rectangle 类的实现）...

  // 二维矩阵
  /****
   * [(1,1), (2,1), (3,1)]
   * [(1,2), (2,2), (3,2)]
   *
   * 分析特点
   * 第一个维度 是y=1，x=1~3
   * 第二个维度 是y=2，x=1~3
   */
  const xNum = 22,
    yNum = 25;
  document.getElementById("total").innerHTML = xNum * yNum;
  const rangeX = new Array(xNum).fill(0).map((val, index) => index + 1); // [1,2,3,4,5,6]
  const rangeY = new Array(yNum).fill(0).map((val, index) => index + 1); // [1,2,3,4]

  const resultArray = [];
  const tbody = [];

  rangeY.forEach((y) => {
    const tds = [];
    rangeX.forEach((x) => {
      resultArray.push({ x, y });
      tds.push(`<td id="id_${x}_${y}">${x}, ${y}</td>`);
    });

    const tr = `<tr>${tds.join("")}</tr>`;
    tbody.push(tr);
  });

  // 插入点
  resultArray.forEach((point) => quadtree.insert(point));

  // 查询范围内的点
  const queryRange = { x: 12, y: 11 }; // 查询范围
  const foundPoints = quadtree.query(queryRange);
  console.log(foundPoints);

  // console.info(resultArray);
  // console.log(tbody);

  // const consoleFlag = rangeX[rangeX.length -1];
  // resultArray.forEach((item, idx) => {
  //   console.log(item);

  //   const toCansole = (idx+1) % consoleFlag === 0;
  //   toCansole && console.error('<<<---')
  // })

  const elTable = document.getElementById("tableId");
  elTable.innerHTML = tbody.join("");

  // Target: 找出 (2,3) (7,8) 范围内的点
  let targetPointLeftTop = { x: 1, y: 1 };
  let targetPointRightBottom = { x: 2, y: 2 };

  const wacao = () => {
    const targetXMin = targetPointLeftTop.x,
      targetXMax = targetPointRightBottom.x;
    const targetYMin = targetPointLeftTop.y,
      targetYMax = targetPointRightBottom.y;

    console.log("start: ", window.performance.now());
    const resultFilter = resultArray.filter(({ x, y }) => {
      if (x < targetXMin || x > targetXMax) return false;
      if (y < targetYMin || y > targetYMax) return false;
      return true;
    });
    console.log("end: ", window.performance.now());
    // console.info(resultFilter);

    resultFilter.forEach(({ x, y }) => {
      const id = `id_${x}_${y}`;
      const el = document.getElementById(id);
      el && (el.style.backgroundColor = "red");
    });
  };
  wacao();

  function ddpoint(point) {
    console.warn(point);
    const now = ++ddpoint.times;
    console.log(now);
    if (now === 1) {
      targetPointLeftTop = point;
    }

    if (now === 2) {
      targetPointRightBottom = point;
      ddpoint.times = 0;
      wacao();
      console.log("不执行吗");
    }
  }
  ddpoint.times = 0;

  elTable.addEventListener(
    "click",
    (e) => {
      const elTarget = e.target;
      const id = elTarget.id;
      const ids = id.split("_");
      console.log(id);
      ddpoint({ x: ids[1], y: ids[2] });
    },
    false
  );
})();
