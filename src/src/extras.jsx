import {useState,useEffect,useLayoutEffect,useRef} from 'react'

/* ---------- umumiy yordamchilar ---------- */
const html=()=>document.documentElement
const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches
export const ini=n=>String(n).split(' ').filter(Boolean).map(w=>w[0]).join('').slice(0,2).toUpperCase()

/* Avatar: rasm bo'lsa rasm, bo'lmasa ism-familiya bosh harflari */
export const Av=({m})=>m.ph
 ?<img className="pimg" src={m.ph} alt={m.name} draggable="false"/>
 :<div className="mono" style={{background:m.c}}><span>{ini(m.name)}</span></div>

/* ---------- ikonkalar (24x24, navy chiziq) ---------- */
const P={
 wrench:<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>,
 bolt:<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>,
 saw:<><path d="M3 15l10-10 6 6-10 10H3z"/><path d="M7 11l2 2M10 8l2 2M13 5l2 2"/><circle cx="6.5" cy="17.5" r="1"/></>,
 snow:<><path d="M12 2v20M4.2 7l15.6 10M19.8 7L4.2 17"/><path d="M9.5 3.8L12 6l2.5-2.2M9.5 20.2L12 18l2.5 2.2"/></>,
 washer:<><rect x="4" y="2.5" width="16" height="19" rx="3"/><circle cx="12" cy="13.5" r="4.5"/><path d="M8 6h.01M11 6h.01M16 6h2"/></>,
 roller:<><rect x="3" y="3" width="15" height="6" rx="2"/><path d="M18 6h3v5H11v3"/><rect x="9.5" y="14" width="3" height="7" rx="1.2"/></>,
 tiles:<><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></>,
 lock:<><rect x="4.5" y="10.5" width="15" height="10.5" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.7" r="1.3"/></>,
 spark:<><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3.5M12 18v3.5M2.5 12H6M18 12h3.5M5.3 5.3l2.4 2.4M16.3 16.3l2.4 2.4M18.7 5.3l-2.4 2.4M7.7 16.3l-2.4 2.4"/></>,
 laptop:<><rect x="4" y="4.5" width="16" height="11" rx="2"/><path d="M2 20h20"/></>,
 box:<><rect x="3" y="8" width="18" height="12" rx="2.5"/><path d="M9 8V6.2A1.2 1.2 0 0 1 10.2 5h3.6A1.2 1.2 0 0 1 15 6.2V8M3 13.5h18M11 13.5v2h2v-2"/></>,
 userplus:<><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M19 8v6M16 11h6"/></>,
 calcheck:<><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4"/></>,
 track:<><circle cx="12" cy="12" r="9"/><path d="M8 12.2l3 3 5-6"/></>,
 eye:<><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
 clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
 shield:<><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></>,
 camera:<><path d="M4 8h3l1.6-2.4h6.8L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.6"/></>,
 trash:<><path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13M9 7V4h6v3"/></>,
 crop:<><path d="M6 2v16h16M2 6h16v16"/></>,
 chev:<path d="M6 9l6 6 6-6"/>,
 user:<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
 users:<><circle cx="9" cy="8" r="3.6"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.6 3.6 0 0 1 0 6.8M18 14a6.5 6.5 0 0 1 3.5 6"/></>
}
export const Ic=({n,s=24,sw=1.9,className,style})=>(<svg className={className} style={style} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{P[n]||P.box}</svg>)

const JMAP=[['santex','wrench'],['elektr','bolt'],['durad','saw'],['kondits','snow'],['texnika','washer'],['pardoz','roller'],['plitka','tiles'],['qulf','lock'],['payvand','spark'],['kompyut','laptop']]
export const jobIcon=j=>{const t=String(j||'').toLowerCase();return (JMAP.find(([k])=>t.includes(k))||[0,'box'])[1]}
export const JobIcon=({job,s=22,sw})=><Ic n={jobIcon(job)} s={s} sw={sw}/>

