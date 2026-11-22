
/* MR JERY GAMES: playable local games + existing online Gomoku */
(()=>{
 const $=id=>document.getElementById(id);
 const hub=$('mrjGamesScreen');
 if(!hub) return;
 $('dashboardGamesHubCard')?.addEventListener('click',()=>showScreen('mrjGamesScreen'));
 const panel=$('mrjgPlayArea');
 const status=$('mrjgStatus');
 let cleanup=null;
 function showPanel(title,html){if(cleanup){cleanup();cleanup=null;}panel.removeAttribute('hidden');panel.hidden=false;panel.style.display='block';panel.style.visibility='visible';panel.innerHTML='<h2>'+title+'</h2>'+html;status.textContent='';requestAnimationFrame(()=>{panel.scrollIntoView({behavior:'smooth',block:'start'});});}
 function backHub(){if(cleanup){cleanup();cleanup=null;}panel.hidden=true;panel.innerHTML='';status.textContent='';}
 $('mrjgBack').addEventListener('click',()=>showScreen('accountMenuScreen'));
 $('mrjgBackTop').addEventListener('click',backHub);
 $('mrjgGomoku').addEventListener('click',()=>{const b=$('accountOnlineBtn');if(b)b.click();else showScreen('accountMenuScreen');});
 $('mrjgMorpion').addEventListener('click',startTic);
 $('mrjg2048').addEventListener('click',start2048);
 $('mrjgMemory').addEventListener('click',startMemory);
 $('mrjgSnake').addEventListener('click',startSnake);
 $('mrjgSudoku').addEventListener('click',startSudoku);
 $('mrjgQuiz').addEventListener('click',startQuiz);
 $('mrjgAriana').addEventListener('click',()=>{try{startCarRacing();}catch(err){console.error('Classic Racing failed to open:',err);panel.removeAttribute('hidden');panel.hidden=false;panel.style.display='block';panel.innerHTML='<h2>🏁 MR JERY CLASSIC RACING</h2><p style="color:#ffd36a">Gen yon erè ki anpeche jwèt la louvri. Rafrechi paj la epi eseye ankò.</p>';status.textContent='Erè ouvèti jwèt la: '+(err&&err.message?err.message:'erè enkoni');panel.scrollIntoView({behavior:'smooth',block:'start'});}});
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


 function startTempleRun(){ startTempleRun3D(); }
 function startTempleRun3D(){
  showPanel('🏛️ MR JERY TEMPLE RUN','<p class="mrjg-muted">Kouri nan yon forè twopikal 3D, evite pyèj yo epi ranmase pyès lò.</p><div class="runner-stats temple-hud"><span>DISTANS <b id="irDistance">0 m</b></span><span>PYÈS <b id="irCoins">0</b></span><span>VITÈS <b id="irSpeed">1×</b></span></div><div id="ir3dMount" class="mrj-temple3d"><div class="mrj-3d-loading">CHAJMAN PÈSONAJ 3D…</div></div><div class="mrjg-status" id="irStatus">N ap prepare forè a…</div><div class="mrjg-controls runner-controls"><button id="irStart" class="mrjg-primary">▶ KÒMANSE</button><button id="irFullscreen">⛶ EKRAN LAJ</button><button id="irLeft">← AGOCH</button><button id="irJump">↑ SOTE</button><button id="irSlide">↓ GLISE</button><button id="irRight">ADWAT →</button></div><p class="mrjg-note">Klavye: ← → pou chanje liy, ↑ oswa espas pou sote, ↓ pou glise. Sou telefòn: glise dwèt ou sou ekran jwèt la.</p>');
  const mount=$('ir3dMount'),status=$('irStatus'),startBtn=$('irStart');
  let disposed=false,active=false,dead=false,raf=0,THREE=null,renderer=null,scene=null,camera=null,mixer=null,runAction=null,player=null,playerModel=null,clock=null,resizeObserver=null,audio=null;
  let lane=0,coins=0,distance=0,speed=8,jump=0,slide=0,spawnClock=0,lastTime=0,world=[],obstacles=[],coinObjects=[],trees=[];
  const laneX=[-2.25,0,2.25],rand=(a,b)=>a+Math.random()*(b-a);
  const setText=(id,v)=>{const e=$(id);if(e)e.textContent=v;};
  function soundCoin(){try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;if(!audio)audio=new A();if(audio.state==='suspended')audio.resume();const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime;o.type='sine';o.frequency.setValueAtTime(900,t);o.frequency.exponentialRampToValueAtTime(1450,t+.09);g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(.12,t+.01);g.gain.exponentialRampToValueAtTime(.001,t+.16);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+.17);}catch(e){}}
  function material(color,roughness=.9){return new THREE.MeshStandardMaterial({color,roughness});}
  function box(w,h,d,mat,x,y,z){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m;}
  function makeTree(x,z,scale=1){
   const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);scene.add(g);
   const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.22,.42,4.2,7),material(0x493321));trunk.position.y=2.1;trunk.castShadow=true;g.add(trunk);
   const greens=[0x123c25,0x1b512d,0x28633a,0x397345];
   for(let i=0;i<6;i++){const leaf=new THREE.Mesh(new THREE.IcosahedronGeometry(rand(1.0,1.65),1),material(greens[i%greens.length]));leaf.position.set(rand(-1.1,1.1),3.4+rand(-.25,2.1),rand(-.9,.9));leaf.scale.set(1.15,.8,1);leaf.castShadow=true;g.add(leaf);}
   const vine=new THREE.Mesh(new THREE.CylinderGeometry(.025,.045,rand(2.5,4),5),material(0x314b25));vine.position.set(rand(-.7,.7),3.1,rand(-.5,.5));vine.rotation.z=rand(-.25,.25);g.add(vine);
   trees.push(g);return g;
  }
  function makeCoin(x,z){const g=new THREE.Group();g.position.set(x,1.15,z);const gold=new THREE.MeshStandardMaterial({color:0xffc52e,metalness:.78,roughness:.2,emissive:0x684000});const ring=new THREE.Mesh(new THREE.TorusGeometry(.34,.09,10,24),gold);g.add(ring);const core=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.07,20),gold);core.rotation.x=Math.PI/2;g.add(core);scene.add(g);coinObjects.push({mesh:g,hit:false});}
  function makeObstacle(type,laneIndex,z){
   const g=new THREE.Group();g.position.set(laneX[laneIndex],0,z);g.userData={type,lane:laneIndex,hit:false};
   if(type==='rock'){
    const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.8,1),material(0x625743));rock.scale.set(1.2,.8,1);rock.position.y=.55;rock.castShadow=true;g.add(rock);
   }else if(type==='gap'){
    const hole=new THREE.Mesh(new THREE.CylinderGeometry(1.02,1.02,.13,32),new THREE.MeshStandardMaterial({color:0x090d09,roughness:1}));hole.scale.set(1,.15,1.45);hole.position.y=.025;g.add(hole);
    const rim=new THREE.Mesh(new THREE.TorusGeometry(.92,.13,8,32),material(0x9a8054));rim.rotation.x=Math.PI/2;rim.position.y=.08;rim.scale.z=1.45;g.add(rim);
   }else{
    const log=new THREE.Mesh(new THREE.CylinderGeometry(.19,.23,2.25,10),material(0x68401f));log.rotation.z=Math.PI/2;log.position.y=1.2;log.castShadow=true;g.add(log);
    for(const x of [-.9,.9]){const post=new THREE.Mesh(new THREE.CylinderGeometry(.09,.13,1.5,8),material(0x594027));post.position.set(x,.72,0);g.add(post);}
   }
   scene.add(g);obstacles.push(g);
  }
  function makeTemple(){
   const stone=material(0x82745a),dark=material(0x263a2a);
   const arch=new THREE.Group();arch.position.set(0,0,-54);scene.add(arch);
   for(const x of [-5.5,5.5]){const p=new THREE.Mesh(new THREE.BoxGeometry(1.5,8,1.7),stone);p.position.set(x,4,0);p.castShadow=true;arch.add(p);const cap=new THREE.Mesh(new THREE.BoxGeometry(2.1,.65,2.1),material(0xb49a6b));cap.position.set(x,8.1,0);arch.add(cap);}
   const top=new THREE.Mesh(new THREE.BoxGeometry(13,1.5,2),stone);top.position.y=8.4;arch.add(top);
   const door=new THREE.Mesh(new THREE.BoxGeometry(7,6,.3),dark);door.position.set(0,3,-.85);arch.add(door);
   for(let i=0;i<5;i++){const mark=new THREE.Mesh(new THREE.BoxGeometry(.12,1.1,.15),material(0xc5a36a));mark.position.set(-4+i*2,8.5,-1.08);arch.add(mark);}
  }
  function buildWorld(){
   scene=new THREE.Scene();scene.background=new THREE.Color(0x91a98a);scene.fog=new THREE.FogExp2(0x718d6c,.014);
   camera=new THREE.PerspectiveCamera(68,1,.1,240);camera.position.set(0,4.5,10.8);camera.lookAt(0,1.25,-7);
   renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;mount.innerHTML='';mount.appendChild(renderer.domElement);
   scene.add(new THREE.HemisphereLight(0xd9edff,0x39402a,2.0));const sun=new THREE.DirectionalLight(0xffe1ad,3.1);sun.position.set(-8,18,7);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);scene.add(sun);
   const ground=new THREE.Mesh(new THREE.PlaneGeometry(120,240),material(0x24472c));ground.rotation.x=-Math.PI/2;ground.position.set(0,-.16,-60);ground.receiveShadow=true;scene.add(ground);
   // Textured asphalt road, with real road shoulders and painted lane markings
   const roadCanvas=document.createElement('canvas');roadCanvas.width=512;roadCanvas.height=512;const roadCtx=roadCanvas.getContext('2d');
   roadCtx.fillStyle='#343936';roadCtx.fillRect(0,0,512,512);
   for(let i=0;i<11500;i++){const v=rand(35,92);roadCtx.fillStyle='rgba('+v+','+v+','+v+',0.22)';const x=Math.random()*512,y=Math.random()*512;roadCtx.fillRect(x,y,rand(1,3),rand(1,3));}
   const roadTex=new THREE.CanvasTexture(roadCanvas);roadTex.wrapS=roadTex.wrapT=THREE.RepeatWrapping;roadTex.repeat.set(1,5);roadTex.colorSpace=THREE.SRGBColorSpace;
   const asphalt=new THREE.Mesh(new THREE.PlaneGeometry(8.2,240),new THREE.MeshStandardMaterial({map:roadTex,color:0xffffff,roughness:.98}));asphalt.rotation.x=-Math.PI/2;asphalt.position.set(0,-.015,-60);asphalt.receiveShadow=true;scene.add(asphalt);
   const shoulderMat=material(0x8b8062),edgeLine=material(0xe6e3d4),laneLine=material(0xf1e9c9);
   for(const x of [-4.3,4.3]){const shoulder=box(.42,.09,240,shoulderMat,x,-.01,-60);shoulder.receiveShadow=true;const line=box(.11,.025,240,edgeLine,x>0?-3.78:3.78,.025,-60);line.receiveShadow=true;}
   for(const x of [-1.35,1.35])for(let i=0;i<34;i++){const dash=box(.075,.025,2.4,laneLine,x,.025,-i*7-2);world.push(dash);}
   // Gravel verges and roadside timber barriers
   for(const x of [-4.8,4.8]){const rail=box(.16,.55,220,material(0x654b2d),x,.55,-60);rail.receiveShadow=true;for(let i=0;i<42;i++){const post=box(.24,.95,.25,material(0x715438),x,.48,-i*5-3);post.castShadow=true;}}
   for(let i=0;i<28;i++){const z=-i*8-4;const pebble=new THREE.Mesh(new THREE.DodecahedronGeometry(rand(.12,.38),0),material(0x77715c));pebble.position.set(rand(-5.3,-4.5),-.02,z);pebble.scale.y=.45;scene.add(pebble);const pebble2=pebble.clone();pebble2.position.x=-pebble.position.x;scene.add(pebble2);}
   for(let i=0;i<24;i++){const z=-i*7-4;makeTree(-rand(6,13),z,rand(.8,1.5));makeTree(rand(6,13),z-rand(0,3),rand(.8,1.55));}
   // Mossy boulders, distant jungle wall and twin waterfalls
   for(let i=0;i<18;i++){const x=(i%2?1:-1)*rand(5,12),z=-rand(8,110);const b=new THREE.Mesh(new THREE.DodecahedronGeometry(rand(.6,1.7),1),material([0x40563b,0x596044,0x6b684b][i%3]));b.position.set(x,rand(.3,1),z);b.scale.y=.7;b.castShadow=true;scene.add(b);}
   const waterMat=new THREE.MeshStandardMaterial({color:0x8bcbd0,transparent:true,opacity:.62,roughness:.18,metalness:.05});
   for(const x of [-15,15]){const water=new THREE.Mesh(new THREE.PlaneGeometry(3,18),waterMat);water.position.set(x,9,-47);scene.add(water);}
   makeTemple();
   for(let i=0;i<3;i++){const torch=new THREE.PointLight(0xff9a35,3,12);torch.position.set(i%2?4:-4,2,-52-i*2);scene.add(torch);}
   player=new THREE.Group();scene.add(player);player.position.set(0,0,0);
   clock=new THREE.Clock();
  }
  function resize(){if(!renderer||!camera)return;const w=Math.max(320,mount.clientWidth),h=Math.max(240,mount.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
  function setLane(n){if(!active||dead)return;lane=Math.max(-1,Math.min(1,lane+n));}
  function doAction(type){if(!active||dead)return;if(type==='jump'&&jump<=0&&slide<=0)jump=.9;if(type==='slide'&&jump<=0)slide=.72;}
  function resetGame(){lane=0;coins=0;distance=0;speed=8;jump=0;slide=0;spawnClock=0;dead=false;obstacles.forEach(o=>scene.remove(o));coinObjects.forEach(o=>scene.remove(o.mesh));obstacles=[];coinObjects=[];setText('irDistance','0 m');setText('irCoins','0');setText('irSpeed','1×');status.textContent='Pare pou kouri?';startBtn.textContent='▶ KÒMANSE';}
  function finish(){active=false;dead=true;status.textContent='🏁 Ou fini! '+Math.floor(distance)+' m • '+coins+' pyès. Peze rekòmanse.';startBtn.textContent='↻ REKÒMANSE';}
  function spawn(){const l=Math.floor(Math.random()*3),r=Math.random();if(r<.42){for(let i=0;i<5;i++)makeCoin(laneX[l],-42-i*1.6);}else makeObstacle(r<.65?'rock':r<.82?'gap':'barrier',l,-46);}
  function animate(){
   if(disposed)return;raf=requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.045);if(active){
    distance+=speed*dt;speed=Math.min(17,8+distance/180);spawnClock+=dt;if(spawnClock>Math.max(.85,1.65-distance/10000)){spawnClock=0;spawn();}
    if(jump>0)jump=Math.max(0,jump-dt);if(slide>0)slide=Math.max(0,slide-dt);
    player.position.x+=(laneX[lane+1]-player.position.x)*Math.min(1,dt*11);player.position.y=jump>0?Math.sin((.9-jump)/.9*Math.PI)*1.65:0;
    if(slide>0){player.rotation.x=Math.min(.55,slide*.8);player.position.y=-.22;}else player.rotation.x+=(0-player.rotation.x)*Math.min(1,dt*10);
    if(mixer)mixer.update(dt);
    world.forEach(s=>{s.position.z+=speed*dt;if(s.position.z>8)s.position.z-=170;});
    trees.forEach(t=>{t.position.z+=speed*dt;if(t.position.z>12)t.position.z-=175;});
    obstacles.forEach(o=>{o.position.z+=speed*dt;if(!o.userData.hit&&o.position.z>1.2&&o.position.z<2.1&&Math.abs(o.position.x-player.position.x)<.95){const type=o.userData.type,passed=(type==='rock'||type==='gap')?jump>.28:type==='barrier'?slide>.2:false;if(passed)o.userData.hit=true;else finish();}});
    coinObjects.forEach(o=>{o.mesh.position.z+=speed*dt;o.mesh.rotation.y+=dt*2.8;if(!o.hit&&o.mesh.position.z>1.1&&o.mesh.position.z<2.1&&Math.abs(o.mesh.position.x-player.position.x)<.95){o.hit=true;coins++;soundCoin();scene.remove(o.mesh);}});
    obstacles=obstacles.filter(o=>{if(o.position.z>12){scene.remove(o);return false;}return true;});coinObjects=coinObjects.filter(o=>!o.hit&&o.mesh.position.z<12);
    camera.position.x+=(player.position.x*.34-camera.position.x)*Math.min(1,dt*3.5);camera.lookAt(player.position.x*.16,1.25,-7);
    setText('irDistance',Math.floor(distance)+' m');setText('irCoins',coins);setText('irSpeed',(speed/8).toFixed(1)+'×');
   }else if(mixer)mixer.update(dt*.25);
   renderer.render(scene,camera);
  }
  const key=e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key)){e.preventDefault();if(e.key==='ArrowLeft')setLane(-1);if(e.key==='ArrowRight')setLane(1);if(e.key==='ArrowUp'||e.key===' ')doAction('jump');if(e.key==='ArrowDown')doAction('slide');}};
  let touch=null;
  function onPointerDown(e){touch={x:e.clientX,y:e.clientY};}
  function onPointerUp(e){if(!touch)return;const dx=e.clientX-touch.x,dy=e.clientY-touch.y;touch=null;if(Math.max(Math.abs(dx),Math.abs(dy))<20)return;if(Math.abs(dx)>Math.abs(dy))setLane(dx>0?1:-1);else doAction(dy<0?'jump':'slide');}
  async function init(){
   try{
    status.textContent='N ap chaje pèsonaj gason 3D la…';
    const [threeMod,loaderMod]=await Promise.all([import('https://esm.sh/three@0.160.0'),import('https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js')]);
    if(disposed)return;THREE=threeMod;const GLTFLoader=loaderMod.GLTFLoader;buildWorld();
    const loader=new GLTFLoader();const asset='https://files.innerscene.com/library/run-sam-3d-person-animated-fa008c06/71777483056ccfecfed9/run-sam-3d-person-animated.glb';
    loader.load(asset,gltf=>{
     if(disposed)return;playerModel=gltf.scene;const bounds=new THREE.Box3().setFromObject(playerModel),size=bounds.getSize(new THREE.Vector3());const scale=1.78/Math.max(size.y,.01);playerModel.scale.setScalar(scale);playerModel.position.y=-bounds.min.y*scale;playerModel.rotation.y=Math.PI;playerModel.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});player.add(playerModel);
     if(gltf.animations&&gltf.animations.length){mixer=new THREE.AnimationMixer(playerModel);runAction=mixer.clipAction(gltf.animations[0]);runAction.play();}
     status.textContent='Pèsonaj reyèl la pare. Peze KÒMANSE pou jwe.';startBtn.disabled=false;resetGame();resize();animate();
    },undefined,err=>{console.error('MR JERY 3D character load failed',err);status.textContent='Pèsonaj 3D a pa t ka chaje. Tcheke koneksyon an epi eseye rafrechi paj la.';mount.innerHTML='<div class="mrj-3d-error">Nou pa rive chaje modèl imen 3D a. Tanpri rafrechi paj la pou eseye ankò.</div>';});
   }catch(err){console.error('MR JERY 3D init failed',err);status.textContent='Navigatè a pa rive louvri motè 3D a. Eseye dènye vèsyon Chrome oswa Edge.';mount.innerHTML='<div class="mrj-3d-error">WebGL / Three.js pa disponib sou navigatè sa a.</div>';}
  }
  startBtn.disabled=true;
  startBtn.addEventListener('click',()=>{if(!renderer)return;if(dead)resetGame();active=true;status.textContent='Kouri! Evite pyèj yo.';startBtn.textContent='▶ AN KOU';});
  $('irFullscreen').addEventListener('click',async()=>{try{if(!document.fullscreenElement){await mount.requestFullscreen();const orientation=screen.orientation;if(orientation&&orientation.lock)await orientation.lock('landscape');}else{if(screen.orientation&&screen.orientation.unlock)screen.orientation.unlock();await document.exitFullscreen();}}catch(e){status.textContent='Pou ekran laj, mete telefòn nan sou kote epi peze bouton an ankò.';}setTimeout(resize,120);});
  document.addEventListener('fullscreenchange',resize);
  $('irLeft').addEventListener('click',()=>setLane(-1));$('irRight').addEventListener('click',()=>setLane(1));$('irJump').addEventListener('click',()=>doAction('jump'));$('irSlide').addEventListener('click',()=>doAction('slide'));
  mount.addEventListener('pointerdown',onPointerDown);mount.addEventListener('pointerup',onPointerUp);document.addEventListener('keydown',key);
  if(typeof ResizeObserver!=='undefined'){resizeObserver=new ResizeObserver(resize);resizeObserver.observe(mount);}window.addEventListener('resize',resize);
  cleanup=()=>{disposed=true;active=false;cancelAnimationFrame(raf);document.removeEventListener('keydown',key);document.removeEventListener('fullscreenchange',resize);window.removeEventListener('resize',resize);if(resizeObserver)resizeObserver.disconnect();if(renderer){renderer.dispose();renderer.domElement.remove();}if(audio){try{audio.close();}catch(e){}}};
  init();
 }
 function startRunner(kind){ startImmersiveRunner(kind==='temple'?'temple':'subway'); }
 function startImmersiveRunner(kind){
  const temple=kind==='temple', title=temple?'MR JERY TEMPLE RUN':'MR JERY SUBWAY SURFERS';
  const intro=temple?'Kouri nan forè tanp lan, evite gwo wòch, twou ak baryè, epi ranmase pyès lò.':'Kouri sou ray tren yo, evite tren, baryè ak siy, epi ranmase pyès lò.';
  showPanel((temple?'🏛️ ':'🚆 ')+title,'<p class="mrjg-muted">'+intro+'</p><div class="runner-stats temple-hud"><span>DISTANS <b id="irDistance">0 m</b></span><span>PYÈS <b id="irCoins">0</b></span><span>VITÈS <b id="irSpeed">1×</b></span></div><canvas id="irCanvas" class="mrjg-runner immersive-runner" width="960" height="600" aria-label="'+title+'"></canvas><div class="mrjg-status" id="irStatus">Pare pou kouri?</div><div class="mrjg-controls runner-controls"><button id="irStart" class="mrjg-primary">▶ KÒMANSE</button><button id="irLeft">← AGOCH</button><button id="irJump">↑ SOTE</button><button id="irSlide">↓ GLISE</button><button id="irRight">ADWAT →</button></div><p class="mrjg-note">Klavye: ← → pou chanje liy, ↑ oswa espas pou sote, ↓ pou glise. Sou telefòn: glise dwèt ou sou jwèt la.</p>');
  const canvas=$('irCanvas'),ctx=canvas.getContext('2d'),status=$('irStatus'),startBtn=$('irStart');
  const W=960,H=600,lanes=[-1,0,1];let lane=0,items=[],distance=0,coins=0,speed=.32,active=false,dead=false,jump=0,slide=0,spawn=0,last=0,raf=0,phase=0,audio=null;
  const rand=(a,b)=>a+Math.random()*(b-a);
  function project(l,z){const q=Math.max(0,Math.min(1.15,z)),y=168+q*q*410,half=30+q*390;return {x:W/2+l*half*.59,y,scale:.22+q*1.18,half};}
  function round(x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
  function soundCoin(){try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;if(!audio)audio=new A();if(audio.state==='suspended')audio.resume();const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime;o.type='sine';o.frequency.setValueAtTime(920,t);o.frequency.exponentialRampToValueAtTime(1480,t+.08);g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(.12,t+.01);g.gain.exponentialRampToValueAtTime(.001,t+.15);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+.16);}catch(e){}}
  function move(n){lane=Math.max(-1,Math.min(1,lane+n));}
  function action(type){if(!active||dead)return;if(type==='jump'&&jump<=0&&slide<=0)jump=1;if(type==='slide'&&jump<=0)slide=1;}
  function reset(){lane=0;items=[];distance=0;coins=0;speed=.32;jump=0;slide=0;spawn=0;phase=0;dead=false;$('irDistance').textContent='0 m';$('irCoins').textContent='0';$('irSpeed').textContent='1×';status.textContent='Pare pou kouri?';startBtn.textContent='▶ KÒMANSE';draw();}
  function drawBackground(){
   const sky=ctx.createLinearGradient(0,0,0,H);if(temple){sky.addColorStop(0,'#173d37');sky.addColorStop(.48,'#7d9b69');sky.addColorStop(1,'#d4ae70');}else{sky.addColorStop(0,'#1595d1');sky.addColorStop(.48,'#73c9e9');sky.addColorStop(1,'#f1c58c');}ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
   if(temple){
    // Layered jungle canopy and distant waterfalls
    for(let i=0;i<17;i++){let x=i*66-24,yy=140+(i%4)*15;ctx.fillStyle=['#123c2b','#1b5136','#2d6741'][i%3];ctx.beginPath();ctx.arc(x,yy,58+(i%3)*9,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle='#d9e9d6';ctx.globalAlpha=.5;ctx.fillRect(42,180,12,160);ctx.fillRect(900,185,10,170);ctx.globalAlpha=1;
    // monumental temple entrance
    ctx.fillStyle='#6b5738';ctx.fillRect(354,82,252,126);ctx.fillStyle='#b0915d';ctx.fillRect(338,76,284,22);ctx.fillRect(370,99,220,15);ctx.fillStyle='#233a2c';ctx.fillRect(423,119,114,89);ctx.fillStyle='#c4a06a';ctx.fillRect(365,101,22,108);ctx.fillRect(573,101,22,108);
    ctx.fillStyle='#bda06a';for(let i=0;i<5;i++)ctx.fillRect(367+i*48,84,13,12);
   }else{
    // Bright city skyline and overhead rail cables
    for(let i=0;i<11;i++){let x=i*96-18,hh=90+(i*37%95);ctx.fillStyle=['#f07843','#edb34c','#d95e62','#55a8b7'][i%4];ctx.fillRect(x,205-hh,82,hh+65);ctx.fillStyle='#b9e9f5';for(let r=0;r<3;r++)for(let c=0;c<2;c++)ctx.fillRect(x+13+c*31,220-hh+r*30,17,18);}
    ctx.strokeStyle='#33485a';ctx.lineWidth=4;for(let x of [170,790]){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,210);ctx.stroke();}ctx.strokeStyle='#35495a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(80,95);ctx.lineTo(880,95);ctx.moveTo(80,130);ctx.lineTo(880,130);ctx.stroke();
   }
  }
  function drawTrack(){
   // Perspective track bed
   ctx.fillStyle=temple?'#44392a':'#303d48';ctx.beginPath();ctx.moveTo(414,168);ctx.lineTo(546,168);ctx.lineTo(945,600);ctx.lineTo(15,600);ctx.closePath();ctx.fill();
   ctx.fillStyle=temple?'#8b7450':'#7a6553';ctx.beginPath();ctx.moveTo(427,174);ctx.lineTo(533,174);ctx.lineTo(895,600);ctx.lineTo(65,600);ctx.closePath();ctx.fill();
   // Track sleepers / stone slabs animate toward camera
   for(let i=0;i<14;i++){let z=((i/14+(distance*.006)%1));let y=174+z*z*426,half=53+z*410;ctx.globalAlpha=.15+z*.38;ctx.fillStyle=temple?'#e3c18a':'#c5b4a0';ctx.fillRect(W/2-half,y,half*2,2+z*7);ctx.globalAlpha=1;}
   for(let l of [-1,0,1]){let top=project(l,0),bot=project(l,1);ctx.strokeStyle=temple?'#d5bd8d':'#d7dce1';ctx.lineWidth=l===0?3:temple?5:7;ctx.beginPath();if(temple){ctx.moveTo(top.x,top.y);ctx.lineTo(bot.x,bot.y);}else{ctx.moveTo(top.x-9,top.y);ctx.lineTo(bot.x-23,bot.y);ctx.moveTo(top.x+9,top.y);ctx.lineTo(bot.x+23,bot.y);}ctx.stroke();}
   if(!temple){for(let l of [-1,0,1]){let p=project(l,1);ctx.fillStyle='#463c36';ctx.fillRect(p.x-3,p.y-4,6,8);}}
  }
  function drawSideScenery(){
   for(let i=0;i<8;i++){let z=((i/8+(distance*.002)%1));let p=project(-1.42,z),q=project(1.42,z),s=.2+z*.85;
    if(temple){for(let [x,side] of [[p.x,-1],[q.x,1]]){ctx.fillStyle='#245239';ctx.beginPath();ctx.moveTo(x, p.y);ctx.lineTo(x+side*(12+(i%3)*5)*s,p.y-95*s);ctx.lineTo(x+side*(25+(i%4)*4)*s,p.y);ctx.fill();ctx.fillStyle='#8c7049';ctx.fillRect(x-9*s,p.y-27*s,18*s,30*s);}}
    else{for(let x of [p.x,q.x]){ctx.fillStyle='#d7d4c8';ctx.fillRect(x-27*s,p.y-80*s,54*s,80*s);ctx.fillStyle='#3288b6';ctx.fillRect(x-20*s,p.y-68*s,40*s,30*s);ctx.fillStyle='#e2a64a';ctx.fillRect(x-20*s,p.y-29*s,40*s,20*s);}}
   }
  }
  function drawCoin(o,p){let s=p.scale;ctx.save();ctx.translate(p.x,p.y-25*s);ctx.scale(s,s);ctx.fillStyle='#ffdc58';ctx.shadowColor='#ffbd26';ctx.shadowBlur=18;ctx.beginPath();ctx.ellipse(0,0,12,17,0,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#a96a19';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#fff1a7';ctx.fillRect(-2,-10,3,20);ctx.restore();}
  function drawObstacle(o,p){const s=p.scale,x=p.x,y=p.y;if(temple){if(o.type==='gap'){ctx.fillStyle='#181a15';ctx.beginPath();ctx.ellipse(x,y,43*s,16*s,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#c2a779';ctx.lineWidth=5*s;ctx.stroke();}else if(o.type==='rock'){ctx.fillStyle='#514332';ctx.beginPath();ctx.moveTo(x-34*s,y);ctx.lineTo(x-30*s,y-39*s);ctx.lineTo(x-5*s,y-58*s);ctx.lineTo(x+31*s,y-35*s);ctx.lineTo(x+38*s,y);ctx.closePath();ctx.fill();ctx.strokeStyle='#b6a17a';ctx.lineWidth=3*s;ctx.stroke();}else{round(x-45*s,y-70*s,90*s,18*s,5*s,'#75431f');round(x-39*s,y-64*s,78*s,7*s,3*s,'#d4aa63');}}else{if(o.type==='train'){round(x-60*s,y-112*s,120*s,112*s,12*s,'#e64b39');round(x-49*s,y-98*s,98*s,43*s,7*s,'#18394f');ctx.fillStyle='#f3ca55';ctx.fillRect(x-52*s,y-48*s,104*s,9*s);ctx.fillStyle='#252d34';ctx.fillRect(x-42*s,y-7*s,20*s,12*s);ctx.fillRect(x+22*s,y-7*s,20*s,12*s);}else{round(x-44*s,y-72*s,88*s,72*s,8*s,'#e9c44c');round(x-36*s,y-64*s,72*s,25*s,4*s,'#d84b3f');ctx.fillStyle='#fff4d8';ctx.fillRect(x-27*s,y-58*s,54*s,9*s);}}}
  function drawRunner(){
   const p=project(lane,1),lift=jump>0?Math.sin((1-jump)*Math.PI)*112:0,x=p.x,y=525-lift,s=1;
   ctx.fillStyle='#0006';ctx.beginPath();ctx.ellipse(x,555,34,10,0,0,Math.PI*2);ctx.fill();
   ctx.save();ctx.translate(x,y);if(slide>0){ctx.rotate(-.12);round(-31,-30,61,31,13,'#c16c2e');ctx.fillStyle='#eac69a';ctx.beginPath();ctx.arc(27,-27,14,0,Math.PI*2);ctx.fill();}
   else{let swing=Math.sin(phase)*12;ctx.strokeStyle='#35251e';ctx.lineWidth=12;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-10,28);ctx.lineTo(-17+swing,66);ctx.moveTo(10,28);ctx.lineTo(17-swing,66);ctx.stroke();ctx.strokeStyle='#80502c';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(-16,-10);ctx.lineTo(-29-swing,-43);ctx.moveTo(16,-10);ctx.lineTo(29+swing,-42);ctx.stroke();round(-22,-40,44,70,14,temple?'#a85d2e':'#243d56');ctx.fillStyle=temple?'#d5a86b':'#f4e8d2';ctx.fillRect(-19,12,38,9);ctx.fillStyle='#eac69a';ctx.beginPath();ctx.arc(0,-58,19,0,Math.PI*2);ctx.fill();ctx.fillStyle=temple?'#4b3020':'#b52f28';ctx.beginPath();ctx.arc(0,-65,20,Math.PI,Math.PI*2);ctx.fill();ctx.fillRect(-19,-65,38,8);if(!temple){ctx.fillStyle='#fff';ctx.fillRect(-18,-25,36,17);ctx.fillStyle='#14283a';ctx.font='bold 10px system-ui';ctx.textAlign='center';ctx.fillText('MR JERY',0,-13);}}
   ctx.restore();
  }
  function draw(){ctx.clearRect(0,0,W,H);drawBackground();drawSideScenery();drawTrack();items.slice().sort((a,b)=>a.z-b.z).forEach(o=>{const p=project(o.lane,o.z);if(o.type==='coin')drawCoin(o,p);else drawObstacle(o,p);});drawRunner();const v=ctx.createRadialGradient(W/2,H/2,210,W/2,H/2,610);v.addColorStop(.55,'#0000');v.addColorStop(1,'#07130c88');ctx.fillStyle=v;ctx.fillRect(0,0,W,H);ctx.fillStyle='#fff1ce';ctx.font='900 23px system-ui';ctx.fillText(temple?'MR JERY • TEMPLE RUN':'MR JERY • SUBWAY SURFERS',22,36);}
  function finish(){active=false;dead=true;cancelAnimationFrame(raf);status.textContent='🏁 Kous la fini! '+Math.floor(distance)+' m • '+coins+' pyès. Eseye bat rekò ou!';startBtn.textContent='↻ REKÒMANSE';}
  function spawnItems(){const l=lanes[Math.floor(Math.random()*3)],r=Math.random();if(r<.42){for(let i=0;i<5;i++)items.push({lane:l,z:.02+i*.055,type:'coin'});}else{const type=temple?(r<.64?'rock':r<.82?'gap':'barrier'):(r<.68?'train':'barrier');items.push({lane:l,z:.04,type});if(Math.random()<.38){const other=lanes.filter(v=>v!==l)[Math.floor(Math.random()*2)];for(let i=0;i<3;i++)items.push({lane:other,z:.06-i*.06,type:'coin'});}}}
  function frame(t){if(!active)return;let dt=Math.min(2.2,(t-last)/16.67||1);last=t;distance+=speed*dt*1.75;speed=Math.min(.72,.32+distance/23000);phase+=dt*.24;if(jump>0)jump=Math.max(0,jump-dt*.045);if(slide>0)slide=Math.max(0,slide-dt*.055);spawn+=dt;if(spawn>Math.max(24,49-distance/1000)){spawn=0;spawnItems();}
   for(const o of items){o.z+=speed*dt*.013;if(o.lane===lane&&o.z>.88&&o.z<1.04){if(o.type==='coin'){o.hit=true;coins++;soundCoin();}else if((o.type==='rock'||o.type==='gap')&&jump>.2){o.hit=true;}else if(o.type==='barrier'&&slide>.2){o.hit=true;}else{finish();return;}}}
   items=items.filter(o=>o.z<1.15&&!o.hit);$('irDistance').textContent=Math.floor(distance)+' m';$('irCoins').textContent=coins;$('irSpeed').textContent=(speed/.32).toFixed(1)+'×';draw();raf=requestAnimationFrame(frame);}
  function start(){if(active)return;if(dead)reset();active=true;last=performance.now();status.textContent='Kouri! Kamera a ap swiv ou. Rete vijilan!';startBtn.textContent='▶ AN KOU';raf=requestAnimationFrame(frame);}
  const key=e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key)){e.preventDefault();if(e.key==='ArrowLeft')move(-1);if(e.key==='ArrowRight')move(1);if(e.key==='ArrowUp'||e.key===' ')action('jump');if(e.key==='ArrowDown')action('slide');}};
  let touch=null;canvas.addEventListener('pointerdown',e=>{touch={x:e.clientX,y:e.clientY};});canvas.addEventListener('pointerup',e=>{if(!touch)return;let dx=e.clientX-touch.x,dy=e.clientY-touch.y;touch=null;if(Math.max(Math.abs(dx),Math.abs(dy))<18)return;if(Math.abs(dx)>Math.abs(dy))move(dx>0?1:-1);else action(dy<0?'jump':'slide');});
  document.addEventListener('keydown',key);startBtn.addEventListener('click',start);$('irLeft').addEventListener('click',()=>move(-1));$('irRight').addEventListener('click',()=>move(1));$('irJump').addEventListener('click',()=>action('jump'));$('irSlide').addEventListener('click',()=>action('slide'));
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

 function startCarRacing(){
  showPanel('🏁 MR JERY CLASSIC RACING','<p class="mrjg-muted">Kous klasik: evite trafik, pran nivo, epi vòlè yon lòt machin lè w pwoche ase.</p><div id="carGameWrap" style="position:relative;width:min(100%,960px);margin:12px auto;border:1px solid rgba(218,177,83,.7);border-radius:18px;overflow:hidden;background:#10151b;box-shadow:0 18px 45px rgba(0,0,0,.42)"><canvas id="carCanvas" aria-label="MR JERY Classic Racing" style="display:block;width:100%;aspect-ratio:16/9;touch-action:none"></canvas><div style="position:absolute;inset:10px 12px auto;display:flex;justify-content:space-between;flex-wrap:wrap;gap:7px;pointer-events:none;color:#fff;font-weight:900;text-shadow:0 2px 5px #000;font-size:clamp(10px,1.6vw,15px)"><span>SCORE <b id="carScore">0</b></span><span>🟡 <b id="carCoins">0</b></span><span>CHANS <b id="carLives">2</b></span><span>NIVO <b id="carLevel">1</b></span><span>BEST <b id="carBest">0</b></span></div><div id="carOverlay" style="position:absolute;inset:0;display:grid;place-content:center;text-align:center;gap:12px;padding:20px;background:rgba(4,9,15,.8);color:#fff;font-size:clamp(20px,4vw,34px);font-weight:950">MR JERY CLASSIC RACING<button id="carStart" type="button" style="padding:13px 26px;border:1px solid #f4c76b;border-radius:12px;background:linear-gradient(135deg,#f5c76d,#9d6822);color:#17120a;font-weight:950;font-size:16px">▶ KÒMANSE KOURSI A</button><small style="font-size:12px;color:#d9e2ed">Ou gen 2 chans. Vòlè machin trafik yo!</small></div></div><div class="mrjg-controls" style="display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin:12px auto"><button id="carLeft" type="button" aria-label="Ale agoch" style="min-width:78px;font-size:23px">◀</button><button id="carRight" type="button" aria-label="Ale adwat" style="min-width:78px;font-size:23px">▶</button><button id="carSteal" type="button" style="border:1px solid #e5b54f">🚘 VÒLÈ MACHIN</button><button id="carPause" type="button">Ⅱ POZ</button><button id="carReset" type="button">↻ REKÒMANSE</button></div><p class="mrjg-note">Òdinatè: ← → oswa A/D pou chanje liy, E oswa ESPAS pou vòlè machin. Telefòn: bouton yo oswa glise dwèt ou sou wout la. Lè w toupre yon machin trafik, peze VÒLÈ MACHIN.</p>');
  const canvas=$('carCanvas'),ctx=canvas.getContext('2d'),overlay=$('carOverlay');
  const W=960,H=540,lanes=3,laneW=146,roadW=laneW*lanes,roadX=(W-roadW)/2;
  const levels=[{name:'FASIL',speed:225,spawn:.72,traffic:230},{name:'MWAYEN',speed:285,spawn:1.05,traffic:300},{name:'DIFISIL',speed:355,spawn:1.42,traffic:390},{name:'EKSPÈ',speed:420,spawn:1.75,traffic:470},{name:'LEJANN',speed:490,spawn:2.1,traffic:560}];
  let raf=0,last=0,run=false,paused=false,dead=false,disposed=false,elapsed=0,distance=0,score=0,coins=0,lives=2,lane=1,playerX=roadX+laneW*1.5,traffic=[{x:roadX+laneW*.5,y:150,color:'#e1e5e8',speed:250},{x:roadX+laneW*2.5,y:-125,color:'#d89c35',speed:270}],pickups=[],particles=[],keys={},level=0,playerColor='#bd2934',stealReady=true,shield=0,spawnClock=0;
  let best=0;try{best=Number(localStorage.getItem('mrjClassicRacingBest'))||0;}catch(e){}
  const $id=id=>$(id),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function resize(){const dpr=Math.min(2,window.devicePixelRatio||1);canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
  function roundRect(x,y,w,h,r){ctx.beginPath();if(ctx.roundRect){ctx.roundRect(x,y,w,h,r);return;}const rr=Math.min(r,w/2,h/2);ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();}
  function car(x,y,color,player=false,angle=0){
   ctx.save();ctx.translate(x,y);ctx.rotate(angle);
   ctx.fillStyle='#080b10';roundRect(-34,-48,68,100,15);ctx.fill();
   const body=ctx.createLinearGradient(-32,0,32,0);body.addColorStop(0,'#111820');body.addColorStop(.2,color);body.addColorStop(.75,color);body.addColorStop(1,'#171d25');
   roundRect(-29,-47,58,94,13);ctx.fillStyle=body;ctx.fill();ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1.5;ctx.stroke();
   ctx.fillStyle='#0b1823';roundRect(-21,-25,42,31,8);ctx.fill();ctx.fillStyle='#83a9bd';roundRect(-17,-21,34,22,5);ctx.fill();
   ctx.fillStyle='rgba(255,255,255,.28)';ctx.fillRect(-13,-18,5,14);ctx.fillStyle='#18232d';roundRect(-20,13,40,20,5);ctx.fill();
   ctx.fillStyle=player?'#fff3c6':'#f8d8a1';ctx.fillRect(-22,-43,13,5);ctx.fillRect(9,-43,13,5);
   ctx.fillStyle='#ff3e36';ctx.fillRect(-22,39,13,5);ctx.fillRect(9,39,13,5);
   ctx.fillStyle='#080b0e';ctx.fillRect(-34,-29,7,21);ctx.fillRect(27,-29,7,21);ctx.fillRect(-34,20,7,21);ctx.fillRect(27,20,7,21);
   if(player){ctx.fillStyle='#f4c76b';ctx.fillRect(-4,-38,8,6);ctx.fillStyle='rgba(255,255,255,.28)';ctx.fillRect(-3,-8,6,42);ctx.fillStyle='#fff';ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.fillText('MR JERY',0,8);}
   ctx.restore();
  }
  function updateHud(){const vals={carScore:Math.floor(score),carCoins:coins,carLives:lives,carBest:best,carLevel:level+1};Object.keys(vals).forEach(id=>{const el=$(id);if(el)el.textContent=vals[id];});}
  function reset(){elapsed=0;distance=0;score=0;coins=0;lives=2;lane=1;playerX=roadX+laneW*1.5;traffic=[{x:roadX+laneW*.5,y:150,color:'#e1e5e8',speed:levels[0].traffic},{x:roadX+laneW*2.5,y:-125,color:'#d89c35',speed:levels[0].traffic+25}];pickups=[];particles=[];dead=false;paused=false;level=0;playerColor='#bd2934';stealReady=true;shield=0;spawnClock=0;updateHud();overlay.style.display='grid';overlay.innerHTML='MR JERY CLASSIC RACING<div style="font-size:15px;color:#e8d6aa">2 CHANS • 5 NIVO • VÒLÈ MACHIN</div><button id="carStart" type="button" style="padding:13px 26px;border:1px solid #f4c76b;border-radius:12px;background:linear-gradient(135deg,#f5c76d,#9d6822);color:#17120a;font-weight:950;font-size:16px">▶ KÒMANSE KOURSI A</button><small style="font-size:12px;color:#d9e2ed">Peze E oswa bouton VÒLÈ MACHIN lè w toupre yon machin.</small>';$('carStart').addEventListener('click',start);draw();}
  function drawRoad(){
   const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#46565a');sky.addColorStop(1,'#182326');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
   ctx.fillStyle='#263b2c';ctx.fillRect(0,0,roadX,H);ctx.fillRect(roadX+roadW,0,W-roadX-roadW,H);
   for(let i=0;i<24;i++){let y=(i*47+distance*.65)%H;ctx.fillStyle=i%2?'#65764b':'#344b38';ctx.beginPath();ctx.arc(roadX-25-(i%3)*20,y,12+(i%4)*4,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(roadX+roadW+25+(i%3)*20,y+15,13+(i%3)*4,0,Math.PI*2);ctx.fill();}
   const asphalt=ctx.createLinearGradient(roadX,0,roadX+roadW,0);asphalt.addColorStop(0,'#1c2228');asphalt.addColorStop(.5,'#3b4147');asphalt.addColorStop(1,'#1c2228');ctx.fillStyle=asphalt;ctx.fillRect(roadX,0,roadW,H);
   ctx.fillStyle='#e3d5ad';ctx.fillRect(roadX+4,0,5,H);ctx.fillRect(roadX+roadW-9,0,5,H);
   for(let l=1;l<3;l++){for(let y=-60+(distance%115);y<H;y+=115){ctx.fillStyle='rgba(245,242,220,.82)';ctx.fillRect(roadX+laneW*l-2,y,4,58);}}
   for(let y=-40+(distance%75);y<H;y+=75){ctx.fillStyle='#e4e0d3';ctx.fillRect(roadX-10,y,6,35);ctx.fillRect(roadX+roadW+4,y,6,35);}
   ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(roadX+roadW/2-1,0,2,H);
  }
  function draw(){ctx.clearRect(0,0,W,H);drawRoad();pickups.forEach(p=>{ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.sin(p.spin)*.2);ctx.fillStyle='#f4b936';ctx.strokeStyle='#fff0a3';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,15,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#8e5a13';ctx.font='bold 17px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('$',0,1);ctx.restore();});traffic.forEach(t=>car(t.x,t.y,t.color));if(shield>0){ctx.strokeStyle='#67dfff';ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(playerX,H-112,43,59,0,0,Math.PI*2);ctx.stroke();}car(playerX,H-112,playerColor,true,keys.left?-.07:keys.right?.07:0);const shade=ctx.createLinearGradient(0,0,0,H);shade.addColorStop(0,'rgba(0,0,0,.18)');shade.addColorStop(.45,'transparent');shade.addColorStop(1,'rgba(0,0,0,.3)');ctx.fillStyle=shade;ctx.fillRect(0,0,W,H);}
  function finish(){run=false;dead=true;if(score>best){best=Math.floor(score);try{localStorage.setItem('mrjClassicRacingBest',String(best));}catch(e){}}updateHud();overlay.style.display='grid';overlay.innerHTML='KOURSI A FINI!<div style="font-size:16px">Score: '+Math.floor(score)+' • Pyès: '+coins+'<br>Nivo rive: '+(level+1)+' • Rekò: '+best+'</div><button id="carStart" type="button" style="padding:13px 26px;border:1px solid #f4c76b;border-radius:12px;background:linear-gradient(135deg,#f5c76d,#9d6822);color:#17120a;font-weight:950;font-size:16px">↻ REJWE</button>';$('carStart').addEventListener('click',start);}
  function spawn(){const l=Math.floor(Math.random()*3),x=roadX+laneW*(l+.5),cfg=levels[level];if(Math.random()<.76)traffic.push({x,y:-105,color:['#b93632','#e1e5e8','#d89c35','#367b9d','#586b50','#713e9b'][Math.floor(Math.random()*6)],speed:cfg.traffic+Math.random()*100});else pickups.push({x,y:-35,spin:0});}
  function steal(){if(!run||paused||!stealReady)return;let nearest=null,dist=Infinity;for(const t of traffic){const d=Math.abs(t.x-playerX)+Math.abs(t.y-(H-112))*.7;if(d<dist){dist=d;nearest=t;}}if(nearest&&dist<155){playerColor=nearest.color;traffic=traffic.filter(t=>t!==nearest);shield=3;stealReady=false;$('carSteal').textContent='VÒLÈ: FÈT';$('carSteal').disabled=true;score+=150;updateHud();}else{const b=$('carSteal');b.textContent='PWOCHE YON MACHIN!';setTimeout(()=>{if(b&&!disposed)b.textContent=stealReady?'🚘 VÒLÈ MACHIN':'VÒLÈ: FÈT';},900);}}
  function update(dt){elapsed+=dt;distance+=dt*levels[level].speed;score+=dt*(12+level*3);const next=Math.min(levels.length-1,Math.floor(score/450));if(next>level){level=next;updateHud();}const cfg=levels[level];playerX=roadX+laneW*(lane+.5);shield=Math.max(0,shield-dt);spawnClock+=dt;if(spawnClock>=1/cfg.spawn){spawnClock=0;spawn();}traffic.forEach(t=>t.y+=t.speed*dt);pickups.forEach(p=>{p.y+=cfg.traffic*dt;p.spin+=dt*5;});traffic=traffic.filter(t=>t.y<H+110);pickups=pickups.filter(p=>p.y<H+40);
   for(const t of traffic){if(Math.abs(t.x-playerX)<49&&Math.abs(t.y-(H-112))<76){if(shield<=0){lives--;updateHud();}t.y=H+200;if(lives<=0){finish();return;}}}
   pickups.forEach(p=>{if(!p.got&&Math.abs(p.x-playerX)<45&&Math.abs(p.y-(H-112))<58){p.got=true;coins++;score+=100;}});pickups=pickups.filter(p=>!p.got);updateHud();}
  function loop(t){if(!run||disposed)return;raf=requestAnimationFrame(loop);const dt=Math.min((t-last)/1000||0,.035);last=t;if(!paused)update(dt);draw();}
  function start(){if(run)return;if(dead)reset();overlay.style.display='none';paused=false;run=true;last=performance.now();raf=requestAnimationFrame(loop);}
  function changeLane(dir){lane=clamp(lane+dir,0,2);}
  const keyDown=e=>{if(['ArrowLeft','ArrowRight','a','d','A','D'].includes(e.key)){e.preventDefault();if(!keys[e.key])changeLane(e.key==='ArrowLeft'||e.key.toLowerCase()==='a'?-1:1);keys[e.key]=true;}if(e.key.toLowerCase()==='e'||e.code==='Space'){e.preventDefault();steal();}};
  const keyUp=e=>{delete keys[e.key];};document.addEventListener('keydown',keyDown);document.addEventListener('keyup',keyUp);
  const bind=(id,dir)=>{const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();changeLane(dir);});};bind('carLeft',-1);bind('carRight',1);
  let touchX=null;canvas.addEventListener('pointerdown',e=>{touchX=e.clientX;});canvas.addEventListener('pointerup',e=>{if(touchX!==null){const dx=e.clientX-touchX;if(Math.abs(dx)>25)changeLane(dx<0?-1:1);touchX=null;}});$('carSteal').addEventListener('click',steal);
  $('carStart').addEventListener('click',start);$('carPause').addEventListener('click',()=>{if(!run)return;paused=!paused;$('carPause').textContent=paused?'▶ KONTINYE':'Ⅱ POZ';});$('carReset').addEventListener('click',()=>{run=false;cancelAnimationFrame(raf);reset();});
  window.addEventListener('resize',resize);resize();updateHud();draw();cleanup=()=>{disposed=true;run=false;cancelAnimationFrame(raf);window.removeEventListener('resize',resize);document.removeEventListener('keydown',keyDown);document.removeEventListener('keyup',keyUp);};
 }

 function startSudoku(){
  showPanel('🔢 SUDOKU MASTER','<p class="mrjg-muted">Ranpli chak liy, kolòn ak kare 3×3 avèk chif 1 rive 9. Chak chif dwe parèt yon sèl fwa.</p><div id="sdkInfo" class="mrjg-status">Chwazi yon kare vid, epi antre yon chif.</div><div id="sdkBoard" style="width:min(94vw,450px);margin:12px auto;display:grid;grid-template-columns:repeat(9,minmax(0,1fr));border:3px solid #d4af37;border-radius:8px;overflow:hidden;background:#111827;aspect-ratio:1"></div><div id="sdkKeys" class="mrjg-controls" style="max-width:450px;margin:10px auto;display:grid;grid-template-columns:repeat(9,1fr);gap:5px"></div><div class="mrjg-controls"><button id="sdkCheck">✓ Verifye repons</button><button id="sdkErase">⌫ Efase</button><button id="sdkReset">↻ Rekòmanse</button></div>');
  const puzzle=['530070000','600195000','098000060','800060003','400803001','700020006','060000280','000419005','000080079'];
  const solution=['534678912','672195348','198342567','859761423','426853791','713924856','961537284','287419635','345286179'];
  const board=puzzle.map(r=>r.split('').map(Number)),fixed=board.map(r=>r.map(Boolean));let selected=-1;
  const el=$('sdkBoard'),info=$('sdkInfo'),keys=$('sdkKeys');
  function draw(){el.innerHTML='';board.forEach((row,r)=>row.forEach((v,c)=>{const i=r*9+c,b=document.createElement('button');b.type='button';b.textContent=v||'';b.style.cssText='aspect-ratio:1;border:0;border-right:'+(c===2||c===5?'3px solid #d4af37':'1px solid #64748b')+';border-bottom:'+(r===2||r===5?'3px solid #d4af37':'1px solid #64748b')+';background:'+(i===selected?'#785d20':fixed[r][c]?'#26364b':'#172235')+';color:'+(fixed[r][c]?'#fff':'#f5ce6a')+';font-size:clamp(14px,3.4vw,22px);font-weight:'+(fixed[r][c]?'900':'600')+';cursor:pointer;padding:0';b.addEventListener('click',()=>{selected=i;draw();});el.appendChild(b);}));}
  function enter(n){if(selected<0){info.textContent='Chwazi yon kare vid anvan.';return;}const r=Math.floor(selected/9),c=selected%9;if(fixed[r][c])return;board[r][c]=n;draw();}
  for(let n=1;n<=9;n++){const b=document.createElement('button');b.type='button';b.textContent=n;b.style.cssText='padding:10px 0;border:1px solid #b58a35;border-radius:8px;background:#26364b;color:#fff;font-weight:800;font-size:17px';b.addEventListener('click',()=>enter(n));keys.appendChild(b);}
  $('sdkErase').addEventListener('click',()=>enter(0));
  $('sdkCheck').addEventListener('click',()=>{let empty=0,wrong=0;board.forEach((row,r)=>row.forEach((v,c)=>{if(!v)empty++;else if(v!==solution[r][c])wrong++;}));if(!empty&&!wrong)info.textContent='🏆 Ekselan! Ou rezoud Sudoku a nèt!';else info.textContent=wrong+' move chif • '+empty+' kare vid. Kontinye!';});
  $('sdkReset').addEventListener('click',()=>{puzzle.forEach((r,i)=>board[i]=r.split('').map(Number));selected=-1;info.textContent='Nou rekòmanse. Bon chans!';draw();});
  draw();cleanup=()=>{};
 }
 function startQuiz(){
  // Gwo bank kesyon. Kesyon ki deja parèt rete make nan navigatè a pou yo pa repete.
  const questions=[
   ['Ki planèt yo rele Planèt Wouj la?',['Mas','Venis','Jipitè','Mèki'],0,'Syans'],
   ['Konbyen jwè yon ekip foutbòl genyen sou teren an pandan match nòmal?',['9','10','11','12'],2,'Espò'],
   ['Ki oseyan ki pi gwo sou Latè?',['Atlantik','Pasifik','Endyen','Aktik'],1,'Jewografi'],
   ['Ki gaz plant yo absòbe pou fotosentèz?',['Oksijèn','Azòt','Gaz kabonik','Idwojèn'],2,'Syans'],
   ['Ki peyi ki gen Tokyo kòm kapital?',['Lachin','Japon','Kore di Sid','Thailand'],1,'Jewografi'],
   ['Konbyen kote yon triyang genyen?',['2','3','4','5'],1,'Matematik'],
   ['Ki ògàn ki ponpe san nan kò moun?',['Poumon','Fwa','Kè','Ren'],2,'Syans'],
   ['Nan ki kontinan Ajantin ye?',['Ewòp','Afrik','Azi','Amerik di Sid'],3,'Jewografi'],
   ['Ki lang ofisyèl Ayiti pale ansanm ak kreyòl?',['Panyòl','Fransè','Anglè','Pòtigè'],1,'Kilti'],
   ['Konbyen minit ki genyen nan yon èdtan?',['30','45','60','90'],2,'Matematik'],
   ['Ki zetwal ki pi pre Latè?',['Sirius','Solèy','Polaris','Vega'],1,'Syans'],
   ['Ki pati plant lan ki absòbe dlo nan tè a?',['Fèy','Flè','Rasin','Fwi'],2,'Syans'],
   ['Ki fòs ki fè objè tonbe atè?',['Mayetis','Gravite','Friksyon','Elektrisite'],1,'Syans'],
   ['Ki eta dlo ye lè li tounen glas?',['Likid','Gaz','Solid','Plasma'],2,'Syans'],
   ['Konbyen jou yon ane bisekstil genyen?',['364','365','366','367'],2,'Syans'],
   ['Ki ògàn ki sèvi sitou pou respire?',['Kè','Poumon','Lestomak','Ren'],1,'Syans'],
   ['Ki vitamin kò a ka fabrike lè po a resevwa limyè solèy?',['Vitamin A','Vitamin B12','Vitamin C','Vitamin D'],3,'Syans'],
   ['Ki metal ki gen senbòl chimik Fe?',['Fè','Lò','Ajan','Kwiv'],0,'Syans'],
   ['Ki gaz ki pi abondan nan atmosfè Latè?',['Oksijèn','Azòt','Gaz kabonik','Idwojèn'],1,'Syans'],
   ['Ki syans ki etidye tranblemanntè?',['Astwonomi','Sismoloji','Botanik','Ekonomi'],1,'Syans'],
   ['Ki kontinan ki pi gwo sou Latè?',['Afrik','Ewòp','Azi','Oseyani'],2,'Jewografi'],
   ['Ki peyi ki gen kapital li nan Pòtoprens?',['Jamayik','Ayiti','Kiba','Repiblik Dominikèn'],1,'Jewografi'],
   ['Ki lanmè ki separe Ayiti ak Kiba?',['Lanmè Karayib','Lanmè Mediterane','Lanmè Wouj','Lanmè Nwa'],0,'Jewografi'],
   ['Ki kapital Kanada?',['Toronto','Vancouver','Ottawa','Monreyal'],2,'Jewografi'],
   ['Sou ki kontinan peyi Lejip ye sitou?',['Afrik','Ewòp','Azi','Amerik'],0,'Jewografi'],
   ['Ki peyi ki gen kapital Brasília?',['Pòtigal','Brezil','Meksik','Chili'],1,'Jewografi'],
   ['Ki pi gwo dezè cho nan mond lan?',['Gobi','Sahara','Kalahari','Atacama'],1,'Jewografi'],
   ['Ki liy imajinè ki separe Latè an emisfè nò ak sid?',['Meridyen Greenwich','Ekwatè','Twopik Kansè','Sèk Aktik'],1,'Jewografi'],
   ['Ki kapital Lafrans?',['Lyon','Wòm','Pari','Bòdo'],2,'Jewografi'],
   ['Ki peyi ki gen plis zile nan Karayib la?',['Kiba','Ayiti','Barbad','Sent Lisi'],0,'Jewografi'],
   ['Nan ki espò yo itilize yon rakèt ak yon boul jòn?',['Boks','Tenis','Ragbi','Gòlf'],1,'Espò'],
   ['Konbyen jwè yon ekip baskètbòl genyen sou teren an?',['4','5','6','7'],1,'Espò'],
   ['Ki peyi ki te òganize koup di mond foutbòl 2022?',['Larisi','Katar','Brezil','Almay'],1,'Espò'],
   ['Ki koulè kat abit la itilize pou ekspilse yon jwè nan foutbòl?',['Jòn','Vèt','Wouj','Ble'],2,'Espò'],
   ['Konbyen bag ki nan senbòl olenpik la?',['4','5','6','7'],1,'Espò'],
   ['Nan tenis, ki mo yo itilize lè yon jwè genyen zewo pwen nan yon jwèt?',['Love','Nilè','Zero','Blank'],0,'Espò'],
   ['Ki distans yon maraton ofisyèl genyen apeprè?',['21.1 km','30 km','42.195 km','50 km'],2,'Espò'],
   ['Ki jwè ki ka sèvi ak men li nan zòn pa li nan foutbòl?',['Atakan','Defansè','Gadyen','Mitan teren'],2,'Espò'],
   ['Nan ki espò yo fè yon dunk?',['Baskètbòl','Tenis','Natasyon','Boks'],0,'Espò'],
   ['Ki pyès echèk ki deplase an fòm L?',['Rèn','Tou','Cheval','Wa'],2,'Espò'],
   ['Konbyen se 12 × 8?',['86','92','96','108'],2,'Matematik'],
   ['Konbyen se 144 ÷ 12?',['10','11','12','14'],2,'Matematik'],
   ['Ki non rezilta yon adisyon?',['Pwodwi','Som','Diferans','Kosyan'],1,'Matematik'],
   ['Ki fraksyon ki egal ak 0.5?',['1/4','1/3','1/2','3/4'],2,'Matematik'],
   ['Konbyen degre yon ang dwat genyen?',['45°','60°','90°','180°'],2,'Matematik'],
   ['Ki nimewo premye nan lis sa a?',['21','27','29','33'],2,'Matematik'],
   ['Si yon atik koute 100 goud epi yo retire 20%, konbyen li koute apre rabè a?',['70 goud','75 goud','80 goud','90 goud'],2,'Matematik'],
   ['Ki fòm ki gen kat kote egal ak kat ang dwat?',['Rektang','Kare','Triyang','Trapèz'],1,'Matematik'],
   ['Konbyen santimèt ki nan yon mèt?',['10','100','1 000','10 000'],1,'Matematik'],
   ['Ki siy ki reprezante pi piti pase?',['>','<','=','÷'],1,'Matematik'],
   ['Ki liv ki gen istwa Toussaint Louverture ak Revolisyon ayisyen an nan sant li?',['Istwa Ayiti','Istwa Wòm','Istwa Japon','Istwa Lagrès'],0,'Istwa'],
   ['Nan ki ane Ayiti te pwoklame endepandans li?',['1791','1804','1825','1844'],1,'Istwa'],
   ['Ki dat Ayiti selebre Jou Endepandans li?',['1ye janvye','18 me','18 novanm','1ye me'],0,'Istwa'],
   ['Ki non batay istorik 18 novanm 1803 la?',['Vertières','Crête-à-Pierrot','Savannah','Rivière-Rouge'],0,'Istwa'],
   ['Ki premye anperè Ayiti?',['Alexandre Pétion','Henri Christophe','Jean-Jacques Dessalines','Toussaint Louverture'],2,'Istwa'],
   ['Ki peyi ki te bati piramid Giza yo?',['Lagrès','Lejip','Meksik','Pès'],1,'Istwa'],
   ['Ki sivilizasyon ki te konstwi vil Machu Picchu?',['Maya','Enka','Women','Viking'],1,'Istwa'],
   ['Ki ane Dezyèm Gè Mondyal la te fini?',['1918','1939','1945','1950'],2,'Istwa'],
   ['Ki dokiman ki tabli prensip fondamantal yon peyi?',['Kontra','Konstitisyon','Resi','Kat idantite'],1,'Sosyete'],
   ['Ki enstitisyon nan Ayiti ki responsab òganize eleksyon yo?',['DGI','CEP','BRH','MENFP'],1,'Sosyete'],
   ['Ki lajan ofisyèl Ayiti?',['Peso','Goud','Dola kanadyen','Euro'],1,'Sosyete'],
   ['Ki konpòtman ki pi bon pou pwoteje modpas ou?',['Pataje li ak tout moun','Sèvi ak menm modpas toupatou','Itilize modpas solid ak diferan','Ekri li sou rezo sosyal'],2,'Teknoloji'],
   ['Ki aparèy ki distribye koneksyon Wi-Fi lakay?',['Enprimant','Routeur','Klavye','Eskanè'],1,'Teknoloji'],
   ['Ki ekstansyon yon fichye imaj PNG genyen?',['.mp3','.png','.docx','.zip'],1,'Teknoloji'],
   ['Ki sa CPU vle di nan yon òdinatè?',['Inite santral tretman','Kapasite prensipal USB','Kontwòl pwogram itilizatè','Koneksyon prive inivèsèl'],0,'Teknoloji'],
   ['Ki aksyon ki pi saj lè yon imèl mande modpas ou sou yon lyen sispèk?',['Klike touswit','Voye modpas la','Verifye sous la epi pa bay modpas','Reponn ak tout enfòmasyon'],2,'Teknoloji'],
   ['Ki zouti ki sèvi pou mezire tanperati?',['Baromèt','Tèmomèt','Altimèt','Voltmèt'],1,'Syans'],
   ['Ki syantis ki asosye ak lwa mouvman ak gravite klasik?',['Isaac Newton','Louis Pasteur','Charles Darwin','Galileo Galilei'],0,'Syans'],
   ['Ki pati nan selil la ki pote pifò enfòmasyon jenetik?',['Nwayo','Manbràn','Sitoplas','Mi selilè'],0,'Syans'],
   ['Ki bèt ki se yon mamifè?',['Reken','Dòfen','Kwokodil','Tòti'],1,'Syans'],
   ['Ki pwosesis dlo a suiv lè li pase likid pou vin vapè?',['Kondansasyon','Evaporasyon','Solidifikasyon','Fizyon'],1,'Syans'],
   ['Ki enèji yon panèl solè transfòme limyè solèy la an li?',['Enèji elektrik','Enèji son','Enèji nikleyè','Enèji chimik sèlman'],0,'Syans'],
   ['Ki ògàn kò a sèvi sitou pou filtre san epi pwodui pipi?',['Kè','Ren','Poumon','Lestomak'],1,'Syans'],
   ['Ki pati nan je a ki kontwole kantite limyè k ap antre?',['Iris','Retin','Kònèy','Nè optik'],0,'Syans'],
   ['Ki non syantifik pwosesis plant yo itilize pou fè manje ak limyè?',['Respirasyon','Fotosentèz','Fèmantasyon','Dijesyon'],1,'Syans'],
   ['Ki bèt ki pi gwo pami bèt vivan yo konnen jodi a?',['Elefan afriken','Balèn ble','Reken blan','Jiraf'],1,'Syans'],
   ['Ki lang yo itilize anpil pou kreye paj entènèt entèaktif ansanm ak HTML ak CSS?',['JavaScript','SQL sèlman','Bash sèlman','XML sèlman'],0,'Teknoloji'],
   ['Ki aparèy ki pèmèt ou antre tèks nan òdinatè?',['Klavye','Ekran','Bwat son','Mikwo'],0,'Teknoloji'],
   ['Ki sa URL reprezante?',['Adrès yon resous sou entènèt','Yon kalite batri','Yon sistèm son','Yon langaj desen'],0,'Teknoloji'],
   ['Ki mezi ki pi apwopriye pou kapasite depo fichye?',['Kilogram','Gigaoctet','Kilomèt','Lit'],1,'Teknoloji'],
   ['Ki sa navigatè entènèt la sèvi pou fè?',['Louvri paj entènèt','Enprime lajan','Mezire tanperati','Chaje batri'],0,'Teknoloji'],
   ['Ki konbinezon klavye ki souvan sèvi pou kopye tèks sou Windows?',['Ctrl + V','Ctrl + C','Ctrl + X','Ctrl + Z'],1,'Teknoloji'],
   ['Ki non pwosesis pou verifye idantite yon moun anvan li antre nan yon kont?',['Otantifikasyon','Konpresyon','Enpresyon','Tradiksyon'],0,'Teknoloji'],
   ['Ki fwi ki se yon bon sous vitamin C?',['Zoranj','Bètrav','Diri','Manyòk'],0,'Sante'],
   ['Ki abitid ki ede diminye pwopagasyon mikwòb?',['Lave men ak savon','Pataje sèvyèt sal','Pa kouvri tous','Manyen figi souvan'],0,'Sante'],
   ['Ki sa yon rejim alimantè ekilibre dwe genyen?',['Yon sèl kalite manje','Divès gwoup manje an kantite apwopriye','Sèlman sik','Sèlman vyann'],1,'Sante'],
   ['Ki aktivite ki bon pou sante kè a?',['Mache regilyèman','Rete chita tout jounen','Fimen','Pa dòmi'],0,'Sante'],
   ['Ki siy ki montre yon moun ka bezwen bwè dlo?',['Swaf ak bouch sèk','Cheve long','Zong kout','Je mawon'],0,'Sante'],
   ['Ki sa premye swen vle di?',['Swen imedya debaz anvan swen pwofesyonèl','Operasyon konplike','Tretman san evalyasyon','Sèlman medikaman'],0,'Sante'],
   ['Ki aksyon ki pi bon lè yon moun pèdi konesans epi li pa respire nòmalman?',['Rele sèvis ijans epi kòmanse CPR si ou kapab','Ba li manje','Kite li pou kont li','Fòse li bwè dlo'],0,'Sante'],
   ['Ki sa polisyon plastik nan lanmè ka fè?',['Mete bèt maren an danje','Ogmante oksijèn toujou','Fè dlo a vin dous','Pa gen okenn efè'],0,'Anviwònman'],
   ['Ki aksyon ki ede pwoteje forè?',['Koupe tout pyebwa','Plante pyebwa epi limite debwazman','Boule fatra nan forè','Jete lwil nan rivyè'],1,'Anviwònman'],
   ['Ki sous enèji ki renouvlab?',['Chabon','Petwòl','Van','Gaz natirèl'],2,'Anviwònman'],
   ['Ki sa resiklaj pèmèt?',['Re-itilize materyèl pou diminye fatra','Ogmante fatra','Gaspiye dlo','Polye plis'],0,'Anviwònman'],
   ['Ki gaz ki kontribye anpil nan rechofman planèt la lè li ogmante nan atmosfè?',['Gaz kabonik','Oksijèn','Elyòm','Neyon'],0,'Anviwònman'],
   ['Ki valè x nan ekwasyon 3x + 5 = 20?',['3','5','7','8'],1,'Matematik','Mwayen'],
   ['Ki non pwosesis kote selil yo divize pou fòme de selil pitit ki idantik?',['Mitòz','Mejoz','Osmòz','Difizyon'],0,'Syans','Mwayen'],
   ['Ki ògàn nan kò moun ki pwodui ensilin?',['Fwa','Pankreyas','Ren','Kè'],1,'Syans','Mwayen'],
   ['Ki peyi Afriken ki gen kapital Addis-Abeba?',['Kenya','Etyopi','Gana','Senegal'],1,'Jewografi','Mwayen'],
   ['Ki kanal ki konekte lanmè Mediterane ak lanmè Wouj?',['Kanal Panama','Kanal Suez','Kanal La Manche','Kanal Korent'],1,'Jewografi','Mwayen'],
   ['Ki ane premye moun te mache sou Lalin?',['1959','1965','1969','1972'],2,'Istwa','Mwayen'],
   ['Ki eleman chimik ki gen senbòl Au?',['Ajan','Lò','Aliminyòm','Ajan mèki'],1,'Syans','Mwayen'],
   ['Ki inite yo itilize pou mezire fòs?',['Joul','Watt','Newton','Pascal'],2,'Syans','Mwayen'],
   ['Ki peyi ki te genyen premye koup di mond foutbòl gason an an 1930?',['Ajantin','Itali','Irigwe','Brezil'],2,'Espò','Mwayen'],
   ['Nan echèk, ki pyès ki ka deplase nenpòt kantite kare an dyagonal?',['Tou','Fou','Cheval','Pyon'],1,'Espò','Mwayen'],
   ['Ki rezilta 15% nan 200?',['15','20','30','35'],2,'Matematik','Mwayen'],
   ['Ki non poligòn ki gen uit kote?',['Egzagòn','Eptagòn','Oktagòn','Nonagòn'],2,'Matematik','Mwayen'],
   ['Ki syantis ki te pwopoze teyori relativite a?',['Albert Einstein','Niels Bohr','Marie Curie','Nikola Tesla'],0,'Syans','Mwayen'],
   ['Ki kouch Latè kote plak tektonik yo deplase?',['Nwayo entèn','Litosfè','Nwayo ekstèn','Atmosfè'],1,'Syans','Difikil'],
   ['Ki non pwosesis kote yon likid pase dirèkteman nan eta solid?',['Evaporasyon','Kondansasyon','Solidifikasyon','Sublimasyon'],2,'Syans','Mwayen'],
   ['Ki kapital Ostrali?',['Sydney','Melbourne','Canberra','Perth'],2,'Jewografi','Mwayen'],
   ['Ki mòn ki pi wo sou Latè anwo nivo lanmè?',['K2','Kilimanjaro','Everest','Mont Blanc'],2,'Jewografi','Fasil'],
   ['Ki peyi ki gen vil istorik Kyoto?',['Lachin','Japon','Vyetnam','Mongoli'],1,'Jewografi','Fasil'],
   ['Ki trete ki te rekonèt endepandans Ayiti an 1825, men ki te egzije yon gwo dedomajman?',['Trete Pari','Òdonans Charles X','Trete Vèsay','Trete Tordesillas'],1,'Istwa','Difikil'],
   ['Ki lidè revolisyonè ayisyen yo te rele “Papa peyi a” nan istwa endepandans lan?',['Jean-Jacques Dessalines','Alexandre Pétion','Henri Christophe','André Rigaud'],0,'Istwa','Mwayen'],
   ['Ki ane Konstitisyon ameriken aktyèl la te siyen?',['1776','1787','1789','1791'],1,'Istwa','Difikil'],
   ['Ki òganizasyon entènasyonal ki gen katye jeneral li nan New York?',['UNESCO','Nasyonzini','OPEC','NATO'],1,'Sosyete','Fasil'],
   ['Ki dokiman legal ki bay yon moun dwa pou vwayaje aletranje?',['Paspò','Diplòm','Fakti','Kat bibliyotèk'],0,'Sosyete','Fasil'],
   ['Ki sa enflasyon vle di nan ekonomi?',['Bès jeneral pri yo','Ogmantasyon jeneral pri yo','Ogmantasyon popilasyon sèlman','Diminisyon salè sèlman'],1,'Sosyete','Mwayen'],
   ['Ki bank santral Ayiti?',['BNC','BRH','Sogebank','UNIBANK'],1,'Sosyete','Fasil'],
   ['Ki pwotokòl entènèt ki sekirize kominikasyon sou sit entènèt?',['HTTP','HTTPS','FTP','SMTP'],1,'Teknoloji','Mwayen'],
   ['Ki langaj sèvi prensipalman pou estriktire kontni yon paj entènèt?',['CSS','HTML','Python','SQL'],1,'Teknoloji','Fasil'],
   ['Ki sa yon bazdone ye?',['Yon koleksyon done òganize','Yon aparèy pou enprime','Yon kalite ekran','Yon rezo elektrik'],0,'Teknoloji','Mwayen'],
   ['Ki konbinezon kle ki kole yon bagay ou te kopye sou Windows?',['Ctrl + X','Ctrl + C','Ctrl + V','Ctrl + A'],2,'Teknoloji','Fasil'],
   ['Ki mezi ki egal 1 000 mèt?',['1 santimèt','1 kilomèt','1 milimèt','1 desimèt'],1,'Matematik','Fasil'],
   ['Ki rasin kare 225?',['12','13','15','25'],2,'Matematik','Mwayen'],
   ['Si 5 travayè fini yon travay nan 12 jou, konbyen jou 10 travayè ta pran nan menm vitès la?',['3','6','12','24'],1,'Matematik','Difikil'],
   ['Ki valè ang enteryè yon egzagòn regilye genyen an total?',['360°','540°','720°','900°'],2,'Matematik','Difikil'],
   ['Ki non fòmil chimik dlo a?',['CO₂','H₂O','O₂','NaCl'],1,'Syans','Fasil'],
   ['Ki pati nan san an ki ede koagilasyon?',['Globil wouj','Plakèt','Plasma sèlman','Globil blan'],1,'Syans','Mwayen'],
   ['Ki maladi moustik Aedes aegypti ka transmèt?',['Deng','Tibèkiloz','Kolera','Tetanòs'],0,'Sante','Mwayen'],
   ['Ki vitamin ki enpòtan anpil pou koagulasyon san?',['Vitamin A','Vitamin C','Vitamin K','Vitamin B1'],2,'Sante','Mwayen'],
   ['Ki gaz ki nesesè pou konbisyon nòmal?',['Azòt','Oksijèn','Elyòm','Idwojèn sèlman'],1,'Syans','Fasil'],
   ['Ki kouch atmosfè kote pifò fenomèn meteyowolojik fèt?',['Tèmosfè','Mezosfè','Twoposfè','Egzosfè'],2,'Syans','Difikil'],
   ['Ki non enèji yon objè genyen poutèt mouvman li?',['Enèji potansyèl','Enèji sinetik','Enèji chimik','Enèji nikleyè'],1,'Syans','Mwayen'],
   ['Ki peyi ki te genyen koup di mond foutbòl gason 2018 la?',['Almay','Ajantin','Frans','Kwoasi'],2,'Espò','Fasil'],
   ['Nan foutbòl, konbyen minit tan nòmal yon match genyen san tan adisyonèl?',['80','90','100','120'],1,'Espò','Fasil'],
   ['Ki atlèt ki te etabli rekò mondyal 100 m gason an 9.58 segonn?',['Carl Lewis','Usain Bolt','Yohan Blake','Justin Gatlin'],1,'Espò','Mwayen'],
   ['Ki oseyan ki ant Afrik ak Ostrali?',['Atlantik','Pasifik','Endyen','Aktik'],2,'Jewografi','Mwayen'],
   ['Ki peyi ki gen kapital Nairobi?',['Tanzani','Kenya','Uganda','Rwanda'],1,'Jewografi','Fasil'],
   ['Ki prensip syantifik ki di enèji pa kreye ni detwi, li transfòme?',['Lwa aksyon-reyaksyon','Konsèvasyon enèji','Lwa gravite','Prensip ensètitid'],1,'Syans','Difikil']

  ];
  const historyKey='mrjery_quiz_seen_v2';
  let seen=new Set();
  try{seen=new Set(JSON.parse(localStorage.getItem(historyKey)||'[]'));}catch(e){}
  let queue=[],pos=0,score=0,answered=false,asked=0;
  function buildQueue(){queue=questions.map((_,i)=>i).filter(i=>!seen.has(questions[i][0])).sort(()=>Math.random()-.5);pos=0;}
  showPanel('🧠 QUIZ CHALLENGE','<p class="mrjg-muted">Yon gwo defi konesans san kantite kesyon fiks. Kesyon yo melanje, epi sa ou deja reponn yo pap parèt ankò sou aparèy sa a.</p><div id="quizProgress" class="mrjg-status"></div><div id="quizQuestion" style="max-width:650px;margin:16px auto;padding:22px;border:1px solid #b58a35;border-radius:16px;background:linear-gradient(145deg,#1c2c43,#101827);font-size:clamp(18px,3vw,24px);font-weight:800"></div><div id="quizAnswers" style="max-width:650px;margin:12px auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px"></div><div id="quizFeedback" class="mrjg-status" aria-live="polite"></div><div class="mrjg-controls"><button id="quizNext" disabled>Kesyon apre →</button><button id="quizRestart">↻ Rekòmanse defi a</button></div>');
  const q=$('quizQuestion'),answers=$('quizAnswers'),progress=$('quizProgress'),feedback=$('quizFeedback'),next=$('quizNext');
  function finishBank(){q.textContent='🏆 Ou fin reponn tout kesyon ki nan bank aktyèl la!';answers.innerHTML='';progress.textContent='BANK KESYON FINI • '+asked+' KESYON JWE';feedback.textContent='Ou fè '+score+' pwen nan sesyon sa a. Kesyon ou deja wè yo rete anrejistre pou yo pa repete. N ap kapab ajoute nouvo kesyon nan pwochen mizajou.';next.disabled=true;next.textContent='Bank lan fini';}
  function draw(){
   if(pos>=queue.length){finishBank();return;}
   answered=false;next.disabled=true;feedback.textContent='';
   const qi=queue[pos],item=questions[qi];
   const level=item[4]|| (qi<32?'Fasil':qi<68?'Mwayen':'Difikil');
   progress.textContent='KESYON #'+(asked+1)+' • NIVO: '+level.toUpperCase()+' • PWEN: '+score+' • '+item[3]+' • RÈS: '+(queue.length-pos);
   q.textContent=item[0];answers.innerHTML='';
   const choices=item[1].map((v,i)=>({v,correct:i===item[2]})).sort(()=>Math.random()-.5);
   choices.forEach((choice,i)=>{const b=document.createElement('button');b.type='button';b.textContent=String.fromCharCode(65+i)+'. '+choice.v;b.style.cssText='min-height:58px;padding:12px;border:1px solid #52647d;border-radius:11px;background:#1d2c42;color:#fff;font-weight:700;font-size:15px;cursor:pointer';b.addEventListener('click',()=>answer(choice.correct,b));answers.appendChild(b);});
   next.textContent='Kesyon apre →';
  }
  function answer(correct){
   if(answered)return;answered=true;asked++;
   const item=questions[queue[pos]];seen.add(item[0]);try{localStorage.setItem(historyKey,JSON.stringify([...seen]));}catch(e){}
   const level=item[4]||(queue[pos]<32?'Fasil':queue[pos]<68?'Mwayen':'Difikil');
   const points=level==='Difikil'?30:level==='Mwayen'?20:10;
   if(correct)score+=points;
   [...answers.children].forEach((b)=>{b.disabled=true;const label=b.textContent.slice(3);if(label===item[1][item[2]])b.style.background='#17633f';else if(b===answers.querySelector(':focus'))b.style.background='#873737';});
   feedback.textContent=correct?'✓ Bon repons! +'+points+' pwen ('+level+')':'✗ Se pa sa. Bon repons lan: '+item[1][item[2]];
   next.disabled=false;progress.textContent='KESYON #'+asked+' • NIVO: '+level.toUpperCase()+' • PWEN: '+score+' • '+item[3];
  }
  next.addEventListener('click',()=>{if(!answered)return;pos++;draw();});
  $('quizRestart').addEventListener('click',()=>{buildQueue();score=0;asked=0;if(!queue.length){finishBank();return;}draw();});
  buildQueue();if(queue.length)draw();else finishBank();cleanup=()=>{};
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
