
const { convertToRsaPrivateKey, rsaDecryption } = require("./nodeRSAservices");
const { aesDecryption } = require("./aesServies");

const DecryptionFileService = async (privateStr,encodedData)=>{

    var pvkey = convertToRsaPrivateKey(privateStr);
    var rsaDecoded = await rsaDecryption(pvkey,encodedData);
    var aesDecrpt = aesDecryption(rsaDecoded, privateStr);

    return aesDecrpt;
}

module.exports = {
    DecryptionFileService
}