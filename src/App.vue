<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld
  },
  data() {
    return {
      mTopic: '',
      client: {}
    };
  },
  created() {
    // this.connect()
    // console.log(this.$mqtt);
  },
  methods: {
    //连接服务器
    connect() {
      // let options = {
      //   username: "xxx",
      //   password: "xxxx",
      //   cleanSession: false,
      //   keepAlive: 60,
      //   clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
      //   connectTimeout: 4000
      // };
      this.client = this.$mqtt.connect(
        "mqtt://test.mosquitto.org",
        // options
      );
      this.client.on("connect", (e) => {
        console.log("成功连接服务器:", e);
        //订阅三个名叫'top/#', 'three/#'和'#'的主题
        // ["top/#", "three/#", "#"]
        this.client.subscribe('presence', { qos: 1 }, (err) => {
          if (!err) {
            console.log("订阅成功");
            //向主题叫“pubtop”发布一则内容为'hello,this is a nice day!'的消息
            this.publish("presence", "hello,this is a nice day!");
          } else {
            console.log("消息订阅失败！");
          }
        });
      });
      //重新连接
      this.reconnect();
      //是否已经断开连接
      this.mqttError();
      //监听获取信息
      this.getMessage();
    },
    //发布消息@topic主题  @message发布内容
    publish(topic, message) {
      if (!this.client.connected) {
        console.log("客户端未连接");
        return;
      }
      this.client.publish(topic, message, { qos: 1 }, (err) => {
        if (!err) {
          console.log("主题为" + topic + "发布成功");
        }
      });
    },
    //监听接收消息
    getMessage() {
      this.client.on("message", (topic, message) => {
        if (message) {
          console.log("收到来着", topic, "的信息", message.toString());
          const res = JSON.parse(message.toString());
          //console.log(res, 'res')
          switch (topic) {
            case "top/#":
              this.msg = res;
              break;
            case "three/#":
              this.msg = res;
              break;
            case "#":
              this.msg = res;
              break;
            default:
              this.msg = res;
              return;
          }
          this.msg = message;
        }
      });
    },
    //取消订阅
    unsubscribe() {
      this.client.unsubscribe(this.mTopic, (error) => {
        console.log("主题为" + this.mTopic + "取消订阅成功", error);
      });
    },
    reconnect() {
      this.client.on("reconnect", (error) => {
        console.log("正在重连:", error);
      });
    },
    //监听服务器是否连接失败
    mqttError() {
      this.client.on("error", (error) => {
        console.log("连接失败：", error);
        this.client.end();
      });
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
