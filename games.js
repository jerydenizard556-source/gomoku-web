
/* MR JERY GAMES: playable local games + existing online Gomoku */
(()=>{
 const $=id=>document.getElementById(id);
 const hub=$('mrjGamesScreen');
 if(!hub) return;
 $('dashboardGamesHubCard')?.addEventListener('click',()=>showScreen('mrjGamesScreen'));
 const panel=$('mrjgPlayArea');
 const status=$('mrjgStatus');
 let cleanup=null;
 function showPanel(title,html){if(cleanup){cleanup();cleanup=null;}panel.hidden=false;panel.innerHTML='<h2>'+title+'</h2>'+html;status.textContent='';}
 function backHub(){if(cleanup){cleanup();cleanup=null;}panel.hidden=true;panel.innerHTML='';status.textContent='';}
 $('mrjgBack').addEventListener('click',()=>showScreen('accountMenuScreen'));
 $('mrjgBackTop').addEventListener('click',backHub);
 $('mrjgGomoku').addEventListener('click',()=>{const b=$('accountOnlineBtn');if(b)b.click();else showScreen('accountMenuScreen');});
 $('mrjgMorpion').addEventListener('click',startTic);
 $('mrjg2048').addEventListener('click',start2048);
 $('mrjgMemory').addEventListener('click',startMemory);
 $('mrjgSnake').addEventListener('click',startSnake);
 $('mrjgTemple').addEventListener('click',startTempleRun);
 $('mrjgSubway').addEventListener('click',()=>startRunner('subway'));
 function startTic(){
  showPanel('⭕ 3×3 MORPION','<p class="mrjg-muted">De jwè sou menm aparèy la. X kòmanse.</p><div id="ticStatus" class="mrjg-status">Tou pa X</div><div id="ticBoard" class="mrjg-board mrjg-tic">'+Array.from({length:9},(_,i)=>'<button type="button" data-i="'+i+'" aria-label="Case '+(i+1)+'"></button>').join('')+'</div><div class="mrjg-controls"><button id="ticReset" type="button">↻ Rekòmanse</button></div>');
  let board=Array(9).fill(''),turn='X',done=false;const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const cells=[...$('ticBoard').querySelectorAll('button')],msg=$('ticStatus');
  function reset(){board=Array(9).fill('');turn='X';done=false;cells.forEach(c=>{c.textContent='';c.disabled=false;});msg.textContent='Tou pa X';}
  cells.forEach((c,i)=>c.addEventListener('click',()=>{if(done||board[i])return;board[i]=turn;c.textContent=turn;c.disabled=true;const win=wins.find(line=>line.every(n=>board[n]===turn));if(win){done=true;msg.textContent='🏆 '+turn+' genyen!';cells.forEach(x=>x.disabled=true);}else if(board.every(Boolean)){done=true;msg.textContent='Match nil!';}else{turn=turn==='X'?'O':'X';msg.textContent='Tou pa '+turn;}}));
  $('ticReset').addEventListener('click',reset);
 }
 function start2048(){
  showPanel('🔢 2048','<p class="mrjg-muted">Sèvi ak flèch klavye yo oswa bouton yo pou deplase blòk yo.</p><div class="mrjg-status" id="score2048">Pwen: 0</div><div id="board2048" class="mrjg-board mrjg-2048"></div><div class="mrjg-controls"><button data-dir="up">↑</button><button data-dir="left">←</button><button data-dir="down">↓</button><button data-dir="right">→</button><button id="reset2048">↻ Rekòmanse</button></div>');
  let a,score=0,over=false;const el=$('board2048');
  function spawn(){let e=[];a.forEach((v,i)=>{if(!v)e.push(i)});if(e.length){let i=e[Math.floor(Math.random()*e.length)];a[i]=Math.random()<.9?2:4;}}
  function draw(){el.innerHTML=a.map(v=>'<div style="'+(v?'background:hsl('+(35+Math.log2(v)*9)+' 45% 35%)':'')+'">'+(v||'')+'</div>').join('');$('score2048').textContent='Pwen: '+score;}
  function reset(){a=Array(16).fill(0);score=0;over=false;spawn();spawn();draw();}
  function move(dir){if(over)return;let old=a.join(',');for(let line=0;line<4;line++){let ids=[];for(let k=0;k<4;k++){let r=dir==='up'?k:dir==='down'?3-k:line,c=dir==='left'?k:dir==='right'?3-k:line;ids.push(r*4+c);}let vals=ids.map(i=>a[i]).filter(Boolean),out=[];for(let k=0;k<vals.length;k++){if(vals[k]===vals[k+1]){out.push(vals[k]*2);score+=vals[k]*2;k++;}else out.push(vals[k]);}while(out.length<4)out.push(0);ids.forEach((id,k)=>a[id]=out[k]);}if(old!==a.join(',')){spawn();draw();if(!a.some(v=>!v)){let can=false;for(let r=0;r<4;r++)for(let c=0;c<4;c++){let i=r*4+c;if((c<3&&a[i]===a[i+1])||(r<3&&a[i]===a[i+4]))can=true;}if(!can){over=true;$('score2048').textContent+=' — Fin jwèt';}}}}
  const key=e=>{let d={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'}[e.key];if(d){e.preventDefault();move(d);}};
  document.addEventListener('keydown',key);cleanup=()=>document.removeEventListener('keydown',key);
  panel.querySelectorAll('[data-dir]').forEach(b=>b.addEventListener('click',()=>move(b.dataset.dir)));$('reset2048').addEventListener('click',reset);reset();
 }


 function startTempleRun(){
  showPanel('🏛️ MR JERY TEMPLE RUN','<p class="mrjg-muted">Kouri nan ansyen tanp lan. Chanje liy, sote pyè ak twou, glise anba baryè epi ranmase pyès lò.</p><div class="runner-stats temple-hud"><span>DISTANS <b id="templeDistance">0 m</b></span><span>PYÈS <b id="templeCoins">0</b></span><span>VITÈS <b id="templeSpeed">1×</b></span></div><canvas id="templeCanvas" class="mrjg-runner temple-canvas" width="900" height="560" aria-label="MR JERY Temple Run"></canvas><div class="mrjg-status" id="templeStatus">Pare pou kouri nan tanp lan?</div><div class="mrjg-controls runner-controls"><button id="templeStart" class="mrjg-primary">▶ KÒMANSE</button><button id="templeLeft">← AGOCH</button><button id="templeJump">↑ SOTE</button><button id="templeSlide">↓ GLISE</button><button id="templeRight">ADWAT →</button></div><p class="mrjg-note">Klavye: ← → pou chanje liy, ↑ oswa espas pou sote, ↓ pou glise. Sou telefòn: glise dwèt ou.</p>');
  const canvas=$('templeCanvas'),ctx=canvas.getContext('2d'),status=$('templeStatus'),startBtn=$('templeStart');
  const W=900,H=560,lanes=[-1,0,1];let lane=0,items=[],distance=0,coins=0,speed=0.34,active=false,dead=false,jump=0,slide=0,spawn=0,last=0,raf=0,runPhase=0;
  const rand=(a,b)=>a+Math.random()*(b-a);
  function rounded(x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
  function laneX(l,p){const horizon=170,base=450;return W/2+l*(26+(p*170));}
  function move(n){lane=Math.max(-1,Math.min(1,lane+n));}
  function action(a){if(!active||dead)return;if(a==='jump'&&jump<=0&&slide<=0)jump=1;if(a==='slide'&&jump<=0)slide=1;}
  function reset(){lane=0;items=[];distance=0;coins=0;speed=.34;jump=0;slide=0;spawn=.3;dead=false;runPhase=0;$('templeDistance').textContent='0 m';$('templeCoins').textContent='0';$('templeSpeed').textContent='1×';status.textContent='Pare pou kouri nan tanp lan?';startBtn.textContent='▶ KÒMANSE';draw(0);}
  function draw(p){
   ctx.clearRect(0,0,W,H);
   const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#143b39');sky.addColorStop(.42,'#527b58');sky.addColorStop(1,'#d1a96c');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
   // distant jungle canopy and mist
   for(let i=0;i<13;i++){let x=i*82-18;ctx.fillStyle=i%2?'#173d2d':'#24543a';ctx.beginPath();ctx.arc(x,178+(i%3)*12,68,0,Math.PI*2);ctx.fill();}
   ctx.fillStyle='#d8c18a';ctx.globalAlpha=.22;ctx.fillRect(0,195,W,52);ctx.globalAlpha=1;
   // ancient temple gate in the distance
   ctx.fillStyle='#5c4a32';ctx.fillRect(365,93,170,105);ctx.fillStyle='#92734b';ctx.fillRect(385,112,130,86);ctx.fillStyle='#243b30';ctx.fillRect(422,125,56,73);ctx.fillStyle='#c5a36a';ctx.fillRect(352,91,196,13);ctx.fillRect(375,77,150,12);
   // jungle cliffs and ruins at sides
   for(let side of [-1,1]){ctx.fillStyle='#354c32';ctx.beginPath();ctx.moveTo(side<0?0:900,120);ctx.lineTo(side<0?175:725,195);ctx.lineTo(side<0?240:660,560);ctx.lineTo(side<0?0:900,560);ctx.closePath();ctx.fill();for(let k=0;k<4;k++){let x=side<0?28+k*37:872-k*37;let y=240+k*70;ctx.fillStyle='#92744b';ctx.fillRect(x,y,22,95);ctx.fillStyle='#b69a68';ctx.fillRect(x-5,y-8,32,10);}}
   // stone running path with depth
   ctx.fillStyle='#382f25';ctx.beginPath();ctx.moveTo(420,185);ctx.lineTo(480,185);ctx.lineTo(850,560);ctx.lineTo(50,560);ctx.closePath();ctx.fill();
   ctx.fillStyle='#66513a';ctx.beginPath();ctx.moveTo(431,190);ctx.lineTo(469,190);ctx.lineTo(795,560);ctx.lineTo(105,560);ctx.closePath();ctx.fill();
   // stone seams flow toward player
   for(let i=0;i<9;i++){let z=((i/9+(distance*.003)%1));let y=190+z*z*370;let half=25+z*340;ctx.strokeStyle='#b69a70';ctx.globalAlpha=.12+z*.2;ctx.lineWidth=1+z*2;ctx.beginPath();ctx.moveTo(W/2-half,y);ctx.lineTo(W/2+half,y);ctx.stroke();ctx.globalAlpha=1;}
   for(let l of [-1,1]){ctx.strokeStyle='#d7bd8b';ctx.globalAlpha=.45;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(W/2+l*20,190);ctx.lineTo(W/2+l*345,560);ctx.stroke();ctx.globalAlpha=1;}
   // torches
   for(let side of [-1,1]){let x=side<0?300:600;ctx.fillStyle='#4c3826';ctx.fillRect(x,185,8,54);ctx.fillStyle='#ffb43b';ctx.shadowColor='#ff9c2e';ctx.shadowBlur=18;ctx.beginPath();ctx.arc(x+4,177,9,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
   // approaching objects, drawn from far to near
   items.slice().sort((a,b)=>a.z-b.z).forEach(o=>{let z=Math.max(.02,Math.min(1.15,o.z)),x=laneX(o.lane,z),y=190+z*z*355,s=.25+z*1.25;
    if(o.type==='coin'){ctx.save();ctx.translate(x,y-18*s);ctx.scale(s,s);ctx.fillStyle='#ffdc67';ctx.shadowColor='#ffca3a';ctx.shadowBlur=15;ctx.beginPath();ctx.ellipse(0,0,10,14,0,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#9a641e';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#fff0a7';ctx.fillRect(-2,-8,3,16);ctx.restore();}
    else if(o.type==='rock'){ctx.fillStyle='#443a2e';ctx.beginPath();ctx.moveTo(x-24*s,y);ctx.lineTo(x-19*s,y-31*s);ctx.lineTo(x+4*s,y-45*s);ctx.lineTo(x+29*s,y-20*s);ctx.lineTo(x+25*s,y);ctx.closePath();ctx.fill();ctx.strokeStyle='#8f8065';ctx.lineWidth=3*s;ctx.stroke();}
    else if(o.type==='gap'){ctx.fillStyle='#161b16';ctx.beginPath();ctx.ellipse(x,y,38*s,13*s,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#b49a70';ctx.lineWidth=4*s;ctx.stroke();}
    else{rounded(x-37*s,y-54*s,74*s,18*s,5*s,'#6e4529');rounded(x-31*s,y-48*s,62*s,8*s,3*s,'#d0a15e');}
   });
   // runner shadow and animated adventurer
   const px=laneX(lane,1),lift=jump>0?Math.sin((1-jump)*Math.PI)*82:0,py=473-lift;
   ctx.fillStyle='#160f0a66';ctx.beginPath();ctx.ellipse(px,493,32,9,0,0,Math.PI*2);ctx.fill();
   ctx.save();ctx.translate(px,py);if(slide>0){ctx.rotate(-.13);rounded(-28,-22,55,27,13,'#b97832');ctx.fillStyle='#e7bd87';ctx.beginPath();ctx.arc(23,-20,13,0,Math.PI*2);ctx.fill();}else{
    const swing=Math.sin(runPhase)*9;ctx.strokeStyle='#39251b';ctx.lineWidth=10;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-9,22);ctx.lineTo(-15+swing,46);ctx.moveTo(9,22);ctx.lineTo(16-swing,46);ctx.stroke();
    rounded(-18,-29,36,54,12,'#a95d2b');ctx.strokeStyle='#e1b47b';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(-14,-17);ctx.lineTo(-27-swing,-1);ctx.moveTo(14,-17);ctx.lineTo(26+swing,-2);ctx.stroke();
    ctx.fillStyle='#eac69a';ctx.beginPath();ctx.arc(0,-43,16,0,Math.PI*2);ctx.fill();ctx.fillStyle='#49301e';ctx.beginPath();ctx.arc(0,-49,17,Math.PI,Math.PI*2);ctx.fill();ctx.fillRect(-16,-49,32,7);
    ctx.fillStyle='#d8b36d';ctx.fillRect(-17,-3,34,8);
   }ctx.restore();
   // vignette and game title
   const vg=ctx.createRadialGradient(450,270,180,450,270,560);vg.addColorStop(.55,'#0000');vg.addColorStop(1,'#07130dbb');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
   ctx.fillStyle='#fff2d0';ctx.font='900 22px system-ui';ctx.fillText('MR JERY',24,38);ctx.fillStyle='#f3c66e';ctx.font='800 13px system-ui';ctx.fillText('TEMPLE RUN',24,58);
  }
  function finish(){active=false;dead=true;cancelAnimationFrame(raf);status.textContent='🏁 Kouri a fini! '+Math.floor(distance)+' m • '+coins+' pyès. Eseye bat rekò ou!';startBtn.textContent='↻ REKÒMANSE';}
  function frame(t){if(!active)return;let dt=Math.min(2,(t-last)/16.67||1);last=t;distance+=speed*dt*1.8;speed=Math.min(.68,.34+distance/18000);runPhase+=dt*.28;if(jump>0)jump=Math.min(1,jump+dt*.055);if(slide>0)slide=Math.max(0,slide-dt*.06);
   spawn+=dt;if(spawn>Math.max(27,53-distance/800)){spawn=0;let l=lanes[Math.floor(Math.random()*3)],r=Math.random();items.push({lane:l,z:.02,type:r<.25?'coin':r<.52?'rock':r<.73?'barrier':'gap'});if(Math.random()<.45){let other=lanes.filter(x=>x!==l)[Math.floor(Math.random()*2)];items.push({lane:other,z:.02,type:'coin'});}}
   for(let o of items){o.z+=speed*dt*.013;if(o.lane===lane&&o.z>.87&&o.z<1.04){if(o.type==='coin'){o.hit=true;coins++;}else if((o.type==='rock'||o.type==='gap')&&jump>.18){o.hit=true;}else if(o.type==='barrier'&&slide>.18){o.hit=true;}else{finish();return;}}}
   items=items.filter(o=>o.z<1.15&&!o.hit);$('templeDistance').textContent=Math.floor(distance)+' m';$('templeCoins').textContent=coins;$('templeSpeed').textContent=(speed/.34).toFixed(1)+'×';draw(dt);raf=requestAnimationFrame(frame);
  }
  function start(){if(active)return;if(dead)reset();active=true;last=performance.now();status.textContent='Kouri! Rete vijilan, vitès la ap monte.';startBtn.textContent='▶ AN KOU';raf=requestAnimationFrame(frame);}
  const key=e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key)){e.preventDefault();if(e.key==='ArrowLeft')move(-1);if(e.key==='ArrowRight')move(1);if(e.key==='ArrowUp'||e.key===' ')action('jump');if(e.key==='ArrowDown')action('slide');}};
  let touch=null;canvas.addEventListener('pointerdown',e=>{touch={x:e.clientX,y:e.clientY};});canvas.addEventListener('pointerup',e=>{if(!touch)return;let dx=e.clientX-touch.x,dy=e.clientY-touch.y;touch=null;if(Math.max(Math.abs(dx),Math.abs(dy))<18)return;if(Math.abs(dx)>Math.abs(dy))move(dx>0?1:-1);else action(dy<0?'jump':'slide');});
  document.addEventListener('keydown',key);startBtn.addEventListener('click',start);$('templeLeft').addEventListener('click',()=>move(-1));$('templeRight').addEventListener('click',()=>move(1));$('templeJump').addEventListener('click',()=>action('jump'));$('templeSlide').addEventListener('click',()=>action('slide'));
  cleanup=()=>{active=false;cancelAnimationFrame(raf);document.removeEventListener('keydown',key);};reset();
 }

 function startRunner(kind){
  const temple=kind==='temple';
  const title=temple?'MR JERY TEMPLE RUN':'MR JERY SUBWAY SURFERS';
  showPanel((temple?'🏛️ ':'🚆 ')+title,'<p class="mrjg-muted">'+(temple?'Kouri sou chemen tanp lan, evite obstak epi ranmase pyès.':'Kouri sou ray tren yo, evite tren ak baryè, epi ranmase pyès.')+'</p><div class="runner-stats"><span>Distans <b id="runnerDistance">0</b></span><span>Pyès <b id="runnerCoins">0</b></span></div><canvas id="runnerCanvas" class="mrjg-runner" width="720" height="460" aria-label="Jwèt kous"></canvas><div class="mrjg-status" id="runnerStatus">Peze Kòmanse pou jwe.</div><div class="mrjg-controls runner-controls"><button id="runnerStart" class="mrjg-primary">▶ Kòmanse</button><button id="runnerLeft">← Agoch</button><button id="runnerJump">↑ Sote</button><button id="runnerSlide">↓ Glise</button><button id="runnerRight">Adwat →</button></div><p class="mrjg-note">Flèch klavye yo oswa glise dwèt ou sou ekran an pou deplase.</p>');
  const canvas=$('runnerCanvas'),ctx=canvas.getContext('2d'),distEl=$('runnerDistance'),coinsEl=$('runnerCoins'),statusEl=$('runnerStatus'),startBtn=$('runnerStart');
  let lane=1,items=[],distance=0,coins=0,speed=5,active=false,dead=false,jump=0,slide=0,last=0,spawn=0,raf=0;
  const lanes=[canvas.width*.29,canvas.width*.5,canvas.width*.71];
  function move(n){lane=Math.max(0,Math.min(2,lane+n));}
  function action(a){if(!active||dead)return;if(a==='jump'&&jump<=0&&slide<=0)jump=25;if(a==='slide'&&jump<=0)slide=24;}
  function reset(){lane=1;items=[];distance=0;coins=0;speed=5;jump=0;slide=0;spawn=0;dead=false;distEl.textContent='0';coinsEl.textContent='0';statusEl.textContent='Kouri! Evite obstak yo.';draw();}
  function rounded(x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
  function draw(){
   const w=canvas.width,h=canvas.height;
   const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,temple?'#6bb4a4':'#8cc9e8');sky.addColorStop(1,temple?'#d6c58c':'#d9e6ee');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
   if(temple){ctx.fillStyle='#315c43';for(let i=0;i<8;i++){let x=i*105-20;ctx.beginPath();ctx.moveTo(x,245);ctx.lineTo(x+40,70+(i%3)*24);ctx.lineTo(x+85,245);ctx.fill();}ctx.fillStyle='#9a8158';ctx.fillRect(0,225,w,235);}
   else{ctx.fillStyle='#71808a';ctx.fillRect(0,170,w,290);ctx.fillStyle='#d3dbe0';for(let i=0;i<7;i++){ctx.fillRect(i*120+10,55,75,140);ctx.fillStyle='#9db3c1';ctx.fillRect(i*120+25,75,45,95);ctx.fillStyle='#d3dbe0';}}
   ctx.fillStyle=temple?'#826b4c':'#424c57';ctx.beginPath();ctx.moveTo(w*.39,175);ctx.lineTo(w*.61,175);ctx.lineTo(w*.96,h);ctx.lineTo(w*.04,h);ctx.closePath();ctx.fill();
   ctx.strokeStyle=temple?'#cbb58b':'#d8dce0';ctx.lineWidth=5;ctx.setLineDash([24,22]);ctx.lineDashOffset=-(distance%46);for(let i=1;i<=2;i++){let x=w*(.39+i*.11);ctx.beginPath();ctx.moveTo(x,180);ctx.lineTo(w*(.04+i*.31),h);ctx.stroke();}ctx.setLineDash([]);
   items.forEach(o=>{if(o.type==='coin'){ctx.fillStyle='#ffd34e';ctx.beginPath();ctx.arc(o.x,o.y,12,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#a96c18';ctx.lineWidth=3;ctx.stroke();}else if(temple){rounded(o.x-25,o.y-34,50,45,7,o.type==='gap'?'#29251e':'#8e4930');ctx.fillStyle='#c9a16b';ctx.fillRect(o.x-19,o.y-27,38,8);}else{rounded(o.x-31,o.y-40,62,54,8,o.type==='train'?'#d34c48':'#e7ad39');ctx.fillStyle='#283b4b';ctx.fillRect(o.x-21,o.y-29,42,17);}});
   const px=lanes[lane],py=h-88-jump*3;ctx.fillStyle='#0004';ctx.beginPath();ctx.ellipse(px,h-38,26,8,0,0,Math.PI*2);ctx.fill();rounded(px-17,py-46,34,slide?25:46,12,temple?'#e6bd74':'#e9b43d');ctx.fillStyle='#f0d2ad';ctx.beginPath();ctx.arc(px,py-53,14,0,Math.PI*2);ctx.fill();ctx.fillStyle=temple?'#5a3b25':'#27394b';ctx.fillRect(px-15,py-68,30,8);
   ctx.fillStyle='#fff';ctx.font='bold 20px system-ui';ctx.fillText(temple?'MR JERY • TEMPLE RUN':'MR JERY • SUBWAY SURFERS',18,30);
  }
  function finish(){active=false;dead=true;cancelAnimationFrame(raf);statusEl.textContent='💥 Ou frape yon obstak! Distans: '+Math.floor(distance)+' • Pyès: '+coins;startBtn.textContent='↻ Eseye ankò';}
  function frame(t){if(!active)return;const dt=Math.min(2,(t-last)/16.67||1);last=t;distance+=speed*dt;speed=Math.min(12,5+distance/900);spawn+=dt;if(spawn>Math.max(18,43-distance/100)){spawn=0;let l=Math.floor(Math.random()*3);items.push({lane:l,y:175,type:Math.random()<.48?'coin':(temple?'block':(Math.random()<.55?'train':'barrier'))});if(Math.random()<.55)items.push({lane:(l+1)%3,y:175,type:'coin'});}
   items.forEach(o=>o.y+=speed*dt*1.7);
   for(const o of items){if(o.lane===lane&&o.y>canvas.height-130&&o.y<canvas.height-48){if(o.type==='coin'){o.hit=true;coins++;coinsEl.textContent=coins;}else if(jump<8&&slide<8){finish();return;}}}
   items=items.filter(o=>o.y<canvas.height+40&&!o.hit);if(jump>0)jump=Math.max(0,jump-dt);if(slide>0)slide=Math.max(0,slide-dt);
   distEl.textContent=Math.floor(distance);draw();raf=requestAnimationFrame(frame);
  }
  function start(){if(active)return;if(dead)reset();active=true;last=performance.now();statusEl.textContent='Bon kouri!';startBtn.textContent='▶ An kou';raf=requestAnimationFrame(frame);}
  const key=e=>{const m={ArrowLeft:-1,ArrowRight:1};if(m[e.key]){e.preventDefault();move(m[e.key]);}if(e.key==='ArrowUp'||e.key===' '){e.preventDefault();action('jump');}if(e.key==='ArrowDown'){e.preventDefault();action('slide');}};
  let touch=null;canvas.addEventListener('pointerdown',e=>{touch={x:e.clientX,y:e.clientY};});canvas.addEventListener('pointerup',e=>{if(!touch)return;let dx=e.clientX-touch.x,dy=e.clientY-touch.y;touch=null;if(Math.max(Math.abs(dx),Math.abs(dy))<20)return;if(Math.abs(dx)>Math.abs(dy))move(dx>0?1:-1);else action(dy<0?'jump':'slide');});
  document.addEventListener('keydown',key);$('runnerStart').addEventListener('click',start);$('runnerLeft').addEventListener('click',()=>move(-1));$('runnerRight').addEventListener('click',()=>move(1));$('runnerJump').addEventListener('click',()=>action('jump'));$('runnerSlide').addEventListener('click',()=>action('slide'));
  cleanup=()=>{active=false;cancelAnimationFrame(raf);document.removeEventListener('keydown',key);};reset();
 }

 function startSnake(){
  showPanel('🐍 SNAKE','<div class="snake-intro"><p>Manje pòm yo, grandi, epi bat rekò ou. Se ou menm k ap dirije koulèv la ak joystick la.</p></div><div class="snake-toolbar"><label for="snakeLevel">Nivo difikilte</label><select id="snakeLevel" class="snake-level"><option value="easy">Fasil</option><option value="medium" selected>Mwayen</option><option value="hard">Difisil</option></select></div><div class="snake-stats"><div><small>PÒN</small><strong id="snakeScore">0</strong></div><div><small>PI BON NÒT</small><strong id="snakeBest">0</strong></div><div><small>NIVO</small><strong id="snakeLevelName">Mwayen</strong></div></div><div id="snakeBoard" class="mrjg-snake" role="img" aria-label="Tablo jwèt Snake"></div><div id="snakeMessage" class="snake-message">Peze Kòmanse pou jwe.</div><div class="mrjg-controls snake-actions"><button type="button" id="snakeStart" class="mrjg-primary">▶ Kòmanse</button><button type="button" id="snakeReset">↻ Rekòmanse</button></div><div class="snake-joystick-wrap"><div class="snake-joystick-label">JOYSTICK</div><div id="snakeJoystick" class="snake-joystick" role="application" aria-label="Kontwòl analòg Snake"><div class="snake-joystick-cross"></div><div id="snakeJoystickKnob" class="snake-joystick-knob"><span></span></div></div><small>Deplase ti bouton won an pou dirije koulèv la</small></div><div class="mrjg-controls mrjg-snake-controls"><button type="button" data-snake="up" aria-label="Anwo">↑</button><span><button type="button" data-snake="left" aria-label="Agoch">←</button><button type="button" data-snake="down" aria-label="Anba">↓</button><button type="button" data-snake="right" aria-label="Adwat">→</button></span></div><p class="mrjg-note snake-help">Trennen joystick la pou dirije koulèv la. Ou ka sèvi ak flèch yo tou. Espas = poz / kontinye.</p>');
  const boardEl=$('snakeBoard'),scoreEl=$('snakeScore'),bestEl=$('snakeBest'),levelNameEl=$('snakeLevelName'),messageEl=$('snakeMessage'),levelEl=$('snakeLevel');
  const size=18,levels={easy:{label:'Fasil',speed:190},medium:{label:'Mwayen',speed:130},hard:{label:'Difisil',speed:82}};
  let snake,food,dir,nextDir,score,best=0,running=false,ended=false,tick=null,level='medium';
  function bestKey(){return 'mrjgSnakeBest_'+level;}
  function loadBest(){try{return Number(localStorage.getItem(bestKey())||0)||0;}catch(e){return 0;}}
  let snakeAudio=null;
  function beepEat(){
   try{
    const AudioCtx=window.AudioContext||window.webkitAudioContext;
    if(!AudioCtx)return;
    if(!snakeAudio)snakeAudio=new AudioCtx();
    if(snakeAudio.state==='suspended')snakeAudio.resume();
    const now=snakeAudio.currentTime,osc=snakeAudio.createOscillator(),gain=snakeAudio.createGain();
    osc.type='sine';osc.frequency.setValueAtTime(880,now);osc.frequency.exponentialRampToValueAtTime(1320,now+.075);
    gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.16,now+.012);gain.gain.exponentialRampToValueAtTime(.0001,now+.13);
    osc.connect(gain);gain.connect(snakeAudio.destination);osc.start(now);osc.stop(now+.14);
   }catch(e){}
  }
  function placeFood(){let free=[];for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(!snake.some(s=>s.x===x&&s.y===y))free.push({x,y});return free.length?free[Math.floor(Math.random()*free.length)]:null;}
  function draw(){
   const pts=snake.map(p=>({x:p.x+.5,y:p.y+.5}));
   // Split the body wherever it crosses an edge: wrapping teleports the head,
   // so the artwork must never draw a long connecting line across the board.
   const paths=[];let segment=[];
   pts.forEach((p,i)=>{if(i&& (Math.abs(p.x-pts[i-1].x)>1||Math.abs(p.y-pts[i-1].y)>1)){if(segment.length)paths.push(segment);segment=[];}segment.push(p);});
   if(segment.length)paths.push(segment);
   const pathData=paths.map(points=>{let d='M '+points[0].x+' '+points[0].y;for(let i=1;i<points.length-1;i++){const mx=(points[i].x+points[i+1].x)/2,my=(points[i].y+points[i+1].y)/2;d+=' Q '+points[i].x+' '+points[i].y+' '+mx+' '+my;}if(points.length>1)d+=' L '+points[points.length-1].x+' '+points[points.length-1].y;return d;});
   const angle=Math.atan2(dir.y,dir.x)*180/Math.PI;
   const apple=food?'<g class="snake-apple" transform="translate('+(food.x+.5)+' '+(food.y+.5)+')"><circle r=".34"/><path d="M .02 -.29 Q .12 -.53 .31 -.48"/><ellipse cx=".22" cy="-.42" rx=".14" ry=".07" transform="rotate(-25 .22 -.42)"/></g>':'';
   const bodyArt=pathData.map(d=>'<path class="snake-outline" d="'+d+'"/><path class="snake-body-art" d="'+d+'"/>').join('');
   boardEl.innerHTML='<svg class="snake-art" viewBox="0 0 18 18" aria-hidden="true" preserveAspectRatio="none">'+apple+bodyArt+'<g class="snake-head-art" transform="translate('+pts[0].x+' '+pts[0].y+') rotate('+angle+')"><ellipse class="snake-head-shape" cx="0" cy="0" rx=".58" ry=".43"/><ellipse class="snake-eye" cx=".19" cy="-.25" rx=".075" ry=".09"/><ellipse class="snake-eye" cx=".19" cy=".25" rx=".075" ry=".09"/><circle class="snake-pupil" cx=".22" cy="-.25" r=".035"/><circle class="snake-pupil" cx=".22" cy=".25" r=".035"/><path class="snake-tongue" d="M .48 0 L .83 0 M .83 0 l .16 -.12 M .83 0 l .16 .12"/></g></svg>';
   scoreEl.textContent=score;bestEl.textContent=best;levelNameEl.textContent=levels[level].label;
  }
  function stop(){running=false;if(tick){clearInterval(tick);tick=null;}}
  function reset(){stop();ended=false;score=0;best=loadBest();snake=[{x:8,y:9},{x:7,y:9},{x:6,y:9}];dir={x:1,y:0};nextDir={x:1,y:0};food=placeFood();messageEl.textContent='Pare? Peze Kòmanse pou jwe.';$('snakeStart').textContent='▶ Kòmanse';draw();}
  function finish(){stop();ended=true;$('snakeStart').textContent='↻ Eseye ankò';messageEl.textContent='🏁 Fin jwèt! Ou fè '+score+' pwen. Peze Eseye ankò pou rekòmanse.';draw();}
  function valid(p){return p.x>=0&&p.y>=0&&p.x<size&&p.y<size;}
  function step(){dir=nextDir;const raw={x:snake[0].x+dir.x,y:snake[0].y+dir.y};const head={x:(raw.x+size)%size,y:(raw.y+size)%size};const eating=food&&head.x===food.x&&head.y===food.y;const body=eating?snake:snake.slice(0,-1);if(body.some(p=>p.x===head.x&&p.y===head.y)){finish();return;}snake.unshift(head);if(eating){beepEat();score+=10;if(score>best){best=score;try{localStorage.setItem(bestKey(),String(best));}catch(e){}}food=placeFood();if(!food){finish();return;}}else snake.pop();draw();}
  function setDir(name){const dirs={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};const d=dirs[name];if(!d||d.x===-dir.x&&d.y===-dir.y)return;nextDir=d;draw();}
  function start(){if(running)return;if(ended)reset();running=true;messageEl.textContent='Bon jwèt! Se ou menm k ap dirije koulèv la.';$('snakeStart').textContent='Ⅱ Poz';tick=setInterval(step,levels[level].speed);}
  function toggle(){if(running){stop();$('snakeStart').textContent='▶ Kontinye';messageEl.textContent='Jwèt la an poz.';}else start();}
  const key=e=>{const map={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'};const d=map[e.key];if(d){e.preventDefault();setDir(d);}if(e.key===' '){e.preventDefault();toggle();}};
  let swipeStart=null;
  boardEl.addEventListener('pointerdown',e=>{swipeStart={x:e.clientX,y:e.clientY};});
  boardEl.addEventListener('pointerup',e=>{if(!swipeStart)return;const dx=e.clientX-swipeStart.x,dy=e.clientY-swipeStart.y;swipeStart=null;if(Math.max(Math.abs(dx),Math.abs(dy))<18)return;setDir(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'));});
  boardEl.addEventListener('pointercancel',()=>{swipeStart=null;});
  const joystick=$('snakeJoystick'),knob=$('snakeJoystickKnob');let joyPointer=null;
  function joystickMove(e){if(joyPointer!==e.pointerId)return;const r=joystick.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),limit=r.width*.29,len=Math.hypot(dx,dy),scale=len>limit?limit/len:1;knob.style.transform='translate(calc(-50% + '+(dx*scale)+'px), calc(-50% + '+(dy*scale)+'px))';if(len>12)setDir(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'));}
  joystick.addEventListener('pointerdown',e=>{joyPointer=e.pointerId;joystick.setPointerCapture(e.pointerId);joystickMove(e);});joystick.addEventListener('pointermove',joystickMove);
  function joystickEnd(e){if(joyPointer!==e.pointerId)return;joyPointer=null;knob.style.transform='translate(-50%,-50%)';}
  joystick.addEventListener('pointerup',joystickEnd);joystick.addEventListener('pointercancel',joystickEnd);
  document.addEventListener('keydown',key);panel.querySelectorAll('[data-snake]').forEach(b=>b.addEventListener('click',()=>setDir(b.dataset.snake)));$('snakeStart').addEventListener('click',toggle);$('snakeReset').addEventListener('click',reset);
  levelEl.addEventListener('change',()=>{level=levelEl.value;reset();messageEl.textContent='Nivo '+levels[level].label+' chwazi. Pare pou jwe.';});
  cleanup=()=>{document.removeEventListener('keydown',key);stop();};reset();
 }
 function startMemory(){
  showPanel('🧠 MEMORY MATCH','<p class="mrjg-muted">Jwenn tout pè imaj ki menm yo.</p><div id="memoryStatus" class="mrjg-status">Pè jwenn: 0 / 8</div><div id="memoryBoard" class="mrjg-board mrjg-memory"></div><div class="mrjg-controls"><button id="memoryReset">↻ Nouvo jwèt</button></div>');
  let vals,first=null,lock=false,matches=0,turns=0,timer=null;const icons=['🍎','🚀','⚽','🎲','🎧','🌟','🐼','🎯'];
  function reset(){if(timer)clearTimeout(timer);vals=[...icons,...icons].sort(()=>Math.random()-.5);first=null;lock=false;matches=0;turns=0;draw();}
  function draw(){const el=$('memoryBoard');el.innerHTML='';vals.forEach((v,i)=>{let b=document.createElement('button');b.type='button';b.textContent='?';b.setAttribute('aria-label','Kat kache');b.addEventListener('click',()=>flip(i,b));el.appendChild(b);});$('memoryStatus').textContent='Pè jwenn: '+matches+' / 8';}
  function flip(i,b){if(lock||b.classList.contains('matched')||b.textContent!=='?')return;b.textContent=vals[i];b.setAttribute('aria-label',vals[i]);if(first===null){first={i,b};return;}turns++;if(vals[first.i]===vals[i]){first.b.classList.add('matched');b.classList.add('matched');first=null;matches++;$('memoryStatus').textContent='Pè jwenn: '+matches+' / 8';if(matches===8)$('memoryStatus').textContent='🏆 Ou genyen! Kout: '+turns;}else{lock=true;let prev=first;first=null;timer=setTimeout(()=>{prev.b.textContent='?';b.textContent='?';lock=false;},700);}}
  $('memoryReset').addEventListener('click',reset);reset();cleanup=()=>{if(timer)clearTimeout(timer);};
 }
})();
