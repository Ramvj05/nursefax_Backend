var jwt = require('jsonwebtoken');
require('dotenv').config();

const Login =async(req,res,next)=>{
    try{
        const{name,email,adminid}=req;
        var userToken = jwt.sign({name:name,email:email,adminid:adminid},process.env.KEY_FOR_AUTH,{ expiresIn: '1d' })
        return userToken;
    }
    catch(err){
        if(err){
            console.log(err)
            return false;
        }
    }
}
//adminPanel
//admin_panel | best
//Admin 
// ADMIN
const Verify =(req,res,next)=>{
    
    var Bearer = req.headers.authorization;
       if(typeof Bearer !== "undefined"){
        var token = Bearer.split(" ")
        var AuthToken = (typeof token[1] !== 'undefined') ? token[1] : token;
        var DATA = false;
            try{
                jwt.verify(AuthToken,process.env.KEY_FOR_AUTH, function(errJwt, responseJwt){
                    //redis 
                 
                    if(errJwt)
                    {
                        returndata=({"msg":"jwt token error","error":errJwt}); //Promise<JWt>

                        
                    }
                    else{
                        DATA = true
                    }
                });
            }
            catch(Err)
            {
                DATA = false;
            }
    
    
        
            console.log(DATA,"JWT")
        return DATA;
    }
    else{
        return false;
    }
}

module.exports={Login,Verify}