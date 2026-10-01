const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const loader=$('#loader'); addEventListener('load',()=>setTimeout(()=>loader.classList.add('done'),650));

const track=$('#track'),world=$('.world'),progress=$('#progress'),chapter=$('#chapter');
const panels=$$('.panel');
const chapters=['01 — BEGINNING','01 — THE BEGINNING','02 — THE ROAD','03 — THE PEOPLE','04 — CULTURE','05 — NEXT','06 — YOUR TURN'];
let max=0,current=0,target=0,rawProgress=0;

function calc(){max=Math.max(1,world.offsetHeight-innerHeight)}
function updateHorizontal(){
  const rect=world.getBoundingClientRect();
  const total=world.offsetHeight-innerHeight;
  rawProgress=total>0?Math.min(1,Math.max(0,-rect.top/total)):0;
  target=rawProgress*(panels.length-1)*innerWidth;
  progress.style.width=`${rawProgress*100}%`;
  const exact=rawProgress*(panels.length-1);
  const idx=Math.min(panels.length-1,Math.round(exact));
  chapter.textContent=chapters[idx]||'NIGERIA';
  panels.forEach((panel,i)=>{
    const p=Math.max(-1,Math.min(1,exact-i));
    panel.style.setProperty('--panel-progress',Math.abs(p).toFixed(3));
    panel.style.setProperty('--distance',p.toFixed(3));
    panel.classList.toggle('is-active',Math.abs(p)<.48);
  });
  $('.p-time')?.style.setProperty('--timeline',Math.min(1,Math.max(0,(exact-1)/1)));
}
function render(){
  current+=(target-current)*.105;
  track.style.transform=`translate3d(${-current}px,0,0)`;
  requestAnimationFrame(render);
}
addEventListener('scroll',updateHorizontal,{passive:true});
addEventListener('resize',()=>{calc();updateHorizontal()});
calc();updateHorizontal();render();

/* Wheel input becomes the vertical driver for the horizontal exhibition. */
addEventListener('wheel',e=>{
  if(Math.abs(e.deltaY)<=Math.abs(e.deltaX))return;
  const atTop=scrollY<=0&&e.deltaY<0,atBottom=scrollY>=max-2&&e.deltaY>0;
  if(atTop||atBottom)return;
  e.preventDefault();
  window.scrollBy({top:e.deltaY*1.12,left:0,behavior:'auto'});
},{passive:false});

/* Keyboard navigation */
addEventListener('keydown',e=>{
  if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();window.scrollBy({top:innerHeight*.78,behavior:'smooth'})}
  if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();window.scrollBy({top:-innerHeight*.78,behavior:'smooth'})}
});

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const el=$(a.getAttribute('href'));if(!el)return;e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});
}));

/* Hero particle field — deliberately restrained so the typography remains the star. */
const pc=$('#particles'),px=pc.getContext('2d');let particles=[],heroOn=true;
function sizeCanvas(c,ctx){const d=Math.min(devicePixelRatio||1,1.5);c.width=innerWidth*d;c.height=innerHeight*d;ctx.setTransform(d,0,0,d,0,0)}
function initParticles(){sizeCanvas(pc,px);particles=Array.from({length:innerWidth<700?34:62},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.5+.3,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18}))}
function particleLoop(){
 if(!heroOn)return;
 px.clearRect(0,0,innerWidth,innerHeight);
 const intensity=.45+rawProgress*.2;
 particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=innerWidth;if(p.x>innerWidth)p.x=0;if(p.y<0)p.y=innerHeight;if(p.y>innerHeight)p.y=0;px.fillStyle=`rgba(196,239,138,${intensity})`;px.beginPath();px.arc(p.x,p.y,p.r,0,7);px.fill()});
 requestAnimationFrame(particleLoop)
}
initParticles();addEventListener('resize',initParticles);particleLoop();

