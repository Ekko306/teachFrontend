// save方法里 将canvas转换成dataUrl数据： https://stackoverflow.com/questions/13198131/how-to-save-an-html5-canvas-as-an-image-on-a-server
// loadUrl加载方法里 将dataUrl数据导入到canvas https://stackoverflow.com/questions/8473205/convert-and-insert-base64-data-to-canvas-in-javascript
// 他的例子都做好了 赞

import {Subject} from '@microsoft/signalr'


import {saveDrawing} from "../../store/features/drawing/drawingSlice";

console.log('启动绘图！')

function startPaint(paintDom, connection, groupName, user, dispatch) {

  // 和React.createElement类似 用js的函数创建dom函数 还有全局变量
  function elt(name, attributes) {
    var node = document.createElement(name);
    if (attributes) {
      for (var attr in attributes)
        if (attributes.hasOwnProperty(attr))
          node.setAttribute(attr, attributes[attr]);
    }
    for (var i = 2; i < arguments.length; i++) {
      var child = arguments[i];
      if (typeof child == "string")
        child = document.createTextNode(child);
      node.appendChild(child);
    }
    return node;
  }
  var controls = Object.create(null);
  var tools = Object.create(null);

  var canvas = elt("canvas", { width: 561.8, height: 300, style: 'border: 4px groove pink;' });
  var cx = canvas.getContext("2d");

// 入口函数
  function createPaint(parent) {

    var toolbar = elt("div", {class: "toolbar"});
    for (var name in controls)
      toolbar.appendChild(controls[name](cx));  // appendChilde 是 node的方法 给节点添加子元素

    var panel = elt("div", {class: "picturepanel"}, canvas);
    parent.appendChild(elt("div", null, panel, toolbar));
  }


// 下面是controls的集合 是控件 选择加载 保存 工具啥的
  controls.tool = function(cx) {
    var select = elt("select");
    for (var name in tools)
      select.appendChild(elt("option", null, name));

    cx.canvas.addEventListener("mousedown", function(event) {
      if (event.which == 1) {
        tools[select.value](event, cx);  // 每次 切换工具后给canvas绑定上响应的mousedown事件，传入event和cx参数 cx是canvas参数 event是mouse参数
        event.preventDefault();
      }
    });
    return elt("span", null, "工具:", select);
  };
  controls.color = function(cx) {
    var input = elt("input", {type: "color"});
    input.addEventListener("change", function() {
      cx.fillStyle = input.value;
      cx.strokeStyle = input.value;
    });
    return elt("span", {style: "margin-left: 6px"}, "颜色: ", input);
  };
  controls.brushSize = function(cx) {
    var select = elt("select");
    var sizes = [1, 2, 3, 5, 8, 12, 25, 35, 50, 75, 100];
    sizes.forEach(function(size) {
      select.appendChild(elt("option", {value: size},
          size + " 像素"));
    });
    select.addEventListener("change", function() {
      cx.lineWidth = select.value;
    });
    return elt("span", {style: "margin-left: 6px"}, "大小: ", select);
  };
  controls["保存到本地"] = function(cx) {
    var link = elt("a", {href: "/", id: "link123", style: "margin-left: 6px"}, "保存到本地");
    function update() {
      try {
        let content = cx.canvas.toDataURL();
        link.href = content
        link.addEventListener('click', ()=>{
          var iframe = "<iframe width='100%' height='100%' src='" + content +  "'></iframe>"
          var x = window.open()
          x.document.write(iframe)
          x.document.close()
        })
      } catch (e) {
        if (e instanceof Error)
          link.href = "javascript:alert(" +
              JSON.stringify("Can't save: " + e.toString()) + ")";
        else
          throw e;
      }
    }
    link.addEventListener("mouseover", update);
    link.addEventListener("focus", update);
    return link;
  };
  function loadImageURL(cx, url) {
    var image = document.createElement("img");
    image.addEventListener("load", function() {
      var color = cx.fillStyle, size = cx.lineWidth;
      cx.canvas.width = image.width;
      cx.canvas.height = image.height;
      cx.drawImage(image, 0, 0);
      cx.fillStyle = color;
      cx.strokeStyle = color;
      cx.lineWidth = size;
    });
    image.src = url;
  }
  controls.openFile = function(cx) {
    var input = elt("input", {type: "file"});
    input.addEventListener("change", function() {
      if (input.files.length == 0) return;
      var reader = new FileReader();
      reader.addEventListener("load", function() {
        var image = document.createElement("img");
        image.addEventListener("load", function () {
          var color = cx.fillStyle, size = cx.lineWidth;
          // cx.canvas.width = image.width;
          // cx.canvas.height = image.height;
          cx.canvas.width = 561.8
          cx.canvas.height = 300
          cx.drawImage(image, 0, 0);
          cx.fillStyle = color;
          cx.strokeStyle = color;
          cx.lineWidth = size;
          sendInfoOnEnd()
        });
        image.src = reader.result;

      });
      reader.readAsDataURL(input.files[0]);
    });
    return elt("div", {style: "margin-top: 6px; display: flex; flex-direction: 'row'", id: "information"}, "加载图片: ", input);
  };
  // controls.openURL = function(cx) {
  //   var input = elt("input", {type: "text"});
  //   var form = elt("form", null,
  //       "Open URL: ", input,
  //       elt("button", {type: "submit"}, "load"));
  //   form.addEventListener("submit", function(event) {
  //     event.preventDefault();
  //     loadImageURL(cx, input.value);
  //   });
  //   return form;
  // };
  // controls.sendOut = function (cx) {
  //   return elt("button", { id: "sendOut" }, "发送信息")
  // }


// 下面是tools的集合 是绘图的工具
// 两个tools的公共函数
  function relativePos(event, element) {
    var rect = element.getBoundingClientRect();
    return {x: Math.floor(event.clientX - rect.left),
      y: Math.floor(event.clientY - rect.top)};
  }
  function trackDrag(onMove, onEnd) {
    function end(event) {
      // eslint-disable-next-line no-restricted-globals
      removeEventListener("mousemove", onMove);
      // eslint-disable-next-line no-restricted-globals
      removeEventListener("mouseup", end);
      if (onEnd)
        onEnd(event);
    }
    // eslint-disable-next-line no-restricted-globals
    addEventListener("mousemove", onMove);
    // eslint-disable-next-line no-restricted-globals
    addEventListener("mouseup", end);
  }

  tools["线段"] = function(event, cx, onEnd) {
    cx.lineCap = "round";

    var pos = relativePos(event, cx.canvas);
    trackDrag(function(event) {
      cx.beginPath();
      cx.moveTo(pos.x, pos.y);
      pos = relativePos(event, cx.canvas);
      cx.lineTo(pos.x, pos.y);
      cx.stroke();
      // }, sendInfoOnEnd);
    }, sendInfoOnEnd)
  };

  tools["橡皮"] = function(event, cx) {
    cx.globalCompositeOperation = "destination-out";
    tools["线段"](event, cx, function() {
      cx.globalCompositeOperation = "source-over";
    });
  };

  tools["文本"] = function(event, cx) {
    var text = prompt("Text:", "");
    if (text) {
      var pos = relativePos(event, cx.canvas);
      cx.font = Math.max(7, cx.lineWidth) + "px sans-serif";
      cx.fillText(text, pos.x, pos.y);
      sendInfoOnEnd()
    }
  };

  function randomPointInRadius(radius) {
    for (;;) {
      var x = Math.random() * 2 - 1;
      var y = Math.random() * 2 - 1;
      if (x * x + y * y <= 1)
        return {x: x * radius, y: y * radius};
    }
  }
  tools["喷洒"] = function(event, cx) {
    var radius = cx.lineWidth / 2;
    var area = radius * radius * Math.PI;
    var dotsPerTick = Math.ceil(area / 30);

    var currentPos = relativePos(event, cx.canvas);
    var spray = setInterval(function() {
      for (var i = 0; i < dotsPerTick; i++) {
        var offset = randomPointInRadius(radius);
        cx.fillRect(currentPos.x + offset.x,
            currentPos.y + offset.y, 1, 1);
      }
    }, 25);
    trackDrag(function(event) {
      currentPos = relativePos(event, cx.canvas);
    }, function () {
      clearInterval(spray);
      sendInfoOnEnd()
    });
  };

  function rectangleFrom(a, b) {
    return {left: Math.min(a.x, b.x),
      top: Math.min(a.y, b.y),
      width: Math.abs(a.x - b.x),
      height: Math.abs(a.y - b.y)};
  }
  tools["矩形"] = function(event, cx) {
    var relativeStart = relativePos(event, cx.canvas);
    var pageStart = {x: event.pageX, y: event.pageY};

    var trackingNode = document.createElement("div");
    trackingNode.style.position = "absolute";
    trackingNode.style.background = cx.fillStyle;
    paintDom.appendChild(trackingNode);

    trackDrag(function(event) {
      var rect = rectangleFrom(pageStart,
          {x: event.pageX, y: event.pageY});
      trackingNode.style.left = rect.left + "px"; // 这个是拖动动态的展示效果 不然canvas只能最后才展示出来
      trackingNode.style.top = rect.top + "px";
      trackingNode.style.width = rect.width + "px";
      trackingNode.style.height = rect.height + "px";
    }, function(event) {
      var rect = rectangleFrom(relativeStart,
          relativePos(event, cx.canvas));
      cx.fillRect(rect.left, rect.top, rect.width, rect.height);
      paintDom.removeChild(trackingNode);
      sendInfoOnEnd()
    });
  };

  function circleForm(a, b) {
    var m = Math.abs(a.x - b.x)
    var n = Math.abs(a.y - b.y)
    var radius = Math.sqrt(m * m + n * n)
    return {
      left: a.x - radius,
      top: a.y - radius,
      width: 2 * radius,
      height: 2 * radius
    }
  }
  tools["圆形"] = function(event, cx) {
    var relativeStart = relativePos(event, cx.canvas);
    var pageStart = {x: event.pageX, y: event.pageY}

    var trackingNode = document.createElement("div");
    trackingNode.style.position = "absolute";
    trackingNode.style.background = cx.fillStyle;
    trackingNode.style.borderRadius = "50%";
    paintDom.appendChild(trackingNode);

    trackDrag(function(event) {
      var circle = circleForm(pageStart,
          {x: event.pageX, y: event.pageY});
      trackingNode.style.left = circle.left + "px";
      trackingNode.style.top = circle.top + "px";
      trackingNode.style.width = circle.width + "px";
      trackingNode.style.height = circle.height + "px";
    }, function(event) {
      var circle = circleForm(relativeStart,
          relativePos(event, cx.canvas))
      cx.beginPath();
      cx.arc(relativeStart.x, relativeStart.y, circle.width/2, 0, 2*Math.PI);
      cx.fill();
      paintDom.removeChild(trackingNode);
      sendInfoOnEnd()
    })
  }

// Call a given function for all horizontal and vertical neighbors
// of the given point.
  function forAllNeighbors(point, fn) {
    fn({x: point.x, y: point.y + 1});
    fn({x: point.x, y: point.y - 1});
    fn({x: point.x + 1, y: point.y});
    fn({x: point.x - 1, y: point.y});
  }
// Given two positions, returns true when they hold the same color.
  function isSameColor(data, pos1, pos2) {
    var offset1 = (pos1.x + pos1.y * data.width) * 4;
    var offset2 = (pos2.x + pos2.y * data.width) * 4;
    for (var i = 0; i < 4; i++) {
      if (data.data[offset1 + i] != data.data[offset2 + i])
        return false;
    }
    return true;
  }
  tools["填充"] = function(event, cx) {
    var startPos = relativePos(event, cx.canvas);

    var data = cx.getImageData(0, 0, cx.canvas.width,
        cx.canvas.height);
    // An array with one place for each pixel in the image.
    var alreadyFilled = new Array(data.width * data.height);

    // This is a list of same-colored pixel coordinates that we have
    // not handled yet.
    var workList = [startPos];
    while (workList.length) {
      var pos = workList.pop();
      var offset = pos.x + data.width * pos.y;
      if (alreadyFilled[offset]) continue;

      cx.fillRect(pos.x, pos.y, 1, 1);
      alreadyFilled[offset] = true;

      forAllNeighbors(pos, function(neighbor) {
        if (neighbor.x >= 0 && neighbor.x < data.width &&
            neighbor.y >= 0 && neighbor.y < data.height &&
            isSameColor(data, startPos, neighbor))
          workList.push(neighbor);
      });
    }
    sendInfoOnEnd()
  };


  createPaint(paintDom)

  connection.on("ReceiveImage", (user, image, time)=>{
    console.log(groupName, 'groupName为左边')
    console.log(user, image, time, '接收图片')
  })

  // 改变传送image base64数据为流方式
  // 原来方式：
  // connection.invoke("SendImageInGroup", groupName, user ,message, (new Date()).valueOf().toString()).catch(err => console.error(err.toString()))
  function sendImageByStream(groupName, user, message, time) {
    var tempObject= {
      groupName,
      user,
      time
    }
    var messages = message + "$" + JSON.stringify(tempObject) + "#"
    var subject = new Subject();
    var chunkSize = 5;
    connection.send("UploadImageStream", subject).catch(err => console.error(err.toString())).catch(err => console.error(err.toString()));
    for (var i = 0; i < messages.length; i += chunkSize) {
      subject.next(messages.slice(i, i + chunkSize));
    }
  }


  // 发送数据
  function sendInfoOnEnd() {
        console.log('123123')
        var message = cx.canvas.toDataURL();
        dispatch(saveDrawing(message))
        // connection.invoke("SendImageInGroup", groupName, user ,message, (new Date()).valueOf().toString()).catch(err => console.error(err.toString()))
        sendImageByStream(groupName, user,message , (new Date()).valueOf().toString())
  }

  function toReadTime(time) {
    var date = new Date(time)
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return h + m + s;
  }

  var informationDom = document.getElementById("information")
  informationDom.appendChild(elt("div", {style: "margin-left: auto; margin-right: 0; color: #f3b09a", id: 'textInfo'}, '最后编辑：'))

  var textInfoDom = document.getElementById("textInfo")


  // 接收数据 还是定义 但是永远不会触发
  // connection.on("ReceiveImage", (user, image, time) => {
  //   console.log(user, time)
  //   textInfoDom.innerText = '最后编辑：'+user+ ' ' +toReadTime(parseInt(time))
  //     console.log(image)
  //     loadImageURL(cx, image)
  // });

  connection.on("ReceiveImageStream", (data)=>{
    // 字符串是base64 + $ + groupName + user + time 自己再拆分
    console.log(data, '我想要的数据')
    let spiltStrings = data.split("$");
    let objectData = JSON.parse(spiltStrings[1])

    textInfoDom.innerText = '最后编辑：'+objectData.user+ ' ' +toReadTime(parseInt(objectData.time))
    loadImageURL(cx, spiltStrings[0])
  })

}

export default startPaint


// function sendInfoOnEnd() {
//         console.log('123123')
//         var message = cx.canvas.toDataURL();
//         connection.invoke("BroadcastMessage", message).catch(err => console.error(err.toString()))
// }
//
// // 接收数据
// connection.on("ReceiveMessage", (message) => {
//     console.log(message)
//     loadImageURL(cx, message)
// });
//
//
//
// // 传输数据
// $('#sendOut').click(function () {
//     var link = document.getElementById("link")
//     connection.invoke("BroadcastMessage", link.href).catch(err => console.error(err.toString()));
// })


// connection.on("ReceiveChat", (user, message, time)=>{
//   console.log()
// })