var CryptoJS = require('crypto-js');

const encryptFile = (fileBuffer,privateStr)=>{
    return CryptoJS.AES.encrypt(fileBuffer,privateStr).toString();
}

const rsaKeyToAesKey = (rsaKey)=>{
    var privateArr = rsaKey.split('\n');
    var aesKey = ''
    for(var i=0;i<privateArr.length;i++){
        if(i!=0 && i!=privateArr.length-1){
            aesKey += privateArr[i];
        }
    }
    return aesKey;
}

const aesDecryption = (encodedData, aesPrivateKey)=>{
    var bytes = CryptoJS.AES.decrypt(encodedData,aesPrivateKey);
    var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
}
module.exports = {
    encryptFile,
    rsaKeyToAesKey,
    aesDecryption
}