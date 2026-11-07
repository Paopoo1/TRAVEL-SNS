// Real geographic coordinates and online basemap tiles. No illustrated fallback.
Object.assign(words,{
'Zoom in':['拡大','Zoom in','확대','放大','Acercar','Agrandir','Vergrößern','Ampliar'],
'Zoom out':['縮小','Zoom out','축소','缩小','Alejar','Réduire','Verkleinern','Reduzir'],
'Reset map':['全体表示に戻す','Reset map','지도 초기화','重置地图','Restablecer mapa','Réinitialiser la carte','Karte zurücksetzen','Redefinir mapa'],
'Street labels':['通常の地名を表示','Show street labels','일반 지명 표시','显示标准地名','Mostrar nombres','Afficher les noms','Ortsnamen anzeigen','Mostrar nomes'],
'Map unavailable':['地図を読み込めません。通信を確認して再試行してください。','Map tiles could not load. Check your connection and retry.','지도를 불러올 수 없습니다. 연결을 확인하세요.','地图加载失败，请检查网络后重试。','No se pudo cargar el mapa. Revisa tu conexión.','Carte indisponible. Vérifiez la connexion.','Karte nicht verfügbar. Verbindung prüfen.','Mapa indisponível. Verifique a conexão.'],
'Retry':['再試行','Retry','재시도','重试','Reintentar','Réessayer','Erneut versuchen','Tentar novamente'],
'Visit overlay note':['色は訪問地点から約100mの目印です。境界や道案内を示すものではありません。','Color marks about 100 m around a visited place, not boundaries or navigation.','색상은 방문 장소 주변 약 100m의 표시입니다. 경계나 길 안내가 아닙니다.','颜色标记到访地点周边约100米，并非边界或导航。','El color marca unos 100 m alrededor de un lugar; no son límites ni navegación.','La couleur indique environ 100 m autour du lieu, sans limite officielle ni guidage.','Die Farbe markiert etwa 100 m um einen Ort, keine Grenzen oder Navigation.','A cor marca cerca de 100 m ao redor do local, não limites nem navegação.']
});
const geographicSpots=[[[34.994856,135.785046],[34.998055,135.780862],[35.003655,135.778553]],[[34.665251,135.506244],[34.668754,135.501273],[34.667459,135.502706]],[[35.711056,139.796335],[35.714765,139.796655],[35.714513,139.803321]]];
const liveMaps=new Set(),geographicViews=new Map();let standardLabels=false;
function disposeRealMaps(){for(const entry of liveMaps){geographicViews.set(entry.key,{center:entry.map.getCenter(),zoom:entry.map.getZoom()});entry.map.remove();}liveMaps.clear();}
function mountRealMap(root,mode,a){
 if(!root||root.dataset.realMap)return;
 root.dataset.realMap='true';root.classList.remove('zoom-viewport','map-is-zoomed','map');root.classList.add('real-geographic-map');root.removeAttribute('tabindex');root.removeAttribute('aria-label');root.innerHTML='';
 const canvas=document.createElement('div');canvas.className='geographic-canvas';canvas.setAttribute('aria-label',tr('Map'));root.append(canvas);
 const warning=document.createElement('div');warning.className='tile-warning';warning.hidden=true;const message=document.createElement('span');message.textContent=tr('Map unavailable');const retry=document.createElement('button');retry.textContent=tr('Retry');warning.append(message,retry);root.append(warning);
 const key=mode+':'+a,map=L.map(canvas,{zoomControl:false,scrollWheelZoom:true,worldCopyJump:true,minZoom:2,maxZoom:19,attributionControl:true});liveMaps.add({map,key});
 const tileLayer=L.tileLayer('',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',crossOrigin:false});
 function tileURL(){return standardLabels?'https://tile.openstreetmap.org/{z}/{x}/{y}.png':'https://basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png';}
 tileLayer.on('tileerror',()=>{warning.hidden=false;});tileLayer.on('tileload',()=>{warning.hidden=true;});retry.onclick=e=>{e.stopPropagation();warning.hidden=true;tileLayer.redraw();};tileLayer.setUrl(tileURL()).addTo(map);
 L.control.zoom({position:'topright',zoomInTitle:tr('Zoom in'),zoomOutTitle:tr('Zoom out')}).addTo(map);
 const reset=L.control({position:'topright'});reset.onAdd=()=>{const button=L.DomUtil.create('button','real-map-reset');button.type='button';button.textContent='↺';button.setAttribute('aria-label',tr('Reset map'));L.DomEvent.disableClickPropagation(button);L.DomEvent.on(button,'click',()=>initialView());return button;};reset.addTo(map);
 const labelControl=L.control({position:'bottomleft'});labelControl.onAdd=()=>{const label=L.DomUtil.create('label','real-map-label-control');const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=standardLabels;label.append(checkbox,document.createTextNode(tr('Street labels')));L.DomEvent.disableClickPropagation(label);L.DomEvent.disableScrollPropagation(label);checkbox.onchange=()=>{standardLabels=checkbox.checked;warning.hidden=true;for(const entry of liveMaps){entry.map.eachLayer(layer=>{if(layer instanceof L.TileLayer)layer.setUrl(tileURL());});entry.map.getContainer().querySelectorAll('.real-map-label-control input').forEach(x=>x.checked=standardLabels);}};return label;};labelControl.addTo(map);
 function openPlace(index){area=a;atlasArea=a;spot=index;route=0;atlasView=false;shopMode=false;collection=false;renderView();if($('tripTools')){$('tripTools').open=true;$('photoForm').scrollIntoView({behavior:'smooth',block:'center'});}}
 if(mode==='world'){
  const group=L.marker([36.3,138.1],{icon:L.divIcon({className:'geo-area-marker',html:'<span class="'+intensity(records)+'">JAPAN · '+areas.filter((_,i)=>areaHistory(i).length).length+' / 3'+(visitDays(records)>=3?' 👑':'')+'</span>',iconSize:[130,32],iconAnchor:[65,16]})}).addTo(map);const areaChoices=document.createElement('div');areaChoices.className='geo-area-choices';for(let i=0;i<areas.length;i++){const button=document.createElement('button');button.textContent=atlasAreaName(i)+(visitDays(areaHistory(i))>=3?' 👑':'');button.onclick=()=>{atlasArea=i;atlasScope='area';storeAtlasSettings();renderView();};areaChoices.append(button);}group.bindPopup(areaChoices);
  for(const [label,coords]of [['Europe',[50,15]],['Africa',[5,20]],['Asia',[42,92]],['North America',[44,-105]],['South America',[-15,-60]],['Oceania',[-24,135]]]){L.marker(coords,{interactive:false,icon:L.divIcon({className:'geo-continent',html:escapeHTML(label),iconSize:[120,22],iconAnchor:[60,11]})}).addTo(map);}
 }else{
  geographicSpots[a].forEach((coords,i)=>{const list=visits(a,i),days=visitDays(list);if(list.length)L.circle(coords,{radius:100,color:days>=3?'#f3a05d':'#63c8e8',fillColor:days>=3?'#ffb472':'#9bdff3',fillOpacity:.55,weight:2,interactive:false}).addTo(map);
   const image=list[0]?.photo||demoCards[i].image;const marker=L.marker(coords,{icon:L.divIcon({className:'geo-photo-marker',html:'<button type="button" class="'+intensity(list)+'" aria-label="'+escapeHTML(areas[a].spots[i][0])+'"><img src="'+escapeHTML(image)+'" alt="">'+(days>=3?'<b class="geo-crown">👑</b>':'')+'</button><span>'+escapeHTML(areas[a].spots[i][0])+'</span>',iconSize:[60,82],iconAnchor:[30,62]})}).addTo(map);marker.on('click',()=>openPlace(i));
  });
  if(mode==='route'){L.polyline(areas[a].routes[route][2].map(i=>geographicSpots[a][i]),{color:'#ed8975',weight:4,dashArray:'6 8'}).addTo(map);}
 }
 function initialView(){if(mode==='world')map.setView([23,16],2);else map.fitBounds(L.latLngBounds(geographicSpots[a]),{padding:[65,65],maxZoom:15});}
 const saved=geographicViews.get(key);if(saved)map.setView(saved.center,saved.zoom);else initialView();
 map.on('moveend',()=>{geographicViews.set(key,{center:map.getCenter(),zoom:map.getZoom()});canvas.dataset.mapZoom=map.getZoom();});canvas.dataset.mapZoom=map.getZoom();canvas.dataset.area=String(a);canvas.dataset.mode=mode;canvas._trailbookMap=map;
 requestAnimationFrame(()=>map.invalidateSize());root.addEventListener('click',e=>e.stopPropagation());
}
function mountGeographicMaps(){
 if(typeof L==='undefined')return;
 document.querySelectorAll('#socialMap').forEach(root=>mountRealMap(root,'feed',area));
 document.querySelectorAll('.world-atlas').forEach(root=>mountRealMap(root,'world',atlasArea));
 document.querySelectorAll('.local-atlas').forEach(root=>mountRealMap(root,'local',atlasArea));
 document.querySelectorAll('.pop-map,.map').forEach(root=>{if(root.getBoundingClientRect().width)mountRealMap(root,'route',area);});
 document.querySelectorAll('.atlas-map-note').forEach(n=>n.textContent=tr('Visit overlay note'));
 document.querySelectorAll('small').forEach(n=>{if(n.textContent==='Schematic · not for navigation'||n.textContent.startsWith('地図: OpenStreetMap。'))n.textContent=tr('Visit overlay note');});
}
const geographicRender=renderView;renderView=function(){disposeRealMaps();geographicRender();mountGeographicMaps();};
document.addEventListener('toggle',e=>{if(e.target instanceof HTMLDetailsElement&&e.target.open){mountGeographicMaps();for(const entry of liveMaps)entry.map.invalidateSize();}},true);
window.addEventListener('resize',()=>{for(const entry of liveMaps)entry.map.invalidateSize();});
renderView();
