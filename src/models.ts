import * as interfaces from './interfaces';

/** 소켓 모델 */
const socketModel: interfaces.ISocketModel = {
	clientSocket: null,
	socketName: '',
	socketGubun: ''
};

/** 유저 모델 */
const userModel: interfaces.IUserModel = {
	nickId: '',
	nickName: '',
	uniqueId: '',
	isActive: false
};

/** 소켓 POOL 모델 */
const socketPoolModel: interfaces.ISocketModel[] = [];

/** 유저 POOL 모델 */
const userPoolModel: interfaces.IUserModel[] = [];

export default { socketModel, userModel, socketPoolModel, userPoolModel };
