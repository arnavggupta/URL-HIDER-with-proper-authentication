
require('dotenv').config()
const express=require("express");
const app=express();
const { v4: uuidv4 } = require('uuid');
const connectdb=require("./db/conn");
// require("./db/conn");
const hbs=require("hbs");
const apth=require("path");
const port=process.env.PORT||8000;
const path=require("path");
const route1= require("./routers/route1");
const saved= require("./models/saving");
const {setuser}=require("./services/auth");
var count=0;
connectdb();
// const generateshorturl=require("./controllers/url");
// const urlroutes=require("./routers/routes");
// app.use("url",urlroutes);


app.use(express.urlencoded({extended:false}));
app.use(express.json());
const user=require("./models/url");
app.set("view engine","hbs");
const  shortid = require("shortid");
app.get("/",(req,res)=>{
  res.render("index");
})

app.use("/",route1);
const staticpath=path.join(__dirname,"/styles");
app.use(express.static(staticpath));

app.post("/link-form",async(req,res)=>{

  if(!req.body.links){
    return res.status(400).json("please enter url");
}


console.log(req.body.links);
const shortId= shortid();
const urlentry= new  user({
shortyid:shortId,
redirecturl:req.body.links,
    visithistory:[]

})
try {
    await urlentry.save();
    count=count+1;
    if(count===1){
     return res.redirect("/login");
    }
  //  return  res.json({ id: shortId });
  res.render("index1", { shortId: shortId });
  
  } catch (error) {
    res.status(400).json({ error: error.message });
  }



});

app.post("/register",async(req,res)=>{

  const {name,email,password}= req.body;
  await saved.create({
    name,
    email,
    password
  })

  res.render("index");
})

app.post("/login",async(req,res)=>{
const email= req.body.lemail;
const password= req.body.lpassword;
const data=await saved.findOne({email,password});


if(!data){
return res.render("index3",{
  error:"Invalid username or password"
});
}

const sessionid= uuidv4();
setuser(sessionid,data);
res.cookie("uid",sessionid);

return res.redirect("/");

  // res.render("index2");
})


app.get("/:shortyy", async (req, res) => {
    const shortyy = req.params.shortyy;
  
    try {
      const result = await user.findOne({ shortyid: shortyy }); // Add a query condition
      if (result) {
        res.redirect(result.redirecturl);
      } else {
        res.status(404).send("Short URL not found");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  });
  





app.listen(port,()=>{
    console.log(`Server is started at port ${port}`);
})

