const express=require("express")
const app=express()
const jwt=require("jsonwebtoken")
const env=require("dotenv")
env.config()
app.use(express.json())

const posts=[
    {name:"jamal",age:25},
    {name:"ali",age:25}
]
app.post("/login",(req,res)=>
{
    //user authentication logic
    const {name}=req.body;
    console.log(req.body)
    console.log(name)
    const user={name:name}
    const access_token=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
    res.json({access_token})
})
app.get("/posts",authenticatejwt,(req,res)=>
{
    const post=posts.filter((post)=>post.name===req.user.name)
    res.status(200).json(post)
})
app.listen(process.env.PORT || 3001,()=>
{
    console.log("listening")
})

function authenticatejwt(req,res,next)
{
    const authenticationHeader=req.header("Authorization")
    const token=authenticationHeader && authenticationHeader.split(' ')[1]
    console.log(token)
    if(!token)
    {
        res.status(401)
    }
    console.log("anc")
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>
    {
        if(err) res.status(403)
        req.user=user
        next()
    })

}