import {useState,useEffect,useLayoutEffect,useMemo,useRef} from 'react'
import {flushSync} from 'react-dom'
import {FilePick,Av,Ic,JobIcon,HeroArt,Count,ScrollFx,Cursor,ThemeToggle,MasterPicker,PhotoEditor,ini} from './extras.jsx'
import {ST,fmt,nowMin,digits,SLOTS,isBusy,dstr,freeLabel,nextFree} from './store.js'
import {useStore} from './store.js'

const F=({l,e,...p})=>(<><label>{l}</label><input {...p}/>{e&&<div className="err">{e}</div>}</>)
const Check=()=>(<svg className="chk" viewBox="0 0 96 96" width="96" height="96" aria-hidden="true"><rect x="10" y="10" width="76" height="76" rx="24" fill="var(--y)" transform="rotate(-8 48 48)"/><path className="ck" d="M30 50l12 12 24-26" fill="none" stroke="#10263b" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/></svg>)
const TEAM=[['Abduvohidov Ibrohim','Loyiha rahbari'],['Abduvohidov Ibrohim','Dasturchi'],['Abduvohidov Ibrohim','Dizayner']]
const FAQ=[['Buyurtmani qanday beraman?','Ustani tanlang, xizmat, manzil va bo‘sh vaqtni belgilang. Usta buyurtmani qabul qilgach, holatini kabinetda kuzatasiz.'],['Usta band bo‘lsa-chi?','Band vaqtlar ro‘yxatda o‘chirilgan holda ko‘rinadi, shuning uchun bir vaqtga ikki kishi buyurtma bera olmaydi.'],['Narx qanday aniqlanadi?','Narx — ustaning e’lon qilgan xizmat narxi. Yakuniy tafsilotlarni usta bilan chatda kelishib olasiz.'],['Usta bilan qanday gaplashaman?','Usta kartasidagi “Xabar yozish” yoki buyurtmadagi “Chat” tugmasi orqali.'],['Usta sifatida qanday qo‘shilaman?','“Ro‘yxatdan o‘tish” bo‘limida “Men ustaman” ni tanlab, kasbingiz va narxlaringizni kiriting.']]
const Badge=({s})=><span className={'bd s'+s}>{ST[s]}</span>
const Rate=({m})=>m.r?<>★ {m.r}</>:<>Yangi</>
const Empty=({t,s,children})=>(<div className="empty"><svg className="ei" viewBox="0 0 120 90" width="120" height="90" aria-hidden="true"><rect x="14" y="34" width="92" height="50" rx="14" fill="var(--y)"/><rect x="14" y="34" width="92" height="12" rx="6" fill="#10263b" opacity=".18"/><path d="M40 20l12 12M80 20L68 32M60 10v22" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round"/><circle cx="60" cy="60" r="10" fill="var(--card)" stroke="#10263b" strokeWidth="4"/></svg><h3>{t}</h3><p className="sub">{s}</p>{children}</div>)

function Card({m,open,S}){
 const fav=!!S.me?.fav?.includes(m.id),fl=freeLabel(S.orders,m.id),go=()=>{location.hash='usta/'+m.id}
 return(<article className="card hc" tabIndex={0} onClick={go} onKeyDown={e=>e.key==='Enter'&&go()}>
 <span role="button" tabIndex={0} aria-label="Sevimlilarga qo‘shish" className={'fv'+(fav?' on':'')} onClick={e=>{e.stopPropagation();S.toggleFav(m.id)}} onKeyDown={e=>e.key==='Enter'&&(e.stopPropagation(),S.toggleFav(m.id))}><svg width="24" height="24" viewBox="0 0 24 24" fill={fav?'currentColor':'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3 5 6.5 5c2 0 3.6 1.1 5.5 3 1.9-1.9 3.5-3 5.5-3C21 5 22.8 8.6 21.5 11.8 19.5 16.4 12 21 12 21z"/></svg></span>
 <div className="hc1"><div className="hav" style={{background:m.c}}>{m.ph?<img src={m.ph} alt={m.name} draggable="false"/>:ini(m.name)}</div>
 <div className="hin"><h3>{m.name}</h3><span className="job"><JobIcon job={m.job} s={14} sw={2.2}/>{m.job}</span>
 <div className="hm"><span className="rt"><Rate m={m}/>{m.rv.length>0&&<small> ({m.rv.length} sharh)</small>}</span>{m.x>=8&&<b className="vb">✓ Tasdiqlangan</b>}</div></div></div>
 <div className="hc2"><small><b>{m.x} yil</b> tajriba · {m.a}</small>
 <div className="tags">{m.s.slice(0,3).map(x=><span key={x[0]}>{x[0]}</span>)}</div>
 <small className={'fr'+(fl.startsWith('Bugun')?' t':'')}>● Eng yaqin bo‘sh vaqt: {fl}</small></div>
 <div className="price"><span><small>dan</small><br/><b>{fmt(m.p)}</b></span><span className="ca"><button className="btn g sm" onClick={e=>{e.stopPropagation();go()}}>Profil</button><button className="btn y sm" onClick={e=>{e.stopPropagation();open(m)}}>Buyurtma</button></span></div></article>)}

function Modal({m,close,S}){
 const [step,setStep]=useState(1),[pr,setPr]=useState(0),[f,setF]=useState({svc:'',problem:'',address:'',date:'',slot:'',img:'',promo:''}),[er,setEr]=useState({})
 const set=k=>e=>setF({...f,[k]:e.target.value}),sv=f.svc!==''?m.s[+f.svc]:null,client=S.me&&S.me.role==='client'
 const send=()=>{const e={}
  if(!sv)e.svc='Xizmat turini tanlang'
  if(f.problem.trim().length<5)e.problem='Muammoni qisqacha yozing'
  if(f.address.trim().length<4)e.address='Manzilni kiriting'
  if(!f.date)e.time='Sanani tanlang';else if(!f.slot)e.time='Bo‘sh vaqtni tanlang'
  setEr(e);if(Object.keys(e).length)return
  const r=S.place({mid:m.id,svc:sv[0],price:Math.round(sv[1]*(1-pr)),img:f.img,promo:pr?f.promo.trim().toUpperCase():'',problem:f.problem,address:f.address,time:f.date+'T'+f.slot});if(r){setEr({time:r});return}setStep(2)}
 const today=nowMin().slice(0,10)
 const Er=k=>er[k]?<div className="err">{er[k]}</div>:null
 return(<div className="ov" onClick={e=>e.target===e.currentTarget&&close()}><div className="md" role="dialog" aria-modal="true">
 {step===2?<div className="ok-box"><Check/><h2>Buyurtma yuborildi</h2><p className="sub">{m.name} buyurtmangizni ko‘rib chiqadi. Holatini kabinetda kuzating.</p><div className="row"><button className="btn g" onClick={close}>Yopish</button><a className="btn y" style={{textAlign:'center',textDecoration:'none'}} href="#cabinet" onClick={close}>Kabinetga</a></div></div>:<>
 <div className="mh"><div className="av"><Av m={m}/></div><div><h3>{m.name}</h3><span className="job">{m.job}</span><br/><small><Rate m={m}/> · {m.rv.length} sharh</small></div><button className="x" onClick={close} aria-label="Yopish">✕</button></div>
 <div className="mb">{step===0?<>
  <div className="kv"><div><small>Tajriba</small>{m.x} yil</div><div><small>Boshlang‘ich narx</small>{fmt(m.p)}</div><div><small>Hudud</small>{m.a.split(',')[0]}</div></div>
  <p style={{margin:'0 0 10px'}}><b>Hududlari:</b> {m.a}</p>
  <h3 style={{margin:'14px 0 4px'}}>Xizmatlar</h3>{m.s.map(s=><div className="sv" key={s[0]}><span>{s[0]}</span><b>{fmt(s[1])}</b></div>)}
  <h3 style={{margin:'18px 0 4px'}}>Mijozlar sharhi</h3>
  {m.rv.length?m.rv.slice(-3).map(o=><div className="sv" key={o.id}><span><b>{o.review.by}</b><br/><small style={{color:'var(--mut)'}}>{o.review.text||'—'}</small></span><b style={{color:'#e5a800'}}>{'★'.repeat(o.review.stars)}</b></div>):<p className="sub">Hozircha sharh yo‘q.</p>}
  <div className="row"><button className="btn g" onClick={close}>Orqaga</button>{client&&<button className="btn g" onClick={()=>{S.openChat(S.me.id,m.id);close();location.hash='chat'}}>Xabar yozish</button>}<button className="btn y" onClick={()=>setStep(1)}>Buyurtma berish</button></div></>:!client?<>
  <Empty t={S.me?'Faqat mijozlar buyurtma beradi':'Avval tizimga kiring'} s={S.me?'Siz usta sifatida kirgansiz. Buyurtma berish uchun mijoz hisobi kerak.':'Buyurtma berish uchun mijoz sifatida kiring yoki ro‘yxatdan o‘ting.'}>
  {!S.me&&<div className="row"><a className="btn" href="#login" onClick={close} style={{textAlign:'center',textDecoration:'none'}}>Kirish</a><a className="btn y" href="#register" onClick={close} style={{textAlign:'center',textDecoration:'none'}}>Ro‘yxatdan o‘tish</a></div>}</Empty></>:<>
  <label>Xizmat turi</label><select value={f.svc} onChange={set('svc')}><option value="">Tanlang…</option>{m.s.map((s,i)=><option key={i} value={i}>{s[0]} — {fmt(s[1])}</option>)}</select>{Er('svc')}
  <label>Muammo tavsifi</label><textarea rows="3" value={f.problem} onChange={set('problem')} placeholder="Masalan: oshxonadagi kran oqyapti"/>{Er('problem')}<label>Muammo rasmi (ixtiyoriy)</label><FilePick label={f.img?'Rasmni almashtirish':'Rasm yuklash'} onFiles={async fs=>{if(fs[0]){const d=await readImg(fs[0]);setF(v=>({...v,img:d}))}}}/>{f.img&&<img className="thumb" src={f.img} alt="Muammo rasmi"/>}
  <label>Manzil</label><input value={f.address} onChange={set('address')} placeholder="Tuman, ko‘cha, uy"/>{Er('address')}
  <SlotPicker S={S} mid={m.id} date={f.date} slot={f.slot} setDate={v=>setF(x=>({...x,date:v}))} setSlot={v=>setF(x=>({...x,slot:v}))}/>{Er('time')}
  <label>Promo-kod</label><div className="pr"><input value={f.promo} onChange={set('promo')} placeholder="Masalan: USTA10"/><button type="button" className="btn g sm" onClick={()=>{const d=PROMO[f.promo.trim().toUpperCase()];setPr(d||0);S.toast(d?'Promo-kod qo‘llandi: −'+Math.round(d*100)+'%':'Bunday promo-kod yo‘q')}}>Qo‘llash</button></div>
  <div className="est"><span>Taxminiy narx{pr>0&&' (−'+Math.round(pr*100)+'%)'}</span><span>{sv?fmt(Math.round(sv[1]*(1-pr))):'Xizmatni tanlang'}</span></div>
  <div className="row"><button className="btn g" onClick={close}>Orqaga</button><button className="btn" onClick={send}>Yuborish</button></div></>}</div></>}
 </div></div>)}

function Masters({S,job,setJob,init}){
 const [q,setQ]=useState(init||''),[sort,setSort]=useState('def'),[sel,setSel]=useState(null),[rt,setRt]=useState(0),[mp,setMp]=useState(0),[td,setTd]=useState(false)
 const [ld,setLd]=useState(true)
 useEffect(()=>{const t=setTimeout(()=>setLd(false),450);return()=>clearTimeout(t)},[])
 const jobs=['Hammasi',...new Set(S.masters.map(m=>m.job))]
 const list=useMemo(()=>S.masters.filter(m=>(job==='Hammasi'||m.job===job)&&m.name.toLowerCase().includes(q.trim().toLowerCase())&&m.r>=rt&&(!mp||m.p<=mp)&&(!td||freeLabel(S.orders,m.id).startsWith('Bugun'))).sort((a,b)=>sort==='r'?b.r-a.r:sort==='p'?a.p-b.p:sort==='x'?b.x-a.x:0),[S.masters,S.orders,q,job,sort,rt,mp,td])
 return(<div className="w pg"><h2>Ustalar</h2><p className="sub">{S.masters.length} ta usta ro‘yxatda. Kasbni tanlang yoki ism bo‘yicha qidiring.</p>
 <div className="sb" style={{boxShadow:'none',border:'1.5px solid var(--line)',background:'var(--card)',maxWidth:'100%',marginBottom:16}}><input style={{color:'var(--ink)'}} value={q} onChange={e=>setQ(e.target.value)} placeholder="Usta ismini yozing…" aria-label="Qidirish"/></div>
 <div className="chips">{jobs.map(j=><button key={j} className={'chip'+(job===j?' on':'')} aria-pressed={job===j} onClick={()=>setJob(j)}>{j}</button>)}
 <select value={sort} onChange={e=>setSort(e.target.value)} aria-label="Saralash"><option value="def">Saralash: odatiy</option><option value="r">Reyting bo‘yicha</option><option value="p">Arzonroq avval</option><option value="x">Tajriba bo‘yicha</option></select></div>
 <div className="chips"><button className={'chip'+(td?' on':'')} aria-pressed={td} onClick={()=>setTd(!td)}>● Bugun bo‘sh</button><select style={{marginLeft:0}} value={rt} onChange={e=>setRt(+e.target.value)} aria-label="Reyting"><option value={0}>Reyting: hammasi</option><option value={4.5}>4.5 va yuqori</option><option value={4.8}>4.8 va yuqori</option></select><select style={{marginLeft:0}} value={mp} onChange={e=>setMp(+e.target.value)} aria-label="Narx"><option value={0}>Narx: hammasi</option><option value={70000}>70 000 gacha</option><option value={100000}>100 000 gacha</option><option value={150000}>150 000 gacha</option></select></div>
 <div className="grid">{ld?Array.from({length:6},(_,i)=><div className="card sk" key={i}><div className="ph"/><div className="cb"><i/><i/><i/></div></div>):list.length?list.map(m=><Card key={m.id} m={m} open={setSel} S={S}/>):<div className="empty" style={{gridColumn:'1/-1'}}><h3>Hech narsa topilmadi</h3><p className="sub">Boshqa ism yozing yoki filtrni tozalang.</p><button className="btn y" onClick={()=>{setQ('');setJob('Hammasi')}}>Filtrni tozalash</button></div>}</div>
 {sel&&<Modal m={S.masters.find(x=>x.id===sel.id)} close={()=>setSel(null)} S={S}/>}</div>)}

function Home({S,setJob,setQs}){
 const [sel,setSel]=useState(null),[qk,setQk]=useState(false),jobs=[...new Set(S.masters.map(m=>m.job))],top=[...S.masters].sort((a,b)=>b.r-a.r).slice(0,4)
 const done=S.orders.filter(o=>o.status===2).length,cl=S.users.filter(u=>u.role==='client').length
 return(<main>
 <div className="hero"><div className="w"><div><h1>Uyingizdagi har bir muammoga usta bor.</h1>
 <p>Tekshirilgan ustalar, aniq narxlar va buyurtma holatini kuzatish — hammasi bir joyda.</p>
 <HeroSearch S={S} setQs={setQs} setJob={setJob}/>
 <div className="row" style={{maxWidth:560,flexWrap:'wrap'}}><button className="btn" style={{padding:'14px 20px',background:'#fff',color:'#10263b'}} onClick={()=>setQk(true)}><svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true"><path d="M8 0L0 9h5l-1 7 8-9H7z" fill="#10263b"/></svg>Tezkor chaqiruv</button><a className="btn" style={{textAlign:'center',textDecoration:'none',padding:'14px 20px'}} href="#masters">Usta topish</a><a className="btn" style={{textAlign:'center',textDecoration:'none',padding:'14px 20px',background:'#fff',color:'#10263b'}} href="#register">Usta bo‘lib qo‘shilish</a></div></div>
 <div className="hcol"><div className="hv"><HeroArt/><span className="hf hf1"><b>★ 4.9</b> Aziz K. · Santexnik</span><span className="hf hf2"><i/>Bugun bo‘sh</span><span className="hf hf3">✓ Tasdiqlangan</span></div>
 <div className="stats"><div><strong><Count to={S.masters.length}/></strong><span>usta</span></div><div><strong><Count to={jobs.length}/></strong><span>kasb turi</span></div><div><strong><Count to={cl}/></strong><span>mijoz</span></div><div><strong><Count to={done}/></strong><span>bajarilgan ish</span></div></div></div></div></div>
 <div className="w"><section className="s"><h2>Kasblar</h2><p className="sub">Kerakli yo‘nalishni tanlang.</p><div className="cats">{jobs.map(j=><button key={j} className="cat" onClick={()=>{setJob(j);location.hash='masters'}}><i><JobIcon job={j} s={24}/></i><span><b>{j}</b><small>{S.masters.filter(m=>m.job===j).length} usta</small></span></button>)}</div></section>
 <section className="s"><h2>Eng yuqori baholilar</h2><p className="sub">Reyting bo‘yicha birinchi ustalar.</p><div className="grid">{top.map(m=><Card key={m.id} m={m} open={setSel} S={S}/>)}</div></section>
 <section className="s"><h2>Qanday ishlaydi?</h2><p className="sub">Uch qadamda usta chaqiring.</p><div className="steps"><div><Ic n="userplus" s={34} className="si"/><h3>Ro‘yxatdan o‘ting</h3><p>Mijoz sifatida hisob oching.</p></div><div><Ic n="calcheck" s={34} className="si"/><h3>Ustani tanlab buyurtma bering</h3><p>Xizmat, manzil va vaqtni yozing.</p></div><div><Ic n="track" s={34} className="si"/><h3>Holatni kuzating</h3><p>Usta qabul qiladi, ish bajariladi, siz baho berasiz.</p></div></div></section>
 <section className="s"><h2>Ko‘p so‘raladigan savollar</h2><p className="sub">Qisqa javoblar.</p><div className="faq">{FAQ.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section>
 <section className="s"><div className="cta"><Ic n="wrench" s={260} sw={.6} className="cta-art"/><div><h2>Ustamisiz? Mijozlar sizni kutmoqda</h2><p style={{margin:'6px 0 0',opacity:.8}}>Profil oching, xizmat narxlarini qo‘ying va buyurtmalarni qabul qiling.</p></div><a className="btn y" style={{textDecoration:'none',padding:'14px 24px'}} href="#register">Usta sifatida ro‘yxatdan o‘tish</a></div></section></div>
 {sel&&<Modal m={S.masters.find(x=>x.id===sel.id)} close={()=>setSel(null)} S={S}/>}{qk&&<Quick S={S} close={()=>setQk(false)}/>}</main>)}

function Auth({S,mode}){
 const reg=mode==='register',[role,setRole]=useState('client'),[f,setF]=useState({name:'',phone:'',pass:'',job:'',exp:'',area:'',price:''}),[er,setEr]=useState({}),set=k=>e=>setF({...f,[k]:e.target.value})
 const go=()=>{const e={}
  if(reg&&f.name.trim().length<2)e.name='Ismingizni kiriting'
  if(digits(f.phone).length<9)e.phone='Telefon raqamini to‘liq kiriting'
  if(f.pass.length<4)e.pass='Parol kamida 4 ta belgi bo‘lsin'
  if(reg&&role==='master'){if(f.job.trim().length<3)e.job='Kasbingizni yozing';if(!(+f.exp>=0&&f.exp!==''&&+f.exp<=60))e.exp='Tajribani yillarda kiriting';if(f.area.trim().length<2)e.area='Hududni kiriting';if(!(+f.price>=10000))e.price='Narx kamida 10 000 so‘m'}
  setEr(e);if(Object.keys(e).length)return
  const m=reg?S.reg({role,...f}):S.login(f.phone,f.pass)
  if(m)setEr({form:m});else location.hash='cabinet'}
 const demo=(p)=>{S.login(p,'1234');location.hash='cabinet'}
 return(<div className="w pg"><div className="authw"><aside className="aart"><HeroArt/><h3>{reg?'Usta yoki mijoz — hammasi bir joyda':'Qaytganingizdan xursandmiz!'}</h3><p>{reg?'Hisob oching va buyurtmalarni bir joydan boshqaring.':'Buyurtmalar, xabarlar va profilingiz sizni kutmoqda.'}</p></aside><div className="auth"><div className="box"><h2>{reg?'Ro‘yxatdan o‘tish':'Tizimga kirish'}</h2><p className="sub">{reg?'Hisob turini tanlang.':'Telefon raqam va parolingizni kiriting.'}</p>
 {reg&&<div className="seg"><button className={role==='client'?'on':''} onClick={()=>setRole('client')}>Men mijozman</button><button className={role==='master'?'on':''} onClick={()=>setRole('master')}>Men ustaman</button></div>}
 {reg&&<F l="Ism familiya" value={f.name} onChange={set('name')} e={er.name}/>}
 <F l="Telefon" type="tel" placeholder="90 123 45 67" value={f.phone} onChange={set('phone')} e={er.phone}/>
 <F l="Parol" type="password" value={f.pass} onChange={set('pass')} e={er.pass}/>
 {reg&&role==='master'&&<><F l="Kasbingiz" list="jl" placeholder="Masalan: Santexnik" value={f.job} onChange={set('job')} e={er.job}/><datalist id="jl">{[...new Set(S.masters.map(m=>m.job))].map(j=><option key={j} value={j}/>)}</datalist>
 <div className="two"><div><F l="Tajriba (yil)" type="number" min="0" value={f.exp} onChange={set('exp')} e={er.exp}/></div><div><F l="Boshlang‘ich narx (so‘m)" type="number" value={f.price} onChange={set('price')} e={er.price}/></div></div>
 <F l="Ishlaydigan hududlar" placeholder="Chilonzor, Yunusobod" value={f.area} onChange={set('area')} e={er.area}/></>}
 {er.form&&<div className="err" style={{marginTop:10}}>{er.form}</div>}
 <div className="row"><button className="btn y" onClick={go}>{reg?'Hisob ochish':'Kirish'}</button></div>
 <p className="sub" style={{marginTop:14,marginBottom:0}}>{reg?<>Hisobingiz bormi? <a href="#login">Kirish</a></>:<>Hisobingiz yo‘qmi? <a href="#register">Ro‘yxatdan o‘tish</a></>}</p>
 {!reg&&<div className="demo"><div className="demo-h"><i><Ic n="bolt" s={18}/></i><span><b>Demo uchun tez kirish</b><small>parol: 1234</small></span></div>
 <div className="dq"><button className="dq-b" onClick={()=>demo('900000000')}><i style={{background:'#cfe3ff'}}>DM</i><span><b>Demo mijoz</b><small>Buyurtma beradi</small></span></button><button className="dq-b" onClick={()=>demo('901000001')}><i style={{background:'#ffe9a8'}}>AK</i><span><b>Demo usta</b><small>Aziz Karimov</small></span></button></div>
 <MasterPicker list={S.masters.filter(m=>/^m\d{1,2}$/.test(m.id))} onPick={m=>demo(S.users.find(u=>u.id===m.id)?.phone)}/>
 <div className="demo-t"><button type="button" onClick={S.seedDemo}>Demo ma‘lumot yaratish</button><button type="button" onClick={S.clearDemo}>Tozalash</button></div></div>}</div></div></div></div>)}

function OrderCard({o,S,side}){
 const m=S.masters.find(x=>x.id===o.mid),[rv,setRv]=useState({s:5,t:''}),[mode,setMode]=useState(null),[rp,setRp]=useState('')
 return(<div className="ord"><div className="av">{side==='m'?<div className="mono" style={{background:'#e8eefc'}}><span>{o.cname[0].toUpperCase()}</span></div>:m&&<Av m={m}/>}</div>
 <div><h3>{side==='m'?o.cname:m?.name} · {o.svc}</h3><small>{side==='m'&&<>Tel: +998 {o.cphone} · </>}Manzil: {o.address}</small><small>Vaqt: {o.time.replace('T',' ')} · {o.problem}</small>
 {o.status<3&&<div className="tr" aria-label={ST[o.status]}>{[0,1,2].map(i=><i key={i} className={o.status>=i?'f':''}/>)}</div>}{o.img&&<img className="thumb" src={o.img} alt="Muammo rasmi"/>}{o.promo&&<small>Promo-kod: {o.promo}</small>}{o.reason&&<small>Bekor sababi: {o.reason}</small>}{o.paid&&<small>To‘langan: {o.paid}</small>}{o.review&&<small>Sharh: {'★'.repeat(o.review.stars)} {o.review.text}</small>}
 {o.review?.reply&&<small>Usta javobi: {o.review.reply}</small>}{side==='m'&&o.review&&!o.review.reply&&<div className="rv"><input placeholder="Sharhga javob yozing" value={rp} onChange={e=>setRp(e.target.value)}/><button className="btn sm" onClick={()=>rp.trim()&&S.reply(o.id,rp)}>Javob</button></div>}{side==='c'&&o.status===2&&!o.review&&<div className="rv"><select value={rv.s} onChange={e=>setRv({...rv,s:+e.target.value})}>{[5,4,3,2,1].map(n=><option key={n} value={n}>{'★'.repeat(n)}</option>)}</select><input placeholder="Sharh yozing" value={rv.t} onChange={e=>setRv({...rv,t:e.target.value})}/><button className="btn sm" onClick={()=>S.review(o.id,rv.s,rv.t)}>Yuborish</button></div>}</div>
 <div style={{textAlign:'right'}}><Badge s={o.status}/><br/><b>{fmt(o.price)}</b>
 <div className="acts"><button className="btn g sm" onClick={()=>{S.openChat(o.cid,o.mid);location.hash='chat'}}>Chat</button>{side==='c'&&o.status<2&&<><button className="btn g sm" onClick={()=>setMode('move')}>Vaqtni o‘zgartirish</button><button className="btn no sm" onClick={()=>setMode('cancel')}>Bekor qilish</button></>}{side==='c'&&o.status===2&&!o.paid&&<button className="btn ok sm" onClick={()=>setMode('pay')}>To‘lash</button>}
 {side==='m'&&o.status===0&&<><button className="btn ok sm" onClick={()=>S.setStatus(o.id,1)}>Qabul qilish</button><button className="btn no sm" onClick={()=>S.setStatus(o.id,3)}>Rad etish</button></>}
 {side==='m'&&o.status===1&&<button className="btn ok sm" onClick={()=>S.setStatus(o.id,2)}>Bajarildi</button>}</div></div>{mode&&<OrderPanel o={o} S={S} mode={mode} close={()=>setMode(null)}/>}</div>)}

function Chat({S}){
 const me=S.me,box=useRef(null),[tx,setTx]=useState(''),th=S.th,K=x=>x.cid+'|'+x.mid
 const mine=S.msgs.filter(x=>me.role==='client'?x.cid===me.id:x.mid===me.id),T={}
 mine.forEach(x=>{const e=T[K(x)]||(T[K(x)]={cid:x.cid,mid:x.mid,n:0});e.last=x;if(x.from!==me.role&&!x.read)e.n++})
 if(th&&!T[K(th)])T[K(th)]={cid:th.cid,mid:th.mid,n:0}
 const list=Object.values(T).sort((a,b)=>(b.last?.t||Infinity)-(a.last?.t||Infinity)),cur=th&&T[K(th)]?th:null
 const nm=t=>S.users.find(u=>u.id===(me.role==='client'?t.mid:t.cid))?.name||'—',pic=t=>me.role==='client'?S.users.find(u=>u.id===t.mid)?.profile?.photo:'',conv=cur?mine.filter(x=>K(x)===K(cur)):[]
 useEffect(()=>{if(cur)S.markRead(cur.cid,cur.mid);box.current?.scrollTo(0,1e9)},[S.msgs.length,th])
 const go=()=>{if(cur&&tx.trim()){S.send(cur.cid,cur.mid,tx);setTx('')}}
 return(<div className="w pg"><h2>Xabarlar</h2><p className="sub">Usta va mijoz o‘rtasidagi suhbat.</p>
 <div className={'chat'+(cur?' open':'')}><aside>{list.length?list.map(t=><button key={K(t)} className={'th'+(cur&&K(cur)===K(t)?' on':'')} onClick={()=>S.setTh({cid:t.cid,mid:t.mid})}><i>{pic(t)?<img src={pic(t)} alt=""/>:nm(t)[0]}</i><span><b>{nm(t)}</b><small>{t.last?.text||'Yangi suhbat'}</small></span>{t.n>0&&<em>{t.n}</em>}</button>):<p className="sub" style={{padding:16}}>Suhbat yo‘q. Usta kartasidan “Xabar yozish” ni bosing.</p>}</aside>
 <section>{cur?<><div className="chh"><button className="btn g sm back" onClick={()=>S.setTh(null)}>←</button><b>{nm(cur)}</b></div>
 <div className="msgs" ref={box}>{conv.length?conv.map(x=><div key={x.id} className={'msg'+(x.from===me.role?' me':'')}>{x.text}<small>{x.auto&&'avto-javob · '}{new Date(x.t).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}</small></div>):<p className="sub" style={{textAlign:'center'}}>Birinchi xabarni yozing</p>}</div>
 <div className="cin"><input value={tx} onChange={e=>setTx(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()} placeholder="Xabar yozing…" aria-label="Xabar"/><button className="btn y" onClick={go}>Yuborish</button></div></>:<div className="empty" style={{margin:'auto'}}>Suhbatni tanlang</div>}</section></div></div>)}

function Settings({S}){
 const me=S.me,[f,setF]=useState({name:me.name,phone:me.phone}),[p,setP]=useState({o:'',n:'',c:''}),[e1,setE1]=useState(''),[e2,setE2]=useState('')
 const info=()=>{if(f.name.trim().length<2)return setE1('Ismingizni kiriting');if(digits(f.phone).length<9)return setE1('Telefon raqamini to‘liq kiriting');setE1(S.updAccount(me.id,f)||'')}
 const pass=()=>{if(p.n.length<4)return setE2('Yangi parol kamida 4 ta belgi bo‘lsin');if(p.n!==p.c)return setE2('Parollar mos kelmadi');const r=S.changePass(me.id,p.o,p.n);setE2(r||'');if(!r)setP({o:'',n:'',c:''})}
 return(<div className="two" style={{alignItems:'start'}}><div className="box"><h3 style={{marginTop:0}}>Shaxsiy ma’lumotlar</h3><F l="Ism familiya" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/><F l="Telefon" type="tel" value={f.phone} onChange={e=>setF({...f,phone:e.target.value})}/>{e1&&<div className="err">{e1}</div>}<div className="row"><button className="btn y" onClick={info}>Saqlash</button></div></div>
 <div className="box"><h3 style={{marginTop:0}}>Parolni o‘zgartirish</h3><F l="Joriy parol" type="password" value={p.o} onChange={e=>setP({...p,o:e.target.value})}/><F l="Yangi parol" type="password" value={p.n} onChange={e=>setP({...p,n:e.target.value})}/><F l="Yangi parolni takrorlang" type="password" value={p.c} onChange={e=>setP({...p,c:e.target.value})}/>{e2&&<div className="err">{e2}</div>}<div className="row"><button className="btn y" onClick={pass}>Parolni yangilash</button></div></div></div>)}

function FavList({S}){
 const [sel,setSel]=useState(null),l=S.masters.filter(m=>S.me.fav?.includes(m.id))
 return l.length?<><div className="grid">{l.map(m=><Card key={m.id} m={m} open={setSel} S={S}/>)}</div>{sel&&<Modal m={S.masters.find(x=>x.id===sel.id)} close={()=>setSel(null)} S={S}/>}</>:<Empty t="Sevimli ustalar yo‘q" s="Usta kartasidagi ♥ belgisini bosing."><a className="btn y" style={{textDecoration:'none'}} href="#masters">Usta topish</a></Empty>}

function About({S}){
 return(<div className="w pg"><h2>Biz haqimizda</h2><p className="sub" style={{maxWidth:640}}>Ustabor — uy ta’miri va maishiy xizmatlar uchun mijoz va ustalarni bir joyda uchrashtiradigan platforma. Maqsadimiz: ishonchli ustani topishni oddiy, narxlarni aniq, jarayonni esa shaffof qilish.</p>
 <div className="kp"><div><strong><Count to={S.masters.length}/></strong><span>usta</span></div><div><strong><Count to={new Set(S.masters.map(m=>m.job)).size}/></strong><span>kasb turi</span></div><div><strong><Count to={S.orders.filter(o=>o.status===2).length}/></strong><span>bajarilgan ish</span></div></div>
 <section className="s"><h2>Biz nimaga ishonamiz</h2><p className="sub">Platformaning uch tamoyili.</p><div className="steps"><div><Ic n="eye" s={34} className="si"/><h3>Shaffoflik</h3><p>Xizmat narxlari va sharhlar hammaga ochiq.</p></div><div><Ic n="clock" s={34} className="si"/><h3>Qulaylik</h3><p>Bo‘sh vaqtni tanlang, usta bilan chatda kelishing, holatni kuzating.</p></div><div><Ic n="shield" s={34} className="si"/><h3>Ishonch</h3><p>Har bir bajarilgan ishdan keyin mijoz baho va sharh qoldiradi.</p></div></div></section>
 <section className="s"><h2>Jamoa</h2><p className="sub">Ustabor ortida turgan odamlar.</p><div className="cats">{TEAM.map(([n,r],i)=><div className="tm" key={i}><i>{n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</i><b>{n}</b><small>{r}</small></div>)}</div></section>
</div>)}

const ordSort=(a,b)=>(a.status<2?0:1)-(b.status<2?0:1)||(a.status<2?a.time.localeCompare(b.time):b.time.localeCompare(a.time))
function Paged({items,S,side}){const [n,setN]=useState(8);return <>{items.slice(0,n).map(o=><OrderCard key={o.id} o={o} S={S} side={side}/>)}{items.length>n&&<div style={{textAlign:'center',margin:'6px 0 20px'}}><button className="btn g" onClick={()=>setN(n+8)}>Yana ko‘rsatish ({items.length-n})</button></div>}</>}

function Chart7({orders}){
 const days=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);return dstr(d)})
 const v=days.map(d=>orders.filter(o=>o.status===2&&o.time.slice(0,10)===d).reduce((a,o)=>a+o.price,0)),mx=Math.max(...v,1),sum=v.reduce((a,b)=>a+b,0)
 return(<div className="box" style={{marginBottom:24}}><div className="sv" style={{border:0,padding:0,marginBottom:10}}><h3 style={{margin:0}}>Oxirgi 7 kun daromadi</h3><b>{fmt(sum)}</b></div>
 <div className="bars">{days.map((d,i)=><div key={d}><span>{v[i]?Math.round(v[i]/1000)+'k':''}</span><i className={v[i]?'f':''} style={{height:Math.max(4,v[i]/mx*100)}}/><small>{d.slice(8)}.{d.slice(5,7)}</small></div>)}</div></div>)}

const readImg=f=>new Promise(res=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,520/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.72))};im.src=r.result};r.readAsDataURL(f)})
const PROMO={USTA10:.1,DEMO20:.2},CR=['Vaqtim o‘zgardi','Muammo hal bo‘ldi','Boshqa usta topdim','Boshqa sabab']
const NotFound=()=>(<div className="w pg"><div className="nf"><div className="n4">404</div><h2>Sahifa topilmadi</h2><p className="sub">Bu manzil mavjud emas yoki o‘chirilgan.</p><a className="btn y" style={{textDecoration:'none'}} href="#home">Bosh sahifaga</a></div></div>)

