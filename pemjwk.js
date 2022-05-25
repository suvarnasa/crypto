/*
Also refer
https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey#json_web_key
*/

const crypto = require('crypto')
const {subtle}  = crypto.webcrypto
const {myatob} = require('./common')

const fs = require('fs')
const header = '-----BEGIN PUBLIC KEY-----'
const footer = '-----END PUBLIC KEY-----'
const newline ="\n"


const pem = fs.readFileSync('../jwt/pub.key', 'ascii')

const stripCert = (cert) => {
    let str = pem.replace( header, '')
    str = str.replace(footer, '')
    str = str.replace(newline, "")
    return str;
}


const base64toBinArray = (strippedPem) => {
    const byteString = myatob(strippedPem);
    let byteArray = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        byteArray[i] = byteString.charCodeAt(i);
    }
    return byteArray
}
//this is the format that is needed to import the generated cert as a key. 
const pemtoBinArray = (cert) => {
    const strippedPem = stripCert(cert)
    return base64toBinArray(strippedPem)
}

const jwkformat = async (cert) => {
    console.log(cert);
    const key = pemtoBinArray(cert)
    try{
        const importedkey = await subtle.importKey(
            'spki',
        key,
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
          },
        true,
        ["encrypt",]
    );
        const jwk = await subtle.exportKey("jwk", importedkey)
//        delete jwk['key_ops']
//        delete jwk['ext']
//        delete jwk['alg']
//        jwk['kid']= crypto.randomBytes(16).toString('hex')
        console.log(jwk);
    }catch(err){
        console.log(err);
    }
}
    
jwkformat(pem)
