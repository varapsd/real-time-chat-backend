const { addFile } = require("../Models/ChatRoom");
const { ecryptFileService } = require("./HybridEncryption/hybridEncryptionService");

const fileSaveService = async (payload)=>{
    bufLength = Buffer.byteLength(payload.body);
    fileBufferString = payload.body.toString('hex');
    const { chiphertext,privateStr} = await ecryptFileService(fileBufferString);

    const response = await addFile({chiphertext,privateKey : privateStr,bufLength, roomId: payload.roomId, userId : payload.userId, fileName : payload.fileName});
    return response;
}

module.exports = {
    fileSaveService
}