/* ---------- Hero / Auth rasmi: uy + asboblar ---------- */
export const HeroArt=({className=''})=>(<svg className={'art '+className} viewBox="0 0 440 300" role="img" aria-label="Uy va usta asboblari">
 <ellipse cx="226" cy="275" rx="196" ry="13" fill="#10263b" opacity=".16"/>
 <g className="a-spark" fill="#10263b"><path d="M46 56l4 10 10 4-10 4-4 10-4-10-10-4 10-4z"/><path d="M398 40l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/><circle cx="392" cy="130" r="4"/><circle cx="40" cy="120" r="3.5"/></g>
 <rect x="276" y="44" width="34" height="56" fill="#10263b"/>
 <rect x="268" y="38" width="50" height="12" rx="4" fill="#10263b"/>
 <rect x="100" y="128" width="236" height="140" rx="12" fill="#fff" stroke="#10263b" strokeWidth="6"/>
 <path d="M76 136L218 40l142 96z" fill="#10263b" stroke="#10263b" strokeWidth="8" strokeLinejoin="round"/>
 <path d="M96 134L218 52l122 82" fill="none" stroke="#ffc72c" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 14"/>
 <circle cx="218" cy="96" r="15" fill="#cfe3ff" stroke="#fff" strokeWidth="5"/>
 <path d="M218 82v28M204 96h28" stroke="#fff" strokeWidth="3"/>
 <rect x="190" y="186" width="58" height="82" rx="9" fill="#ffc72c" stroke="#10263b" strokeWidth="6"/>
 <circle cx="237" cy="228" r="4.5" fill="#10263b"/>
 <rect x="120" y="160" width="46" height="46" rx="9" fill="#cfe3ff" stroke="#10263b" strokeWidth="6"/>
 <path d="M143 160v46M120 183h46" stroke="#10263b" strokeWidth="4"/>
 <rect x="272" y="160" width="46" height="46" rx="9" fill="#cfe3ff" stroke="#10263b" strokeWidth="6"/>
 <path d="M295 160v46M272 183h46" stroke="#10263b" strokeWidth="4"/>
 <g className="a-wr" transform="translate(304 94) rotate(22) scale(7)"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z" fill="#fff" stroke="#10263b" strokeWidth=".85" strokeLinejoin="round"/></g>
 <g className="a-sd" transform="translate(46 176) rotate(-16)"><rect x="0" y="0" width="22" height="64" rx="9" fill="#2d6cdf" stroke="#10263b" strokeWidth="6"/><path d="M5 18h12M5 30h12" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".7"/><rect x="8" y="62" width="6" height="42" fill="#fff" stroke="#10263b" strokeWidth="5" strokeLinejoin="round"/></g>
 <rect x="20" y="268" width="400" height="12" rx="6" fill="#10263b"/>
 <path d="M30 274h380" stroke="#ffc72c" strokeWidth="4" strokeDasharray="16 14"/>
</svg>)

/* ---------- Raqam sanash animatsiyasi ---------- */
export function Count({to}){
 const [v,setV]=useState(0),cur=useRef(0)
 useEffect(()=>{
  let raf,dead=false
  const go=()=>{const a=cur.current,t0=performance.now(),dur=reduced()?0:1000
   const step=t=>{const p=dur?Math.min(1,(t-t0)/dur):1,e=1-Math.pow(1-p,3);cur.current=Math.round(a+(to-a)*e);setV(cur.current);if(p<1&&!dead)raf=requestAnimationFrame(step)}
   raf=requestAnimationFrame(step)}
  if(html().classList.contains('gating'))addEventListener('gateopen',go,{once:true});else go()
  return()=>{dead=true;cancelAnimationFrame(raf);removeEventListener('gateopen',go)}
 },[to])
 return v
}

