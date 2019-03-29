import dotenv from 'dotenv';
import koa from 'koa';
import koaRouter from 'koa-router';
import http from 'http';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import net from 'net';
import _ from 'lodash';
import uuidv1 from 'uuid/v1';
import io from 'socket.io';
import msgpackParser from 'socket.io-msgpack-parser';
import { IMessageModel, IUserModel } from './interfaces';
import { json } from 'body-parser';

/* 설정 세팅 =================================================================================================*/

dotenv.config();
const app = new koa();
const server = new http.Server(app.callback());
const router = new koaRouter();

// json 객체의 크기 축소, 바이너리 전송을 위해 message pack 적용
// 일반 json 데이터 전송보다 빠름
const socketIo = io(server, {
	pingInterval: 10000, // ping 인터벌
	pingTimeout: 10000, // ping 타임아웃
	transports: [ 'websocket', 'polling' ],
	parser: msgpackParser
});

// socket.io cors 옵션
socketIo.origins((origin, callback) => {
	console.log('server:', server);
	console.log('origin:', origin);
});

// 포트
const socketIoPort: number =
	Number(process.env.PORT) || Number(process.env.SOCKET_IO_PORT) || 5000;
const ip: string = process.env.IP || '127.0.0.1';
const netPort: number = Number(process.env.NET_PORT) || 5001;

// 개발모드인지 여부 true/false
const dev: boolean = process.env.NODE_ENV !== 'production';

// 클라이언트 타입
interface clientType {
	clientSocket: any;
	uniqueId: string;
	nickName: string;
	nickId: string;
	socketName: string;
	socketGubun: string;
}

// bodyParser 적용
app.use(bodyParser());

// CORS 관련 옵션 설정
// app.use(cors());

// 접속 클라이언틑 정보
const clientPool: clientType[] = [];

/** 유저 POOL 모델 */
const userPoolModel: IUserModel[] = [];

// 접속한 클라이언트들 로그로 보여주기
function connectClients() {
	console.log('접속 클라이언트들:');

	userPoolModel.map((data: IUserModel) => {
		console.log(
			`nickName:${data.nickName}, nickId:${data.nickId}, uniqueId:${data.uniqueId}`
		);
	});
}
/* 설정 세팅 =================================================================================================*/

/* SOCKET.IO 서버 =================================================================================================*/
// 소켓통신 이벤트 핸들러
// connection
socketIo.on('connection', (socket: any) => {
	// 접속한 유저정보(접속시에는 빨간 dot(메시지 읽었는지 여부)가 안뜨게 isRead: true 로 설정)
	const userModel: IUserModel = {
		isRead: true,
		nickName: socket.handshake.query.nickName,
		nickId: socket.handshake.query.nickId,
		uniqueId: socket.id,
		unreadCount: 0
	};

	// 사용자 POOL 에 PUSH
	userPoolModel.push(userModel);

	// 클라이언트가 접속했을 때 나머지 사용자에게 접속했다고 메시지 보내기
	console.log('접속정보 SEND:', JSON.stringify(userModel));
	socket.broadcast.emit('client.user.in', JSON.stringify(userModel));

	// 클라이언트에게 현재 접속자 정보를 보냄
	socket.emit('client.current.users', JSON.stringify(userPoolModel));

	// 접속한 클라이언트들 보여주기
	connectClients();

	// SERVER RECEIVE 이벤트 핸들러(클라이언트 -> 서버)
	// 접속종료
	socket.on('disconnect', (context: any) => {
		const disconUserModel: IUserModel = _.find(userPoolModel, {
			uniqueId: socket.id
		}) as IUserModel;

		// 접속종료정보를 모든 클라이언트 소켓들에게 emit
		socket.broadcast.emit('client.user.out', JSON.stringify(disconUserModel));

		// 사용자 pool 에서 해당 사용자객체 제거
		_.remove(
			userPoolModel,
			(data: IUserModel) => data.uniqueId === disconUserModel.uniqueId
		);

		// log
		console.log('client disconnected!', JSON.stringify(disconUserModel));
	});

	// 메시지 SEND
	socket.on('client.msg.send', (context: string) => {
		console.log('client.msg.send:', context);

		const message: IMessageModel = JSON.parse(context);
		const messageEmit: IMessageModel = {
			...message,
			isSelf: false
		};

		if (message.msgToUniqueId === '') {
			socket.broadcast.emit('client.msg.receive', JSON.stringify(messageEmit));
		} else {
			socketIo
				.to(message.msgToUniqueId)
				.emit('client.msg.receive', JSON.stringify(messageEmit));
		}

		//console.log('sockets:', socketIo.sockets);

		// .NET 클라이언트에게로 메시지 보내기
		// clientPool.filter((data) => data.socketGubun === 'net').map((data) => {
		// 	data.clientSocket.write(
		// 		JSON.stringify({
		// 			action: 'client.msg.receive',
		// 			data: context
		// 		}),
		// 		(err: any) => {}
		// 	);
		// });
	});
});

router.get('*', (ctx, next) => {
	return (ctx.response.body = 'hello!');
});

app.use(router.routes());

// socket.io 서버 listen
server.listen(socketIoPort, (err: any) => {
	if (err) throw err;
	console.log(`> SOCKET.IO Server Listening! port:${socketIoPort}`);
});
/* SOCKET.IO 서버 =================================================================================================*/

/* NET 서버 =======================================================================================================*/
// net 서버 listen
// const netServer = net.createServer((socket: any) => {
// 	console.log('> Ready On NET Server!');

// 	socket.on('end', () => {
// 		console.log('> NET Server End');
// 	});

const netServer = net.createServer((socket: any) => {
	const remoteAddress = socket.remoteAddress + ':' + socket.remotePort;
	console.log('client connected:', remoteAddress);

	// clientPool.map((data) => {
	// 	console.log('접속 클라이언트들:', data.socketName, data.uniqueId);
	// });

	// 클라이언트 정보
	const clientInfo: clientType = {
		clientSocket: socket,
		nickName: socket.nickName,
		nickId: socket.nickId,
		uniqueId: uuidv1(),
		socketName: '',
		socketGubun: 'net'
	};

	// 클라이언트에게 uniqueId 를 전송함
	socket.write(
		JSON.stringify({
			action: 'client.msg.connected',
			data: clientInfo.uniqueId
		})
	);

	// 클라이언트 정보 PUSH
	clientPool.push(clientInfo);

	// 접속한 클라이언트들 보여주기
	connectClients();

	socket.on('data', (data: any) => {
		const msg = data.toString();
		console.log('net data:', msg);

		// 브라우저쪽으로 .NET 클라이언트에서 보낸 메세지 보내기
		clientPool
			.filter((data) => data.socketGubun === 'socket.io')
			.map((data) => {
				data.clientSocket.emit('client.msg.receive', msg);
			});
	});

	socket.on('close', () => {
		console.log('NET Server Closed!');

		// 연결 끊어진 소켓을 클라이언트풀에서 삭제처리
		_.remove(clientPool, (data: any) => data.clientSocket === socket);

		// 접속한 클라이언트들 보여주기
		connectClients();

		socket.end('소켓 closed!');
	});

	socket.on('end', () => {
		console.log('NET Socket Client end!');
	});

	socket.on('error', (err: any) => {});
});

netServer.on('connection', (conn) => {
	console.log('connected!');

	// 접속한 클라이언트들 보여주기
	connectClients();
	//console.log(conn);
});

// netServer.listen(netPort, () => {
// 	console.log(`> NET Server Listening! port:${netPort}`);
// });
/* NET 서버 =======================================================================================================*/
