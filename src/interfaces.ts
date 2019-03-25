/** 사용자 모델 인터페이스 */
interface IUserModel {
	isRead: boolean;
	nickId: string;
	nickName: string;
	uniqueId: string;
	unreadCount: number;
}

/** 소켓 메시지 모델 인터페이스 */
interface IMessageModel {
	isRead: boolean;
	isSelf: boolean;
	message: string;
	msgFromUniqueId: string;
	msgToUniqueId: string;
	user: IUserModel;
}

export { IUserModel, IMessageModel };
