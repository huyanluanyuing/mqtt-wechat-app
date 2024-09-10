// pages/move/move.js
import mqtt from "../../utils/mqtt.min.js";
const app = getApp();
var minOffset = 3;//最小偏移量，低于这个值不响应滑动处理
var minTime = 60;// 最小时间，单位：毫秒，低于这个值不响应滑动处理
var direction=0;
var mode=1//模式

Page({

  /**
   * 页面的初始数据
   */
  data:{
    startX: 0, //touchStart开始坐标
    startY: 0,
    moveX : 0, //位移
    moveY : 0,
    sumX : 0,//数字显示
    sumY : 0,
    progressX: 0,//进度条显示
    progressY: 0,
},
change(e){
  mode=mode*(-1)
  if(mode==1){
  wx.showToast({
    title: "模式1",
    icon: "success",
  });
}
else{
  wx.showToast({
    title: "模式2",
    icon: "success",
  });
}
},
setValue(key, value) {
  this.setData({
    [key]: value,
  });
},
touchstart(e) {
  this.setData({
    startX: e.changedTouches[0].clientX,
    startY: e.changedTouches[0].clientY
  })
},

angle(start, end) {
  var _X = end.X - start.X,
    _Y = end.Y - start.Y;
  //返回角度 Math.atan()返回数字的反正切值
  return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
},

touchmove(e){
  let {startX,startY} = this.data;
  let slidingRange = 45; //角度
  let touchMoveX = e.changedTouches[0].clientX;
  let touchMoveY = e.changedTouches[0].clientY;
  let angle = this.angle({
    X: startX,
    Y: startY
  }, {
    X: touchMoveX,
    Y: touchMoveY
  });
  //为了方便计算取绝对值判断
  if (Math.abs(angle) > slidingRange && touchMoveY < startY && direction!=2 ) {
    direction=1
   // console.log("上",touchMoveY - startY)
    if(this.data.moveY+touchMoveY - startY>-200){
      this.setValue("moveY",this.data.moveY+(touchMoveY - startY))
      this.setValue("sumY",Math.abs(Math.round(this.data.moveY)))
    }
    else{
      this.setValue("sumY",200)
    } 
    /*wx.showToast({
      title: "上",
      icon: "error",
    });*/
  };
  if (Math.abs(angle) > slidingRange && touchMoveY > startY && direction!=2) {
    // 向下滑动
    direction=1
   // console.log("下",touchMoveY - startY)
    if(this.data.moveY+touchMoveY - startY<200){
      this.setValue("moveY",this.data.moveY+(touchMoveY - startY))
      this.setValue("sumY",Math.abs(Math.round(this.data.moveY)))
    }
    else{
      this.setValue("sumY",200)
    } 
   /* wx.showToast({
      title: "下",
      icon: "error",
    });*/
  };
  if (Math.abs(angle) < 45 && touchMoveX < startX && direction!=1) {
    // 向左滑动
    direction=2
   // console.log("左",touchMoveX - startX)
    if(this.data.moveX+touchMoveX - startX>-200){
      this.setValue("moveX",this.data.moveX+(touchMoveX - startX))
      this.setValue("sumX",Math.abs(Math.round(this.data.moveX)))
    }
    else{
      this.setValue("sumX",200)
    } 
   /* wx.showToast({
      title: "左",
      icon: "error",
    });*/
};
if (Math.abs(angle) < 45 && touchMoveX > startX && direction!=1) {
  // 向右滑动
  direction=2
  //console.log("右",touchMoveX - startX)
  if(this.data.moveX+touchMoveX - startX<200){
    this.setValue("moveX",this.data.moveX+(touchMoveX - startX))
    this.setValue("sumX",Math.abs(Math.round(this.data.moveX)))
  }
  else{
    this.setValue("sumX",200)
  } 
 /* wx.showToast({
    title: "右",
    icon: "error",
  });*/
};
  this.setValue("startY",touchMoveY)
  this.setValue("startX",touchMoveX)
  this.setValue("progressX",Math.abs(this.data.moveX/2).toFixed(0))
  this.setValue("progressY",Math.abs(this.data.moveY/2).toFixed(0))
  this.drawGauge(this.data.sumY);
},
touchend(e){
 // let touchMoveX = e.changedTouches[0].clientX;
 // let touchMoveY = e.changedTouches[0].clientY;
 if(mode==1){
 this.setValue("moveY",0)
 this.setValue("moveX",0)
 this.setValue("sumY",0)
 this.setValue("sumX",0)
 }
 this.setValue("progressX",Math.abs(this.data.moveX/2).toFixed(0))
 this.setValue("progressY",Math.abs(this.data.moveY/2).toFixed(0))
 this.drawGauge(this.data.sumY);
 direction=0
 //app.globalData.global_client.publish(app.globalData.pubTopic,(this.data.sumX).toFixed(0));
 //     console.log(this.data.sumX)
},

onReady() {
  this.drawGauge(this.data.sumX);  // 传入当前温度值，例如 125
},

drawGauge(temp) {
  const ctx = wx.createCanvasContext('gaugeCanvas');
  const width = 300;
  const height = 300;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 90;
  
  // 绘制背景圆环
  ctx.setStrokeStyle('#e5e5e5');
  ctx.setLineWidth(10);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, 2.25 * Math.PI);
  ctx.stroke();
  
  // 绘制当前温度部分的圆环
  ctx.setStrokeStyle('#c9c1fc');
  ctx.setLineWidth(10);
  ctx.beginPath();
  const endAngle = 0.75 * Math.PI + (temp / 250) * 1.5 * Math.PI;  // 250 是最大温度值
  ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, endAngle);
  ctx.stroke();
  
  // 绘制温度文本
  ctx.setFontSize(40);
  ctx.setFillStyle('#000');
  ctx.setTextAlign('center');
  ctx.fillText(`${temp}`, centerX, centerY);
  
  // 绘制状态文本
  ctx.setFontSize(20);
  ctx.setFillStyle('#999');
  ctx.fillText('油门', centerX, centerY + 40);
  
  ctx.draw();
}
})