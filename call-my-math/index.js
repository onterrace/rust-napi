const ffi = require('ffi-napi');

const lib = ffi.Library('../math/target/release/my_math.dll', {
        'add2numbers':[ 'int', ['int', 'int'] ]
});


let result = lib.add2numbers(1,2);
console.log(result);

