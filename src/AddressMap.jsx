import {useEffect, useRef, useState} from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Toshkent shahri uchun taxminiy ko‘pburchak. Chegaralar aniq kadastr chegarasi emas.
const CITY = [
  [41.225,69.105],[41.205,69.17],[41.205,69.245],[41.215,69.31],
  [41.245,69.365],[41.285,69.405],[41.33,69.405],[41.365,69.37],
  [41.39,69.315],[41.405,69.255],[41.405,69.19],[41.38,69.135],
  [41.34,69.105],[41.29,69.09],[41.25,69.09]
]
const insideCity = ([lat,lng]) => {
  let inside=false
  for(let i=0,j=CITY.length-1;i<CITY.length;j=i++){
    const [yi,xi]=CITY[i], [yj,xj]=CITY[j]
    if(((yi>lat)!==(yj>lat)) && lng < (xj-xi)*(lat-yi)/(yj-yi)+xi) inside=!inside
  }
  return inside
}
export default function AddressMap({value,onSelect}) {
 const el=useRef(null), map=useRef(null), marker=useRef(null), boundary=useRef(null), onSelectRef=useRef(onSelect)
 useEffect(()=>{onSelectRef.current=onSelect},[onSelect])
 const [message,setMessage]=useState('Xaritadan Toshkent shahri ichidagi manzilni tanlang.')
 const [loading,setLoading]=useState(false)
 useEffect(()=>{
  if(!el.current || map.current) return
  const m=L.map(el.current,{scrollWheelZoom:false,minZoom:10,maxZoom:19,maxBounds:[[41.17,69.04],[41.44,69.46]],maxBoundsViscosity:0.9}).setView([41.2995,69.2401],12)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(m)
  boundary.current=L.polygon(CITY,{color:'#d49b00',weight:2,fillColor:'#ffc72c',fillOpacity:0.08,dashArray:'6 5'}).addTo(m)
  m.fitBounds(boundary.current.getBounds(),{padding:[12,12]})
  m.on('click',async e=>{
    const point=[e.latlng.lat,e.latlng.lng]
    if(!insideCity(point)){setMessage('Bu nuqta Toshkent shahri belgilangan hududidan tashqarida. Boshqa joyni tanlang.');return}
    if(marker.current) marker.current.remove()
    marker.current=L.marker(point).addTo(m)
    setLoading(true);setMessage('Manzil aniqlanmoqda…')
    let address=`Toshkent shahri (${point[0].toFixed(5)}, ${point[1].toFixed(5)})`
    try {
      const res=await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${point[0]}&lon=${point[1]}&zoom=18&addressdetails=1`,{headers:{'Accept-Language':'uz'}})
      if(res.ok){const data=await res.json();if(data.display_name) address=data.display_name}
    } catch {}
    onSelectRef.current({lat:point[0],lng:point[1]},address)
    setLoading(false);setMessage('Manzil tanlandi. Buyurtma berish uchun davom etishingiz mumkin.')
  })
  map.current=m
  const timer=setTimeout(()=>m.invalidateSize(),100)
  return ()=>{clearTimeout(timer);m.remove();map.current=null}
 },[])
 useEffect(()=>{
  if(!map.current||!value) return
  if(marker.current) marker.current.remove()
  marker.current=L.marker([value.lat,value.lng]).addTo(map.current)
  map.current.setView([value.lat,value.lng],15)
 },[value])
 return <div className="address-map-wrap">
   <div ref={el} className="address-map" aria-label="Toshkent shahri xaritasi"/>
   <div className={'map-status'+(loading?' loading':'')}>{message}</div>
 </div>
}
