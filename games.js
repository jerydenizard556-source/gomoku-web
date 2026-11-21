
/* MR JERY GAMES: playable local games + existing online Gomoku */
(()=>{
 const $=id=>document.getElementById(id);
 const hub=$('mrjGamesScreen');
 if(!hub) return;
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
 function startMemory(){
  showPanel('🧠 MEMORY MATCH','<p class="mrjg-muted">Jwenn tout pè imaj ki menm yo.</p><div id="memoryStatus" class="mrjg-status">Pè jwenn: 0 / 8</div><div id="memoryBoard" class="mrjg-board mrjg-memory"></div><div class="mrjg-controls"><button id="memoryReset">↻ Nouvo jwèt</button></div>');
  let vals,first=null,lock=false,matches=0,turns=0,timer=null;const icons=['🍎','🚀','⚽','🎲','🎧','🌟','🐼','🎯'];
  function reset(){if(timer)clearTimeout(timer);vals=[...icons,...icons].sort(()=>Math.random()-.5);first=null;lock=false;matches=0;turns=0;draw();}
  function draw(){const el=$('memoryBoard');el.innerHTML='';vals.forEach((v,i)=>{let b=document.createElement('button');b.type='button';b.textContent='?';b.setAttribute('aria-label','Kat kache');b.addEventListener('click',()=>flip(i,b));el.appendChild(b);});$('memoryStatus').textContent='Pè jwenn: '+matches+' / 8';}
  function flip(i,b){if(lock||b.classList.contains('matched')||b.textContent!=='?')return;b.textContent=vals[i];b.setAttribute('aria-label',vals[i]);if(first===null){first={i,b};return;}turns++;if(vals[first.i]===vals[i]){first.b.classList.add('matched');b.classList.add('matched');first=null;matches++;$('memoryStatus').textContent='Pè jwenn: '+matches+' / 8';if(matches===8)$('memoryStatus').textContent='🏆 Ou genyen! Kout: '+turns;}else{lock=true;let prev=first;first=null;timer=setTimeout(()=>{prev.b.textContent='?';b.textContent='?';lock=false;},700);}}
  $('memoryReset').addEventListener('click',reset);reset();cleanup=()=>{if(timer)clearTimeout(timer);};
 }
})();
