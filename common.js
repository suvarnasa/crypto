const mybtoa = (text) => {
    return Buffer.from(text, 'binary').toString('base64');
};

const myatob = (base64str) => {
    return Buffer.from(base64str, 'base64').toString('binary');
};

 module.exports  = {myatob, mybtoa};