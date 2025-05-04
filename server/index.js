const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const EmployeeModel=require('./models/Employee')
const app=express()
app.use(express.json())
app.use(cors())
mongoose.connect("process.env.MONGODB_URI")

app.post('/register',(req,res)=>{
    EmployeeModel.create(req.body)
    .then(employee=>res.json(employee))
    .catch(err=>res.json(err))
})

app.post('/login',(req,res)=>{
    const {email,password}=req.body;
    EmployeeModel.findOne({email:email})
    .then(user=>{
        if(user){
            if(user.password===password){
                res.json('Success')
            }
            else{
                res.json("password incorrect")
            }
        }
        else{
            res.json("no record")
        }
    })
})

app.listen(3001,()=>{
    console.log("server ready")
})
