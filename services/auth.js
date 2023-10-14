const sessionidmap=new Map();
function setuser(id,user){

    sessionidmap.set(id,user);
}

function getuser(id){
   
    return sessionidmap.get(id);
}

module.exports={
    setuser,
    getuser
};
