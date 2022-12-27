# napi-rs

이 프로젝트는 rust로 간단한 함수를 만들고 node에서 그 함수를 호출하는 간단한 예제이다. 

napi-rs는 Node API를 이용해 러스트로 작성된 코드를 노드에서 사용할 수 있도록 해주는 멋진 라이브러리이다. N-API는 노드 버전 8부터 도입되었으며, 현재는 Node API로 이름이 변경 되었다. 이 프로젝트는 [Calling Rust code from Node.JS - Why and How | Rust Lang | JavaScript](https://www.youtube.com/watch?v=kkc2Z_PI8E8)를 참고했다. 


napi에 대한 문서는 다음을 참고한다. 
* [Node.js와 Rust의 우아한 결합 napi-rs](https://blog.hanlee.io/2022/napi-rs)
* [napi-rs github 사이트](https://github.com/napi-rs/napi-rs)


 노드에서 네이티브 확장 기능은 노드 애드온이라고 한다. 노드 애드온은 .node 확장자를 가진 동적 라이브러리이다. 윈도우에서는 dll, 맥에서는 dylib, 리눅스에서는 so와 동일하다. node-ffi-napi를 설치하는 중에 오류가 나서 시간을 좀 소모했다. ubuntu에서는 설치가 정작적으로 되었다. 환경을 맞추고 난 후에 정상적으로 설치되었다. 설치는 다음 버전을 기준으로 성공했다. 
* nvm 1.1.10 설치
* node 19.3.0
* cargo 1.65.0 
* rustc 1.65.0

## 프로젝트 구조 

```shell
📁root # 이 문서가 있는 폴더 
  📁math # rust로 작성된 러스트 모듈 
    📁src # rust로 작성된 러스트 모듈 
      📄lib.rs  # rust 모듈 
      📄main.rs # rust 모듈 테스트용 main 
  📁call-my-math # rust 모듈을 사용할 node.js 모듈  
    📄index.js 테스트할 javascript 파일 
    📄package.json 
```  

## 테스트하기 
먼저 rust 모듈을 빌드 한다. 
```shell
cd math 
cargo build --release
```
node 모듈로 이동한 다음에 install 하고 index.js를 실행한다. 
```shell
cd call-my-math 
npm install
node index.js
```

## 프로그램 작성
### math 모듈 
**src/lib.rs**
```rust
#[no_mangle]
pub extern fn add2numbers(n1:i32, n2:i32) -> i32 {
  n1 + n2
}
```
**Cargo.toml**    
```toml
[package]
name = "math"
version = "0.1.0"
edition = "2021"

[lib]
name = "my_math"
crate-type=["rlib", "cdylib"]

[dependencies]
```

> cdylib는 주로 C/C++ 프로그램에 연결할 수 있는 공유 라이브러리를 구축하기 위해 설계되었다. 최소 크기는 Linux에서 ~2.2M이므로 가장 작은 cdylib는 가장 작은 dylib보다 크다. C/C++ 프로그램(및 extern 블록을 정의하는 Rust 프로그램)에 동적으로 연결할 수 있는 C ABI를 구축하도록 설계되었다. ABI를 통해 Rust 프로그램을 Rust cdylib에 연결하려면 Extern 블록을 사용해야 한다.



**src/main.rs**
```shell
use my_math;

fn main() {
    let result = my_math::add2numbers(1, 2);
    println!("Result: {}", result);
}
```


### javascript 모듈 
**index.js**
```jsx
const ffi = require('ffi-napi');

const lib = ffi.Library('../math/target/release/my_math.dll', {
        'add2numbers':[ 'int', ['int', 'int'] ]
});


let result = lib.add2numbers(1,2);
console.log(result);
```
**package.json** 
```json
{
  "name": "call-my-math",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "ffi-napi": "^4.0.3"
  }
}
```



