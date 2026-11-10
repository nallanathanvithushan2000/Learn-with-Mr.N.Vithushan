(function(){
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches,d=devicePixelRatio||1;
const bg=document.createElement('canvas');bg.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none';document.body.prepend(bg);
const bx=bg.getContext('2d');let st=[];
function bs(){bg.width=innerWidth*d;bg.height=innerHeight*d;st=Array.from({length:90},()=>({x:Math.random()*bg.width,y:Math.random()*bg.height,r:(Math.random()*1.5+.4)*d,v:(Math.random()*.18+.04)*d,p:Math.random()*6}))}
bs();addEventListener('resize',bs);
function bgf(t){bx.clearRect(0,0,bg.width,bg.height);bx.fillStyle='#b9c3ee';
for(const s of st){s.y+=s.v;if(s.y>bg.height)s.y=0;bx.globalAlpha=.35+.35*Math.sin(t/700+s.p);bx.fillRect(s.x,s.y,s.r,s.r)}
bx.globalAlpha=1;if(!rm)requestAnimationFrame(bgf)}requestAnimationFrame(bgf);
document.querySelectorAll('canvas.banner').forEach(c=>{const x=c.getContext('2d'),k=c.dataset.anim;
function fit(){c.width=c.clientWidth*d;c.height=c.clientHeight*d}fit();addEventListener('resize',fit);
function dot(px,py,r,col){x.fillStyle=col;x.shadowColor=col;x.shadowBlur=10*d;x.beginPath();x.arc(px,py,r*d,0,7);x.fill();x.shadowBlur=0}
function f(ms){const t=ms/1000,W=c.width,H=c.height;x.clearRect(0,0,W,H);
if(k=='orbit'){const cx=W/2,cy=H/2,a=Math.min(W*.3,200*d),b=H*.36;
x.strokeStyle='#2a3566';x.setLineDash([4*d,6*d]);x.beginPath();x.ellipse(cx,cy,a,b,0,0,7);x.stroke();x.setLineDash([]);
dot(cx,cy,14,'#ffb454');const px=cx+a*Math.cos(t*.9),py=cy+b*Math.sin(t*.9);dot(px,py,7,'#5ad1e6');
dot(px+18*d*Math.cos(t*4),py+18*d*Math.sin(t*4),3,'#e8ebf7');
const u=(t%2.2)/2.2;dot(W*.12,H*.1+u*u*H*.8,5,'#ff8a7a');x.fillStyle='#16306b';x.fillRect(W*.1,H-8*d,W*.04,8*d)}
else if(k=='ramp'){const r=.35,L=W*.7,x0=W*.15,y0=H*.12;x.fillStyle='#16306b';x.beginPath();x.moveTo(x0,y0);x.lineTo(x0+L*Math.cos(r),y0+L*Math.sin(r));x.lineTo(x0,y0+L*Math.sin(r));x.fill();
const u=(t%3)/3,s=u*u*(L-30*d);x.save();x.translate(x0,y0);x.rotate(r);x.fillStyle='#ffb454';x.shadowColor='#ffb454';x.shadowBlur=10*d;x.fillRect(s,-26*d,26*d,26*d);x.restore();}
else{const u=(t%3.2)/3.2,x0=W*.08,w=W*.84,h=H*.75;x.strokeStyle='#2a3566';x.setLineDash([4*d,6*d]);x.beginPath();
for(let i=0;i<=40;i++){const v=i/40;x.lineTo(x0+v*w,H-8*d-4*h*v*(1-v))}x.stroke();x.setLineDash([]);
for(let j=0;j<8;j++){const v=Math.max(u-j*.012,0);dot(x0+v*w,H-8*d-4*h*v*(1-v),(5-j*.5),j?'#5ad1e6':'#ffb454')}}
if(!rm)requestAnimationFrame(f)}requestAnimationFrame(f)});
})();
