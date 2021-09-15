import crypto from 'crypto';

const block = {
    id:1,
    transactions:[],
    miner:'Yannick Charron',
    nonce:0
}

let tries = 0;
let hash = '';
do {
    block.nonce++;
    hash = crypto.createHash('sha256').update(JSON.stringify(block)).digest('hex');
    //console.log(hash);
    tries++;
} while(!hash.startsWith('000000'));
console.log(tries);