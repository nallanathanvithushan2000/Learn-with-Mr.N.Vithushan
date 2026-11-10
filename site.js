(function(){
const d=devicePixelRatio||1,root=document.documentElement;
let paused=matchMedia('(prefers-reduced-motion:reduce)').matches,tt=0,lastMs=0;
/* --- scenery pause button --- */
const sb=document.createElement('button');sb.className='scene-btn';document.body.appendChild(sb);
function applyPause(){root.classList.toggle('paused',paused);sb.textContent=paused?'▶ Play background motion':'⏸ Pause background motion';
document.querySelectorAll('svg').forEach(s=>{try{paused?s.pauseAnimations():s.unpauseAnimations()}catch(e){}})}
sb.onclick=()=>{paused=!paused;applyPause()};applyPause();
/* --- simulation pause (pages with #pause) --- */
window.simPaused=false;
const pb=document.getElementById('pause');
if(pb){const lab=()=>pb.textContent=window.simPaused?'▶ Resume':'⏸ Pause';
pb.onclick=()=>{window.simPaused=!window.simPaused;lab()};
['play','reset'].forEach(i=>{const e=document.getElementById(i);if(e)e.addEventListener('click',()=>{window.simPaused=false;lab()})})}
/* --- starfield --- */
const bg=document.createElement('canvas');bg.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none';document.body.prepend(bg);
const bx=bg.getContext('2d');let st=[];
function bs(){bg.width=innerWidth*d;bg.height=innerHeight*d;st=Array.from({length:90},()=>({x:Math.random()*bg.width,y:Math.random()*bg.height,r:(Math.random()*1.5+.4)*d,v:(Math.random()*.18+.04)*d,p:Math.random()*6}))}
bs();addEventListener('resize',bs);
function drawBg(dt){bx.clearRect(0,0,bg.width,bg.height);bx.fillStyle='#b9c3ee';
for(const s of st){if(!paused){s.y+=s.v*dt*60;if(s.y>bg.height)s.y=0}bx.globalAlpha=.35+.35*Math.sin(tt*1.4+s.p);bx.fillRect(s.x,s.y,s.r,s.r)}bx.globalAlpha=1}
/* --- banners --- */
const banners=[...document.querySelectorAll('canvas.banner')].map(c=>({c,x:c.getContext('2d'),k:c.dataset.anim}));
function fit(){banners.forEach(b=>{b.c.width=b.c.clientWidth*d;b.c.height=b.c.clientHeight*d});dpFit()}
function drawBanner(b){const{c,x,k}=b,t=tt,W=c.width,H=c.height;x.clearRect(0,0,W,H);
const dot=(px,py,r,col)=>{x.fillStyle=col;x.shadowColor=col;x.shadowBlur=10*d;x.beginPath();x.arc(px,py,r*d,0,7);x.fill();x.shadowBlur=0};
if(k=='orbit'){const cx=W/2,cy=H/2,a=Math.min(W*.3,200*d),bb=H*.36;
x.strokeStyle='#2a3566';x.setLineDash([4*d,6*d]);x.beginPath();x.ellipse(cx,cy,a,bb,0,0,7);x.stroke();x.setLineDash([]);
dot(cx,cy,14,'#ffb454');const px=cx+a*Math.cos(t*.9),py=cy+bb*Math.sin(t*.9);dot(px,py,7,'#5ad1e6');
dot(px+18*d*Math.cos(t*4),py+18*d*Math.sin(t*4),3,'#e8ebf7');
const u=(t%2.2)/2.2;dot(W*.12,H*.1+u*u*H*.8,5,'#ff8a7a');x.fillStyle='#16306b';x.fillRect(W*.1,H-8*d,W*.04,8*d)}
else if(k=='ramp'){const r=.35,L=W*.7,x0=W*.15,y0=H*.12;x.fillStyle='#16306b';x.beginPath();x.moveTo(x0,y0);x.lineTo(x0+L*Math.cos(r),y0+L*Math.sin(r));x.lineTo(x0,y0+L*Math.sin(r));x.fill();
const u=(t%3)/3,s=u*u*(L-30*d);x.save();x.translate(x0,y0);x.rotate(r);x.fillStyle='#ffb454';x.shadowColor='#ffb454';x.shadowBlur=10*d;x.fillRect(s,-26*d,26*d,26*d);x.restore()}
else{const u=(t%3.2)/3.2,x0=W*.08,w=W*.84,h=H*.75;x.strokeStyle='#2a3566';x.setLineDash([4*d,6*d]);x.beginPath();
for(let i=0;i<=40;i++){const v=i/40;x.lineTo(x0+v*w,H-8*d-4*h*v*(1-v))}x.stroke();x.setLineDash([]);
for(let j=0;j<8;j++){const v=Math.max(u-j*.012,0);dot(x0+v*w,H-8*d-4*h*v*(1-v),5-j*.5,j?'#5ad1e6':'#ffb454')}}}
/* --- 3D profile animation: accretion disk + planet with moon --- */
const dpB=document.querySelector('.dpb'),dpF=document.querySelector('.dpf');
const parts=Array.from({length:300},()=>{const r=.34+Math.random()*.13;return{r,a:Math.random()*6.283,w:.9*Math.pow(.34/r,1.5),c:r<.4?'#ffb454':r<.44?'#ff8a7a':'#5ad1e6',s:Math.random()*1.2+.6}});
function dpFit(){[dpB,dpF].forEach(c=>{if(c){c.width=c.clientWidth*d;c.height=c.clientHeight*d}})}
function proj(px,py,pz,al,be,W){ // orbit-plane point -> screen
const y1=py*Math.cos(al),z1=py*Math.sin(al),x2=px*Math.cos(be)-y1*Math.sin(be),y2=px*Math.sin(be)+y1*Math.cos(be);
const sc=1+z1/(W*2.2);return{x:W/2+x2*sc,y:W/2+y2*sc,z:z1,sc}}
function drawDp(){if(!dpB)return;const W=dpB.width,ctxs=[dpB.getContext('2d'),dpF.getContext('2d')];ctxs.forEach(g=>g.clearRect(0,0,W,W));
const draw=(p,r,col,glow)=>{const g=ctxs[p.z>0?1:0];g.fillStyle=col;g.shadowColor=col;g.shadowBlur=glow*d;g.beginPath();g.arc(p.x,p.y,r*p.sc,0,7);g.fill();g.shadowBlur=0};
const be=-.35+.12*Math.sin(tt*.3),al=1.25;
for(const q of parts){const a=q.a+q.w*tt,p=proj(q.r*W*Math.cos(a),q.r*W*Math.sin(a),0,al,be,W);draw(p,q.s*d,q.c,4)}
const a2=tt*.55,R2=.455*W,pl=proj(R2*Math.cos(a2),R2*Math.sin(a2),0,.85,1.1,W);
draw(pl,W*.032,'#3b8bff',16);
const rm=W*.06,m=proj(pl.x-W/2+0,0,0,0,0,W); // moon offset in 3D around planet
const ma=tt*2.6,mx=rm*Math.cos(ma),my=rm*Math.sin(ma)*Math.cos(.9),mz=rm*Math.sin(ma)*Math.sin(.9);
const mp={x:pl.x+mx,y:pl.y+my,z:pl.z+mz,sc:pl.sc*(1+mz/(W*2.2))};draw(mp,W*.012,'#e8ebf7',8)}
function frame(ms){if(!lastMs)lastMs=ms;const dt=Math.min((ms-lastMs)/1000,.05);lastMs=ms;if(!paused)tt+=dt;
drawBg(dt);banners.forEach(drawBanner);drawDp();requestAnimationFrame(frame)}
fit();addEventListener('resize',fit);requestAnimationFrame(frame);
})();
