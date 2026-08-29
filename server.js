const express = require("express");
const app = express();
app.use(express.json({limit:"1mb"}));

const PORT = process.env.PORT || 10000;
const ERLC_SERVER_KEY = process.env.ERLC_SERVER_KEY;

app.get("/", (req,res)=>res.json({ok:true,service:"ER:LC Training Command"}));
app.get("/health", (req,res)=>res.json({ok:true}));

function getCommand(body){
  return [
    body?.command, body?.message, body?.content,
    body?.data?.command, body?.data?.message
  ].find(x=>typeof x==="string")?.trim().toLowerCase() || "";
}

async function sendERLCCommand(command){
  if(!ERLC_SERVER_KEY) throw new Error("ERLC_SERVER_KEY is not configured.");
  const r=await fetch("https://api.erlc.gg/v1/server/command",{
    method:"POST",
    headers:{"Content-Type":"application/json","server-key":ERLC_SERVER_KEY},
    body:JSON.stringify({command})
  });
  if(!r.ok) throw new Error(`ER:LC API returned ${r.status}`);
  return r.json().catch(()=>({}));
}

app.post("/erlc/webhook",async(req,res)=>{
  try{
    const command=getCommand(req.body);
    if(command===";start training" || command===":start training"){
      await sendERLCCommand(":m Training is starting! Please report to the training area.");
      return res.json({ok:true,triggered:"start training"});
    }
    res.json({ok:true,triggered:false});
  }catch(e){
    console.error(e);
    res.status(500).json({ok:false,error:e.message});
  }
});

app.listen(PORT,()=>console.log(`Listening on ${PORT}`));