/* ---------- Scroll animatsiyalari: paydo bo'lish + progress + parallax ---------- */
const SEL=['.hero .w>div>*:not(.stats)','.hero .stats>div','section.s>*:not(.grid):not(.cats):not(.steps):not(.faq)','.cats>*','.grid>*','.steps>*','.faq>*','.kp>*','.pf','.auth>*','.aart','.pg>h2','.pg>.sub','.tabs','.ord','.box','.chat','.tm','.top','.dh'].join(',')
export function ScrollFx(){
 const bar=useRef()
 useLayoutEffect(()=>{
  const root=document.getElementById('root'),seen=new WeakSet(),pend=new Set()
  let io=null
  if('IntersectionObserver' in window)io=new IntersectionObserver(es=>{es.forEach(e=>{if(!e.isIntersecting)return
    if(html().classList.contains('gating')){pend.add(e.target);return}
    e.target.dataset.in='1';io.unobserve(e.target);pend.delete(e.target)})},{threshold:.08,rootMargin:'0px 0px -6% 0px'})
  const reg=el=>{if(seen.has(el))return;seen.add(el)
   const sib=el.parentElement?[...el.parentElement.children].filter(x=>x.matches(SEL)):[],i=Math.min(Math.max(sib.indexOf(el),0),7)
   el.style.setProperty('--d',i*70+'ms');el.dataset.r='';if(io)io.observe(el);else el.dataset.in='1'}
  const scan=n=>{if(n.nodeType!==1)return;if(n.matches(SEL))reg(n);n.querySelectorAll(SEL).forEach(reg)}
  scan(root)
  const mo=new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(scan)));mo.observe(root,{childList:true,subtree:true})
  const open=()=>{pend.forEach(el=>{io.unobserve(el);io.observe(el)})};addEventListener('gateopen',open)
  let raf=0
  const upd=()=>{raf=0;const y=scrollY,h=document.documentElement.scrollHeight-innerHeight
   if(bar.current)bar.current.style.transform='scaleX('+(h>0?Math.min(1,y/h):0)+')'
   html().style.setProperty('--sy',Math.min(y,900));html().dataset.sc=y>8?'1':''}
  const on=()=>{if(!raf)raf=requestAnimationFrame(upd)}
  addEventListener('scroll',on,{passive:true});addEventListener('resize',on);upd()
  return()=>{mo.disconnect();io&&io.disconnect();removeEventListener('gateopen',open);removeEventListener('scroll',on);removeEventListener('resize',on)}
 },[])
 return <div className="sp" aria-hidden="true"><i ref={bar}/></div>
}

/* ---------- Maxsus kursor ---------- */
export function Cursor(){
 const w=useRef()
 useEffect(()=>{
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return
  const el=w.current,d=el.firstChild,r=el.lastChild,r0=html()
  r0.classList.add('has-cur')
  let x=-100,y=-100,rx=-100,ry=-100,raf=0,vis=false,st='',pr=false
  const k=reduced()?1:.2
  const paint=()=>{el.className='cu'+(vis?' on':'')+(st?' '+st:'')+(pr?' p':'')}
  const setSt=s=>{if(s!==st){st=s;paint()}}
  const loop=()=>{rx+=(x-rx)*k;ry+=(y-ry)*k;r.style.transform=`translate3d(${rx}px,${ry}px,0)`
   raf=(Math.abs(x-rx)>.1||Math.abs(y-ry)>.1)?requestAnimationFrame(loop):0}
  const mv=e=>{x=e.clientX;y=e.clientY;d.style.transform=`translate3d(${x}px,${y}px,0)`
   if(!vis){vis=true;rx=x;ry=y;paint()}
   const t=e.target.closest?e.target:e.target.parentElement
   const txt=t&&t.closest('input,textarea'),hov=t&&t.closest('a,button,[role=button],summary,label,select,.card,.chip,.slot,[data-cur]')
   setSt(txt?'t':hov&&!hov.disabled?'h':'')
   if(!raf)raf=requestAnimationFrame(loop)}
  const dn=()=>{pr=true;paint()},up=()=>{pr=false;paint()}
  const out=e=>{if(!e.relatedTarget){vis=false;paint()}}
  addEventListener('pointermove',mv,{passive:true});addEventListener('pointerdown',dn);addEventListener('pointerup',up);document.addEventListener('mouseout',out)
  return()=>{r0.classList.remove('has-cur');cancelAnimationFrame(raf);removeEventListener('pointermove',mv);removeEventListener('pointerdown',dn);removeEventListener('pointerup',up);document.removeEventListener('mouseout',out)}
 },[])
 return <div className="cu" ref={w} aria-hidden="true"><div className="cu-d"><i/></div><div className="cu-r"><i/></div></div>
}

/* ---------- Kunduzgi / tungi rejim tugmasi ---------- */
export const ThemeToggle=({dk,flip})=>(<button className={'tg th-t'+(dk?' dk':'')} onClick={flip} aria-label="Tungi rejimni almashtirish" aria-pressed={dk} title="Tungi / kunduzgi rejim">
 <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
  <g className="moon"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" fill="currentColor" fillOpacity=".15"/></g>
  <g className="sun"><circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity=".2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/></g>
 </svg></button>)

