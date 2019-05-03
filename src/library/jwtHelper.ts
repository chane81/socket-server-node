import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/*
	JWT 토큰관련 라이브러리

	// 사용 예제코드
  // 서버는 토큰 검증만 함
*/

// 키
const privateKey: string = process.env.JWT_PRIVATE_KEY;

// 토근 검증
const getTokenVerify = (token: string) => {
	try {
		return {
			info: jwt.verify(token, privateKey),
			success: true
		};
	} catch (err) {
		return {
			info: '',
			success: false
		};
	}
};

export default getTokenVerify;
