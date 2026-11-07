// OpenMapTiles geometry, simplified colors. No hand-drawn roads or boundaries.
Object.assign(words,{
'Game map':['やさしい地図','Soft map','부드러운 지도','柔和地图','Mapa suave','Carte douce','Sanfte Karte','Mapa suave'],
'Standard map':['標準地図','Standard map','기본 지도','标准地图','Mapa estándar','Carte standard','Standardkarte','Mapa padrão'],
'Vector unavailable':['やさしい地図を取得できないため、標準地図を表示しています。','Soft map unavailable; showing the standard map.','부드러운 지도를 사용할 수 없어 기본 지도를 표시합니다.','柔和地图不可用，正在显示标准地图。','Mapa suave no disponible; mostrando mapa estándar.','Carte douce indisponible ; carte standard affichée.','Sanfte Karte nicht verfügbar; Standardkarte wird angezeigt.','Mapa suave indisponível; exibindo mapa padrão.']
});
const softMapStyle={version:8,sources:{world:{type:'vector',url:'https://tiles.openfreemap.org/planet/latest',attribution:'<a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener">© OpenMapTiles</a> Data from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}},layers:[
 {id:'base',type:'background',paint:{'background-color':'#edf1d8'}},
 {id:'landcover',type:'fill',source:'world','source-layer':'landcover',paint:{'fill-color':'#d2e7bc','fill-opacity':.7}},
 {id:'parks',type:'fill',source:'world','source-layer':'landuse',filter:['in','class','park','grass','cemetery','recreation_ground','garden'],paint:{'fill-color':'#bee2a8','fill-opacity':.8}},
 {id:'water',type:'fill',source:'world','source-layer':'water',paint:{'fill-color':'#a5dae8'}},
 {id:'streams',type:'line',source:'world','source-layer':'waterway',minzoom:11,paint:{'line-color':'#a5dae8','line-width':['interpolate',['linear'],['zoom'],11,1,17,6]}},
 {id:'country-outline',type:'line',source:'world','source-layer':'boundary',filter:['==','admin_level',2],paint:{'line-color':'#c1cbb1','line-width':.7,'line-dasharray':[3,3]}},
 {id:'buildings',type:'fill',source:'world','source-layer':'building',minzoom:15,paint:{'fill-color':'#e4decc','fill-outline-color':'#d6d3bf','fill-opacity':.75}},
 {id:'road-outlines',type:'line',source:'world','source-layer':'transportation',minzoom:10,filter:['in','class','motorway','trunk','primary','secondary','tertiary','minor','service'],layout:{'line-join':'round','line-cap':'round'},paint:{'line-color':'#d6d8bd','line-width':['interpolate',['linear'],['zoom'],10,1.5,14,5,18,15]}},
 {id:'roads',type:'line',source:'world','source-layer':'transportation',minzoom:10,filter:['in','class','motorway','trunk','primary','secondary','tertiary','minor','service'],layout:{'line-join':'round','line-cap':'round'},paint:{'line-color':'#fffcf1','line-width':['interpolate',['linear'],['zoom'],10,.8,14,3.5,18,12]}},
 {id:'walks',type:'line',source:'world','source-layer':'transportation',minzoom:15,filter:['in','class','path','track'],layout:{'line-join':'round','line-cap':'round'},paint:{'line-color':'#faf7e8','line-width':['interpolate',['linear'],['zoom'],15,1,18,4]}}
]};
let preferredMapStyle='soft';
function createBaseMap(map,canvas,warning){
 let layer=null,gl=null,disposed=false;const message=warning.querySelector('span'),retry=warning.querySelector('button');
 const chooser=L.control({position:'bottomright'});chooser.onAdd=()=>{const label=L.DomUtil.create('label','real-map-label-control');const select=document.createElement('select');select.setAttribute('aria-label',tr('Map'));for(const [value,key]of [['soft','Game map'],['standard','Standard map']]){const option=document.createElement('option');option.value=value;option.textContent=tr(key);select.append(option);}label.append(select);L.DomEvent.disableClickPropagation(label);L.DomEvent.disableScrollPropagation(label);select.onchange=()=>{preferredMapStyle=select.value;apply(select.value);};return label;};chooser.addTo(map);
 const select=chooser.getContainer().querySelector('select');
 function standard(fallback){layer=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}).addTo(map);canvas.dataset.basemap=fallback?'standard-fallback':'standard';select.value='standard';warning.hidden=!fallback;message.textContent=tr(fallback?'Vector unavailable':'Map unavailable');layer.on('tileerror',()=>{message.textContent=tr('Map unavailable');warning.hidden=false;});layer.on('tileload',()=>{if(!fallback)warning.hidden=true;});}
 function apply(style){if(disposed)return;if(layer){map.removeLayer(layer);layer=null;gl=null;}warning.hidden=true;if(style==='standard'){standard(false);return;}try{if(typeof maplibregl==='undefined'||!L.maplibreGL||!maplibregl.supported({failIfMajorPerformanceCaveat:false}))throw Error('WebGL unavailable');layer=L.maplibreGL({style:JSON.parse(JSON.stringify(softMapStyle)),interactive:false,attributionControl:{customAttribution:softMapStyle.sources.world.attribution}}).addTo(map);gl=layer.getMaplibreMap();select.value='soft';canvas.dataset.basemap='soft';const active=gl;gl.on('error',()=>{setTimeout(()=>{if(!disposed&&gl===active)applyFallback();},0);});gl.on('idle',()=>{if(gl===active&&gl.isSourceLoaded('world'))canvas.dataset.vectorLoaded='true';});}catch{applyFallback();}}
 function applyFallback(){if(disposed)return;if(layer){map.removeLayer(layer);layer=null;gl=null;}standard(true);}
 retry.onclick=e=>{e.stopPropagation();apply(preferredMapStyle);};map.once('unload',()=>{disposed=true;});apply(preferredMapStyle);return {redraw:()=>apply(preferredMapStyle)};
}
