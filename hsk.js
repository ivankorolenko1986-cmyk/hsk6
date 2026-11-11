/* Блок «HSK 6 экзамен»: словарь 2500 слов HSK 6, игры, тренажёры по частям экзамена. Данные: hsk_words.json, hsk_exam.json */
(function(){
'use strict';
const V='11';
let W=null,E=null,L6=[],BASE=[],loading=null,T=[],ACT={};
let X={};try{X=JSON.parse(localStorage.getItem('hsk6x')||'{}')}catch(e){}
X.b=X.b||{};X.d=X.d||{};X.xp=X.xp||0;X.rec=X.rec||{};X.pool=X.pool||'cur';if(X.pool==='base')X.pool='cur';X.days=X.days||{};X.sx=X.sx||{};
const sv=()=>{try{localStorage.setItem('hsk6x',JSON.stringify(X))}catch(e){}};
const dn=()=>Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);
const GAPS=[0,1,3,7,14,30],SZ=50;
const rnd=n=>Math.floor(Math.random()*n);
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=(a,n)=>shuf(a).slice(0,n);
const EN=()=>S.en!==false;
const C={w:'#2E5C8A',g:'#B0702A',e:'#8E1B1B',ok:'#3D7A4E',v:'#6B4C8F',t:'#2A7A7A'};
function timer(f,ms){const t=setInterval(f,ms);T.push(t);return t}
function stop(){T.forEach(clearInterval);T=[];try{speechSynthesis.cancel()}catch(e){}}
function xp(n){X.xp+=n;const d=dn();X.days[d]=(X.days[d]||0)+n;sv()}
function streak(){let d=dn(),n=0;if(!X.days[d])d--;while(X.days[d]){n++;d--}return n}
function miss(w){if(w&&w.id){X.b[w.id]=0;X.d[w.id]=dn();sv()}}
function put(h,keep){app.innerHTML=h;if(!keep)scrollTo(0,0)}
function best(k,v,low){const o=X.rec[k];if(o===undefined||(low?v<o:v>o)){X.rec[k]=v;sv();return true}return false}
const css=document.createElement('style');css.textContent=`
.tiles{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}
.tile{background:#fff;border-radius:12px;padding:11px 12px;text-align:left;border-left:5px solid var(--c);box-shadow:0 1px 2px rgba(0,0,0,.06);font-size:calc(var(--k)*14px);color:var(--ink)}
.tile b{display:block}.tile span{display:block;color:var(--mut);font-size:calc(var(--k)*11.5px);margin-top:2px}
.tile.wide{grid-column:1/3}
.sec{font-weight:700;margin:16px 2px 4px;font-size:calc(var(--k)*15px)}
.stat{display:flex;gap:8px;text-align:center}.stat div{flex:1;background:#fff;border-radius:12px;padding:8px 4px}.stat b{display:block;font-size:calc(var(--k)*19px);color:#8E1B1B}.stat span{font-size:calc(var(--k)*11px);color:var(--mut)}
.opt{display:block;width:100%;margin:8px 0;padding:12px;text-align:left;background:#fff;border:1px solid #cfd6de;border-radius:10px;font-size:calc(var(--k)*16px);color:var(--ink)}
.opt.r{background:#E4F1E7;border-color:#3D7A4E}.opt.x{background:#FBEDED;border-color:#B4413C}
.opt .oz{font-size:calc(var(--k)*21px);color:var(--red);font-weight:600}
.op{display:none;color:#8a8a8a;font-style:italic;font-size:calc(var(--k)*12px);font-weight:400}.done .op{display:block}
.pairs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}.pairs>div{display:flex;flex-direction:column;gap:8px}
.pt{background:#fff;border:2px solid #dde2e8;border-radius:10px;min-height:62px;padding:6px;font-size:calc(var(--k)*13.5px);color:var(--ink)}
.pt.z{font-size:calc(var(--k)*21px);color:var(--red);font-weight:600}.pt small{display:block;font-size:.5em;color:var(--mut);font-weight:400;font-style:italic}
.pt.sel{border-color:#2E5C8A;background:#EAF1F8}.pt.bad{border-color:#B4413C;background:#FBEDED}.pt.done{opacity:.25;border-color:#3D7A4E}
.slots{min-height:54px;border-bottom:2px dashed #ccc;display:flex;flex-wrap:wrap;gap:6px;padding:6px 0;margin:10px 0}
.tls{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:14px 0}
.tl{background:#fff;border:2px solid #cfd6de;border-radius:10px;padding:8px 13px;font-size:calc(var(--k)*21px);color:var(--red);font-weight:600}
.tl.used{visibility:hidden}.tl.on{border-color:#2E5C8A}
.wr{display:flex;align-items:baseline;gap:8px;background:#fff;border-radius:10px;padding:8px 10px;margin:5px 0;border-left:4px solid #ddd}
.wr.s1{border-left-color:#E0B040}.wr.s2{border-left-color:#3D7A4E}
.wr .h{font-size:calc(var(--k)*20px);color:var(--red);font-weight:600;white-space:nowrap}.wr .m{flex:1;font-size:calc(var(--k)*13px)}
details.ref{background:#fff;border-radius:10px;padding:10px 12px;margin:6px 0;border-left:4px solid var(--c)}
details.ref summary{font-weight:600;cursor:pointer}details.ref summary .zh{font-size:calc(var(--k)*19px);display:inline}
textarea{width:100%;min-height:240px;font:inherit;font-size:calc(var(--k)*17px);padding:10px;border-radius:10px;border:1px solid #ccc}
.big{font-size:calc(var(--k)*30px);width:72px;height:72px}
.tf{display:flex;gap:10px;margin-top:12px}.tf button{flex:1;padding:18px;border-radius:12px;font-size:calc(var(--k)*17px);font-weight:600;color:#fff}
.para{margin:0 0 10px;font-size:calc(var(--k)*18px);text-indent:2em}
.blank{display:inline-block;min-width:3em;border-bottom:2px solid var(--red);text-align:center;color:var(--red);font-weight:700}
`;document.head.appendChild(css);

function load(){if(W)return Promise.resolve();
 if(!loading)loading=Promise.all(['hsk_words.json','hsk_exam.json'].map(f=>fetch(f+'?v='+V).then(r=>{if(!r.ok)throw 0;return r.json()}))).then(([w,e])=>{
  W=w.map(r=>({id:r[0],h:r[1],ps:r[2].split(' '),p:r[2].replace(/ /g,''),ru:r[3],en:r[4],l:r[5]}));E=e;L6=W.filter(x=>x.l===6);BASE=W.filter(x=>x.l<6)}).catch(e=>{loading=null;throw e});
 return loading}
const setW=n=>L6.slice(n*SZ,(n+1)*SZ);
const seen=w=>X.b[w.id]!==undefined, kn=w=>X.b[w.id]>=1;
function curSet(){for(let n=0;n*SZ<L6.length;n++)if(setW(n).some(w=>!kn(w)))return n;return 0}
const dueList=()=>W.filter(w=>seen(w)&&(X.d[w.id]||0)<=dn());
function pool(){let a=X.pool==='known'?L6.filter(kn):X.pool==='all'?L6:setW(curSet());if(a.length<12)a=setW(curSet());return a}
const poolName=()=>({cur:'набор '+(curSet()+1),known:'изученные',all:'весь HSK 6'})[L6.filter(kn).length<12&&X.pool==='known'?'cur':X.pool];

function nav(r){const c=history.state||{},d=c.v==='h'?(c.d||1)+1:1;try{history.pushState({v:'h',r:r,d:d},'')}catch(e){}render(r)}
function render(r){stop();ACT={};const i=r.indexOf(':'),n=i<0?r:r.slice(0,i),a=i<0?'':r.slice(i+1);
 if(!W)put((n==='hub'?tabs():'')+'<div class="help">Загружаю словарь HSK…</div>');if(n==='hub')bindTabs();
 load().then(()=>{(VIEWS[n]||VIEWS.hub)(a)},()=>{put((n==='hub'?tabs():'')+'<div class="help">Не удалось загрузить словарь. Для первой загрузки нужен интернет, потом блок работает без сети.</div>');if(n==='hub')bindTabs()})}
document.addEventListener('click',e=>{const el=e.target.closest&&e.target.closest('[data-a],[data-n]');if(!el||!app.contains(el))return;
 if(el.dataset.n!==undefined)nav(el.dataset.n);else if(el.dataset.a==='back')history.back();else{const f=ACT[el.dataset.a];if(f)f(el,e)}});

const wdet=w=>{const x=E.wx[w.h];return `<div class="py">${esc(w.p)}</div><div class="ru">${esc(w.ru)}</div>${EN()&&w.en?`<div class="en">${esc(w.en)}</div>`:''}`+
 (x?`${x.syn?`<div class="note syn">${esc(x.syn)}</div>`:''}${x.ant?`<div class="note ant">${esc(x.ant)}</div>`:''}${x.ex.length?`<div class="ex"><div class="lbl">примеры</div>${x.ex.map(e=>`<div class="exi"><div class="z">${hl(e[0],w.h)}</div><div class="pyl">${esc(e[2])}</div><div class="r">${esc(e[1])}</div></div>`).join('')}</div>`:''}`:'')};
const wcard=w=>`<div class="zh" style="font-size:calc(var(--k)*26px)">${esc(w.h)}</div>`+wdet(w);
const wrow=w=>`<div class="wr ${kn(w)?'s2':seen(w)?'s1':''}" data-a="w" data-h="${esc(w.h)}"><span class="h">${esc(w.h)}</span><span class="m"><span class="py">${esc(w.p)}</span> · ${esc(w.ru)}${EN()&&w.en?`<span class="en" style="display:block">${esc(w.en)}</span>`:''}</span></div>`;
const topl=(t,c,r)=>`<div class="top"><span style="font-weight:600;color:${c}">${t}</span><span>${r||''}</span></div>`;
const backBtn=(t)=>`<button class="ghost" data-a="back">${t||'← Назад'}</button>`;

const VIEWS={};
VIEWS.hub=()=>{const k=L6.filter(kn).length,sn=L6.filter(seen).length,due=dueList().length,cs=curSet(),st=streak(),td=X.days[dn()]||0;
 Object.keys(X.days).forEach(d=>{if(+d<dn()-400)delete X.days[d]});
 const g=(n,t,s,c,cls)=>`<button class="tile ${cls||''}" data-n="${n}" style="--c:${c}"><b>${t}</b><span>${s}</span></button>`;
 const rc=(k,u)=>X.rec[k]!==undefined?` · рекорд ${X.rec[k]}${u||''}`:'';
 const newLeft=setW(cs).filter(w=>!seen(w)).length;
 put(tabs()+`<div class="stat"><div><b>🔥 ${st}</b><span>дней подряд</span></div><div><b>${td}</b><span>верных сегодня</span></div><div><b>${k}</b><span>из 2500 слов HSK 6</span></div></div>
 <div class="bar" style="margin:8px 2px"><i style="width:${(100*k/2500).toFixed(1)}%;background:#8E1B1B"></i></div>
 <div class="row"><button class="go" style="--c:#8E1B1B;flex:1;padding:13px" data-n="learn:${cs}">▶ Учить новые слова · набор ${cs+1}</button></div>
 <div class="row"><button class="go" style="--c:#3D7A4E;flex:1;padding:13px" data-n="review">🔁 Повторить, что пора · ${due}</button></div>
 <div class="sec">📚 Слова</div><div class="tiles">
 ${g('sets','Наборы HSK 6','2500 слов · 50 наборов по 50, от частых к редким',C.w,'wide')}
 ${g('search','🔎 Поиск по словарю','2500 слов HSK 6: 汉字, pinyin, русский, English',C.w,'wide')}</div>
 <div class="sec">🎮 Игры</div><div class="lbl">на каких словах играть</div>
 <div class="seg" style="flex-wrap:wrap;margin:4px 0 8px">${[['cur','Набор '+(cs+1)],['known','Изученные'],['all','Весь HSK 6']].map(p=>`<button data-a="pool" data-p="${p[0]}" class="${X.pool==p[0]?'on':''}">${p[1]}</button>`).join('')}</div>
 <div class="tiles">${g('blitz','⚡ Блиц','20 слов, 8 секунд на ответ'+rc('blitz','/20'),C.g)}${g('pairs','🧩 Пары','соедините слово и перевод'+rc('pairs',' с'),C.g)}
 ${g('sprint','✅ Верно или нет','60 секунд на скорость'+rc('sprint'),C.g)}${g('tones','🎵 Тоны','выберите верный пиньинь'+rc('tones','/15'),C.g)}
 ${g('ear','👂 На слух','услышьте слово и найдите его'+rc('ear','/15'),C.g)}${g('wbuild','🔤 Собери слово','из иероглифов по переводу'+rc('wbuild','/10'),C.g)}
 ${g('sbuild','🧱 Собери фразу','расставьте части предложения'+rc('sbuild','/8'),C.g,'wide')}</div>
 <div class="sec">🎓 Экзамен</div><div class="tiles">
 ${g('guide','📋 Как устроен HSK 6','части, время, баллы, план подготовки',C.e,'wide')}
 ${g('listen:a','听力 · Аудирование','текст на слух и вопрос'+rc('listen','/8'),C.e)}${g('listen:r','阅读 · Чтение','короткий текст и вопрос'+rc('read','/8'),C.e)}
 ${g('bj','病句 · Найди ошибку','самая трудная часть чтения'+rc('bingju','/10'),C.e)}${g('cloze','选词填空 · Пропуски','синонимы и сочетаемость'+rc('cloze','/10'),C.e)}
 ${g('suoxie','缩写 · Изложение','прочитать, запомнить, пересказать',C.e)}${g('mock','⏱ Мини-экзамен','18 заданий из всех частей'+rc('mock','/18'),C.e)}
 ${g('grammar','Грамматика HSK 6',E.grammar.length+' конструкций с примерами',C.t)}${g('idioms','成语 · Чэнъюи',E.idioms.length+' выражений + игры',C.t)}
 ${g('syn','Похожие слова',E.syn.length+' пар: в чём разница',C.t,'wide')}</div>
 <div class="help">Всего очков: ⭐ ${X.xp}. Просмотрено слов HSK 6: ${sn}. Прогресс хранится в этом телефоне, блок работает без интернета.<br>🔊 Для звука нужен китайский голос синтеза речи (на Android — «Синтезатор речи Google», язык 中文).<br><span style="font-size:.9em">Список слов и переводы: открытый проект LiudmilaLV/json_hsk (chineseplus.club), порядок по частоте — complete-hsk-vocabulary.</span></div>`);
 bindTabs();ACT.pool=el=>{X.pool=el.dataset.p;sv();const y=scrollY;VIEWS.hub();scrollTo(0,y)}};

/* ── карточки: новые слова и повторение */
function cards(list,title,color){let q=list.slice(),cur=null,shown=false,n=0;
 function nx(){if(!q.length){put(`<div class="card" style="text-align:center;min-height:auto"><div class="zh">太好了！</div><p>${n?'Готово: '+n+' карточек.':'Здесь пока нечего учить.'}</p><div class="row" style="justify-content:center">${backBtn()}</div></div>`);return}cur=q.shift();shown=false;dr()}
 function dr(){const w=cur,isNew=!seen(w);
  put(topl(title,color,'осталось '+(q.length+1))+`<div class="card" style="--c:${color}"><div class="lbl">${isNew?'новое слово':'вспомните перевод'}</div>
  <div style="display:flex;align-items:center;gap:10px"><div class="zh">${esc(w.h)}</div><button class="spk" data-a="spk">🔊</button></div>${isNew||shown?wdet(w):'<div class="hint">как читается и что значит?</div>'}</div>
  <div class="ans">${isNew?`<button class="show" style="--c:${color}" data-a="mem">Дальше →</button>`:shown?`<button class="no" data-a="no">Не знаю</button><button class="ok" data-a="ok">Знаю</button>`:`<button class="show" style="--c:${color}" data-a="sh">Показать</button>`}</div>`)}
 ACT.spk=()=>say(cur.h);ACT.sh=()=>{shown=true;dr()};
 ACT.mem=()=>{X.b[cur.id]=0;X.d[cur.id]=dn();sv();q.push(cur);nx()};
 ACT.ok=()=>{const b=Math.min((X.b[cur.id]||0)+1,5);X.b[cur.id]=b;X.d[cur.id]=dn()+GAPS[b];n++;xp(1);nx()};
 ACT.no=()=>{X.b[cur.id]=0;X.d[cur.id]=dn();sv();q.splice(Math.min(3,q.length),0,cur);nx()};
 nx()}
VIEWS.learn=a=>{const n=+a||0,ws=setW(n),fresh=ws.filter(w=>!seen(w)).slice(0,10);
 cards(fresh.length?fresh:ws.filter(w=>!kn(w)).slice(0,10),'Набор '+(n+1)+' · новые слова',C.w)};
VIEWS.review=()=>cards(shuf(dueList()).slice(0,30),'Повторение',C.ok);

/* ── списки слов */
function wordActs(){ACT.w=el=>say(el.dataset.h)}
VIEWS.sets=()=>{let h=topl('Наборы HSK 6',C.w,'от частых слов к редким');
 for(let n=0;n*SZ<L6.length;n++){const ws=setW(n),k=ws.filter(kn).length;
  h+=`<div class="deck" style="--c:${C.w}" data-n="set:${n}"><div style="flex:1"><div class="t">Набор ${n+1} <span class="n">· ${ws.slice(0,3).map(w=>w.h).join('、')}…</span></div><div class="n">слова ${n*SZ+1}–${n*SZ+ws.length} · выучено ${k} из ${ws.length}</div><div class="bar"><i style="width:${100*k/ws.length}%"></i></div></div><span style="color:${C.w}">›</span></div>`}
 put(h)};
VIEWS.set=a=>{const n=+a||0,ws=setW(n);
 put(topl('Набор '+(n+1),C.w,'выучено '+ws.filter(kn).length+' из '+ws.length)+`<div class="row"><button class="go" style="--c:${C.w};flex:1" data-n="learn:${n}">▶ Учить по 10</button><button class="go" style="--c:${C.g};flex:1" data-n="blitz:${n}">⚡ Блиц по набору</button></div>
 <div class="lbl">нажмите на слово — прозвучит · зелёная полоска = выучено, жёлтая = в работе</div>`+ws.map(wrow).join(''));wordActs()};
VIEWS.search=()=>{put(`<input type="search" id="hq" placeholder="汉字, pinyin (можно без тонов), русский или English"><div id="hres"></div>`);
 const q=document.getElementById('hq'),res=document.getElementById('hres');const flat=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
 if(!W[0].f)W.forEach(w=>w.f=(w.h+'|'+flat(w.p)+'|'+w.ru+'|'+w.en).toLowerCase());
 const run=()=>{const t=flat(q.value.trim()).replace(/\s+/g,' ');if(!t){res.innerHTML='<div class="help">Введите слово. Найдёт по всем 2500 словам HSK 6.</div>';return}
  const t2=t.replace(/ /g,'');const it=W.filter(w=>w.f.includes(t)||w.f.includes(t2)).sort((a,b)=>a.h.length-b.h.length).slice(0,60);
  res.innerHTML=it.length?it.map(w=>`<div class="li" style="--c:${C.w}">${wcard(w)}</div>`).join(''):'<div class="help">Ничего не найдено.</div>'};
 q.oninput=run;run();q.focus()};

/* ── общий движок вопросов с вариантами */
function quiz(c){let i=0,ok=0,wrong=[],left=0;const so={},sn={};
 function dr(){stop();const q=c.qs[i];if(!q)return end();
  put(topl(c.title+' · '+(i+1)+'/'+c.qs.length,c.color,'✓ '+ok+(c.time?` · <b id="tm">${c.time}</b> с`:''))+(c.time?`<div class="bar"><i id="tb" style="width:100%;background:${c.color};transition:width 1s linear"></i></div>`:'')+
  `<div class="card" style="--c:${c.color};min-height:auto">${q.q}</div><div id="opts">${q.opts.map((o,k)=>`<button class="opt" data-a="o" data-k="${k}">${o}</button>`).join('')}</div><div id="exp"></div>`);
  ACT.o=el=>ans(+el.dataset.k);ACT.say=()=>say(q.say||q.say0);
  if(q.say)setTimeout(()=>say(q.say),300);
  if(c.time){left=c.time;timer(()=>{left--;const tm=document.getElementById('tm'),tb=document.getElementById('tb');if(tm)tm.textContent=left;if(tb)tb.style.width=(100*left/c.time)+'%';if(left<=0)ans(-1)},1000)}}
 function ans(k){T.forEach(clearInterval);T=[];const q=c.qs[i];ACT.o=null;const box=document.getElementById('opts');box.classList.add('done');
  box.querySelectorAll('.opt').forEach((b,j)=>{if(j===q.a)b.classList.add('r');else if(j===k)b.classList.add('x')});
  if(q.sec)sn[q.sec]=(sn[q.sec]||0)+1;
  if(k===q.a){ok++;xp(1);if(q.sec)so[q.sec]=(so[q.sec]||0)+1}else{wrong.push(q);miss(q.w)}
  const ex=document.getElementById('exp');ex.innerHTML=`<div class="card" style="--c:${k===q.a?C.ok:'#B4413C'};min-height:auto;margin-top:8px"><div class="lbl" style="color:${k===q.a?C.ok:'#B4413C'}">${k===q.a?'верно':k<0?'время вышло':'неверно'}</div>${q.ex||''}<button class="go" style="--c:${c.color};width:100%;margin-top:10px;padding:12px" data-a="nx">${i+1<c.qs.length?'Дальше →':'Итог'}</button></div>`;
  ACT.nx=()=>{i++;dr()};ex.scrollIntoView({block:'nearest'})}
 function end(){stop();const n=c.qs.length,p=n?Math.round(100*ok/n):0,nr=n&&best(c.key,ok);
  put(`<div class="card" style="text-align:center;min-height:auto;--c:${c.color}"><div class="zh">${p>=80?'太棒了！':p>=50?'不错！':'加油！'}</div><div class="ru">${ok} из ${n} · ${p}%</div>${nr&&ok?'<div class="lbl">🏆 новый рекорд</div>':''}
  ${Object.keys(sn).length?`<div style="text-align:left;margin:10px 0">${Object.keys(sn).map(s=>`<div>${s}: <b>${so[s]||0} из ${sn[s]}</b></div>`).join('')}</div>`:''}
  ${wrong.length?`<div class="lbl" style="margin-top:12px">ошибки${wrong.some(q=>q.w)?' — слова добавлены в повторение':''}</div>${wrong.map(q=>`<div class="li" style="--c:${c.color};text-align:left">${q.sum||q.ex||''}</div>`).join('')}`:''}
  <div class="row" style="justify-content:center;margin-top:12px"><button class="go" style="--c:${c.color}" data-a="again">Ещё раз</button>${backBtn()}</div></div>`);
  ACT.again=()=>c.again()}
 dr()}
const sumw=w=>`<span class="zh">${esc(w.h)}</span> <span class="py">${esc(w.p)}</span><div class="ru" style="display:block">${esc(w.ru)}</div>`;
function qWord(w,P,dir){const o=shuf([w].concat(pick(P.filter(x=>x.id!==w.id&&x.ru!==w.ru&&x.h!==w.h),3)));
 return{q:dir==='zr'?`<div class="lbl">что значит?</div><div class="zh">${esc(w.h)}</div><div class="py">${esc(w.p)}</div>`:`<div class="lbl">как по-китайски?</div><div class="ru">${esc(w.ru)}</div>${EN()&&w.en?`<div class="en">${esc(w.en)}</div>`:''}`,
  opts:o.map(x=>dir==='zr'?esc(x.ru):`<span class="oz">${esc(x.h)}</span> <span class="py">${esc(x.p)}</span>`),a:o.indexOf(w),ex:wcard(w),sum:sumw(w),w:w}}
VIEWS.blitz=a=>{let P,t;if(a&&a[0]==='b'){P=BASE.filter(w=>w.l===+a[1]);t='HSK '+a[1]}else if(a!==''){P=setW(+a);t='набор '+(+a+1)}else{P=pool();t=poolName()}
 const mk=()=>quiz({title:'⚡ Блиц · '+t,color:C.g,key:a?'blitz_'+a:'blitz',time:8,qs:pick(P,20).map(w=>qWord(w,P,Math.random()<.5?'zr':'rz')),again:mk});mk()};
const TM={a:'āáǎà',e:'ēéěè',i:'īíǐì',o:'ōóǒò',u:'ūúǔù','ü':'ǖǘǚǜ'},TR=/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/;
function retone(ps){const idx=[];ps.forEach((s,i)=>{if(TR.test(s))idx.push(i)});if(!idx.length)return null;const out=ps.slice();
 const ch=k=>{out[k]=out[k].replace(TR,c=>{for(const b in TM){const j=TM[b].indexOf(c);if(j>=0){let n;do{n=rnd(4)}while(n===j);return TM[b][n]}}return c})};
 ch(idx[rnd(idx.length)]);if(idx.length>1&&Math.random()<.4)ch(idx[rnd(idx.length)]);return out.join('')}
VIEWS.tones=()=>{const P=pool().filter(w=>w.ps.some(s=>TR.test(s)));
 const mk=()=>quiz({title:'🎵 Тоны · '+poolName(),color:C.g,key:'tones',again:mk,qs:pick(P,15).map(w=>{const v=new Set();let g=0;while(v.size<3&&g++<60){const r=retone(w.ps);if(r&&r!==w.p)v.add(r)}
  const o=shuf([w.p].concat([...v]));return{q:`<div class="lbl">как читается?</div><div class="zh">${esc(w.h)}</div><div class="rs">${esc(w.ru)}</div>`,opts:o.map(x=>`<span style="font-size:1.15em">${esc(x)}</span>`),a:o.indexOf(w.p),ex:wcard(w)+`<button class="spk" data-a="say">🔊</button>`,say0:w.h,sum:sumw(w),w:w}})});mk()};
VIEWS.ear=()=>{const P=pool();
 const mk=()=>quiz({title:'👂 На слух · '+poolName(),color:C.g,key:'ear',again:mk,qs:pick(P,15).map(w=>{const same=P.filter(x=>x.id!==w.id&&x.h.length===w.h.length&&x.h!==w.h);
  const o=shuf([w].concat(pick(same.length>=3?same:P.filter(x=>x.id!==w.id),3)));
  return{q:`<div class="lbl">послушайте и выберите слово</div><div style="text-align:center;padding:8px"><button class="spk big" data-a="say">🔊</button></div>`,say:w.h,opts:o.map(x=>`<span class="oz">${esc(x.h)}</span><span class="op">${esc(x.p)} · ${esc(x.ru)}</span>`),a:o.indexOf(w),ex:wcard(w),sum:sumw(w),w:w}})});mk()};

/* ── пары */
VIEWS.pairs=()=>{const P=pool();let round=0,err=0,sel=null,left=0;const t0=Date.now();const R=3;
 const sh=s=>{s=s.split(';')[0];return s.length>34?s.slice(0,33)+'…':s};
 function rd(){const ws=[];for(const w of shuf(P)){if(!ws.some(x=>x.ru===w.ru||x.h===w.h))ws.push(w);if(ws.length===6)break}left=ws.length;sel=null;
  put(topl('🧩 Пары · раунд '+(round+1)+'/'+R,C.g,'<b id="pt">'+Math.round((Date.now()-t0)/1000)+'</b> с · ошибок '+err)+`<div class="pairs"><div>${shuf(ws).map(w=>`<button class="pt z" data-a="p" data-s="l" data-id="${w.id}">${esc(w.h)}<small>${esc(w.p)}</small></button>`).join('')}</div><div>${shuf(ws).map(w=>`<button class="pt" data-a="p" data-s="r" data-id="${w.id}">${esc(sh(w.ru))}</button>`).join('')}</div></div>`,round>0)}
 timer(()=>{const e=document.getElementById('pt');if(e)e.textContent=Math.round((Date.now()-t0)/1000)},1000);
 ACT.p=el=>{if(el.classList.contains('done'))return;if(el.dataset.s==='l')say(el.firstChild.textContent);
  if(!sel||sel.dataset.s===el.dataset.s){if(sel)sel.classList.remove('sel');sel=el;el.classList.add('sel');return}
  const s=sel;sel=null;if(s.dataset.id===el.dataset.id){s.classList.remove('sel');s.classList.add('done');el.classList.add('done');xp(1);if(!--left){round++;if(round<R)setTimeout(rd,350);else fin()}}
  else{err++;el.classList.add('bad');s.classList.add('bad');miss(W.find(w=>w.id==s.dataset.id));setTimeout(()=>{el.classList.remove('bad');s.classList.remove('bad','sel')},450)}};
 function fin(){stop();const sec=Math.round((Date.now()-t0)/1000)+err*3,nr=best('pairs',sec,true);
  put(`<div class="card" style="text-align:center;min-height:auto;--c:${C.g}"><div class="zh">${err?'不错！':'太棒了！'}</div><div class="ru">${sec} с</div><p>ошибок: ${err} (каждая +3 с)${nr?'<br>🏆 новый рекорд':'<br>рекорд: '+X.rec.pairs+' с'}</p><div class="row" style="justify-content:center"><button class="go" style="--c:${C.g}" data-a="again">Ещё раз</button>${backBtn()}</div></div>`);
  ACT.again=()=>{ACT={};VIEWS.pairs()}}
 rd()};

/* ── верно или нет: 60 секунд */
VIEWS.sprint=()=>{const P=pool();let score=0,combo=0,left=60,cur=null,bad=[],lock=false;
 function nx(){const w=P[rnd(P.length)];let o=w;if(Math.random()<.5){do{o=P[rnd(P.length)]}while(o.ru===w.ru)}cur={w:w,o:o,t:o===w};dr()}
 function dr(fb){put(topl('✅ Верно или нет · '+poolName(),C.g,'⭐ '+score+(combo>2?' · серия '+combo:'')+' · <b id="st">'+left+'</b> с')+`<div class="bar"><i id="sb" style="width:${100*left/60}%;background:${C.g};transition:width 1s linear"></i></div>
  <div class="card" style="--c:${C.g};min-height:auto;text-align:center"><div class="zh">${esc(cur.w.h)}</div><div class="py">${esc(cur.w.p)}</div><div class="ru" style="margin-top:14px">${esc(cur.o.ru)}</div>${fb||''}</div>
  <div class="tf"><button style="background:#B4413C" data-a="f">✗ Неверно</button><button style="background:#3D7A4E" data-a="t">✓ Верно</button></div>`,true)}
 function ans(v){if(lock)return;if(v===cur.t){score++;combo++;xp(1);nx()}else{combo=0;bad.push(cur.w);miss(cur.w);lock=true;dr(`<div class="note ant" style="margin-top:12px">на самом деле: ${esc(cur.w.ru)}</div>`);setTimeout(()=>{lock=false;if(left>0)nx()},1100)}}
 ACT.t=()=>ans(true);ACT.f=()=>ans(false);
 timer(()=>{left--;const e=document.getElementById('st'),b=document.getElementById('sb');if(e)e.textContent=left;if(b)b.style.width=(100*left/60)+'%';if(left<=0)fin()},1000);
 function fin(){stop();ACT.t=ACT.f=null;const nr=best('sprint',score);
  put(`<div class="card" style="text-align:center;min-height:auto;--c:${C.g}"><div class="zh">${score>=25?'太棒了！':score>=12?'不错！':'加油！'}</div><div class="ru">${score} верных за 60 с</div>${nr&&score?'<div class="lbl">🏆 новый рекорд</div>':'<div class="lbl">рекорд: '+(X.rec.sprint||0)+'</div>'}
  ${bad.length?`<div class="lbl" style="margin-top:12px">ошибки — добавлены в повторение</div>${[...new Set(bad)].map(w=>`<div class="li" style="--c:${C.g};text-align:left">${sumw(w)}</div>`).join('')}`:''}
  <div class="row" style="justify-content:center;margin-top:12px"><button class="go" style="--c:${C.g}" data-a="again">Ещё раз</button>${backBtn()}</div></div>`);ACT.again=()=>{ACT={};VIEWS.sprint()}}
 nx()};

/* ── сборка из плиток: слово, чэнъюй, фраза */
function tiles(c){let i=0,ok=0,sel=[],pl=[],state=0;
 function st(){const it=c.items[i];if(!it)return end();sel=[];state=0;pl=shuf(it.parts.concat(it.extra||[])).map((t,k)=>({t:t,k:k,used:false}));paint()}
 function paint(keep){const it=c.items[i];
  put(topl(c.title+' · '+(i+1)+'/'+c.items.length,c.color,'✓ '+ok)+`<div class="card" style="--c:${state===1?C.ok:state===2?'#B4413C':c.color};min-height:auto">${it.prompt}
  <div class="slots">${sel.map((s,j)=>`<button class="tl on" data-a="un" data-j="${j}">${esc(s.t)}</button>`).join('')}</div>
  ${state?`<div class="lbl" style="color:${state===1?C.ok:'#B4413C'}">${state===1?'верно':'правильно так'}</div>${it.after}<button class="go" style="--c:${c.color};width:100%;margin-top:10px;padding:12px" data-a="nx">${i+1<c.items.length?'Дальше →':'Итог'}</button>`:''}</div>
  ${state?'':`<div class="tls">${pl.map(p=>`<button class="tl${p.used?' used':''}" data-a="add" data-k="${p.k}">${esc(p.t)}</button>`).join('')}</div><div class="row" style="justify-content:center"><button class="ghost" data-a="clr">Сбросить</button><button class="ghost" data-a="dk">Не знаю</button></div>`}`,keep)}
 function chk(right){const it=c.items[i];state=right?1:2;if(right){ok++;xp(2)}else miss(it.w);if(it.say)say(it.say);paint(true)}
 ACT.add=el=>{if(state)return;const p=pl[+el.dataset.k];if(p.used)return;p.used=true;sel.push(p);const it=c.items[i];if(sel.length>=it.parts.length)chk(sel.map(s=>s.t).join('')===it.answer);else paint(true)};
 ACT.un=el=>{if(state)return;const p=sel.splice(+el.dataset.j,1)[0];p.used=false;paint(true)};
 ACT.clr=()=>{sel.forEach(p=>p.used=false);sel=[];paint(true)};ACT.dk=()=>chk(false);ACT.nx=()=>{i++;st()};
 function end(){const n=c.items.length,nr=best(c.key,ok);put(`<div class="card" style="text-align:center;min-height:auto;--c:${c.color}"><div class="zh">${ok>=n*.8?'太棒了！':ok>=n*.5?'不错！':'加油！'}</div><div class="ru">${ok} из ${n}</div>${nr&&ok?'<div class="lbl">🏆 новый рекорд</div>':''}<div class="row" style="justify-content:center;margin-top:12px"><button class="go" style="--c:${c.color}" data-a="again">Ещё раз</button>${backBtn()}</div></div>`);ACT.again=()=>c.again()}
 st()}
VIEWS.wbuild=()=>{const P=pool().filter(w=>w.h.length>=2&&w.h.length<=4),chars=[...new Set(P.map(w=>w.h).join(''))];
 const mk=()=>{ACT={};tiles({title:'🔤 Собери слово · '+poolName(),color:C.g,key:'wbuild',again:mk,items:pick(P,10).map(w=>({prompt:`<div class="lbl">соберите слово</div><div class="ru">${esc(w.ru)}</div>${EN()&&w.en?`<div class="en">${esc(w.en)}</div>`:''}<div class="py">${esc(w.p)}</div>`,
  parts:[...w.h],extra:pick(chars.filter(ch=>!w.h.includes(ch)),4),answer:w.h,after:wcard(w),w:w,say:w.h}))})};mk()};
VIEWS.sbuild=()=>{const mk=()=>{ACT={};tiles({title:'🧱 Собери фразу',color:C.g,key:'sbuild',again:mk,items:pick(E.build,8).map(b=>({prompt:`<div class="lbl">соберите предложение</div><div class="ru" style="font-size:calc(var(--k)*17px)">${esc(b.ru)}</div>`,
  parts:b.parts,answer:b.parts.join(''),after:`<div class="zs">${esc(b.parts.join(''))}</div><div class="pyl">${esc(b.py)}</div>`,say:b.parts.join('')}))})};mk()};
VIEWS.ibuild=()=>{const chars=[...new Set(E.idioms.map(x=>x.h).join(''))];const mk=()=>{ACT={};tiles({title:'成语 · соберите',color:C.t,key:'ibuild',again:mk,items:pick(E.idioms.filter(x=>x.h.length===4),10).map(x=>({prompt:`<div class="lbl">соберите чэнъюй</div><div class="ru" style="font-size:calc(var(--k)*18px)">${esc(x.ru)}</div><div class="rs">${esc(x.lit)}</div>`,
  parts:[...x.h],extra:pick(chars.filter(ch=>!x.h.includes(ch)),4),answer:x.h,after:idi(x),say:x.h}))})};mk()};
VIEWS.iquiz=()=>{const P=E.idioms;const mk=()=>quiz({title:'成语 · блиц',color:C.t,key:'iquiz',again:mk,qs:pick(P,12).map(x=>{const zr=Math.random()<.5,o=shuf([x].concat(pick(P.filter(y=>y!==x),3)));
 return{q:zr?`<div class="lbl">что значит?</div><div class="zh">${esc(x.h)}</div><div class="py">${esc(x.py)}</div>`:`<div class="lbl">какой чэнъюй?</div><div class="ru">${esc(x.ru)}</div>`,opts:o.map(y=>zr?esc(y.ru):`<span class="oz">${esc(y.h)}</span><span class="op">${esc(y.py)}</span>`),a:o.indexOf(x),ex:idi(x)}})});mk()};

/* ── экзамен */
VIEWS.guide=()=>{put(topl('📋 Как устроен HSK 6',C.e)+E.guide.map(g=>`<div class="set"><div style="font-weight:700;color:#8E1B1B;margin-bottom:6px">${esc(g[0])}</div>${g[1].map(l=>`<div style="margin:6px 0;padding-left:14px;text-indent:-14px">• ${esc(l)}</div>`).join('')}</div>`).join('')+`<div class="row">${backBtn()}</div>`)};
const zo=(z,p)=>`${esc(z)}<span class="op">${esc(p)}</span>`;
function qBing(){const bad=pick(E.bingju.filter(b=>!b.ok),1)[0],good=pick(E.bingju.filter(b=>b.ok).map(b=>[b.s,b.py]).concat(E.good),3),o=shuf([[bad.s,bad.py]].concat(good));
 const ex=`<div class="zs" style="text-decoration:line-through;text-decoration-color:#B4413C">${esc(bad.s)}</div><div><b>${esc(bad.type)}</b></div><div class="rs">${esc(bad.why)}</div><div class="lbl" style="margin-top:8px">правильно</div><div class="zs">${esc(bad.fix)}</div><div class="pyl">${esc(bad.fp)}</div>`;
 return{q:`<div class="lbl">病句</div><div class="rs">Выберите предложение <b>с ошибкой</b></div>`,opts:o.map(x=>zo(x[0],x[1])),a:o.findIndex(x=>x[0]===bad.s),ex:ex,sum:ex,sec:'病句'}}
function qBing1(b){const ex=b.ok?`<div class="rs">Предложение верное. ${esc(b.why)}</div>`:`<div><b>${esc(b.type)}</b></div><div class="rs">${esc(b.why)}</div><div class="lbl" style="margin-top:8px">правильно</div><div class="zs">${esc(b.fix)}</div><div class="pyl">${esc(b.fp)}</div>`;
 return{q:`<div class="lbl">есть ли ошибка?</div><div class="zs">${esc(b.s)}</div>`,opts:['✓ Предложение верное','✗ Есть ошибка'],a:b.ok?0:1,ex:`<div class="pyl">${esc(b.py)}</div>`+ex,sum:`<div class="zs">${esc(b.s)}</div>`+ex}}
function qCloze(x,three){const idx=shuf(x.opts.map((_,k)=>k));const ex=`<div class="zs">${x.full}</div><div class="pyl">${esc(x.py)}</div><div class="zru">${esc(x.ru)}</div><div class="note det">${esc(x.why)}</div>`;
 return{q:`<div class="lbl">选词填空</div><div class="zs">${esc(x.s).replace(/____(.)?/g,'<span style="white-space:nowrap"><span class="blank">&nbsp;</span>$1</span>')}</div>`,opts:idx.map(k=>`<span class="${three?'':'oz'}" style="${three?'font-size:1.1em;color:var(--red)':''}">${esc(x.opts[k])}</span>`),a:idx.indexOf(x.a),ex:ex,sum:ex,sec:'选词填空'}}
function qListen(x,audio){const idx=shuf(x.opts.map((_,k)=>k));const txt=`<div class="zs" style="font-size:calc(var(--k)*16px)">${esc(x.t)}</div>`,ex=(audio?txt:'')+`<div class="pyl">${esc(x.py)}</div><div class="zru" style="margin-top:6px">${esc(x.ru)}</div>`;
 return{q:(audio?`<div class="lbl">听力 · текст звучит, читать нельзя</div><div style="text-align:center;padding:6px"><button class="spk big" data-a="say">🔊</button></div>`:`<div class="lbl">阅读</div>${txt}`)+`<div class="zs" style="font-weight:600">${esc(x.q)}</div>`,say:audio?x.t:'',opts:idx.map(k=>zo(x.opts[k],x.op[k])),a:idx.indexOf(x.a),ex:ex,sum:`<div class="zs" style="font-weight:600">${esc(x.q)}</div><div>${esc(x.opts[x.a])}</div>`,sec:audio?'听力':'阅读'}}
VIEWS.bj=()=>{const types=[...new Set(E.bingju.filter(b=>!b.ok).map(b=>b.type))];
 put(topl('病句 · Найди ошибку',C.e)+`<div class="tiles"><button class="tile wide" style="--c:${C.e}" data-n="bingju"><b>Как на экзамене</b><span>4 предложения — найдите одно с ошибкой · 10 заданий</span></button><button class="tile wide" style="--c:${C.e}" data-n="bingju1"><b>По одному</b><span>верное или с ошибкой? · 12 предложений с разбором</span></button></div>
 <div class="set"><div style="font-weight:700;color:#8E1B1B">Какие бывают ошибки</div>${types.map(t=>{const b=E.bingju.find(x=>x.type===t);return `<div style="margin:10px 0"><b>${esc(t)}</b><div class="zs" style="font-size:calc(var(--k)*15px);margin:2px 0">✗ ${esc(b.s)}</div><div class="zs" style="font-size:calc(var(--k)*15px);margin:2px 0">✓ ${esc(b.fix)}</div><div class="rs">${esc(b.why)}</div></div>`}).join('')}</div>`)};
VIEWS.bingju=()=>{const mk=()=>{const qs=[],u=new Set();let g=0;while(qs.length<10&&g++<200){const q=qBing();if(!u.has(q.ex)){u.add(q.ex);qs.push(q)}}quiz({title:'病句',color:C.e,key:'bingju',qs:qs,again:mk})};mk()};
VIEWS.bingju1=()=>{const mk=()=>quiz({title:'病句 · по одному',color:C.e,key:'bingju1',qs:pick(E.bingju,12).map(qBing1),again:mk});mk()};
VIEWS.cloze=()=>{const mk=()=>quiz({title:'选词填空',color:C.e,key:'cloze',qs:shuf(pick(E.cloze,7).map(x=>qCloze(x)).concat(pick(E.cloze3,3).map(x=>qCloze(x,true)))),again:mk});mk()};
VIEWS.listen=a=>{const au=a!=='r';const mk=()=>quiz({title:au?'听力':'阅读',color:C.e,key:au?'listen':'read',qs:pick(E.listen,8).map(x=>qListen(x,au)),again:mk});mk()};
VIEWS.mock=()=>{const mk=()=>{const ls=shuf(E.listen),bq=[],u=new Set();let g=0;while(bq.length<5&&g++<100){const q=qBing();if(!u.has(q.ex)){u.add(q.ex);bq.push(q)}}
 quiz({title:'⏱ Мини-экзамен',color:C.e,key:'mock',again:mk,qs:ls.slice(0,4).map(x=>qListen(x,true)).concat(bq,pick(E.cloze,3).map(x=>qCloze(x)),pick(E.cloze3,2).map(x=>qCloze(x,true)),ls.slice(4,8).map(x=>qListen(x,false)))})};mk()};
VIEWS.suoxie=()=>{put(topl('缩写 · Изложение',C.e)+`<div class="set"><b>Как на экзамене:</b> 10 минут читаете рассказ на 1000 знаков, записывать нельзя; текст забирают; 35 минут пишете пересказ на 400 знаков с заголовком, без своего мнения.<br><b>Здесь:</b> тексты короче — около 450 знаков, чтение 5 минут, пересказ около 200 знаков.</div>`+
 E.suoxie.map((s,i)=>`<div class="deck" style="--c:${C.e}" data-n="sx:${i}"><div style="flex:1"><div class="t">${esc(s.title)}</div><div class="n">${esc(s.ru_title)} · ${s.text.join('').length} знаков${X.sx[i]?' · есть ваш текст':''}</div></div><span style="color:${C.e}">›</span></div>`).join(''))};
VIEWS.sx=a=>{const i=+a||0,s=E.suoxie[i];let left=s.minutes*60,t0=0;const cnt=t=>(t.match(/[一-鿿]/g)||[]).length;const mmss=x=>Math.floor(x/60)+':'+('0'+x%60).slice(-2);
 function intro(){stop();put(topl('缩写 · '+esc(s.title),C.e)+`<div class="set">1. Читайте ${s.minutes} минут. Запоминайте: кто, где, когда, почему, что произошло, чем закончилось, главная мысль.<br>2. Текст исчезнет. Напишите пересказ примерно на ${s.target} иероглифов и заголовок.<br>3. Сравните с образцом и отметьте, что вы передали.</div><div class="row"><button class="go" style="--c:${C.e};flex:1;padding:13px" data-a="rd">Начать чтение · ${s.minutes} мин</button></div>${X.sx[i]?`<div class="row"><button class="ghost" data-a="res">Мой прошлый текст и образец</button></div>`:''}`)}
 function read(){left=s.minutes*60;put(topl('Чтение',C.e,'осталось <b id="rt">'+mmss(left)+'</b>')+`<div class="card" style="--c:${C.e}">${s.text.map(p=>`<p class="para">${esc(p)}</p>`).join('')}</div><div class="row"><button class="go" style="--c:${C.e};flex:1;padding:13px" data-a="wr">Прочитал — писать</button></div>`);
  timer(()=>{left--;const e=document.getElementById('rt');if(e)e.textContent=mmss(Math.max(left,0));if(left<=0)write()},1000)}
 function write(){stop();t0=Date.now();put(topl('Пишите пересказ',C.e,'<b id="wc">0</b> / ~'+s.target+' знаков · <span id="wt">0:00</span>')+`<textarea id="ta" placeholder="《标题》&#10;……" lang="zh"></textarea><div class="row"><button class="go" style="--c:${C.e};flex:1;padding:13px" data-a="fin">Готово — сравнить с образцом</button></div>`);
  const ta=document.getElementById('ta');ta.oninput=()=>{document.getElementById('wc').textContent=cnt(ta.value)};
  timer(()=>{const e=document.getElementById('wt');if(e)e.textContent=mmss(Math.round((Date.now()-t0)/1000))},1000)}
 function res(){stop();const my=X.sx[i]||'';put(topl('Разбор · '+esc(s.title),C.e)+`<div class="set"><div class="lbl">ваш текст · ${cnt(my)} знаков</div><div style="white-space:pre-wrap;font-size:calc(var(--k)*17px)">${esc(my)||'—'}</div></div>
  <div class="set"><div class="lbl">что должно быть в пересказе — отметьте</div>${s.points.map(p=>`<label style="display:block;margin:7px 0"><input type="checkbox"> ${esc(p)}</label>`).join('')}</div>
  <div class="set"><div class="lbl">образец · ${cnt(s.model)} знаков</div><div style="white-space:pre-wrap;font-size:calc(var(--k)*17px)">${esc(s.model)}</div><div class="pyl" style="margin-top:8px;white-space:pre-wrap">${esc(s.model_py)}</div></div>
  <details class="ref" style="--c:${C.e}"><summary>Исходный текст с пиньинь</summary>${s.text.map((p,j)=>`<p style="margin:8px 0">${esc(p)}<span class="pyl" style="display:block">${esc(s.text_py[j])}</span></p>`).join('')}</details>
  <div class="row"><button class="go" style="--c:${C.e}" data-a="rd">Ещё раз</button>${backBtn()}</div>`)}
 ACT.rd=read;ACT.wr=write;ACT.res=res;ACT.fin=()=>{X.sx[i]=document.getElementById('ta').value;xp(10);res()};intro()};

/* ── справочники */
const exs=(ex,key)=>ex.map(e=>`<div class="exi"><div class="z">${key?hl(e[0],key):esc(e[0])}</div><div class="pyl">${esc(e[2])}</div><div class="r">${esc(e[1])}</div></div>`).join('');
const idi=x=>`<div class="zh" style="font-size:calc(var(--k)*24px)">${esc(x.h)}</div><div class="py">${esc(x.py)}</div><div class="ru" style="font-size:calc(var(--k)*16px)">${esc(x.ru)}</div><div class="rs">${esc(x.lit)}</div>${EN()?`<div class="en">${esc(x.en)}</div>`:''}${exs(x.ex,x.h)}`;
VIEWS.grammar=()=>{put(topl('Грамматика HSK 6',C.t,E.grammar.length+' конструкций')+E.grammar.map(g=>`<details class="ref" style="--c:${C.t}"><summary><span class="zh">${esc(g.p)}</span> — ${esc(g.mean)}</summary><div class="py">${esc(g.py)}</div><div class="sch">${esc(g.sch)}</div><div class="note det">${esc(g.det)}</div>${EN()?`<div class="en">${esc(g.en)}</div>`:''}${exs(g.ex)}</details>`).join(''))};
VIEWS.idioms=()=>{put(topl('成语 · Чэнъюи',C.t,E.idioms.length+' выражений')+`<div class="row"><button class="go" style="--c:${C.t};flex:1" data-n="iquiz">⚡ Блиц</button><button class="go" style="--c:${C.t};flex:1" data-n="ibuild">🔤 Собрать</button></div>`+E.idioms.map(x=>`<details class="ref" style="--c:${C.t}"><summary><span class="zh">${esc(x.h)}</span> — ${esc(x.ru)}</summary><div class="py">${esc(x.py)}</div><div class="rs">${esc(x.lit)}</div>${EN()?`<div class="en">${esc(x.en)}</div>`:''}${exs(x.ex,x.h)}</details>`).join(''))};
VIEWS.syn=()=>{put(topl('Похожие слова',C.t,'в чём разница')+E.syn.map(s=>`<details class="ref" style="--c:${C.v}"><summary><span class="zh">${esc(s.pair)}</span></summary><div class="rs">${esc(s.common)}</div>${s.parts.map(p=>`<div class="part"><div class="w">${esc(p.w)} <span class="py" style="font-size:.6em">${esc(p.wpy)}</span></div>${EN()?`<div class="en">${esc(p.en)}</div>`:''}<div class="rs">${esc(p.when)}</div><div style="margin-top:4px">${esc(p.col)}</div><div class="exi"><div class="z">${hl(p.z,p.w)}</div><div class="pyl">${esc(p.zp)}</div><div class="r">${esc(p.r)}</div></div></div>`).join('')}<div class="memo">💡 ${esc(s.memo)}</div></details>`).join(''))};

window.HSK={hub:()=>render('hub'),render:render,stop:stop};
})();
