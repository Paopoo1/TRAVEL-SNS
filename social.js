const theme=document.createElement('link');theme.rel='stylesheet';theme.href='social.css';document.body.append(theme);
// UI translations are local; user-written names and event text remain unchanged.
const localeNames={ja:'日本語',en:'English',ko:'한국어',zh:'简体中文',es:'Español',fr:'Français',de:'Deutsch',pt:'Português'};
let locale='ja';try{const saved=localStorage.getItem('trailbook-language-v1');if(localeNames[saved])locale=saved;}catch{}
const words={
'My Trips':['旅コレクション','My Trips','내 여행','我的旅行','Mis viajes','Mes voyages','Meine Reisen','Minhas viagens'],
'Explore':['地図を見る','Explore','둘러보기','探索','Explorar','Explorer','Entdecken','Explorar'],
'My Atlas':['マイ旅地図','My Atlas','나의 여행 지도','我的地图','Mi atlas','Mon atlas','Mein Atlas','Meu atlas'],
'Routes':['旅ルート','Routes','여행 경로','旅行路线','Rutas','Itinéraires','Routen','Rotas'],
'Model walk':['モデルコース','Model walk','추천 코스','推荐路线','Ruta sugerida','Parcours conseillé','Empfohlene Route','Rota sugerida'],
'Sample traveler route':['旅行者ルート例','Sample traveler route','여행자 코스 예시','旅行者路线示例','Ruta de ejemplo','Exemple de parcours','Beispielroute','Rota de exemplo'],
'Add to My Trips':['写真を記録','Add to My Trips','사진 추가','添加照片','Añadir foto','Ajouter une photo','Foto hinzufügen','Adicionar foto'],
'Visit date':['訪問日','Visit date','방문일','到访日期','Fecha de visita','Date de visite','Besuchsdatum','Data da visita'],
'Photo':['写真','Photo','사진','照片','Foto','Photo','Foto','Foto'],
'Collected':['収集済み','Collected','수집 완료','已收集','Coleccionado','Collectionné','Gesammelt','Colecionado'],
'Unvisited':['未訪問','Unvisited','미방문','未到访','Sin visitar','À découvrir','Unbesucht','Não visitado'],
'Profile':['プロフィール','Profile','프로필','个人资料','Perfil','Profil','Profil','Perfil'],
'Shop workspace':['お店用','Shop workspace','매장 관리','商家管理','Mi negocio','Espace commerce','Geschäft','Meu negócio'],
'Back to personal':['個人用に戻る','Back to personal','개인 화면으로','返回个人页面','Volver a personal','Espace personnel','Zum persönlichen Bereich','Voltar ao pessoal'],
'Every trip, mapped.':['旅を塗り集めよう。','Every trip, mapped.','여행을 지도로 모아요.','用旅行点亮地图。','Cada viaje, en tu mapa.','Chaque voyage, sur la carte.','Deine Reisen auf der Karte.','Cada viagem no seu mapa.'],
'Explore an area, follow a route, and collect the places you visit.':['地図を開いて、行った場所に写真を残そう。','Explore an area, follow a route, and collect the places you visit.','지역을 탐색하고 방문한 장소를 사진으로 남겨요.','探索区域，用照片记录足迹。','Explora y guarda tus recuerdos.','Explorez et collectionnez vos souvenirs.','Entdecke Orte und sammle Erinnerungen.','Explore lugares e guarde memórias.'],
'地図から、次の寄り道へ。':['地図から、次の寄り道へ。','Find your next little adventure.','다음 여행을 찾아보세요.','发现下一站精彩。','Descubre tu próxima aventura.','Trouvez votre prochaine escapade.','Finde dein nächstes Abenteuer.','Encontre sua próxima aventura.'],
'現在地から探す':['現在地から探す','Explore nearby','내 주변 탐색','探索附近','Explorar cerca','Explorer à proximité','In der Nähe suchen','Explorar por perto'],
'近くのイベント':['近くのイベント','Nearby events','주변 이벤트','附近活动','Eventos cercanos','Événements à proximité','Events in der Nähe','Eventos próximos'],
'このエリアのお店':['このエリアのお店','Local shops','지역 매장','本地商店','Tiendas locales','Commerces locaux','Lokale Geschäfte','Lojas locais'],
'サンプル店舗':['サンプル店舗','Sample shop','예시 매장','示例商店','Tienda de ejemplo','Commerce de démonstration','Beispielgeschäft','Loja de exemplo'],
'近くの人に、イベントを届ける':['近くの人に、イベントを届ける','Bring your event to the neighborhood','주변에 이벤트 알리기','向附近的人介绍活动','Comparte tu evento local','Faites découvrir votre événement','Teile dein Event in der Nähe','Compartilhe seu evento local'],
'店舗名':['店舗名','Shop name','매장 이름','店铺名称','Nombre del negocio','Nom du commerce','Geschäftsname','Nome da loja'],
'エリア':['エリア','Area','지역','区域','Zona','Quartier','Gebiet','Área'],
'イベント名':['イベント名','Event title','이벤트 이름','活动名称','Nombre del evento','Nom de l’événement','Eventname','Nome do evento'],
'終了日時':['終了日時','Ends at','종료 일시','结束时间','Finaliza','Date de fin','Endet am','Termina em'],
'お知らせする範囲':['お知らせする範囲','Notification radius','알림 반경','通知范围','Radio de aviso','Rayon de notification','Benachrichtigungsradius','Raio de aviso'],
'このブラウザに掲載':['このブラウザに掲載','Publish in this browser','이 브라우저에 게시','在此浏览器发布','Publicar en este navegador','Publier dans ce navigateur','In diesem Browser veröffentlichen','Publicar neste navegador'],
'掲載したイベント':['掲載したイベント','Your events','등록한 이벤트','已发布的活动','Tus eventos','Vos événements','Deine Events','Seus eventos'],
'掲載を終了':['掲載を終了','End listing','게시 종료','结束发布','Finalizar publicación','Retirer l’annonce','Eintrag beenden','Encerrar publicação'],
'掲載中のイベントはありません。':['掲載中のイベントはありません。','No active events yet.','진행 중인 이벤트가 없습니다.','暂无活动。','No hay eventos activos.','Aucun événement actif.','Keine aktiven Events.','Nenhum evento ativo.'],
'Next stops for you':['次のおすすめ','Next stops for you','다음 추천 장소','下一站推荐','Tus próximas paradas','Vos prochaines étapes','Deine nächsten Stopps','Suas próximas paradas'],
'Find your travel style':['旅の好みを見つける','Find your travel style','나의 여행 스타일','发现旅行风格','Tu estilo de viaje','Votre style de voyage','Dein Reisestil','Seu estilo de viagem'],
'Travelers with stops in common':['同じ場所を巡った人','Travelers with stops in common','같은 곳을 방문한 여행자','足迹相同的旅行者','Viajeros con lugares en común','Voyageurs aux étapes communes','Reisende mit gemeinsamen Stopps','Viajantes com lugares em comum'],
'このブラウザの店舗イベント':['このブラウザの店舗イベント','Local browser event','이 브라우저의 이벤트','此浏览器中的活动','Evento de este navegador','Événement de ce navigateur','Event in diesem Browser','Evento deste navegador'],
'イラスト地図 · ナビには使えません':['イラスト地図 · ナビには使えません','Illustrated map · not for navigation','일러스트 지도 · 길 안내용 아님','插画地图 · 不用于导航','Mapa ilustrado · sin navegación','Carte illustrée · sans navigation','Illustrationskarte · keine Navigation','Mapa ilustrado · sem navegação'],
'実際の地図を見る':['実際の地図を見る','Open street map','실제 지도 보기','查看真实地图','Ver mapa real','Voir la carte réelle','Straßenkarte ansehen','Ver mapa real'],
'現在地付近のイベントをアプリ内で知らせる':['現在地付近のイベントをアプリ内で知らせる','Show nearby event alerts in this app','앱에서 주변 이벤트 알림 보기','在应用内显示附近活动','Mostrar avisos de eventos cercanos','Afficher les alertes locales','Eventhinweise in der App anzeigen','Mostrar alertas de eventos próximos']
};

