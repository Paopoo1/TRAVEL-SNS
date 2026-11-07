import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { File, Paths } from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const sample = [
  { id:'kyoto', name:'京都・東山', spots:['清水寺','二年坂','八坂神社'], question:'雨の日でも東山で楽しめる？', answer:'屋内体験を中心にして、雨が弱まったら周辺を歩くプラン。予約と空き状況はお店に確認。', event:'東山の工芸マーケット', shop:'器の工房' },
  { id:'osaka', name:'大阪・難波', spots:['黒門市場','法善寺','道頓堀'], question:'難波を半日で回るには？', answer:'食事を軸に、近くのスポットを徒歩でつなぐ。', event:'難波のフードフェア', shop:'大阪のお土産店' },
  { id:'tokyo', name:'東京・浅草', spots:['雷門','浅草寺','隅田公園'], question:'荷物が多い日はどこから回る？', answer:'荷物を預けられる場所を確認してから、駅に近いスポットを起点にする。', event:'浅草のクラフト市', shop:'浅草の雑貨店' },
];
const empty = { areas:[], photos:[], questions:[], follows:[] };
const storageKey = 'trailbook-mobile-v1';
const areaColors = ['#c9ff73','#ffad80','#91cfff','#d8afff'];
const pinPositions = [{left:'19%',top:'61%'},{left:'49%',top:'39%'},{left:'78%',top:'59%'}];
const tabs = ['地図','旅ルート','困りごと','イベント・お店','My Trips'];
const today = () => new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);
const validDate = date => /^\d{4}-\d{2}-\d{2}$/.test(date) && new Date(date+'T00:00:00Z').toString() !== 'Invalid Date' && new Date(date+'T00:00:00Z').toISOString().slice(0,10) === date;
const id = () => Date.now().toString(36)+Math.random().toString(36).slice(2);

function Button({ children, onPress, active=false }) {
  return <Pressable accessibilityRole="button" accessibilityState={{selected:active}} onPress={onPress} style={[styles.button,active&&styles.active]}><Text style={[styles.label,active&&styles.dark]}>{children}</Text></Pressable>;
}
function Input({value,onChangeText,placeholder}) {
  return <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#9ba5b7" style={styles.input}/>;
}

