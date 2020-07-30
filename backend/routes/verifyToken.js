const jwt= require('jsonwebtoken');


module.exports=function (req,res,next){
    const token= req.header('jwt_auth');
    if(!token)  return res.status(403).send('Access denied');

    try {
        const verified= jwt.verify(token, process.env.JWT_PUBLIC_KEY)
        req.user=verified;
        next()

        
    } catch (error) {
        res.status(400).send('invalid token');
    }
}

