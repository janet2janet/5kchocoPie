import{r as e,j as m}from"./index-CmJj0UUD.js";import{L as s}from"./leaflet-GljM32QK.js";function c(o,r){return s.divIcon({className:"",html:`<div style="
      width:28px;height:28px;border-radius:50%;
      background:${r?"#ff00ff":"#003399"};
      border:2px solid ${r?"#00ffff":"#0099ff"};
      color:#fff;font-family:VT323,monospace;font-size:14px;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 0 ${r?10:4}px ${r?"#ff00ff":"#0099ff"};
      cursor:pointer;
    ">${o}</div>`,iconSize:[28,28],iconAnchor:[14,14],popupAnchor:[0,-16]})}function h({locations:o,selected:r,onSelect:p}){const a=e.useRef(null),f=e.useRef(null),i=e.useRef({});return e.useEffect(()=>{if(!a.current)return;const t=s.map(a.current,{center:[37.785,-122.425],zoom:13});return s.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'© <a href="https://openstreetmap.org">OpenStreetMap</a>'}).addTo(t),f.current=t,()=>{t.remove(),f.current=null,i.current={}}},[]),e.useEffect(()=>{const t=f.current;t&&(Object.values(i.current).forEach(n=>n.remove()),i.current={},o.forEach(n=>{const u=s.marker([n.lat,n.lng],{icon:c(n.id,(r==null?void 0:r.id)===n.id)}).addTo(t).bindPopup(`<div style="font-family:VT323,monospace;font-size:16px;min-width:160px">
          <strong style="color:#003399">#${n.id} ${n.name}</strong><br/>
          <span style="font-size:13px">${n.address}</span><br/>
          <em style="font-size:13px;color:#666">${n.films.join(", ")}</em>
        </div>`);u.on("click",()=>p(n)),i.current[n.id]=u}))},[o,r,p]),e.useEffect(()=>{const t=f.current;!t||!r||t.flyTo([r.lat,r.lng],16,{duration:1})},[r]),m.jsx("div",{ref:a,style:{width:"100%",height:"100%"}})}export{h as default};