/* ---------- Demo usta tanlagichi (saytning o'z uslubida) ---------- */
export function MasterPicker({list,onPick}){
 const [o,setO]=useState(false),ref=useRef()
 useEffect(()=>{if(!o)return
  const sc=setTimeout(()=>ref.current?.querySelector('.mpk-p')?.scrollIntoView({block:'nearest',behavior:'smooth'}),60)
  const f=e=>{if(!ref.current?.contains(e.target))setO(false)},k=e=>e.key==='Escape'&&setO(false)
  addEventListener('pointerdown',f);addEventListener('keydown',k)
  return()=>{clearTimeout(sc);removeEventListener('pointerdown',f);removeEventListener('keydown',k)}},[o])
 return(<div className={'mpk'+(o?' open':'')} ref={ref}>
  <button type="button" className="mpk-b" aria-haspopup="listbox" aria-expanded={o} onClick={()=>setO(!o)}>
   <span className="mpk-ic"><Ic n="users" s={18}/></span><span className="mpk-t"><b>Boshqa usta sifatida kirish</b><small>{list.length} ta demo usta</small></span><Ic n="chev" s={18} className="mpk-c"/></button>
  {o&&<div className="mpk-p" role="listbox" aria-label="Demo ustalar">{list.map((m,i)=>(
   <button type="button" role="option" key={m.id} style={{'--i':i}} onClick={()=>{setO(false);onPick(m)}}>
    <span className="mpk-av"><Av m={m}/></span><span className="mpk-n"><b>{m.name}</b><small><JobIcon job={m.job} s={13}/> {m.job}</small></span><span className="mpk-go">→</span></button>))}</div>}
 </div>)
}

/* ---------- Profil rasmi: yuklash, qirqish, almashtirish, o'chirish ---------- */
const SZ=300,OUT=360
function Cropper({src,onSave,onCancel,onOther}){
 const cv=useRef(),[img,setImg]=useState(null),[z,setZ]=useState(1),[o,setO]=useState({x:0,y:0}),dr=useRef(null)
 useEffect(()=>{const i=new Image();i.onload=()=>setImg(i);i.src=src},[src])
 const base=img?SZ/Math.min(img.width,img.height):1
 const clamp=(p,zz)=>{if(!img)return p;const s=base*zz,mx=Math.max(0,(img.width*s-SZ)/2),my=Math.max(0,(img.height*s-SZ)/2);return{x:Math.min(mx,Math.max(-mx,p.x)),y:Math.min(my,Math.max(-my,p.y))}}
 const paint=(c,size,p,zz)=>{const f=size/SZ,s=base*zz,g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,size,size);g.imageSmoothingQuality='high'
  g.drawImage(img,(SZ/2-img.width*s/2+p.x)*f,(SZ/2-img.height*s/2+p.y)*f,img.width*s*f,img.height*s*f)}
 useEffect(()=>{if(img&&cv.current)paint(cv.current,SZ,o,z)},[img,o,z])
 const down=e=>{dr.current={x:e.clientX,y:e.clientY,o,k:SZ/e.currentTarget.getBoundingClientRect().width};e.currentTarget.setPointerCapture(e.pointerId)}
 const move=e=>{const d=dr.current;if(!d)return;setO(clamp({x:d.o.x+(e.clientX-d.x)*d.k,y:d.o.y+(e.clientY-d.y)*d.k},z))}
 const up=()=>{dr.current=null}
 const zoom=v=>{setZ(v);setO(p=>clamp(p,v))}
 const nudge=e=>{const st=12,m={ArrowLeft:[st,0],ArrowRight:[-st,0],ArrowUp:[0,st],ArrowDown:[0,-st]}[e.key];if(m){e.preventDefault();setO(p=>clamp({x:p.x+m[0],y:p.y+m[1]},z))}}
 const save=()=>{const c=document.createElement('canvas');c.width=c.height=OUT;paint(c,OUT,o,z);onSave(c.toDataURL('image/jpeg',.88))}
 return(<div className="ov" onClick={e=>e.target===e.currentTarget&&onCancel()}><div className="md crm" role="dialog" aria-modal="true" aria-label="Rasmni sozlash">
  <div className="mb" style={{paddingTop:22}}><div style={{display:'flex',alignItems:'center'}}><h2 style={{margin:0}}>Rasmni sozlang</h2><button className="x" onClick={onCancel} aria-label="Yopish">✕</button></div>
  <p className="sub" style={{margin:'6px 0 14px'}}>Suring va kattalashtiring — doira ichidagi qism profilingizda ko‘rinadi.</p>
  <div className="crp" data-cur="" tabIndex={0} onKeyDown={nudge} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} aria-label="Rasmni surish uchun sudrang yoki strelka tugmalarini bosing">
   <canvas ref={cv} width={SZ} height={SZ}/>{!img&&<div className="crp-l">Yuklanmoqda…</div>}</div>
  <div className="crz"><span aria-hidden="true">−</span><input type="range" min="1" max="3" step="0.01" value={z} onChange={e=>zoom(+e.target.value)} aria-label="Kattalashtirish"/><span aria-hidden="true">+</span></div>
  <div className="row"><button className="btn g" onClick={onOther}>Boshqa rasm</button><button className="btn y" onClick={save} disabled={!img}>Saqlash</button></div></div></div></div>)
}

