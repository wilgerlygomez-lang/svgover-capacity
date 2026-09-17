const WebSocket = require('ws');
const http = require('http');
const PORT = process.env.PORT || 8080;
const rooms = new Map();
const server = http.createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8'});res.end('Over-Capacity multiplayer server OK');});
const wss = new WebSocket.Server({server});
function send(ws,msg){if(ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify(msg));}
function roster(room){const out={};for(const [role,p] of room.players)out[role]={role,name:p.name};return out;}
function broadcast(room,msg){for(const p of room.players.values())send(p.ws,msg);}
wss.on('connection',ws=>{
 let player=null, room=null;
 ws.on('message',raw=>{
  let m;try{m=JSON.parse(raw)}catch(e){return}
  if(m.type==='join'){
   const key=String(m.room||'COCINA1').toUpperCase().slice(0,16);
   if(!rooms.has(key))rooms.set(key,{players:new Map(),host:null});
   room=rooms.get(key);
   const free=['p1','p2','p3','p4'].find(r=>!room.players.has(r));
   if(!free){send(ws,{type:'error',message:'Sala llena (máximo 4 jugadores).'});return}
   player={role:free,name:String(m.name||'Jugador').slice(0,18),ws};room.players.set(free,player);if(!room.host)room.host=free;
   send(ws,{type:'welcome',role:free,host:room.host===free,players:roster(room)});broadcast(room,{type:'roster',players:roster(room)});return;
  }
  if(!room||!player)return;
  if(m.type==='position'&&m.player===player.role){broadcast(room,{type:'position',player:player.role,x:Number(m.x)||0,y:Number(m.y)||0});return;}
  if(m.type==='action'&&m.player===player.role){broadcast(room,{type:'action',player:player.role});return;}
  if(m.type==='snapshot'&&player.role===room.host){broadcast(room,{type:'snapshot',host:true,state:m.state});return;}
  if(m.type==='start'&&player.role===room.host){broadcast(room,{type:'start'});return;}
 });
 ws.on('close',()=>{if(room&&player){room.players.delete(player.role);broadcast(room,{type:'roster',players:roster(room)});if(room.host===player.role){room.host=room.players.keys().next().value||null;if(room.host)broadcast(room,{type:'hostChanged',host:room.host});}if(room.players.size===0)rooms.delete([...rooms.entries()].find(([k,v])=>v===room)?.[0]);}});
});
server.listen(PORT,()=>console.log(`Over-Capacity multiplayer server listening on ${PORT}`));
