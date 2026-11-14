// Discrete touch actions (Jump/Mine/Place) own one finger per button.
// A second finger cannot repeat the action until the owner releases.
export function createTouchActionOwner(){
  let owner=null;
  return {
    claim(id){
      if(!Number.isInteger(id)||owner!==null)return false;
      owner=id;
      return true;
    },
    release(id){
      if(owner!==id)return false;
      owner=null;
      return true;
    },
    cancel(){owner=null;},
    get active(){return owner!==null;}
  };
}
