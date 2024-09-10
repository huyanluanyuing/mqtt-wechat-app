var moderocker=1 //1是不可移动。-1是可以动
const app = getApp();
var minOffset = 3;//最小偏移量，低于这个值不响应滑动处理
var minTime = 60;// 最小时间，单位：毫秒，低于这个值不响应滑动处理
var direction=0;
var modemove=1//模式
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
    angel: 0,
    startmoveX: 0, //touchStart开始坐标
    startmoveY: 0,
    moveX : 0, //位移
    moveY : 0,
    sumX : 0,//数字显示
    sumY : 0,
    progressX: 0,//进度条显示
    progressY: 0,

    },
    onLoad(){//从缓存中载入数据，复现摇杆位置
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

    //下面是画板move，控制速度的模块
    change(e){//改变油门模式，模式1松手速度清零，模式2不清零
      modemove=modemove*(-1)
      if(modemove==1){
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

    touchstart(e) {//开始触碰画板
      this.setData({
        startmoveX: e.changedTouches[0].clientX,
        startmoveY: e.changedTouches[0].clientY
      })
    },
    
    angle(start, end) {
      var _X = end.X - start.X,
        _Y = end.Y - start.Y;
      //返回角度 Math.atan()返回数字的反正切值
      return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    },
    
    touchmove(e){
      let {startmoveX,startmoveY} = this.data;
      let slidingRange = 45; //角度
      let touchMoveX = e.changedTouches[0].clientX;
      let touchMoveY = e.changedTouches[0].clientY;
      let angle = this.angle({
        X: startmoveX,
        Y: startmoveY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
      //为了方便计算取绝对值判断
      if (Math.abs(angle) > slidingRange && touchMoveY < startmoveY && direction!=2 ) {
        direction=1
       // console.log("上",touchMoveY - startmoveY)
        if(this.data.moveY+touchMoveY - startmoveY>-200){
          this.setValue("moveY",this.data.moveY+(touchMoveY - startmoveY))
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
      if (Math.abs(angle) > slidingRange && touchMoveY > startmoveY && direction!=2) {
        // 向下滑动
        direction=1
       // console.log("下",touchMoveY - startmoveY)
        if(this.data.moveY+touchMoveY - startmoveY<200){
          this.setValue("moveY",this.data.moveY+(touchMoveY - startmoveY))
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
      if (Math.abs(angle) < 45 && touchMoveX < startmoveX && direction!=1) {
        // 向左滑动
        direction=2
       // console.log("左",touchMoveX - startmoveX)
        if(this.data.moveX+touchMoveX - startmoveX>-200){
          this.setValue("moveX",this.data.moveX+(touchMoveX - startmoveX))
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
    if (Math.abs(angle) < 45 && touchMoveX > startmoveX && direction!=1) {
      // 向右滑动
      direction=2
      //console.log("右",touchMoveX - startmoveX)
      if(this.data.moveX+touchMoveX - startmoveX<200){
        this.setValue("moveX",this.data.moveX+(touchMoveX - startmoveX))
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
      this.setValue("startmoveY",touchMoveY)
      this.setValue("startmoveX",touchMoveX)
      this.setValue("progressX",Math.abs(this.data.moveX/2).toFixed(0))
      this.setValue("progressY",Math.abs(this.data.moveY/2).toFixed(0))
      this.drawGauge(this.data.sumY);
    },
    touchend(e){
     // let touchMoveX = e.changedTouches[0].clientX;
     // let touchMoveY = e.changedTouches[0].clientY;
     if(modemove==1){
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
    //==========================================上面是画板模块

    //==========================================下面是摇杆模块
     change_Direction(e){ //1是不可移动。-1是可以动,摇杆的
      moderocker=moderocker*(-1)
      console.log(moderocker)
      if(moderocker==1){
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
         if(moderocker==1)
         {return}
         else if(moderocker==-1){
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
      if(moderocker==1){return}
    },
    
    //拖动摇杆移动
      ImageTouchMove: function (e) {
        if(moderocker==-1) {return}
        var self = this;
        var touchX = e.touches[0].clientX - 40;
        var touchY = e.touches[0].clientY - 40;
        //console.log(touchX)
        var movePos = self.GetPosition(touchX, touchY);//移动到的位置
        var angel=(Math.atan((movePos.posY-this.data.StartY)/(movePos.posX-this.data.StartX)))*180/3.1416
        //console.log(angel)
        if((movePos.posY-this.data.StartY)<=0&&(movePos.posX-this.data.StartX)>=0){angel=angel+180}
        if((movePos.posY-this.data.StartY)>=0&&(movePos.posX-this.data.StartX)>=0){angel=angel+180}
        if((movePos.posY-this.data.StartY)>0&&(movePos.posX-this.data.StartX)<0){angel=angel+360}
        angel=Math.round(angel)   
        self.setData({
          leftLooks: Math.round(movePos.posX),
          topLooks: Math.round(movePos.posY),
          angel: Math.round(angel)
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
      if(moderocker==-1) {return}
      var self = this;
      self.setData({
      leftLooks: Math.round(self.data.StartX),
      topLooks: Math.round(self.data.StartY),
      })
      },
   //========================摇杆模块结束
   //========================下面是方向显示
  onReady() {
    this.drawCompass(this.data.angel);  // 传入当前方向角度，例如 90 度
    this.drawGauge(this.data.sumY);   //油门数值
  },

  drawCompass(direction) {
    const ctx = wx.createCanvasContext('compassCanvas');
    const width = 200;
    const height = 200;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 90;
    
    // 清除画布
    ctx.clearRect(0, 0, width, height);

    // 绘制罗盘圆环
    ctx.setStrokeStyle('#e5e5e5');
    ctx.setLineWidth(10);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // 绘制罗盘刻度
    ctx.setStrokeStyle('#000');
    ctx.setLineWidth(2);
    for (let i = 0; i < 360; i += 30) {
      const tickAngle = i * (Math.PI / 180);
      const startX = centerX + (radius - 10) * Math.cos(tickAngle - Math.PI / 2);
      const startY = centerY + (radius - 10) * Math.sin(tickAngle - Math.PI / 2);
      const endX = centerX + radius * Math.cos(tickAngle - Math.PI / 2);
      const endY = centerY + radius * Math.sin(tickAngle - Math.PI / 2);
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
    }
    ctx.stroke();
    
    // 绘制方向文本
    ctx.setFontSize(20);
    ctx.setFillStyle('#000');
    ctx.setTextAlign('center');
    ctx.fillText('N', centerX, centerY - radius + 20);
    ctx.fillText('E', centerX + radius - 20, centerY);
    ctx.fillText('S', centerX, centerY + radius - 10);
    ctx.fillText('W', centerX - radius + 20, centerY);

    // 绘制指针
    ctx.setStrokeStyle('#ff0000');
    ctx.setLineWidth(5);
    ctx.beginPath();
    const angle = direction * (Math.PI / 180);  // 将角度转换为弧度
    const endX = centerX + radius * Math.cos(angle - Math.PI / 2);
    const endY = centerY + radius * Math.sin(angle - Math.PI / 2);
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.draw();
  },

  updateDirection(newDirection) {
    this.setData({
      direction: newDirection
    });
    this.drawCompass(newDirection);
  },
   //========================罗盘模块结束
   //========================下面是油门显示

  drawGauge(temp) {
    const ctx = wx.createCanvasContext('gaugeCanvas');
    const width = 200;
    const height = 200;
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
});
