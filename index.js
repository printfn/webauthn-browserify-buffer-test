const { Buffer } = require('buffer');

function newBuffer(type, data) {
    switch (type) {
        case 'browserify':
            return Buffer.from(data);
        case 'uint8array':
            return new Uint8Array(data);
        default:
            throw new Error(`unknown type ${type}`);
    }
}

async function register(type) {
    const options = {
        publicKey: {
            rp: {
                name: 'Webauthn Browserify Buffer Test',
            },
            user: {
                id: newBuffer(type, [1, 2, 3, 4, 5, 6, 7, 8]),
                name: 'my user',
                displayName: 'my user',
            },
            challenge: newBuffer(type, [1, 2, 3, 4, 5, 6, 7, 8]),
            pubKeyCredParams: [
                { alg: -7, type: 'public-key' },
                { alg: -257, type: 'public-key' },
            ],
            authenticatorSelection: {
                residentKey: 'required',
                requireResidentKey: true,
                userVerification: 'required',
            },
            excludeCredentials: [
                { id: newBuffer(type, [1, 2, 3, 4, 5, 6, 7, 8]), type: 'public-key' },
            ]
        },
    };
    console.log('Beginning registration with options', options);
    const result = await navigator.credentials.create(options);
    console.log('Successfully registered credential', result);
}

async function login(type) {
    const options = {
        publicKey: {
            challenge: newBuffer(type, [1, 2, 3, 4, 5, 6, 7, 8]),
            userVerification: 'required',
        },
    };
    console.log('Beginning login with options', options);
    const result = await navigator.credentials.get(options);
    console.log('Successfully logged in with credential', result);
}

document.getElementById('register-browserify').addEventListener('click', async () => {
    await register('browserify');
});

document.getElementById('login-browserify').addEventListener('click', async () => {
    await login('browserify');
});

document.getElementById('register-uint8array').addEventListener('click', async () => {
    await register('uint8array');
});

document.getElementById('login-uint8array').addEventListener('click', async () => {
    await login('uint8array');
});
