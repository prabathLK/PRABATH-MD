const http = require('http');

const errors = [
    'Bad proxy string',
    'Proxy offline'
];

const proxy_check = p => {

    return new Promise((resolve, reject) => {

        let proxy = {
            host: '',
            port: 0,
            proxyAuth: ''
        };

        if (typeof p === 'object') {
            if (Array.isArray(p)) {
                if (typeof p[0] === 'object') {
                    proxy = p[0];
                } else if (typeof p === 'string') {
                    p = p[0];
                } else {
                    return reject(errors[0]);
                }
            } else {
                proxy = p;
            }
        }

        if (typeof p === 'string') {
            if (p.indexOf('@') + 1) {
                proxy.proxyAuth = p.split('@')[0];
                const host_port = p.split('@')[1];
                if (host_port.indexOf(':') + 1) {
                    proxy.host = host_port.split(':')[0];
                    proxy.port = host_port.split(':')[1];
                }
            } else {
                if (p.indexOf(':') + 1) {
                    proxy.host = p.split(':')[0];
                    proxy.port = p.split(':')[1];
                }
            }
        }

        const proxy_options = {
            method: 'CONNECT',
            path: 'www.google.com:443',
            timeout: 1000,
            agent: false
        };

        if (proxy.host) {
            proxy_options.host = proxy.host;
        }
        if (proxy.port) {
            proxy_options.port = proxy.port;
        }
        if (proxy.proxyAuth) {
            proxy_options.headers = {
                'Proxy-Authorization': 'Basic ' + Buffer.from(proxy.proxyAuth).toString('base64')
            };
        }

        const req = http.request(proxy_options);
        req.on('connect', res => {
            req.destroy();
            if (res.statusCode === 200) {
                return resolve(true);
            } else {
                return reject(errors[1]);
            }
        });
        req.on('timeout', () => {
            req.destroy();
        });
        req.on('error', err => {
            return reject((err && err.code) || errors[1]);
        });
        req.end();

    });
}

module.exports = proxy_check;
