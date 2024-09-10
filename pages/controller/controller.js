// pages/controller/controller.js
const util = require('../../utils/util.js')
Page({
data: {
StartX:'160',
StartY:'310',
leftLooks: '',//水平位置
topLooks: '',//+
radius: '60',//半径
angel:""
},
//拖动摇杆移动
  ImageTouchMove: function (e) {
    var self = this;
    var touchX = e.touches[0].clientX - 40;
    var touchY = e.touches[0].clientY - 40;
    var movePos = self.GetPosition(touchX, touchY);//移动到的位置
    var angel=(Math.atan((movePos.posY-this.data.StartY)/(movePos.posX-this.data.StartX)))*180/3.1416
    
    if((movePos.posY-this.data.StartY)<=0&&(movePos.posX-this.data.StartX)>=0){angel=angel+180}
    if((movePos.posY-this.data.StartY)>=0&&(movePos.posX-this.data.StartX)>=0){angel=angel+180}
    if((movePos.posY-this.data.StartY)>0&&(movePos.posX-this.data.StartX)<0){angel=angel+360}
    angel=Math.round(angel)   
    self.setData({
      leftLooks: movePos.posX,
      topLooks: movePos.posY,
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
imageX = DValue_X * ratio + 160;
imageY = Dvalue_Y * ratio + 310;
imageX = Math.round(imageX);
imageY = Math.round(imageY);
return { posX: imageX, posY: imageY };
}
},

ImageReturn: function (e) {
  var self = this;
  self.setData({
  leftLooks: self.data.StartX,
  topLooks: self.data.StartY,
  })
  },
})