Object.assign(words,{
'エリアを選択すると、下のモデルルートとお店が切り替わります。':['エリアを選択すると、下のモデルルートとお店が切り替わります。','Choose an area to discover its routes and shops.','지역을 선택하면 코스와 매장이 표시됩니다.','选择区域，发现路线与商店。','Elige una zona para ver rutas y tiendas.','Choisissez un quartier pour découvrir ses parcours et commerces.','Wähle ein Gebiet für Routen und Geschäfte.','Escolha uma área para descobrir rotas e lojas.'],
'登録されたイベントはまだありません。お店用画面で追加できます。':['登録されたイベントはまだありません。お店用画面で追加できます。','No events yet. Add one in the shop workspace.','이벤트가 없습니다. 매장 화면에서 추가하세요.','暂无活动，可在商家页面添加。','Sin eventos. Añade uno desde tu negocio.','Aucun événement. Ajoutez-en depuis l’espace commerce.','Noch keine Events. Im Geschäftsbereich hinzufügen.','Sem eventos. Adicione na área da loja.'],
'街歩きの途中にひと休み。モデルルートと一緒に巡れます。':['街歩きの途中にひと休み。モデルルートと一緒に巡れます。','A little break along your walking route.','산책 코스에서 잠깐 쉬어 가세요.','沿着步行路线，享受片刻休息。','Una pausa en tu paseo.','Une petite pause sur votre parcours.','Eine kleine Pause auf deiner Route.','Uma pausa no seu passeio.'],
'近くのイベントのお知らせはオフです。':['近くのイベントのお知らせはオフです。','Nearby event alerts are off.','주변 이벤트 알림이 꺼져 있습니다.','附近活动提醒已关闭。','Los avisos están desactivados.','Les alertes locales sont désactivées.','Eventhinweise sind ausgeschaltet.','Alertas de eventos desativados.'],
'「現在地から探す」で位置情報を許可してください。':['「現在地から探す」で位置情報を許可してください。','Choose Explore nearby and allow location access.','내 주변 탐색에서 위치 접근을 허용하세요.','请选择探索附近并允许位置访问。','Permite tu ubicación en Explorar cerca.','Autorisez votre position dans Explorer à proximité.','Erlaube den Standort bei In der Nähe suchen.','Permita sua localização em Explorar por perto.'],
'設定範囲内で開催中のイベントはありません。':['設定範囲内で開催中のイベントはありません。','No active events within range.','범위 내 진행 중인 이벤트가 없습니다.','范围内暂无活动。','No hay eventos dentro del radio.','Aucun événement dans ce rayon.','Keine Events in Reichweite.','Nenhum evento dentro do raio.'],
'現在地は端末内で距離の計算にのみ使用します。アプリを開いている間の確認です。':['現在地は端末内で距離の計算にのみ使用します。アプリを開いている間の確認です。','Your location stays on this device. Alerts are checked while this app is open.','위치는 기기 내에서만 사용됩니다. 앱이 열려 있을 때 확인합니다.','位置仅在设备内使用，应用打开时检查提醒。','Tu ubicación permanece en tu dispositivo. Avisos con la app abierta.','Votre position reste sur cet appareil. Alertes lorsque l’app est ouverte.','Dein Standort bleibt auf dem Gerät. Hinweise bei geöffneter App.','Sua localização fica no dispositivo. Alertas com o app aberto.']
});

