import mqtt from "../../utils/mqtt.min.js";
const app = getApp();
Page({
  data: {
    client: null,
    conenctBtnText: "连接",
    host: "mqtt.gexin.link",   //域名地址
    subTopic: "testtopic/miniprogram",//订阅主题
    pubTopic: "testtopic/miniprogram",//发布主题
    pubMsg: "Hello! I am from WeChat miniprogram",//发布信息
    receivedMsg: "",//接受的信息
    recievefrommqtt:"",
    direction:"",
    mqttOptions: {
      username: "gexin",//用户名
      password: "gexin1982",
      reconnectPeriod: 1000, // 1000毫秒，设置为 0 禁用自动重连，两次重新连接之间的间隔时间
      connectTimeout: 30 * 1000, // 30秒，连接超时时间
      // 更多参数请参阅 MQTT.js 官网文档：https://github.com/mqttjs/MQTT.js#mqttclientstreambuilder-options
      // 更多 EMQ 相关 MQTT 使用教程可在 EMQ 官方博客中进行搜索：https://www.emqx.com/zh/blog
    },
  },

  setValue(key, value) {
    this.setData({
      [key]: value,
    });
  },
  setHost(e) {
    this.setValue("host", e.detail.value);
  },
  setSubTopic(e) {
    this.setValue("subTopic", e.detail.value);
  },
  setPubTopic(e) {
    this.setValue("pubTopic", e.detail.value);
  },
  setPubMsg(e) {
    this.setValue("pubMsg", e.detail.value);
  },
  setRecMsg(msg) {
    this.setValue("receivedMsg", msg);
  },
  setRecievefrommqtt(msg){
    this.setValue("recievefrommqtt",msg);
  },
  move_up(e){
    this.setValue("direction","1")
    if (this.data.client) {
      this.data.client.publish(this.data.pubTopic, this.data.direction);
      console.log(this.data.direction)
      return;
    }
    wx.showToast({
      title: "请先点击连接",
      icon: "error",
    });
   },


  connect() {
    // MQTT-WebSocket 统一使用 /path 作为连接路径，连接时需指明，但在 EMQX Cloud 部署上使用的路径为 /mqtt
    // 因此不要忘了带上这个 /mqtt !!!
    // 微信小程序中需要将 wss 协议写为 wxs，且由于微信小程序出于安全限制，不支持 ws 协议
    try {
      this.setValue("conenctBtnText", "连接中...");
      const clientId = new Date().getTime();
      this.data.client = mqtt.connect(`wxs://${this.data.host}:8084/mqtt`, {  //方法创建了一个MQTT客户端实例，参数mqttOptions包含了其他连接选项，而clientId则是前面生成的唯一客户端ID。
        ...this.data.mqttOptions,  //将 this.data.mqttOptions 对象中的所有属性和值展开并作为新对象的属性和值。
        clientId,
      });
      app.globalData.global_client=this.data.client
      app.globalData.pubTopic=this.data.pubTopic
      console.log(app.globalData.global_client)
      this.data.client.on("connect", () => {//on监听了 MQTT 客户端的 "connect" 事件。当 MQTT 客户端成功连接到 MQTT 服务器时，这个事件将被触发。一旦事件被触发，指定的回调函数（在箭头函数 () => { ... } 中）就会被执行。
        wx.showToast({
          title: "连接成功",
        });
        this.setValue("conenctBtnText", "连接成功");

        this.data.client.on("message", (topic, payload) => {
          /*wx.showModal({
            content: `收到消息 - Topic: ${topic}，Payload: ${payload}`,
            showCancel: false,
          });*/
          const currMsg = this.data.receivedMsg ? `<br/>${payload}` : payload;
          this.setValue("receivedMsg", this.data.receivedMsg.concat(currMsg));
        });

        this.data.client.on("error", (error) => {
          this.setValue("conenctBtnText", "连接");
          console.log("onError", error);
        });

        this.data.client.on("reconnect", () => {
          this.setValue("conenctBtnText", "连接");
          console.log("reconnecting...");
        });

        this.data.client.on("offline", () => {
          this.setValue("conenctBtnText", "连接");
          console.log("onOffline");
        });
        // 更多 MQTT.js 相关 API 请参阅 https://github.com/mqttjs/MQTT.js#api
      });
    } catch (error) {
      this.setValue("conenctBtnText", "连接");
      console.log("mqtt.connect error", error);
    }
  },

  subscribe() {
    if (this.data.client) {
      this.data.client.subscribe(this.data.subTopic);
      wx.showModal({
        content: `成功订阅主题：${this.data.subTopic}`,
        showCancel: false,
      });
      return;
    }
    wx.showToast({
      title: "请先点击连接",
      icon: "error",
    });
  },

  unsubscribe() {
    if (this.data.client) {
      this.data.client.unsubscribe(this.data.subTopic);
      wx.showModal({
        content: `成功取消订阅主题：${this.data.subTopic}`,
        showCancel: false,
      });
      return;
    }
    wx.showToast({
      title: "请先点击连接",
      icon: "error",
    });
  },

  publish1() {
    if (this.data.client) {
      this.data.client.publish(this.data.pubTopic, this.data.pubMsg);
      return;
    }
    wx.showToast({
      title: "请先点击连接",
      icon: "error",
    });
  },
  

  disconnect() {
    this.data.client.end();
    this.data.client = null;
    this.setValue("conenctBtnText", "连接");
    wx.showToast({
      title: "成功断开连接",
    });
  },
});
