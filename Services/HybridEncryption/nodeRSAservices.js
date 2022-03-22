const NodeRSA = require('node-rsa');

const generateKey = ()=>{
    return new NodeRSA({b:512})
}

const rsaEncryption = (key,rawData)=>{
    return key.encrypt(rawData,'base64');
}

const convertToRsaPrivateKey = (keyString)=>{
    
    var privateStr = '-----BEGIN RSA PRIVATE KEY-----\n';
    for(var i=0;i<keyString.length;i=i+64){
        privateStr += keyString.substring(i,i+64)+'\n';
    }
    privateStr += '-----END RSA PRIVATE KEY-----'
    
    return new NodeRSA(privateStr);;
}

const rsaDecryption = (rsaKey,encryptedData)=>{
    return rsaKey.decrypt(encryptedData,'utf8');
}
module.exports = {
    generateKey,
    rsaEncryption,
    convertToRsaPrivateKey,
    rsaDecryption
}