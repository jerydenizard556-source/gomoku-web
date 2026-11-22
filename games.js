
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
 function startSnake(){
  showPanel('🐍 SNAKE','<div class="snake-intro"><p>Manje pòm yo, grandi, epi bat rekò ou. Se ou menm k ap dirije koulèv la ak joystick la.</p></div><div class="snake-toolbar"><label for="snakeLevel">Nivo difikilte</label><select id="snakeLevel" class="snake-level"><option value="easy">Fasil</option><option value="medium" selected>Mwayen</option><option value="hard">Difisil</option></select></div><div class="snake-stats"><div><small>PÒN</small><strong id="snakeScore">0</strong></div><div><small>PI BON NÒT</small><strong id="snakeBest">0</strong></div><div><small>NIVO</small><strong id="snakeLevelName">Mwayen</strong></div></div><div id="snakeBoard" class="mrjg-snake" role="img" aria-label="Tablo jwèt Snake"></div><div id="snakeMessage" class="snake-message">Peze Kòmanse pou jwe.</div><div class="mrjg-controls snake-actions"><button type="button" id="snakeStart" class="mrjg-primary">▶ Kòmanse</button><button type="button" id="snakeReset">↻ Rekòmanse</button></div><div class="snake-joystick-wrap"><div class="snake-joystick-label">JOYSTICK</div><div id="snakeJoystick" class="snake-joystick" role="application" aria-label="Kontwòl analòg Snake"><div class="snake-joystick-cross"></div><div id="snakeJoystickKnob" class="snake-joystick-knob"><span></span></div></div><small>Deplase ti bouton won an pou dirije koulèv la</small></div><div class="mrjg-controls mrjg-snake-controls"><button type="button" data-snake="up" aria-label="Anwo">↑</button><span><button type="button" data-snake="left" aria-label="Agoch">←</button><button type="button" data-snake="down" aria-label="Anba">↓</button><button type="button" data-snake="right" aria-label="Adwat">→</button></span></div><p class="mrjg-note snake-help">Trennen joystick la pou dirije koulèv la. Ou ka sèvi ak flèch yo tou. Espas = poz / kontinye.</p>');
  const boardEl=$('snakeBoard'),scoreEl=$('snakeScore'),bestEl=$('snakeBest'),levelNameEl=$('snakeLevelName'),messageEl=$('snakeMessage'),levelEl=$('snakeLevel');
  const size=18,levels={easy:{label:'Fasil',speed:190},medium:{label:'Mwayen',speed:130},hard:{label:'Difisil',speed:82}};
  let snake,food,dir,nextDir,score,best=0,running=false,ended=false,tick=null,level='medium';
  function bestKey(){return 'mrjgSnakeBest_'+level;}
  function loadBest(){try{return Number(localStorage.getItem(bestKey())||0)||0;}catch(e){return 0;}}
  function placeFood(){let free=[];for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(!snake.some(s=>s.x===x&&s.y===y))free.push({x,y});return free.length?free[Math.floor(Math.random()*free.length)]:null;}
  function draw(){const cells=Array.from({length:size*size},()=>'<i></i>');if(food)cells[food.y*size+food.x]='<i class="snake-food">●</i>';snake.forEach((p,i)=>cells[p.y*size+p.x]=i===0?'<i class="snake-head">◆</i>':'<i class="snake-body"></i>');boardEl.innerHTML=cells.join('');scoreEl.textContent=score;bestEl.textContent=best;levelNameEl.textContent=levels[level].label;}
  function stop(){running=false;if(tick){clearInterval(tick);tick=null;}}
  function reset(){stop();ended=false;score=0;best=loadBest();snake=[{x:8,y:9},{x:7,y:9},{x:6,y:9}];dir={x:1,y:0};nextDir={x:1,y:0};food=placeFood();messageEl.textContent='Pare? Peze Kòmanse pou jwe.';$('snakeStart').textContent='▶ Kòmanse';draw();}
  function finish(){stop();ended=true;$('snakeStart').textContent='↻ Eseye ankò';messageEl.textContent='🏁 Fin jwèt! Ou fè '+score+' pwen. Peze Eseye ankò pou rekòmanse.';draw();}
  function valid(p){return p.x>=0&&p.y>=0&&p.x<size&&p.y<size;}
  function step(){dir=nextDir;const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};const eating=food&&head.x===food.x&&head.y===food.y;const body=eating?snake:snake.slice(0,-1);if(!valid(head)||body.some(p=>p.x===head.x&&p.y===head.y)){finish();return;}snake.unshift(head);if(eating){score+=10;if(score>best){best=score;try{localStorage.setItem(bestKey(),String(best));}catch(e){}}food=placeFood();if(!food){finish();return;}}else snake.pop();draw();}
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
