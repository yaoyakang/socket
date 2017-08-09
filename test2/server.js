const app = require('express')();
const http = require('http').Server(app);
//设置心跳间隔
const io = require('socket.io')(http,{'pingInterval': 0, 'pingTimeout': 6000});
app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html')
})
io.on('connection',function (socket) {
  socket.on("msg",function (data) {
    var msg1=data[0];
    if (data[1]=="yyy"||data[1]=="ppp"){
      io.to("123").emit('msg1',msg1)
    }
  })
  socket.on("adduse",function (data) {
    console.log(data+'加入了聊天室');
    if(data=="yyy"||data=="ppp"){
      var roomID="123";
      socket.join(roomID);
      socket.emit('addroom',123);
    }
  });
  var date;
  var defaultTime=new Date().getTime();
  var newDate=[defaultTime];
  //接收心跳包  通讯检测
  socket.on('monitor',(userName)=>{
    newDate[1]=userName;
    date=[...newDate];
    var time=new Date().getTime();
    newDate[0]=time;
    // console.log(date,newDate)
    var delay=newDate[0]-date[0];
    // console.log(delay)
    //判断客户端发送的心跳包是否正常
    if(delay>0 && delay<10000){
      console.log("心跳包正常")
    }else{
      console.log("网络环境异常")
    }
  });
  //服务器判断客户端连接情况
  setTimeout(()=>{
    setInterval(()=>{
      var current=new Date().getTime();
      var past=current-newDate[0];
      console.log(current,past);
      if(past<5000){
        console.log("没毛病")
      }else{
        console.log("客户端断开连接")
      }
    },5000)
  },10000)
})
http.listen(8088,()=>{
  console.log("ok");
});

