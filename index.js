const parser = require('./src/node/parsestatus.js');

let params = {};

process.argv.forEach(function (val, index, array) {
    const key = val.split('=')[0];
    const value = val.substring(key.length+1, val.length);

    switch (key) {
        case 'user':
            params.user = value;
            break;

        case 'status':
            params.status = value;
    }

});

console.log(parser(params.status));