function Gate(){
 const [ph,setPh]=useState(()=>matchMedia('(prefers-reduced-motion:reduce)').matches?2:0)
 useEffect(()=>{const a=setTimeout(()=>setPh(p=>p||1),1700);return()=>clearTimeout(a)},[])
 useEffect(()=>{document.body.style.overflow=ph<2?'hidden':'';return()=>{document.body.style.overflow=''}},[ph])
 useLayoutEffect(()=>{const h=document.documentElement;if(ph<1){h.classList.add('gating');return}h.classList.remove('gating');dispatchEvent(new Event('gateopen'))},[ph])
 if(ph>1)return null
 return(<div className={'gate'+(ph?' up':'')} onClick={()=>setPh(1)} onTransitionEnd={e=>e.target===e.currentTarget&&ph&&setPh(2)} role="presentation"><div className="gl"><div className="gk"><i>U</i><b>Ustabor</b></div><p>Kerakli usta — bir bosishda</p><span className="gh">Darvoza ochilmoqda…</span></div><div className="gf"/></div>)}

function Bell({S}){
 const me=S.me,[o,setO]=useState(false),seen=me.seen||0,nm=id=>S.users.find(u=>u.id===id)?.name||'Usta',items=[]
 S.orders.forEach(x=>{const t=x.at||x.id
  if(me.role==='master'&&x.mid===me.id){if(x.status===0)items.push({t,x:'Yangi buyurtma: '+x.cname+' · '+x.svc});if(x.review)items.push({t:x.review.at||t,x:'Yangi sharh: '+'★'.repeat(x.review.stars)+' '+x.cname});if(x.paid)items.push({t,x:'To‘lov olindi: '+fmt(x.price)+' ('+x.paid+')'})}
  if(me.role==='client'&&x.cid===me.id&&x.status>0&&x.status<4&&(x.status!==2||!x.paid||!x.review))items.push({t,x:nm(x.mid)+['',' buyurtmangizni qabul qildi',' ishni bajardi — to‘lov va baho qoldiring',' buyurtmani rad etdi'][x.status]})})
 if(S.unread)items.push({t:Date.now(),x:S.unread+' ta yangi xabar',h:'chat'})
 items.sort((a,b)=>b.t-a.t);const top=items.slice(0,8),nw=top.filter(i=>i.t>seen).length
 const shut=()=>{setO(false);S.markSeen()}
 return(<div className="bell"><button className="tg" aria-label="Bildirishnomalar" aria-expanded={o} onClick={()=>o?shut():setO(true)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 003.4 0"/></svg></button>{nw>0&&<em>{nw}</em>}
 {o&&<><div className="bo" onClick={shut}/><div className="bp"><h4>Bildirishnomalar</h4>{top.length?top.map((i,k)=><button key={k} className={i.t>seen?'n':''} onClick={()=>{shut();location.hash=i.h||'cabinet'}}>{i.x}</button>):<p>Hozircha yangilik yo‘q.</p>}</div></>}</div>)}

function SlotPicker({S,mid,date,slot,setDate,setSlot,skip}){
 const today=nowMin().slice(0,10),orders=skip?S.orders.filter(o=>o.id!==skip):S.orders
 return(<><label>Sana</label><input type="date" min={today} value={date} onChange={e=>{setDate(e.target.value);setSlot('')}}/>{date&&<><label>Bo‘sh vaqtlar</label><div className="slots">{SLOTS.map(s=>{const bz=isBusy(orders,mid,date,s)||(date===today&&date+'T'+s<nowMin());return <button type="button" key={s} disabled={bz} className={'slot'+(slot===s?' on':'')} onClick={()=>setSlot(s)}>{s}</button>})}</div><small style={{color:'var(--mut)'}}>Band yoki o‘tib ketgan vaqtlar o‘chirilgan</small></>}</>)}

function OrderPanel({o,S,mode,close}){
 const [r,setR]=useState(CR[0]),[d,setD]=useState(o.time.slice(0,10)),[sl,setSl]=useState(''),[er,setEr]=useState(''),[pm,setPm]=useState('Payme'),[busy,setBusy]=useState(false)
 return(<div className="mp">
 {mode==='cancel'&&<><label>Bekor qilish sababi</label><select value={r} onChange={e=>setR(e.target.value)}>{CR.map(x=><option key={x}>{x}</option>)}</select><div className="row"><button className="btn g sm" onClick={close}>Ortga</button><button className="btn no sm" onClick={()=>{S.cancel(o.id,r);close()}}>Bekor qilishni tasdiqlash</button></div></>}
 {mode==='move'&&<><SlotPicker S={S} mid={o.mid} date={d} slot={sl} setDate={setD} setSlot={setSl} skip={o.id}/>{er&&<div className="err">{er}</div>}<div className="row"><button className="btn g sm" onClick={close}>Ortga</button><button className="btn y sm" onClick={()=>{if(!d||!sl)return setEr('Sana va vaqtni tanlang');const x=S.resched(o.id,d+'T'+sl);x?setEr(x):close()}}>Saqlash</button></div></>}
 {mode==='pay'&&<><label>To‘lov usuli</label><div className="chips">{['Payme','Click','Karta','Naqd'].map(x=><button key={x} className={'chip'+(pm===x?' on':'')} onClick={()=>setPm(x)}>{x}</button>)}</div><div className="est"><span>To‘lov summasi</span><span>{fmt(o.price)}</span></div><small style={{color:'var(--mut)'}}>Demo to‘lov: haqiqiy pul yechilmaydi.</small><div className="row"><button className="btn g sm" onClick={close}>Ortga</button><button className="btn y sm" disabled={busy} onClick={()=>{setBusy(true);setTimeout(()=>{S.pay(o.id,pm);close()},1100)}}>{busy?'Jarayonda…':'To‘lash'}</button></div></>}</div>)}

function Quick({S,close}){
 const [f,setF]=useState({job:'',problem:'',address:''}),[er,setEr]=useState(''),[done,setDone]=useState(null),jobs=[...new Set(S.masters.map(m=>m.job))],client=S.me?.role==='client'
 const go=()=>{if(!f.job)return setEr('Kasbni tanlang');if(f.problem.trim().length<5)return setEr('Muammoni qisqacha yozing');if(f.address.trim().length<4)return setEr('Manzilni kiriting')
  const c=S.masters.filter(m=>m.job===f.job).map(m=>({m,n:nextFree(S.orders,m.id)})).filter(x=>x.n).sort((a,b)=>(a.n.date+a.n.slot).localeCompare(b.n.date+b.n.slot)||b.m.r-a.m.r)[0]
  if(!c)return setEr('Hozircha bo‘sh usta topilmadi')
  const sv=c.m.s[0],r=S.place({mid:c.m.id,svc:sv[0],price:sv[1],problem:f.problem,address:f.address,time:c.n.date+'T'+c.n.slot});if(r)return setEr(r);setDone({m:c.m,l:c.n.label,sv})}
 return(<div className="ov" onClick={e=>e.target===e.currentTarget&&close()}><div className="md" role="dialog" aria-modal="true">
 {done?<div className="ok-box"><Check/><h2>Usta topildi</h2><p className="sub"><b>{done.m.name}</b> ({done.m.job}) · {done.l} · {done.sv[0]} — {fmt(done.sv[1])}. Buyurtmangiz yuborildi.</p><div className="row"><button className="btn g" onClick={close}>Yopish</button><a className="btn y" style={{textAlign:'center',textDecoration:'none'}} href="#cabinet" onClick={close}>Kabinetga</a></div></div>:
 <div className="mb" style={{paddingTop:24}}><div style={{display:'flex',alignItems:'center'}}><h2 style={{margin:0}}>⚡ Tezkor chaqiruv</h2><button className="x" onClick={close} aria-label="Yopish">✕</button></div><p className="sub" style={{marginTop:6}}>Eng yaqin bo‘sh ustani biz o‘zimiz tanlaymiz.</p>
 {!client?<div className="row"><a className="btn" style={{textAlign:'center',textDecoration:'none'}} href="#login" onClick={close}>Kirish</a><a className="btn y" style={{textAlign:'center',textDecoration:'none'}} href="#register" onClick={close}>Ro‘yxatdan o‘tish</a></div>:<>
 <label>Kim kerak?</label><select value={f.job} onChange={e=>setF({...f,job:e.target.value})}><option value="">Kasbni tanlang…</option>{jobs.map(j=><option key={j}>{j}</option>)}</select>
 <label>Muammo</label><textarea rows="3" value={f.problem} onChange={e=>setF({...f,problem:e.target.value})} placeholder="Masalan: kran oqyapti"/>
 <label>Manzil</label><input value={f.address} onChange={e=>setF({...f,address:e.target.value})} placeholder="Tuman, ko‘cha, uy"/>{er&&<div className="err">{er}</div>}
 <div className="row"><button className="btn y" onClick={go}>Eng yaqin ustani chaqirish</button></div></>}</div>}</div></div>)}

function HeroSearch({S,setQs,setJob}){
 const [q,setQ]=useState(''),[o,setO]=useState(false),t=q.trim().toLowerCase()
 const jobs=[...new Set(S.masters.map(m=>m.job))].filter(j=>t&&j.toLowerCase().includes(t)).slice(0,4),ms=S.masters.filter(m=>t&&m.name.toLowerCase().includes(t)).slice(0,3)
 return(<form className="hs" onSubmit={e=>{e.preventDefault();setQs(q);setJob('Hammasi');location.hash='masters'}}><div className="sb"><input value={q} onChange={e=>setQ(e.target.value)} onFocus={()=>setO(true)} onBlur={()=>setO(false)} placeholder="Masalan: santexnik" aria-label="Qidirish"/><button>Qidirish</button></div>
 {o&&(jobs.length>0||ms.length>0)&&<div className="sg">{jobs.map(j=><button type="button" key={j} onMouseDown={()=>{setJob(j);setQs('');location.hash='masters'}}><small>Kasb</small>{j}</button>)}{ms.map(m=><button type="button" key={m.id} onMouseDown={()=>{location.hash='usta/'+m.id}}><small>Usta</small>{m.name} · {m.job}</button>)}</div>}</form>)}

function Profile({S,id}){
 const m=S.masters.find(x=>x.id===id),[bk,setBk]=useState(false),[ph,setPh]=useState(null)
 if(!m)return <NotFound/>
 const done=S.orders.filter(o=>o.mid===m.id&&o.status===2).length,fl=freeLabel(S.orders,m.id),own=S.me?.id===m.id,client=S.me?.role==='client',fav=!!S.me?.fav?.includes(m.id)
 const dist=[5,4,3,2,1].map(n=>m.rv.filter(o=>o.review.stars===n).length),mx=Math.max(...dist,1)
 return(<div className="w pg"><a className="bk" href="#masters">← Ustalarga qaytish</a>
 <div className="pf"><div className="cv" style={{background:m.c}}><JobIcon job={m.job} s={150} sw={.7}/></div>
 <div className="pfh"><div className="pa"><Av m={m}/></div><div style={{flex:1,minWidth:200}}><h2 style={{margin:0}}>{m.name}{m.x>=8&&<span className="vb">✓ Tasdiqlangan</span>}</h2><span className="job">{m.job}</span><br/><small style={{color:'var(--mut)'}}><Rate m={m}/> · {m.rv.length} sharh · {done} ta bajarilgan ish</small></div>
 <div className="pfa">{client&&<button className="btn g" onClick={()=>S.toggleFav(m.id)}>{fav?'♥ Sevimli':'♡ Sevimlilarga'}</button>}{client&&<button className="btn g" onClick={()=>{S.openChat(S.me.id,m.id);location.hash='chat'}}>Xabar yozish</button>}{own?<a className="btn y" style={{textDecoration:'none'}} href="#cabinet">Kabinetga</a>:<button className="btn y" onClick={()=>setBk(true)}>Buyurtma berish</button>}</div></div>
 <div className="pcols"><div>
 <h3>Usta haqida</h3><p style={{marginTop:0}}>{m.x} yillik tajribaga ega {m.job.toLowerCase()}. {m.a} hududlarida xizmat ko‘rsatadi.</p>
 <h3 style={{marginTop:22}}>Ish namunalari</h3>{m.g.length?<div className="gal">{m.g.map((src,i)=><img key={i} src={src} alt={'Ish namunasi '+(i+1)} onClick={()=>setPh(src)}/>)}</div>:<p className="sub">Hali ish rasmlari qo‘shilmagan.</p>}
 <h3 style={{marginTop:22}}>Mijozlar sharhi ({m.rv.length})</h3>{m.rv.length?m.rv.slice().reverse().map(o=><div className="rvw" key={o.id}><div className="sv" style={{border:0,padding:0}}><b>{o.review.by}</b><b style={{color:'#e5a800'}}>{'★'.repeat(o.review.stars)}</b></div><div>{o.review.text||'—'}</div>{o.review.reply&&<div className="rpl"><b>Usta javobi:</b> {o.review.reply}</div>}</div>):<p className="sub">Hozircha sharh yo‘q.</p>}
 </div><aside>
 <div className="kv" style={{gridTemplateColumns:'1fr 1fr'}}><div><small>Tajriba</small>{m.x} yil</div><div><small>Narx (dan)</small>{fmt(m.p)}</div><div style={{gridColumn:'1/-1'}}><small>Eng yaqin bo‘sh vaqt</small>{fl}</div></div>
 <h3>Xizmatlar</h3>{m.s.map(s=><div className="sv" key={s[0]}><span>{s[0]}</span><b>{fmt(s[1])}</b></div>)}
 <h3 style={{marginTop:22}}>Reyting</h3>{dist.map((c,i)=><div className="dst" key={i}><span>{5-i}★</span><div><i style={{width:c/mx*100+'%'}}/></div><span>{c}</span></div>)}
 </aside></div></div>
 {bk&&<Modal m={m} close={()=>setBk(false)} S={S}/>}{ph&&<div className="ov" onClick={()=>setPh(null)}><img className="lb" src={ph} alt="Ish namunasi"/></div>}</div>)}

function Gallery({S,me}){
 const g=me.profile.gallery||[]
 const add=async fs=>{const im=await Promise.all(fs.slice(0,6-g.length).map(readImg));if(im.length)S.saveProfile(me.id,{gallery:[...g,...im]})}
 return(<div className="box" style={{gridColumn:'1/-1'}}><h3 style={{marginTop:0}}>Ish rasmlari ({g.length}/6)</h3><p className="sub">Mijozlar profilingizda ko‘radi.</p><div className="gal">{g.map((s,i)=><div key={i} className="gi"><img src={s} alt=""/><button aria-label="O‘chirish" onClick={()=>S.saveProfile(me.id,{gallery:g.filter((_,j)=>j!==i)})}>✕</button></div>)}</div>{g.length<6&&<><label>Rasm qo‘shish</label><FilePick multiple onFiles={fs=>add(fs)} hint={'Yana '+(6-g.length)+' ta rasm qo‘shish mumkin'}/></>}</div>)}

function ClientDash({S}){
 const me=S.me,[tab,setTab]=useState('o'),[nm,setNm]=useState(me.name),mine=S.orders.filter(o=>o.cid===me.id).sort(ordSort)
 return(<div className="w pg"><h2>Salom, {me.name}</h2><p className="sub">Mijoz kabineti</p>
 <div className="kp"><div><strong>{mine.length}</strong><span>jami buyurtma</span></div><div><strong>{mine.filter(o=>o.status<2).length}</strong><span>faol</span></div><div><strong>{mine.filter(o=>o.status===2).length}</strong><span>bajarilgan</span></div></div>
 <div className="tabs"><button className={tab==='o'?'on':''} onClick={()=>setTab('o')}>Buyurtmalarim</button><button className={tab==='p'?'on':''} onClick={()=>setTab('p')}>Sozlamalar</button><button className={tab==='f'?'on':''} onClick={()=>setTab('f')}>Sevimlilar</button></div>
 {tab==='o'?(mine.length?<Paged items={mine} S={S} side="c"/>:<Empty t="Hozircha buyurtma yo‘q" s="Ustani tanlab, birinchi buyurtmangizni bering."><a className="btn y" style={{textDecoration:'none'}} href="#masters">Usta topish</a></Empty>):
 (tab==='f'?<FavList S={S}/>:<Settings S={S}/>)}</div>)}

function MasterDash({S}){
 const me=S.me,p=me.profile,[tab,setTab]=useState('o'),[fl,setFl]=useState(-1),[pf,setPf]=useState({job:p.job,exp:p.exp,area:p.area,price:p.price}),[sv,setSv]=useState({n:'',p:''}),[er,setEr]=useState('')
 const mine=S.orders.filter(o=>o.mid===me.id).sort(ordSort),list=mine.filter(o=>fl<0||o.status===fl),m=S.masters.find(x=>x.id===me.id)
 const earn=mine.filter(o=>o.status===2).reduce((a,o)=>a+o.price,0)
 const save=()=>{if(pf.job.trim().length<3||pf.area.trim().length<2||!(+pf.price>=10000))return setEr('Maydonlarni to‘g‘ri to‘ldiring');setEr('');S.saveProfile(me.id,{job:pf.job.trim(),exp:+pf.exp,area:pf.area.trim(),price:+pf.price})}
 const addSv=()=>{if(sv.n.trim().length<2||!(+sv.p>=1000))return setEr('Xizmat nomi va narxini kiriting');setEr('');S.saveProfile(me.id,{services:[...p.services,[sv.n.trim(),+sv.p]]});setSv({n:'',p:''})}
 return(<div className="w pg"><div className="dh"><div className="dav"><Av m={m}/></div><div><h2 style={{margin:0}}>Usta kabineti</h2><p className="sub" style={{margin:0}}>{me.name} · {p.job}</p></div></div>
 <div className="kp"><div><strong>{mine.filter(o=>o.status===0).length}</strong><span>yangi buyurtma</span></div><div><strong>{mine.filter(o=>o.status===1).length}</strong><span>jarayonda</span></div><div><strong>{mine.filter(o=>o.status===2).length}</strong><span>bajarilgan</span></div><div><strong>{earn.toLocaleString('ru-RU')}</strong><span>daromad (so‘m)</span></div><div><strong>{m.r?m.r:'—'}</strong><span>reyting ({m.rv.length} sharh)</span></div></div>
 <Chart7 orders={mine}/>
 <div className="tabs"><button className={tab==='o'?'on':''} onClick={()=>setTab('o')}>Buyurtmalar</button><button className={tab==='p'?'on':''} onClick={()=>setTab('p')}>Profil va xizmatlar</button><button className={tab==='a'?'on':''} onClick={()=>setTab('a')}>Hisob sozlamalari</button></div>
 {tab==='a'?<Settings S={S}/>:tab==='o'?<><div className="chips">{[[-1,'Hammasi'],[0,'Yangi'],[1,'Jarayonda'],[2,'Bajarilgan']].map(([v,l])=><button key={v} className={'chip'+(fl===v?' on':'')} onClick={()=>setFl(v)}>{l}</button>)}</div>
 {list.length?<Paged items={list} S={S} side="m"/>:<Empty t="Buyurtma yo‘q" s="Mijoz buyurtma berganda shu yerda paydo bo‘ladi."/>}</>:
 <div className="two" style={{alignItems:'start'}}><PhotoEditor m={m} S={S}/><div className="box"><h3 style={{marginTop:0}}>Profil</h3><F l="Kasb" value={pf.job} onChange={e=>setPf({...pf,job:e.target.value})}/><div className="two"><div><F l="Tajriba (yil)" type="number" value={pf.exp} onChange={e=>setPf({...pf,exp:e.target.value})}/></div><div><F l="Narx (dan)" type="number" value={pf.price} onChange={e=>setPf({...pf,price:e.target.value})}/></div></div><F l="Hududlar" value={pf.area} onChange={e=>setPf({...pf,area:e.target.value})}/>{er&&<div className="err">{er}</div>}<div className="row"><button className="btn y" onClick={save}>Saqlash</button></div></div>
 <div className="box"><h3 style={{marginTop:0}}>Xizmatlar</h3>{p.services.map((s,i)=><div className="pl" key={i}><span>{s[0]} — <b>{fmt(s[1])}</b></span><button className="btn no sm" disabled={p.services.length<2} onClick={()=>S.saveProfile(me.id,{services:p.services.filter((_,j)=>j!==i)})}>O‘chirish</button></div>)}
 <div className="two"><div><F l="Yangi xizmat" value={sv.n} onChange={e=>setSv({...sv,n:e.target.value})}/></div><div><F l="Narxi" type="number" value={sv.p} onChange={e=>setSv({...sv,p:e.target.value})}/></div></div><div className="row"><button className="btn" onClick={addSv}>Qo‘shish</button></div></div><Gallery S={S} me={me}/></div>}</div>)}

export default function App(){
 const S=useStore(),[pg,setPg]=useState(()=>location.hash.slice(1)||'home'),[job,setJob]=useState('Hammasi'),me=S.me,[dk,setDk]=useState(()=>document.documentElement.dataset.theme==='dark')
 useEffect(()=>{document.documentElement.dataset.theme=dk?'dark':'light';try{localStorage.setItem('ub_theme',dk?'dark':'light')}catch{}},[dk])
 const flip=e=>{const next=!dk,root=document.documentElement,apply=()=>{root.dataset.theme=next?'dark':'light';flushSync(()=>setDk(next))}
  if(!matchMedia('(prefers-reduced-motion:reduce)').matches&&document.startViewTransition){
   const b=e.currentTarget.getBoundingClientRect(),x=b.left+b.width/2,y=b.top+b.height/2,R=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y))
   const t=document.startViewTransition(apply)
   t.ready.then(()=>root.animate({clipPath:['circle(0px at '+x+'px '+y+'px)','circle('+R+'px at '+x+'px '+y+'px)']},{duration:800,easing:'cubic-bezier(.6,0,.2,1)',pseudoElement:'::view-transition-new(root)'})).catch(()=>{})
  }else{root.classList.add('theming');apply();setTimeout(()=>root.classList.remove('theming'),700)}}
 const [mo,setMo]=useState(false),[qs,setQs]=useState('')
 useEffect(()=>{const k=e=>e.key==='Escape'&&setMo(false);addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[])
 useEffect(()=>{const f=()=>{const h=location.hash.slice(1)||'home';setPg(h);if(h!=='masters')setQs('');setMo(false);window.scrollTo(0,0)};addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[])
 const L=(h,t)=><a href={'#'+h} className={pg===h?'on':''}>{t}</a>
 const cab=!me?<Auth S={S} mode="login"/>:me.role==='master'?<MasterDash S={S}/>:<ClientDash S={S}/>
 return(<div className="app"><Gate/><ScrollFx/><Cursor/><div className="bar">Ustabor — ishonchli ustalar, aniq narxlar</div>
 <header><div className="w"><a className="logo" href="#home" style={{textDecoration:'none',color:'inherit'}}><i>U</i><span>Ustabor</span></a>
 <nav className={mo?'open':''} onClick={()=>setMo(false)}>{L('home','Bosh sahifa')}{L('masters','Ustalar')}{L('about','Biz haqimizda')}{me?<>{L('cabinet','Kabinet')}{L('chat',<>Xabarlar{S.unread>0&&<b>{S.unread}</b>}</>)}<a href="#login" onClick={()=>S.logout()}>Chiqish</a></>:<>{L('login','Kirish')}{L('register','Ro‘yxatdan o‘tish')}</>}</nav>{me&&<Bell S={S}/>}<ThemeToggle dk={dk} flip={flip}/><button className={'bg'+(mo?' on':'')} aria-label="Menyu" aria-expanded={mo} onClick={()=>setMo(!mo)}><i/></button></div></header>
 <div className="page" key={pg.startsWith('usta/')?pg:pg.split('/')[0]}>
 {pg==='masters'?<Masters S={S} job={job} setJob={setJob} init={qs}/>:pg==='login'?(me?cab:<Auth S={S} mode="login"/>):pg==='register'?(me?cab:<Auth S={S} mode="register"/>):pg==='cabinet'?cab:pg==='about'?<About S={S}/>:pg.startsWith('usta/')?<Profile S={S} id={pg.slice(5)}/>:pg==='chat'?(me?<Chat S={S}/>:<Auth S={S} mode="login"/>):pg==='home'?<Home S={S} setJob={setJob} setQs={setQs}/>:<NotFound/>}</div>
 <footer><div className="w"><div className="fg"><div><b>Ustabor</b>Kerakli ustani toping va uyingizga chaqiring.</div><div><b>Mijozlarga</b><a href="#masters">Ustalar</a><a href="#register">Ro‘yxatdan o‘tish</a></div><div><b>Ustalarga</b><a href="#register">Usta bo‘lish</a><a href="#login">Kirish</a></div><div><b>Loyiha</b><a href="#about">Biz haqimizda</a><span>Demo Day 2026</span></div></div></div></footer>
 {S.t&&<div className="toast" role="status"><i>✓</i>{S.t}</div>}</div>)}
