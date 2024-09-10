const util = require('../../utils/util.js')
var mode=1 //1是不可移动。-1是可以动
Page({
data: {
state:"不可移动",
StartX:160,//背景圆环
StartY:310,
StartX1:150,////摇杆
StartY1:300,
leftLooks: 160,//水平位置
topLooks: 310,//+
radius: 60,//半径
angel:"",
},

onLoad(){//从缓存中载入数据,复现摇杆位置
  var flag=wx.getStorageSync('flag')
  if(flag==2){
  this.setData({
    StartX1:wx.getStorageSync('StartX1'),
    StartY1:wx.getStorageSync('StartY1'),
    leftLooks:wx.getStorageSync('leftLooks'),
    topLooks:wx.getStorageSync('topLooks'),
    StartX:wx.getStorageSync('StartX'),
    StartY:wx.getStorageSync('StartY'),
  })
}
},

onHide() {//换页面的时候把数据放进缓存，记录摇杆位置
  wx.setStorageSync('flag', 2);
  wx.setStorageSync('StartX1', this.data.StartX1);
  wx.setStorageSync('StartY1', this.data.StartY1);
  wx.setStorageSync('StartX', this.data.StartX);
  wx.setStorageSync('StartY', this.data.StartY);
  wx.setStorageSync('topLooks', this.data.topLooks);
  wx.setStorageSync('leftLooks', this.data.leftLooks);
},

 change_Direction(e){ //1是不可移动。-1是可以动，改变摇杆位置
  mode=mode*(-1)
  console.log(mode)
  if(mode==1){
    this.setData({
      state:"不可移动"
    })
  wx.showToast({
    title: "不可移动",
    icon: "success",
  });
 }
  else{
    this.setData({
      state:"可移动"
    })
     wx.showToast({
      title: "可移动",
      icon: "success",
  });
 }
},

ControllerTouchMove:function(event){
     console.log('asdasdasda')
     if(mode==1)
     {return}
     else if(mode==-1){
      var touch = event.touches[0]; // touches 数组中存放所有的触摸点
      var touchX = touch.pageX; // 触摸点的 X 坐标
      var touchY = touch.pageY; // 触摸点的 Y 坐标
      this.setData({
        StartX1:touchX-10,
        StartY1:touchY-10,
        leftLooks:Math.round(touchX),
        topLooks:Math.round(touchY),
        StartX:Math.round(touchX),
        StartY:Math.round(touchY),
      })
    }
},

ControlllerTouchEnd(e){
  if(mode==1){return}
},

//拖动摇杆移动
  ImageTouchMove: function (e) {
    if(mode==-1) {return}
    var self = this;
    var touchX = e.touches[0].clientX - 40;
    var touchY = e.touches[0].clientY - 40;
    console.log(touchX)
    var movePos = self.GetPosition(touchX, touchY);//移动到的位置
    var angel=(Math.atan((movePos.posY-this.data.StartY)/(movePos.posX-this.data.StartX)))*180/3.1416
    
    if((movePos.posY-this.data.StartY)<=0&&(movePos.posX-this.data.StartX)>=0){angel=angel+180}
    if((movePos.posY-this.data.StartY)>=0&&(movePos.posX-this.data.StartX)>=0){angel=angel+180}
    if((movePos.posY-this.data.StartY)>0&&(movePos.posX-this.data.StartX)<0){angel=angel+360}
    angel=Math.round(angel)   
    self.setData({
      leftLooks: Math.round(movePos.posX),
      topLooks: Math.round(movePos.posY),
      angel: angel
    })
  },
//获得触碰位置并且进行数据处理获得触碰位置与拖动范围的交点位置
GetPosition: function (touchX, touchY) {
var self = this;
var DValue_X;
var Dvalue_Y;
var Dvalue_Z;
var imageX;
var imageY;
var ratio;
DValue_X = touchX - self.data.StartX;
Dvalue_Y = touchY - self.data.StartY;
Dvalue_Z = Math.sqrt(DValue_X * DValue_X + Dvalue_Y * Dvalue_Y);//移动的半径
//触碰点在范围内
if (Dvalue_Z <= self.data.radius) {
imageX = touchX;
imageY = touchY;
imageX = Math.round(imageX);
imageY = Math.round(imageY);
return { posX: imageX, posY: imageY };
}
 
//触碰点在范围外
else {
ratio = self.data.radius / Dvalue_Z;
imageX = DValue_X * ratio + this.data.StartX;
imageY = Dvalue_Y * ratio + this.data.StartY;
console.log("ratio=",ratio)
imageX = Math.round(imageX);
imageY = Math.round(imageY);
return { posX: imageX, posY: imageY };
}
},

ImageReturn: function (e) {
  if(mode==-1) {return}
  var self = this;
  self.setData({
  leftLooks: Math.round(self.data.StartX),
  topLooks: Math.round(self.data.StartY),
  })
  },
})