/**
 * 사용자 config 세팅 여기서 함(.env 에서 설정하던 방식에서 변경)
 */

// function getParse(val) {
//   return Object.keys(val).reduce((env, key) => {
//     env[key] = JSON.stringify(val[key]);
//     return env;
//   }, {});
// }

function getParse(val) {
  return Object.keys(val).reduce((env, key) => 
    Object.assign({}, env, {
      [`process.env.${key}`]: val[key]
    }), {});
}

function getClientConfig() {
  const target = process.env.npm_lifecycle_event;
  process.env.NODE_ENV = target === 'start' ? 'production' : 'development';
//console.log('fdfd:', target);
	const envVal = {
    // 개발환경 변수
		development: {
      SOCKET_IO_PORT: '5000',
      NET_PORT: '5001',
      JWT_PRIVATE_KEY: 'cloud99'
    },
    // 실서버환경 변수
    production: {      
      JWT_PRIVATE_KEY: 'black2284'
    }
	};

  // 실행환경
	// 'development' or 'production'
  const raw = envVal[process.env.NODE_ENV];

  // env 에 사용자 config 변수값 삽입
  const stringified = getParse(raw);
    //'process.env': Object.assign(getParse(raw), getParse(process.env))
    
  

  console.log('raw:', stringified);
  return { raw, stringified };
}

module.exports = getClientConfig;
