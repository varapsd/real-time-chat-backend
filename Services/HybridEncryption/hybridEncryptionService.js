
const { rsaEncryption , generateKey } = require("./nodeRSAservices");
const { rsaKeyToAesKey, encryptFile } = require("./aesServies");

const ecryptFileService = async (fileBufferString)=>{
    // console.log(req.file.buffer);
    // bufLength = Buffer.byteLength(req.file.buffer);
    // fileBuffer = req.file.buffer.toString('hex');
    var key = generateKey();
    var privatekey = key.exportKey('private');
    var privateStr = rsaKeyToAesKey(privatekey);
    var encryptData = encryptFile(fileBufferString, privateStr);
    //console.log(encryptData);

    var chiphertext = await rsaEncryption(key,encryptData);
    return {privateStr,chiphertext};
}

module.exports = {
    ecryptFileService
} ;