const languageIndex=()=>Object.keys(localeNames).indexOf(locale);
const tr=key=>words[key]?.[languageIndex()]||key;
function localize(root){const lookup=new Map();for(const [key,translations]of Object.entries(words)){lookup.set(key,translations[languageIndex()]);lookup.set(translations[0],translations[languageIndex()]);}const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const node=walker.currentNode;if(node.parentElement.closest('script,style,#areaEvents,#managedEvents,#nearbyResults h3'))continue;const text=node.nodeValue.trim();if(lookup.has(text))node.nodeValue=node.nodeValue.replace(text,lookup.get(text));}document.documentElement.lang=locale;}
const nearbyRender=renderNearby;renderNearby=function(){nearbyRender();if($('nearbyResults'))localize($('nearbyResults'));};
const socialRender=renderView;
renderView=function(){japanese=locale==='ja';socialRender();
 const select=document.createElement('select');select.id='locale';select.setAttribute('aria-label','Language / 言語');select.innerHTML=Object.entries(localeNames).map(([id,label])=>'<option value="'+id+'">'+label+'</option>').join('');select.value=locale;$('locale')?.remove();$('language').after(select);select.onchange=()=>{locale=select.value;try{localStorage.setItem('trailbook-language-v1',locale);}catch{}renderView();};
 if(!shopMode&&!collection){const iframe=document.querySelector('.explore-map');if(iframe){const pop=document.createElement('div');pop.className='pop-map';pop.setAttribute('aria-label',tr('イラスト地図 · ナビには使えません'));pop.innerHTML='<span class="tree" style="left:8%;top:15%">🌳</span><span class="tree" style="left:45%;top:65%">🌷</span><span class="tree" style="right:10%;top:12%">🌳</span>'+areas[area].spots.map(([name,x,y],i)=>'<button data-spot="'+i+'" style="left:'+Math.min(x,65)+'%;top:'+Math.min(y,65)+'%;background:'+['#ffe2a9','#e5ddff','#ffd8d1'][i]+'" aria-label="'+name+'">'+['📷','☕','⛩️'][i]+' '+name+'</button>').join('')+'<span class="map-caption">'+tr('イラスト地図 · ナビには使えません')+'</span>';const detail=document.createElement('details');detail.className='real-map';const summary=document.createElement('summary');summary.textContent=tr('実際の地図を見る');iframe.before(pop,detail);detail.append(summary,iframe);}}
 localize(document.querySelector('main'));const profileButton=$('profileButton');profileButton.textContent=tr('Profile')+(profile?' · '+profile:'');
};
renderView();
