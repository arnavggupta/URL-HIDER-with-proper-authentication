const express=require("express");
const router=express.Router();


router.get("/signin",(req,res)=>{

    res.render("index2");
})
module.exports=router;

router.get("/login",(req,res)=>{
    res.render("index3");
})
