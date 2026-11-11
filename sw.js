// сеть в приоритете (свежая версия при интернете), без сети — из памяти телефона; большие словари (?v=) — из памяти
const C='hsk6-v13';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./hsk.js','./hsk_words.json?v=13','./hsk_exam.json?v=13'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url),same=u.origin===location.origin;
 if(same&&u.search.indexOf('v=')>=0){e.respondWith(caches.match(r).then(h=>h||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})));return}
 if(same){e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(h=>h||caches.match('./index.html'))));return}
 e.respondWith(caches.open(C).then(async c=>{const hit=await c.match(r);const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res}).catch(()=>hit);return hit||net}))});
