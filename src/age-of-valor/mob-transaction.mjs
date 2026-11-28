// Proposed AV/MOB revision validator, not a commit implementation.
export function verifyMobDamageTransaction({request,record,validateReceipt}){
 if(!request||!record||typeof validateReceipt!=='function'||record.version!==1||record.committed!==true||record.requestAmount!==request.amount||!Number.isSafeInteger(request.expectedRevision)||request.expectedRevision<0||record.beforeRevision!==request.expectedRevision||!Number.isSafeInteger(record.afterRevision))throw Error('unverified transaction');
 const outcome=validateReceipt(request,record.receipt);
 if(typeof outcome?.accepted!=='boolean'||record.afterRevision!==record.beforeRevision+(outcome.accepted?1:0))throw Error('invalid revision transition');
 return Object.freeze({outcome,beforeRevision:record.beforeRevision,afterRevision:record.afterRevision});
}
