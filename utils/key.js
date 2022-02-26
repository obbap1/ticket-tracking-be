const {V4} = require('paseto')
let privKey, pubKey
module.exports = {
    keys: async () => {
        if(privKey && pubKey) {
            return {
                secretKey: privKey,
                publicKey: pubKey
            }
        }
        const {secretKey, publicKey} = await V4.generateKey("public", {format: 'paserk'})
        privKey = secretKey
        pubKey = publicKey
        return {secretKey, publicKey}
    }
}