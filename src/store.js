import {useState,useEffect} from 'react'
import {M} from './data'
import {t as tr} from './i18n.js'
export const ST=['Yangi','Qabul qilindi','Bajarildi','Rad etildi','Bekor qilindi']
export const fmt=n=>Number(n).toLocaleString('ru-RU')+' '+tr('so‘m')
export const nowMin=()=>new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,16)
export const SLOTS=Array.from({length:10},(_,i)=>String(9+i).padStart(2,'0')+':00')
export const isBusy=(orders,mid,date,slot)=>orders.some(o=>o.mid===mid&&o.status<2&&o.time.slice(0,13)===date+'T'+slot.slice(0,2))
export const dstr=d=>new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)
export const nextFree=(orders,mid)=>{const n=nowMin();for(let d=0;d<14;d++){const dt=new Date();dt.setDate(dt.getDate()+d);const ds=dstr(dt);for(const s of SLOTS){if(ds+'T'+s<=n||isBusy(orders,mid,ds,s))continue;return {date:ds,slot:s,label:(d===0?'Bugun ':d===1?'Ertaga ':ds.slice(8)+'.'+ds.slice(5,7)+' ')+s}}}return null}
export const freeLabel=(orders,mid)=>nextFree(orders,mid)?.label||'Band'
export const digits=s=>String(s).replace(/\D/g,'').slice(-9)
const PAL=['#cfe3ff','#ffe9a8','#ffd9c2','#d4f3ee','#e7dcff','#ffd3dc','#d9f0d0','#dcd9ff']
const get=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch{return d}}
const put=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const seed=()=>[{id:'c0',role:'client',name:'Demo Mijoz',phone:'900000000',pass:'1234'},...M.map(m=>({id:'m'+m.id,role:'master',name:m.name,phone:'9010000'+String(m.id).padStart(2,'0'),pass:'1234',profile:{job:m.job,exp:m.x,area:m.a,price:m.p,services:m.s,c:m.c,rating:m.r}}))]
export function useStore(){
 const [users,setUsers]=useState(()=>get('ub_users',null)||seed())
 const [orders,setOrders]=useState(()=>get('ub_orders',[]))
 const [sid,setSid]=useState(()=>{try{return JSON.parse(sessionStorage.getItem('ub_session'))}catch{return null}})
 const [msgs,setMsgs]=useState(()=>get('ub_msgs',[])),[th,setTh]=useState(null)
 const [t,setT]=useState('')
 useEffect(()=>put('ub_users',users),[users])
 useEffect(()=>put('ub_orders',orders),[orders])
 useEffect(()=>put('ub_msgs',msgs),[msgs])
 useEffect(()=>{try{sessionStorage.setItem('ub_session',JSON.stringify(sid))}catch{}},[sid])
 useEffect(()=>{const f=e=>{if(e.key==='ub_users')setUsers(get('ub_users',[]));if(e.key==='ub_orders')setOrders(get('ub_orders',[]));if(e.key==='ub_msgs')setMsgs(get('ub_msgs',[]))};window.addEventListener('storage',f);return()=>window.removeEventListener('storage',f)},[])
 const toast=m=>{setT(m);setTimeout(()=>setT(''),2200)}
 const me=users.find(u=>u.id===sid)||null
 const masters=users.filter(u=>u.role==='master').map(u=>{const p=u.profile,rv=orders.filter(o=>o.mid===u.id&&o.review);
  return {id:u.id,name:u.name,job:p.job,c:p.c,p:p.price,x:p.exp,a:p.area,s:p.services,g:p.gallery||[],ph:p.photo||'',rv,r:rv.length?+(rv.reduce((a,o)=>a+o.review.stars,0)/rv.length).toFixed(1):p.rating}})
 const upd=(id,fn)=>setOrders(orders.map(o=>o.id===id?fn(o):o))
 const unread=me?msgs.filter(x=>x.from!==me.role&&!x.read&&(me.role==='client'?x.cid===me.id:x.mid===me.id)).length:0
 return {users,orders,me,masters,t,toast,msgs,th,setTh,unread,
  openChat:(cid,mid)=>setTh({cid,mid}),
  reply:(id,t)=>{upd(id,o=>({...o,review:{...o.review,reply:t.trim()}}));toast(tr('Javob yuborildi'))},
  cancel:(id,r)=>{upd(id,o=>({...o,status:4,reason:r,at:Date.now()}));toast(tr('Buyurtma bekor qilindi'))},
  resched:(id,time)=>{const cur=get('ub_orders',orders),o=cur.find(x=>x.id===id);if(isBusy(cur.filter(x=>x.id!==id),o.mid,time.slice(0,10),time.slice(11,16)))return tr('Bu vaqt band');setOrders(cur.map(x=>x.id===id?{...x,time,status:0,at:Date.now()}:x));toast(tr('Vaqt o‘zgartirildi'));return null},
  pay:(id,method)=>{upd(id,o=>({...o,paid:method,at:Date.now()}));toast(tr('To‘lov qabul qilindi'))},
  markSeen:()=>{if(me)setUsers(users.map(u=>u.id===me.id?{...u,seen:Date.now()}:u))},
  clearDemo:()=>{setOrders(orders.filter(o=>!o.demo));setMsgs(ms=>ms.filter(x=>!x.demo));toast(tr('Demo ma‘lumotlar o‘chirildi'))},
  seedDemo:()=>{const ms=users.filter(u=>u.role==='master').slice(0,8),cl=users.find(u=>u.id==='c0')||users.find(u=>u.role==='client')
   if(!cl||!ms.length)return toast(tr('Demo uchun hisob topilmadi'))
   const T=['Juda tez va sifatli ishladi, rahmat!','Narxi aytilgandek, ish toza.','Vaqtida keldi, tavsiya qilaman.','Muammo bir zumda hal bo‘ldi.','Yaxshi usta, albatta yana murojaat qilaman.'],A=['Chilonzor, 7-kvartal','Yunusobod, 12-mavze','Mirobod, Shevchenko ko‘chasi','Sergeli, 5-uy']
   const base=Date.now(),day=n=>dstr(new Date(base+n*864e5)),out=[]
   ms.forEach((m,i)=>{const sv=m.profile.services
    for(let k=0;k<4;k++){const s=sv[(i+k)%sv.length];out.push({id:base+i*100+k,demo:true,cid:cl.id,cname:cl.name,cphone:cl.phone,mid:m.id,at:base-2*864e5,paid:(i<2&&k===0)?undefined:'Payme',status:2,svc:s[0],price:s[1],problem:'Demo buyurtma',address:A[(i+k)%4],time:day(-((i+k*2)%7))+'T'+SLOTS[(i+k)%8],review:{stars:(i+k)%5===4?4:5,text:T[(i+k)%5],by:cl.name,at:base-2*864e5}})}
    if(i<3){const s=sv[0];out.push({id:base+i*100+50,demo:true,cid:cl.id,cname:cl.name,cphone:cl.phone,mid:m.id,status:0,svc:s[0],price:s[1],problem:'Demo: tezroq kelsangiz yaxshi bo‘lardi',address:A[i],time:day(1)+'T'+SLOTS[2]});out.push({id:base+i*100+51,demo:true,cid:cl.id,cname:cl.name,cphone:cl.phone,mid:m.id,status:1,svc:s[0],price:s[1],problem:'Demo: qabul qilingan buyurtma',address:A[i+1],time:day(2)+'T'+SLOTS[4]})}})
   setOrders([...orders.filter(o=>!o.demo),...out])
   const mk=(mid,arr)=>arr.map(([from,text,read],j)=>({id:base+Math.random(),demo:true,cid:cl.id,mid,from,text,t:base-(arr.length-j)*6e4*7,read}))
   setMsgs(m=>[...m.filter(x=>!x.demo),...mk(ms[0].id,[['client','Assalomu alaykum, ertaga soat 11:00 ga kela olasizmi?',true],['master','Va alaykum assalom! Ha, albatta, vaqtida boraman.',false],['master','Kerakli ehtiyot qismlar bilan kelaman.',false]]),...mk(ms[1].id,[['client','Salom, hisoblagichni ham ulab bera olasizmi?',true],['master','Ha, bu xizmat narxi profilda yozilgan.',false]])])
   toast(tr('Demo ma‘lumotlar yaratildi'))},
  updAccount:(id,p)=>{const ph=digits(p.phone);if(users.some(x=>x.id!==id&&x.phone===ph))return tr('Bu raqam boshqa hisobda bor')
   setUsers(users.map(u=>u.id===id?{...u,name:p.name.trim(),phone:ph}:u));setOrders(orders.map(o=>o.cid===id?{...o,cname:p.name.trim(),cphone:ph}:o));toast(tr('Ma‘lumotlar saqlandi'));return null},
  changePass:(id,o,n)=>{const u=users.find(x=>x.id===id);if(u.pass!==o)return tr('Joriy parol noto‘g‘ri')
   setUsers(users.map(x=>x.id===id?{...x,pass:n}:x));toast(tr('Parol yangilandi'));return null},
  toggleFav:mid=>{if(!me||me.role!=='client')return toast(tr('Sevimlilarga qo‘shish uchun mijoz sifatida kiring'))
   const f=me.fav||[];setUsers(users.map(u=>u.id===me.id?{...u,fav:f.includes(mid)?f.filter(x=>x!==mid):[...f,mid]}:u))},
  markRead:(cid,mid)=>setMsgs(ms=>ms.some(x=>x.cid===cid&&x.mid===mid&&x.from!==me.role&&!x.read)?ms.map(x=>x.cid===cid&&x.mid===mid&&x.from!==me.role?{...x,read:true}:x):ms),
  send:(cid,mid,text)=>{const tx=text.trim();if(!tx||!me)return
   const push=(from,text,auto)=>setMsgs(ms=>[...ms,{id:Date.now()+Math.random(),cid,mid,from,text,t:Date.now(),read:false,auto}])
   push(me.role,tx)
   if(me.role==='client'&&/^m\d{1,2}$/.test(mid)&&!msgs.some(x=>x.cid===cid&&x.mid===mid&&x.from==='master'))setTimeout(()=>push('master','Assalomu alaykum! Xabaringiz uchun rahmat, tez orada batafsil javob beraman.',true),1400)},
  reg:u=>{const ph=digits(u.phone);if(users.some(x=>x.phone===ph))return tr('Bu raqam bilan hisob allaqachon bor')
   const id=(u.role==='master'?'m':'c')+Date.now()
   const nu={id,role:u.role,name:u.name.trim(),phone:ph,pass:u.pass,...(u.role==='master'?{profile:{job:u.job.trim(),exp:+u.exp,area:u.area.trim(),price:+u.price,services:[[u.job.trim()+' xizmati',+u.price]],c:PAL[users.length%PAL.length],rating:0}}:{})}
   setUsers([...users,nu]);setSid(id);return null},
  login:(ph,pw)=>{const u=users.find(x=>x.phone===digits(ph)&&x.pass===pw);if(!u)return tr('Telefon yoki parol noto‘g‘ri');setSid(u.id);return null},
  logout:()=>setSid(null),
  place:o=>{const cur=get('ub_orders',orders)
   if(isBusy(cur,o.mid,o.time.slice(0,10),o.time.slice(11,16)))return tr('Bu vaqt hozirgina band qilindi. Boshqa vaqtni tanlang')
   setOrders([...cur,{id:Date.now(),at:Date.now(),cid:me.id,cname:me.name,cphone:me.phone,status:0,...o}]);toast(tr('Buyurtma yuborildi'));return null},
  setStatus:(id,s)=>{upd(id,o=>({...o,status:s,at:Date.now()}));toast(tr('Holat: {v}',{v:tr(ST[s])}))},
  review:(id,stars,text)=>{upd(id,o=>({...o,review:{stars,text,by:o.cname,at:Date.now()}}));toast(tr('Sharh qoldirildi'))},
  saveUser:(id,p)=>{setUsers(users.map(u=>u.id===id?{...u,...p}:u));toast(tr('Saqlandi'))},
  saveProfile:(id,p,msg)=>{setUsers(users.map(u=>u.id===id?{...u,profile:{...u.profile,...p}}:u));toast(msg||tr('Profil saqlandi'))}}
}
