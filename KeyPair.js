const crypto = require('crypto')
const {subtle}  = crypto.webcrypto
const {mybtoa} = require('./common')
const createKeyPair = async () =>{
    let keypair
    try{
         keypair = await subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1,0,1]),
                hash:"SHA-256",
            },
            
            true,
            ["encrypt", "decrypt"]
        )
    }catch(err){
        console.log(err);
    }
    return keypair
}

const exportPublickeys = async (keys)=>{
    const public = await subtle.exportKey("spki", keys.publicKey)
    const keyString = ab2str(public)
    const exportedAsBase64 = mybtoa(keyString);
  const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
    console.log(pemExported);
}
const exportPrivatekeys = async (keys)=>{
    const private = await subtle.exportKey("pkcs8", keys.privateKey)
    const keyString = ab2str(private)
    const exportedAsBase64 = mybtoa(keyString);
  const pemExported = `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
    console.log(pemExported);
}
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }
  
const createExport = async ()=>{
    const keypair = await createKeyPair();
    exportPublickeys(keypair)  
    exportPrivatekeys(keypair)  
}



createExport()
