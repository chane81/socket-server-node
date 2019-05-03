!function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(o,r,function(n){return e[n]}.bind(null,r));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=1)}([function(e,n){e.exports=require("dotenv")},function(e,n,t){"use strict";var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(n,"__esModule",{value:!0});const r=o(t(0)),i=o(t(2)),c=o(t(3)),u=o(t(4)),s=o(t(5)),l=o(t(6)),a=o(t(7)),d=o(t(8)),f=o(t(9)),p=o(t(10)),g=o(t(11));r.default.config();const m=new i.default,b=new u.default.Server(m.callback()),k=new c.default,O=f.default(b,{pingInterval:1e4,pingTimeout:1e4,transports:["websocket","polling"],origins:"*:*",parser:p.default}),_=Number(Object({JWT_PRIVATE_KEY:"black2284"}).PORT)||Number(Object({JWT_PRIVATE_KEY:"black2284"}).SOCKET_IO_PORT)||5e3;Object({JWT_PRIVATE_KEY:"black2284"}).IP,Number(Object({JWT_PRIVATE_KEY:"black2284"}).NET_PORT);console.log("is dev:","production"),m.use(s.default());const v=[],y=[];function S(){console.log("접속 클라이언트들:"),y.map(e=>{console.log(`nickName:${e.nickName}, nickId:${e.nickId}, uniqueId:${e.uniqueId}`)})}let I;O.use((e,n)=>{const t=e.handshake.query;if(t&&t.token){const o=g.default(t.token);if(o.success){const{nickName:t,nickId:r}=o.info.data;return I={isRead:!0,nickName:t,nickId:r,uniqueId:e.id,unreadCount:0},n()}return console.log("미인증 토큰!"),n(new Error("AUTH_ERROR"))}}).on("connection",(e,n)=>{y.push({...I}),console.log("접속정보 SEND:",JSON.stringify(I)),e.broadcast.emit("client.user.in",JSON.stringify(I)),e.emit("client.current.users",JSON.stringify(y)),S(),e.on("disconnect",n=>{const t=a.default.find(y,{uniqueId:e.id});e.broadcast.emit("client.user.out",JSON.stringify(t)),a.default.remove(y,e=>e.uniqueId===t.uniqueId),console.log("client disconnected!",JSON.stringify(t))}),e.on("client.msg.send",n=>{console.log("client.msg.send:",n);const t=JSON.parse(n),o={...t,isSelf:!1};""===t.msgToUniqueId?e.broadcast.emit("client.msg.receive",JSON.stringify(o)):O.to(t.msgToUniqueId).emit("client.msg.receive",JSON.stringify(o))})}),k.get("*",(e,n)=>e.response.body="hello!"),m.use(k.routes()),b.listen(_,()=>{console.log(`> SOCKET.IO Server Listening! port:${_}`)}).on("error",e=>{throw e}),l.default.createServer(e=>{const n=e.remoteAddress+":"+e.remotePort;console.log("client connected:",n);const t={clientSocket:e,nickName:e.nickName,nickId:e.nickId,uniqueId:d.default(),socketName:"",socketGubun:"net"};e.write(JSON.stringify({action:"client.msg.connected",data:t.uniqueId})),v.push(t),S(),e.on("data",e=>{const n=e.toString();console.log("net data:",n),v.filter(e=>"socket.io"===e.socketGubun).map(e=>{e.clientSocket.emit("client.msg.receive",n)})}),e.on("close",()=>{console.log("NET Server Closed!"),a.default.remove(v,n=>n.clientSocket===e),S(),e.end("소켓 closed!")}),e.on("end",()=>{console.log("NET Socket Client end!")}),e.on("error",e=>{})}).on("connection",e=>{console.log("connected!"),S()})},function(e,n){e.exports=require("koa")},function(e,n){e.exports=require("koa-router")},function(e,n){e.exports=require("http")},function(e,n){e.exports=require("koa-bodyparser")},function(e,n){e.exports=require("net")},function(e,n){e.exports=require("lodash")},function(e,n){e.exports=require("uuid/v1")},function(e,n){e.exports=require("socket.io")},function(e,n){e.exports=require("socket.io-msgpack-parser")},function(e,n,t){"use strict";var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(n,"__esModule",{value:!0});const r=o(t(12));o(t(0)).default.config();n.default=(e=>{try{return console.log("env:production"),console.log("privateKey:black2284"),{info:r.default.verify(e,"black2284"),success:!0}}catch(e){return{info:"",success:!1}}})},function(e,n){e.exports=require("jsonwebtoken")}]);