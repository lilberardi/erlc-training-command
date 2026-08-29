const express = require("express");
const crypto = require("crypto");
const app = express();
const PORT = process.env.PORT || 10000;
const ERLC_SERVER_KEY = process.env.ERLC_SERVER_KEY;
const ERLC_PUBLIC_KEY = crypto.createPublicKey({key: Buffer.from("MCowBQYDK2VwAyEAjSICb9pp0kHizGQtdG8ySWsDChfGqi+gyFCttigBNOA=","base64"),format:"der",type:"spki"});
app.post("/erlc/webhook", express.raw({type:"application/json",limit:"1mb"}), async (req,res)=>{
  try {
    const signature=req.get("X-Signature-Ed25519"), timestamp=req.get("X-Signature-Timestamp");
    if(!signature||!timestamp||!Buffer.isBuffer(req.body)) return res.status(400).send("Missing webhook signature headers or raw body.");
    const sig=Buffer.from(signature,"hex");
    const message=Buffer.concat([Buffer.from(timestamp,"utf8"),req.body]);
    if(!crypto.verify(null,message,ERLC_PUBLIC_KEY,sig)) return res.status(401).send("Invalid webhook signature.");
    const body=JSON.parse(req.body.toString("utf8"));
    const events=Array.isArray(body.events)?body.events:[];
    for(const event of events){
      if(event.event!=="CustomCommand") continue;
      const data=event.data||{};
      const command=String(data.command??event.command??"").trim().toLowerCase();
      const argument=String(data.argument??event.argument??"").trim().toLowerCase();
      if(command==="start training"||(command==="start"&&argument==="training")) await sendERLCCommand(":m Training is starting! Please report to the training area.");
    }
    return res.status(204).end();
  } catch(error){ console.error(error); return res.status(500).send("Webhook processing error."); }
});
app.get("/",(req,res)=>res.json({ok:true,service:"ER:LC Training Command",webhook:"/erlc/webhook"}));
app.get("/health",(req,res)=>res.json({ok:true}));
async function sendERLCCommand(command){
  if(!ERLC_SERVER_KEY) throw new Error("ERLC_SERVER_KEY is not configured.");
  const response=await fetch("https://api.erlc.gg/v1/server/command",{method:"POST",headers:{"Content-Type":"application/json","server-key":ERLC_SERVER_KEY},body:JSON.stringify({command})});
  const text=await response.text();
  if(!response.ok) throw new Error(`ER:LC API returned ${response.status}: ${text}`);
  console.log("ER:LC command sent:",command,text);
}
app.listen(PORT,()=>console.log(`Listening on ${PORT}`));
