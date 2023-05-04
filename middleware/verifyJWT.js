const jwt = require('jsonwebtoken')
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log(authHeader)
    //console.log(authHeader?.startsWith("Be"))
    if (!authHeader?.startsWith("Bearer ")) {
        console.log("opppppppppppppppssssssssss")
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const array = authHeader.split(' ');
    console.log(array.length)
    if (array.length<2)
    return res.status(401).json({massage:'Unauthorized'})
    const token=array[1];
    
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
        15
        if (err) return res.status(403).json({ message: 'Forbidden' })
        req.user = decoded
        next()
        }
        )

}
module.exports = verifyJWT