/**
 * 사용자 config 세팅 여기서 함(.env 에서 설정하던 방식에서 변경)
 */

function getClientConfig() {
	const envVal = {
    // 개발환경 변수
		development: {
      SOCKET_IO_PORT: '5000',
      NET_PORT: '5001',
      JWT_PRIVATE_KEY: 'cloud99'
    },
    // heroku 에서는 자체적으로 env 설정 제공
    // 실서버환경 변수
		// production: {
		// 	SOCKET_IO_PORT: '5000',
    //   NET_PORT: '5001',
    //   JWT_PRIVATE_KEY: 'cloud99'
		// }
	};

  // 실행환경
	// 'development' or 'production'
	const nodeEnv = process.env.NODE_ENV || 'development';
  const raw = envVal[nodeEnv];

  // env 에 사용자 config 변수값 삽입
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
}

module.exports = getClientConfig;