/* Timeline */
const details={
 '1960':['1960','INDEPENDENCE','A beginning<br>of our own.','Nigeria became an independent and sovereign nation on October 1.'],
 '1963':['1963','THE REPUBLIC','A new<br>constitutional chapter.','Nigeria became a republic on October 1.'],
 '1999':['1999','FOURTH REPUBLIC','A new<br>democratic era.','Civilian democratic government returned in May 1999.'],
 '2026':['2026','NOW','And now,<br>it is our turn.','The story is still being written by the people living it.']
};
$$('.year').forEach(y=>y.addEventListener('click',()=>{
 $$('.year').forEach(x=>x.classList.remove('active'));y.classList.add('active');
 const d=details[y.dataset.year];$('#detailYear').textContent=d[0];$('#detailKicker').textContent=d[1];$('#detailTitle').innerHTML=d[2];$('#detailText').textContent=d[3];
}));

/* People: make the radar react subtly to pointer position. */
const pulse=$('.p-pulse'),radar=$('.radar');
pulse.addEventListener('pointermove',e=>{
 const r=pulse.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
 radar.style.transform=`translate(${x*18}px,${y*12}px)`;
});
pulse.addEventListener('pointerleave',()=>radar.style.transform='');

/* Culture */
const culture={
 'MUSIC':['01','MUSIC','Rhythm becomes memory.'],
 'LANGUAGE':['02','LANGUAGE','Words carry worlds.'],
 'FOOD':['03','FOOD','A table becomes a meeting place.'],
 'FASHION':['04','FASHION','Identity becomes expression.'],
 'ART':['05','ART','Imagination leaves a trace.']
};
$$('.culture-object').forEach(o=>o.addEventListener('click',()=>{
 $$('.culture-object').forEach(x=>x.classList.remove('active'));o.classList.add('active');
 const d=culture[o.dataset.name];$('#cultureNum').textContent=d[0];$('#cultureName').textContent=d[1];$('#cultureText').textContent=d[2];
}));

/* Future network */
const fc=$('#future'),fx=fc.getContext('2d');let dots=[],futureOn=false,futureFrame=0;
function initFuture(){sizeCanvas(fc,fx);dots=Array.from({length:innerWidth<700?24:48},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.2,p:Math.random()*Math.PI*2}))}
function futureLoop(){
 if(!futureOn)return;
 futureFrame+=.01;fx.clearRect(0,0,innerWidth,innerHeight);
 dots.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>innerWidth)p.vx*=-1;if(p.y<0||p.y>innerHeight)p.vy*=-1;p.p+=.01;const a=.35+Math.sin(p.p)*.15;fx.fillStyle=`rgba(196,239,138,${a})`;fx.beginPath();fx.arc(p.x,p.y,1.2+Math.sin(p.p)*.5,0,7);fx.fill()});
 for(let i=0;i<dots.length;i++)for(let j=i+1;j<dots.length;j++){const a=dots[i],b=dots[j],dx=a.x-b.x,dy=a.y-b.y,d=dx*dx+dy*dy;if(d<17000){fx.strokeStyle=`rgba(22,182,111,${.14*(1-d/17000)})`;fx.beginPath();fx.moveTo(a.x,a.y);fx.lineTo(b.x,b.y);fx.stroke()}}
 requestAnimationFrame(futureLoop)
}
initFuture();addEventListener('resize',initFuture);
new IntersectionObserver(([e])=>{futureOn=e.isIntersecting;if(futureOn)futureLoop()},{threshold:.01}).observe($('.p-future'));

/* Message wall */
const form=$('#form'),out=$('#messageOut');
form.addEventListener('submit',e=>{e.preventDefault();const n=$('#name').value.trim(),m=$('#message').value.trim();if(!n||!m)return;localStorage.setItem('ng-message',JSON.stringify({n,m}));out.textContent=`“${m}” — ${n}`;form.reset()});
const saved=JSON.parse(localStorage.getItem('ng-message')||'null');if(saved)out.textContent=`“${saved.m}” — ${saved.n}`;
