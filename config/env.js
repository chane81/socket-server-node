/**
 * 사용자 config 세팅 여기서 함(.env 에서 설정하던 방식에서 변경)
 */

function getParse(val) {
  return Object.keys(val).reduce((env, key) => {
    env[key] = JSON.stringify(val[key]);
    return env;
  }, {});
}

function getClientConfig() {
  const target = process.env.npm_lifecycle_event;
  process.env.NODE_ENV = target === 'build' ? 'production' : 'development';

	const envVal = {
    // 개발환경 변수
		development: {
      SOCKET_IO_PORT: '5000',
      NET_PORT: '5001',
      JWT_PRIVATE_KEY: 'cloud99'
    },
    // 실서버환경 변수
    production: {
      SOCKET_IO_PORT: process.env.port,
      JWT_PRIVATE_KEY: 'black2284'
    }
	};

  // 실행환경
	// 'development' or 'production'
  const raw = envVal[process.env.NODE_ENV];

  // env 에 사용자 config 변수값 삽입
  // const stringified = {
  //   'process.env': {
  //     ...getParse(process.env),
  //     ...getParse(raw)
  //   }
  // };

  const stringified = {
    'process.env': `Object.assign(${JSON.stringify(raw)}, process.env)`
  };

  console.log('raw:', stringified);
  return { raw, stringified };
}

module.exports = getClientConfig;
