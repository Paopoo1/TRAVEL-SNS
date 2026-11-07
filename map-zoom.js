// Shared, dependency-free map viewport. Transform only map content, never controls.
Object.assign(words,{
'Zoom in':['拡大','Zoom in','확대','放大','Acercar','Agrandir','Vergrößern','Ampliar'],
'Zoom out':['縮小','Zoom out','축소','缩小','Alejar','Réduire','Verkleinern','Reduzir'],
'Reset map':['全体表示に戻す','Reset map','지도 초기화','重置地图','Restablecer mapa','Réinitialiser la carte','Karte zurücksetzen','Redefinir mapa'],
'Map zoom help':['＋／−で拡大縮小。ドラッグで移動、2本指でピンチ。','Use +/− to zoom, drag to pan, or pinch with two fingers.','+/− 확대·축소, 드래그 이동, 두 손가락 핀치.','使用＋／−缩放，拖动移动，双指捏合缩放。','Usa +/−, arrastra o pellizca con dos dedos.','Utilisez +/−, glissez ou pincez avec deux doigts.','Mit +/− zoomen, ziehen oder mit zwei Fingern skalieren.','Use +/−, arraste ou faça pinça com dois dedos.']
});
const mapViews=new Map();
function enableMapZoom(root){
 if(root.dataset.zoomReady||!root.getBoundingClientRect().width)return;
 root.dataset.zoomReady='true';root.classList.add('zoom-viewport');
 const key=(root.id||[...root.classList].find(c=>c!=='zoom-viewport'))+':'+(root.closest('#personalAtlas')?atlasArea:area);
 const saved=mapViews.get(key);let scale=saved?.scale||1,nx=saved?.nx||0,ny=saved?.ny||0,x=0,y=0;
 if(root.classList.contains('world-atlas')){root.style.height='clamp(250px, 40vw, 430px)';}
 const layer=document.createElement('div');layer.className='zoom-map-layer';
 const fixed=[];for(const node of [...root.childNodes]){if(node.nodeType===1&&(node.id==='searchArea'||node.classList.contains('map-demo-label')||node.classList.contains('map-caption')))fixed.push(node);else layer.append(node);}root.append(layer,...fixed);
 const toolbar=document.createElement('div');toolbar.className='map-zoom-controls';toolbar.setAttribute('role','group');toolbar.setAttribute('aria-label',tr('Map'));
 toolbar.innerHTML='<button type="button" data-zoom="in" aria-label="'+tr('Zoom in')+'">+</button><output aria-live="polite"></output><button type="button" data-zoom="out" aria-label="'+tr('Zoom out')+'">−</button><button type="button" data-zoom="reset" aria-label="'+tr('Reset map')+'">↺</button>';
 root.append(toolbar);root.tabIndex=0;root.setAttribute('aria-label',tr('Map zoom help'));
 const zoomIn=toolbar.querySelector('[data-zoom="in"]'),zoomOut=toolbar.querySelector('[data-zoom="out"]');
 function paint(){const w=root.clientWidth,h=root.clientHeight;x=Math.max(-w*(scale-1),Math.min(0,x));y=Math.max(-h*(scale-1),Math.min(0,y));layer.style.transform='translate('+x+'px,'+y+'px) scale('+scale+')';root.dataset.zoom=scale.toFixed(2);toolbar.querySelector('output').textContent=Math.round(scale*100)+'%';zoomIn.disabled=scale>=4;zoomOut.disabled=scale<=1;root.classList.toggle('map-is-zoomed',scale>1);mapViews.set(key,{scale,nx:w?x/w:0,ny:h?y/h:0});}
 function zoom(next,ax=root.clientWidth/2,ay=root.clientHeight/2){next=Math.max(1,Math.min(4,next));x=ax-(ax-x)*next/scale;y=ay-(ay-y)*next/scale;scale=next;paint();}
 x=nx*root.clientWidth;y=ny*root.clientHeight;paint();
 toolbar.onclick=e=>{const type=e.target.closest('[data-zoom]')?.dataset.zoom;if(!type)return;e.stopPropagation();if(type==='reset'){scale=1;x=0;y=0;paint();}else zoom(scale*(type==='in'?1.3:1/1.3));};
 root.addEventListener('wheel',e=>{if(e.target.closest('.map-zoom-controls'))return;e.preventDefault();const rect=root.getBoundingClientRect();zoom(scale*Math.exp(-e.deltaY*.002),e.clientX-rect.left,e.clientY-rect.top);},{passive:false});
 root.addEventListener('keydown',e=>{if(e.target!==root)return;const key=e.key;if(['+','=','-','Home','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(key)){e.preventDefault();if(key==='Home'){scale=1;x=0;y=0;paint();}else if(['+','=','-'].includes(key))zoom(scale*(key==='-'?1/1.3:1.3));else{x+=key==='ArrowLeft'?40:key==='ArrowRight'?-40:0;y+=key==='ArrowUp'?40:key==='ArrowDown'?-40:0;paint();}}});
 const pointers=new Map();let gesture=null,moved=false,suppressClick=false;
 const point=e=>({x:e.clientX-root.getBoundingClientRect().left,y:e.clientY-root.getBoundingClientRect().top});
 function start(){const pts=[...pointers.values()];gesture={pts:pts.map(p=>({...p})),scale,x,y};moved=false;}
 root.addEventListener('pointerdown',e=>{if(e.target.closest('.map-zoom-controls,#searchArea')||e.button!==0)return;pointers.set(e.pointerId,point(e));start();});
 root.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId)||!gesture)return;pointers.set(e.pointerId,point(e));const pts=[...pointers.values()];if(pts.length>=2&&gesture.pts.length>=2){const initial=Math.hypot(gesture.pts[1].x-gesture.pts[0].x,gesture.pts[1].y-gesture.pts[0].y);if(initial<1)return;const dist=Math.hypot(pts[1].x-pts[0].x,pts[1].y-pts[0].y);scale=Math.max(1,Math.min(4,gesture.scale*dist/initial));const ax=(gesture.pts[0].x+gesture.pts[1].x)/2,ay=(gesture.pts[0].y+gesture.pts[1].y)/2;x=(pts[0].x+pts[1].x)/2-(ax-gesture.x)*scale/gesture.scale;y=(pts[0].y+pts[1].y)/2-(ay-gesture.y)*scale/gesture.scale;moved=true;}else{const dx=pts[0].x-gesture.pts[0].x,dy=pts[0].y-gesture.pts[0].y;if(Math.hypot(dx,dy)<6&&!moved)return;if(scale===1)return;moved=true;x=gesture.x+dx;y=gesture.y+dy;}if(moved){suppressClick=true;root.setPointerCapture(e.pointerId);root.classList.add('map-dragging');paint();}});
 function finish(e){if(!pointers.has(e.pointerId))return;pointers.delete(e.pointerId);root.classList.remove('map-dragging');if(root.hasPointerCapture(e.pointerId))root.releasePointerCapture(e.pointerId);if(pointers.size)start();else gesture=null;setTimeout(()=>{if(!pointers.size)suppressClick=false;},0);}
 root.addEventListener('pointerup',finish);root.addEventListener('pointercancel',finish);
 root.addEventListener('click',e=>{if(suppressClick&&!e.target.closest('.map-zoom-controls')){e.preventDefault();e.stopImmediatePropagation();}},{capture:true});
 root.addEventListener('dragstart',e=>e.preventDefault());
}
function initializeMapZoom(){document.querySelectorAll('#socialMap,.world-atlas,.local-atlas,.pop-map,.map').forEach(enableMapZoom);}
const zoomRender=renderView;renderView=function(){zoomRender();initializeMapZoom();};
document.addEventListener('toggle',e=>{if(e.target instanceof HTMLDetailsElement&&e.target.open)initializeMapZoom();},true);
renderView();