export default function App() {
  const [data,setData]=useState(empty);
  const [loaded,setLoaded]=useState(false);
  const [world,setWorld]=useState('地球');
  const [selected,setSelected]=useState('kyoto');
  const [tab,setTab]=useState('地図');
  const [spot,setSpot]=useState(0);
  const [date,setDate]=useState(today);
  const [draft,setDraft]=useState('');
  const [newArea,setNewArea]=useState('');
  const [newSpot,setNewSpot]=useState('');
  const [question,setQuestion]=useState(null);
  const [busy,setBusy]=useState(false);
  useEffect(()=>{AsyncStorage.getItem(storageKey).then(raw=>{if(raw)setData({...empty,...JSON.parse(raw)});setLoaded(true)}).catch(()=>Alert.alert('保存データを読み込めませんでした','アプリを開き直してください。'));},[]);
  async function save(next) {
    await AsyncStorage.setItem(storageKey,JSON.stringify(next));
    setData(next);
  }
  async function update(next) {
    if(!loaded||busy)return;
    setBusy(true);
    try { await save(next); } catch { Alert.alert('保存できませんでした'); } finally { setBusy(false); }
  }
  const areas=[...sample,...data.areas];
  const areaColor=item=>areaColors[areas.indexOf(item)%areaColors.length];
  const visited=(item,i)=>data.photos.some(photo=>photo.area===item.id&&photo.spot===i);
  const visitedCount=item=>item.spots.filter((_,i)=>visited(item,i)).length;
  const area=areas.find(item=>item.id===selected);
  const names=area?.spots||[];
  const seeded=area?.question?[{id:'sample-'+area.id,area:area.id,title:area.question,answers:[area.answer],sample:true}]:[];
  const questions=[...seeded,...data.questions.filter(item=>item.area===selected&&!item.sample)].map(item=>data.questions.find(saved=>saved.id===item.id)||item);
  const thread=questions.find(item=>item.id===question);
  const follow=data.follows.includes(selected);
  const images=data.photos.filter(photo=>photo.area===selected&&photo.spot===spot);
  const crown=photos=>new Set(photos.map(photo=>photo.date)).size>=3?' ♛':'';
  function choose(next){setSelected(next);setSpot(0);setQuestion(null);setDraft('');setNewSpot('');}
  function addArea(){
    if(!newArea.trim()||!newSpot.trim()||busy||!loaded)return;
    const item={id:id(),name:newArea.trim(),spots:[newSpot.trim()]};
    update({...data,areas:[...data.areas,item]});
    choose(item.id);setNewArea('');setNewSpot('');setTab('地図');
  }
  async function addPhoto(){
    if(!loaded||busy)return;
    if(!validDate(date)){Alert.alert('訪問日を YYYY-MM-DD で入力してください');return;}
    setBusy(true);
    try{
      const result=await ImagePicker.launchImageLibraryAsync({mediaTypes:['images'],quality:0.65});
      if(result.canceled)return;
      const asset=result.assets[0];
      const photoId=id();
      const ext=asset.uri.match(/\.([a-z0-9]+)(?:\?|$)/i)?.[1]||'jpg';
      const destination=new File(Paths.document,photoId+'.'+ext);
      new File(asset.uri).copy(destination);
      try { await save({...data,photos:[...data.photos,{id:photoId,area:selected,spot,date,uri:destination.uri}]}); }
      catch(error){destination.delete();throw error;}
    }catch{Alert.alert('写真を保存できませんでした');}
    finally{setBusy(false);}
  }
  function submit(){
    const value=draft.trim();
    if(!value||!loaded||busy)return;
    const next=thread?{...thread,answers:[...thread.answers,value]}:{id:id(),area:selected,title:value,answers:[]};
    update({...data,questions:[...data.questions.filter(item=>item.id!==next.id),next]});setQuestion(next.id);setDraft('');
  }
  const gallery=photos=><View style={styles.row}>{photos.map(photo=><Image key={photo.id} accessibilityLabel={photo.date+' の訪問写真'} source={{uri:photo.uri}} style={styles.photo}/>)}</View>;
  return <View style={styles.root}><StatusBar style="light"/><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page}>
    <Text style={styles.brand}>TRAILBOOK  /  TRAVEL ATLAS</Text><Text style={styles.hero}>旅が、地図になる。</Text><Text style={styles.muted}>みんなの足あとから、次の旅へ。</Text>
    <View style={styles.row}>{['地球','月','火星'].map(item=><Button key={item} active={world===item} onPress={()=>setWorld(item)}>{item}</Button>)}</View>
    {world!=='地球'?<View style={styles.card}><Text style={styles.title}>{world}のアトラス</Text><Text style={styles.muted}>将来の探査記録用エリア。現在の試作では地球を探索できます。</Text></View>:<>
      <View style={styles.row}>{areas.map(item=>{const count=visitedCount(item);return <Pressable key={item.id} accessibilityRole="button" accessibilityState={{selected:selected===item.id}} onPress={()=>choose(item.id)} style={[styles.areaTile,count>0&&{backgroundColor:areaColor(item)},selected===item.id&&{borderColor:'#fff'}]}><Text style={[styles.label,count>0&&styles.dark]}>{item.name}</Text><Text style={[styles.tileCount,count>0&&styles.dark]}>{count} / {item.spots.length} 記録</Text></Pressable>;})}</View>
      <View style={styles.row}>{tabs.map(item=><Button key={item} active={tab===item} onPress={()=>{setTab(item);setDraft('');setQuestion(null);}}>{item}</Button>)}</View>
      {tab==='地図'&&area&&<>
        <View style={[styles.map,visitedCount(area)>0&&{borderColor:areaColor(area)}]}>
          <Text style={styles.brand}>MY TRAVEL ATLAS</Text><Text style={styles.title}>{area.name}</Text>
          <Text style={styles.muted}>{visitedCount(area)} / {names.length} スポットを記録</Text>
          <View style={styles.mapSurface}>
            <View pointerEvents="none" style={styles.mapRiver}/>
            {names.map((name,i)=>{const isVisited=visited(area,i);const records=data.photos.filter(photo=>photo.area===area.id&&photo.spot===i);return <Pressable key={name} accessibilityRole="button" accessibilityLabel={name+(isVisited?'、訪問記録あり':'、未記録')} accessibilityState={{selected:spot===i}} onPress={()=>setSpot(i)} style={[styles.mapPin,pinPositions[i],isVisited&&{backgroundColor:areaColor(area),borderColor:areaColor(area)},spot===i&&styles.selectedPin]}><Text style={[styles.label,isVisited&&styles.dark]}>{crown(records)?'♛':i+1}</Text></Pressable>;})}
          </View>
          <View style={styles.row}>{names.map((name,i)=><Button key={name} active={spot===i} onPress={()=>setSpot(i)}>{i+1} · {name}</Button>)}</View>
          <Text style={styles.tileCount}>模式図 · 色のついたピンは写真を残した場所</Text>
        </View>
        <View style={styles.card}><Text style={styles.title}>{names[spot]}{crown(images)}</Text><Text style={styles.muted}>別の日の訪問を3回記録すると王冠が付きます。</Text>{gallery(images)}<Input value={date} onChangeText={setDate} placeholder="YYYY-MM-DD"/><Button active onPress={addPhoto}>{busy?'保存中…':'訪問写真を追加'}</Button></View>
        <View style={styles.card}><Text style={styles.title}>エリアを追加</Text><Input value={newArea} onChangeText={setNewArea} placeholder="例：福岡・天神"/><Input value={newSpot} onChangeText={setNewSpot} placeholder="最初のスポット"/><Button onPress={addArea}>追加する</Button></View>
      </>}
      {tab==='旅ルート'&&<View style={styles.card}><Text style={styles.title}>モデルコース</Text><Text style={styles.muted}>{names.join(' → ')}</Text><Text style={styles.title}>みんなの旅ルート</Text><Text style={styles.muted}>{names.length>1?'サンプル · '+[...names].reverse().join(' → '):'公開ルートはまだありません。'}</Text></View>}
      {tab==='困りごと'&&<View style={styles.card}><Text style={styles.title}>{area?.name}の困りごと</Text>{thread?<><Button onPress={()=>{setQuestion(null);setDraft('');}}>質問一覧へ</Button><Text style={styles.title}>{thread.title}</Text>{thread.answers.map((answer,i)=><Text key={i} style={styles.answer}>{thread.sample&&i===0?'サンプル回答 · ':''}{answer}</Text>)}</>:questions.map(item=><Button key={item.id} onPress={()=>{setQuestion(item.id);setDraft('');}}>{item.title} · {item.answers.length}件</Button>)}<Input value={draft} onChangeText={setDraft} placeholder={thread?'回答を書く':'このエリアで聞きたいこと'}/><Button active onPress={submit}>{thread?'回答を保存':'質問を保存'}</Button></View>}
      {tab==='イベント・お店'&&<View style={styles.card}><Text style={styles.title}>エリアのイベント</Text><Button active={follow} onPress={()=>update({...data,follows:follow?data.follows.filter(item=>item!==selected):[...data.follows,selected]})}>{follow?'フォロー中':'このエリアをフォロー'}</Button><Text style={styles.answer}>{area?.event?(follow?'🔔 ':'')+area.event+'（サンプル）':'イベント情報はまだありません。'}</Text><Text style={styles.title}>お店・出店</Text><Text style={styles.muted}>{area?.shop?area.shop+'（サンプル）':'お店情報はまだありません。'}</Text><Text style={styles.muted}>フォローとベル表示は端末内のプレビューです。</Text></View>}
      {tab==='My Trips'&&<View style={styles.card}><Text style={styles.title}>My Trips</Text>{areas.flatMap(item=>item.spots.map((name,i)=>{const photos=data.photos.filter(photo=>photo.area===item.id&&photo.spot===i);return photos.length?<View key={item.id+i}><Text style={styles.title}>{item.name} / {name}{crown(photos)}</Text>{gallery(photos)}</View>:null;}))}{!data.photos.length&&<Text style={styles.muted}>地図のスポットに写真を追加すると、ここに並びます。</Text>}</View>}
    </>}
    <Text style={styles.muted}>試作 · 質問・回答・写真はこの端末に保存されます。</Text>
  </ScrollView></View>;
}
const styles=StyleSheet.create({
  root:{flex:1,backgroundColor:'#0c1220'},page:{padding:20,paddingTop:64,paddingBottom:52,gap:15},
  brand:{color:'#c9ff73',fontWeight:'800',letterSpacing:3,fontSize:11},hero:{color:'#f5f8ff',fontSize:40,fontWeight:'900',letterSpacing:-2},
  muted:{color:'#a9b7ce',lineHeight:22},title:{color:'#f5f8ff',fontSize:22,fontWeight:'800'},
  row:{flexDirection:'row',flexWrap:'wrap',gap:7},button:{minHeight:44,justifyContent:'center',paddingHorizontal:13,paddingVertical:9,backgroundColor:'#26344b',borderRadius:12},
  active:{backgroundColor:'#c9ff73'},label:{color:'#f2f7ff',fontWeight:'700'},dark:{color:'#101e18'},
  card:{backgroundColor:'#172236',borderRadius:20,padding:16,gap:12},map:{backgroundColor:'#172632',borderColor:'#334b59',borderWidth:1,borderRadius:24,padding:18,gap:10},
  areaTile:{backgroundColor:'#26344b',borderWidth:1,borderColor:'transparent',borderRadius:13,padding:10,minHeight:52},
  tileCount:{color:'#a9b7ce',fontSize:12},
  mapSurface:{height:175,backgroundColor:'#203642',borderRadius:15,overflow:'hidden'},
  mapRiver:{position:'absolute',height:260,width:46,left:'52%',top:-34,backgroundColor:'#2c5367',transform:[{rotate:'33deg'}]},
  mapPin:{position:'absolute',width:44,height:44,marginLeft:-22,marginTop:-22,borderRadius:22,alignItems:'center',justifyContent:'center',backgroundColor:'#101d2a',borderColor:'#758897',borderWidth:2},
  selectedPin:{borderColor:'#fff',borderWidth:3},
  answer:{color:'#e3ebfa',backgroundColor:'#26344b',padding:12,borderRadius:10},
  input:{color:'#fff',backgroundColor:'#0e1828',borderRadius:10,minHeight:48,padding:12},photo:{width:92,height:92,borderRadius:10},
});