export function PhotoEditor({m,S}){
 const [src,setSrc]=useState(null),[ask,setAsk]=useState(false),[hov,setHov]=useState(false),inp=useRef()
 const pick=f=>{if(!f)return;if(!/^image\//.test(f.type))return S.toast('Faqat rasm fayli tanlang');if(f.size>25e6)return S.toast('Rasm juda katta (25 MB gacha)')
  const r=new FileReader();r.onload=()=>setSrc(r.result);r.readAsDataURL(f)}
 const save=d=>{S.saveProfile(m.id,{photo:d},'Profil rasmi yangilandi');setSrc(null)}
 const del=()=>{S.saveProfile(m.id,{photo:''},'Rasm o‘chirildi — bosh harflar ko‘rsatiladi');setAsk(false)}
 return(<div className="box phb" style={{gridColumn:'1/-1'}}>
  <div className={'phb-av'+(hov?' dz':'')} onDragOver={e=>{e.preventDefault();setHov(true)}} onDragLeave={()=>setHov(false)} onDrop={e=>{e.preventDefault();setHov(false);pick(e.dataTransfer.files[0])}}>
   <div className="phb-c" data-cur=""><Av m={m}/></div>
   <button type="button" className="phb-cam" aria-label={m.ph?'Rasmni almashtirish':'Rasm yuklash'} onClick={()=>inp.current.click()}><Ic n="camera" s={18}/></button></div>
  <div className="phb-t"><h3 style={{margin:0}}>Profil rasmi</h3>
   <p className="sub" style={{margin:'4px 0 12px'}}>{m.ph?'Rasmingiz mijozlarga kartangizda va profilingizda ko‘rinadi.':'Rasm qo‘ymasangiz, ism-familiyangizning bosh harflari ko‘rinadi.'} Rasmni bu yerga tashlab ham yuklashingiz mumkin.</p>
   <div className="phb-b">
    <button className="btn y sm" onClick={()=>inp.current.click()}><Ic n="camera" s={16}/>{m.ph?'Rasmni almashtirish':'Rasm yuklash'}</button>
    {m.ph&&<button className="btn g sm" onClick={()=>setSrc(m.ph)}><Ic n="crop" s={16}/>Qirqish</button>}
    {m.ph&&!ask&&<button className="btn g sm phb-del" onClick={()=>setAsk(true)}><Ic n="trash" s={16}/>O‘chirish</button>}
    {ask&&<span className="phb-ask">O‘chirilsinmi? <button className="btn no sm" onClick={del}>Ha, o‘chir</button><button className="btn g sm" onClick={()=>setAsk(false)}>Yo‘q</button></span>}</div></div>
  <input ref={inp} type="file" accept="image/*" hidden onChange={e=>{pick(e.target.files[0]);e.target.value=''}}/>
  {src&&<Cropper src={src} onSave={save} onCancel={()=>setSrc(null)} onOther={()=>{setSrc(null);inp.current.click()}}/>}
 </div>)
}

/* ---------- O'zbekcha fayl tanlash tugmasi (brauzerning "Choose file" o'rniga) ---------- */
export function FilePick({onFiles,multiple,label='Rasm yuklash',hint}){
 const r=useRef(),[n,setN]=useState(0)
 return(<div className="fp"><input ref={r} type="file" accept="image/*" multiple={multiple} hidden onChange={async e=>{const f=[...e.target.files];setN(f.length);await onFiles(f);e.target.value='';setN(0)}}/>
  <button type="button" className="btn y sm" onClick={()=>r.current.click()}><Ic n="camera" s={16}/>{label}</button>
  <span className="fp-h">{hint||(multiple?'Bir nechta rasm tanlash mumkin':'Rasm tanlanmagan')}</span></div>)
}
