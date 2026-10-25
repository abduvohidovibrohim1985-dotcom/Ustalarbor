import {useEffect,useRef,useState} from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
export default function RouteMap({client,master}) {
 const el=useRef(null), layers=useRef([])
 const [info,setInfo]=useState('Marshrut yuklanmoqda…')
 useEffect(()=>{
  if(!el.current||!client||!master)return
  const m=L.map(el.current,{scrollWheelZoom:false}).setView([41.2995,69.2401],12)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(m)
  const a=[master.lat,master.lng], b=[client.lat,client.lng]
  L.marker(a).addTo(m).bindPopup('Usta manzili')
  L.marker(b).addTo(m).bindPopup('Mijoz manzili')
  const straight=L.polyline([a,b],{color:'#1f9d6b',weight:4,dashArray:'7 7'}).addTo(m)
  m.fitBounds(L.latLngBounds([a,b]),{padding:[28,28]})
  const controller=new AbortController()
  fetch(`https://router.project-osrm.org/route/v1/driving/${a[1]},${a[0]};${b[1]},${b[0]}?overview=full&geometries=geojson`,{signal:controller.signal})
   .then(r=>{if(!r.ok)throw Error('route');return r.json()}).then(data=>{
    const r=data.routes?.[0];if(!r)throw Error('route')
    straight.remove()
    const coords=r.geometry.coordinates.map(([lng,lat])=>[lat,lng])
    L.polyline(coords,{color:'#1f9d6b',weight:5,opacity:.95}).addTo(m)
    m.fitBounds(L.latLngBounds(coords),{padding:[28,28]})
    setInfo(`Yo‘l masofasi: ${(r.distance/1000).toFixed(1)} km · taxminiy vaqt: ${Math.max(1,Math.round(r.duration/60))} daqiqa`)
   }).catch(()=>setInfo('Yo‘nalish xizmati hozir javob bermadi. Yashil chiziq ikki manzil orasidagi taxminiy yo‘nalishni ko‘rsatadi.'))
  const timer=setTimeout(()=>m.invalidateSize(),120)
  return()=>{clearTimeout(timer);controller.abort();m.remove();layers.current=[]}
 },[client?.lat,client?.lng,master?.lat,master?.lng])
 if(!client||!master)return <p className="sub">Marshrut uchun mijoz va usta manzillarini saqlashi kerak.</p>
 return <div className="route-wrap"><div ref={el} className="route-map"/><div className="map-status">{info}</div></div>
}
