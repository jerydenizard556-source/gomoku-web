
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
 $('mrjgAriana').addEventListener('click',startArianaQuest);
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

 function startArianaQuest(){
  showPanel('⚔️ MR JERY JUNGLE QUEST','<p class="mrjg-muted">Eksplore wayòm nan, sote sou platfòm, bat eskòpyon epi ranmase pyès lò.</p><div class="ariana-stage ariana-stage-2d" id="aqStage"><canvas id="aqCanvas" aria-label="MR JERY Jungle Quest"></canvas><div class="aq-hud"><div class="aq-player">MR JERY <span id="aqHearts">♥ ♥ ♥ ♥ ♥</span></div><div>SCORE <b id="aqScore">0</b></div><div>COINS <b>🟡 <span id="aqCoins">0</span></b></div><div>LIFE <b id="aqLife">×5</b></div><div class="aq-level">LEVEL <b id="aqLevel">1 / 50</b> <span id="aqTime">01:00</span></div><div class="aq-progress" style="height:7px;margin:5px 10px 0;background:rgba(5,20,17,.7);border:1px solid rgba(255,226,151,.55);border-radius:8px;overflow:hidden"><i id="aqProgress" style="display:block;width:0;height:100%;background:linear-gradient(90deg,#8bd34e,#ffe07a);border-radius:8px;transition:width .12s"></i></div></div><div class="aq-touch aq-left"><button id="aqLeft" aria-label="Ale agoch">◀</button><button id="aqRight" aria-label="Ale adwat">▶</button></div><div class="aq-touch aq-right"><button id="aqJump" aria-label="Sote">⬆</button><button id="aqAttack" aria-label="Atake">⚔</button></div><div id="aqOverlay" class="ariana-overlay">MR JERY • JUNGLE QUEST<button id="aqPlay" type="button">▶ KÒMANSE</button></div></div><div class="ariana-controls"><button id="aqPause" type="button">Ⅱ POZ</button><button id="aqRestart" type="button">↻ REKÒMANSE</button></div><p class="mrjg-note">Klavye: ← → deplase, Espas/↑ sote, X/J atake. Sou telefòn, itilize bouton ki sou ekran an.</p>');
  const canvas=$('aqCanvas'),ctx=canvas.getContext('2d'),stage=$('aqStage'),overlay=$('aqOverlay');
  let W=1280,H=720,raf=0,last=0,elapsed=0,score=0,coins=0,life=5,world=0,hero,enemyList=[],coinList=[],hazards=[],blocks=[],particles=[],keys={},running=false,paused=false,disposed=false,attack=0,attackNeedsRelease=false,attackHitDone=false,level=1,maxUnlocked=1,levelLength=5345,levelTime=75,invulnerable=0;try{maxUnlocked=Math.max(1,Math.min(50,Number(localStorage.getItem("mrjArianaMaxLevel"))||1));}catch(e){}
  const rnd=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),ground=566,gravity=1900;
  function resize(){const r=stage.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);W=1280;H=720;canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.width/(16/9)*dpr);ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);}
  function path(points,fill,stroke=null,lw=2){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}}
  function ellipse(x,y,rx,ry,c,stroke=null,lw=2){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}}
  function round(x,y,w,h,r,fill,stroke=null,lw=2){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}}
  function line(points,color,width=3){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();}
  function leaf(x,y,s,rot,color){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-s*.72,-s*.45,-s*.55,-s*1.3,0,-s);ctx.bezierCurveTo(s*.6,-s*1.25,s*.75,-s*.35,0,0);ctx.fill();ctx.strokeStyle='rgba(224,255,181,.25)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,-2);ctx.lineTo(0,-s*.83);ctx.stroke();ctx.restore();}
  function drawCastle(){const x=780-world*.11;ctx.save();ctx.globalAlpha=.92;const base=500;const stone=ctx.createLinearGradient(x,180,x+330,500);stone.addColorStop(0,'#b5c2b8');stone.addColorStop(.5,'#71877f');stone.addColorStop(1,'#405c56');for(let i=0;i<3;i++){const xx=x+i*105-70,hh=210+(i%2)*45;round(xx,base-hh,90,hh,5,stone,'#263e3b',5);for(let yy=base-hh+18;yy<base-25;yy+=32){ctx.strokeStyle='rgba(20,38,32,.25)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(xx+4,yy);ctx.lineTo(xx+86,yy);ctx.stroke();}path([[xx-10,base-hh],[xx+45,base-hh-48],[xx+100,base-hh]],'#526e68','#314e4b',4);for(let k=0;k<3;k++){round(xx+12+k*25,base-hh+38,12,28,6,'#173d45');}round(xx+33,base-58,24,58,12,'#183b43');}for(let i=0;i<4;i++){const xx=x+i*95;path([[xx,base-240],[xx+22,base-295],[xx+44,base-240]],'#334f4d','#203c3a',4);path([[xx+8,base-270],[xx+22,base-305],[xx+36,base-270]],'#a94d43');ctx.fillStyle='#cba56b';ctx.fillRect(xx+19,base-296,3,26);path([[xx+22,base-294],[xx+54,base-285],[xx+22,base-274]],'#b7483c');}ctx.restore();}
  function waterfall(){const x=570-world*.16;ctx.save();const rock=ctx.createLinearGradient(x-20,260,x+110,550);rock.addColorStop(0,'#58786e');rock.addColorStop(.5,'#314f49');rock.addColorStop(1,'#1c3d36');path([[x-25,270],[x+105,260],[x+118,535],[x-20,535]],rock);path([[x,280],[x+88,280],[x+102,535],[x-12,535]],'#3c9eae');ctx.globalAlpha=.55;for(let i=0;i<12;i++){const yy=290+((elapsed*120+i*38)%230);ctx.fillStyle=i%3?'#b9f8f5':'#e7ffff';ctx.fillRect(x+8+(i*17)%80,yy,2+(i%3),35+(i%4)*18);}ctx.globalAlpha=.25;ellipse(x+45,535,95,20,'#a5e8d7');ctx.globalAlpha=.4;for(let i=0;i<8;i++)ellipse(x-35+i*22,545+Math.sin(elapsed*3+i)*3,rand(4,9),rand(2,5),'#d8fff8');ctx.restore();}
  function tree(x,y,s,shade){ctx.save();ctx.translate(x,y);ctx.scale(s,s);round(-13,-150,26,175,8,'#573a27');path([[-5,-110],[-80,-190],[-62,-185],[-5,-140],[64,-225],[75,-210],[10,-112]],'#315a42');for(let i=0;i<8;i++){const a=i*Math.PI/4;leaf(Math.cos(a)*48,-160+Math.sin(a)*43,70,a,shade[i%shade.length]);}ellipse(-42,-178,54,43,shade[1]);ellipse(40,-205,60,52,shade[0]);ellipse(0,-246,66,58,shade[2]);ctx.restore();}
  function forest(){const g=ctx.createLinearGradient(0,0,0,H);const zones=[['#102f48','#267b83','#58a77d','#194b38'],['#382b55','#67517c','#9b886f','#3f4b3a'],['#653b2e','#c07845','#d6aa65','#4b4b2e'],['#123c50','#347e91','#7bc2bd','#1e5949'],['#242c49','#575e81','#a28a79','#343d37']];const zone=zones[Math.floor((level-1)/10)%zones.length];g.addColorStop(0,zone[0]);g.addColorStop(.28,zone[1]);g.addColorStop(.64,zone[2]);g.addColorStop(1,zone[3]);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);const sun=ctx.createRadialGradient(650,185,5,650,185,430);sun.addColorStop(0,'rgba(255,236,161,.45)');sun.addColorStop(1,'rgba(255,236,161,0)');ctx.fillStyle=sun;ctx.fillRect(0,0,W,H);ctx.save();ctx.globalAlpha=.11;for(let i=0;i<7;i++){ctx.fillStyle='#fff4c7';ctx.beginPath();ctx.moveTo(610+i*22,0);ctx.lineTo(660+i*38,510);ctx.lineTo(700+i*38,510);ctx.lineTo(640+i*22,0);ctx.fill();}ctx.restore();
   // Premium cinematic jungle atmosphere: distant ridges, drifting clouds, light shafts, and layered foliage
   ctx.save();ctx.globalAlpha=.28;path([[0,385],[160,250],[300,360],[485,220],[680,370],[870,245],[1050,350],[1190,230],[1280,330],[1280,500],[0,500]],'#173f4a');ctx.globalAlpha=.18;path([[0,430],[210,315],[390,420],[610,285],[830,420],[1040,300],[1280,425],[1280,520],[0,520]],'#b0d4a0');ctx.restore();
   for(let i=0;i<5;i++){const cx=((i*315-elapsed*11)%1550+1550)%1550-100,cy=95+(i%3)*54;ctx.save();ctx.globalAlpha=.16;ellipse(cx,cy,75,17,'#e9fff0');ellipse(cx+38,cy-9,43,22,'#e9fff0');ellipse(cx-36,cy-5,34,18,'#e9fff0');ctx.restore();}
   for(let i=0;i<9;i++){const x=((i*210-world*.12)%1800+1800)%1800-160;tree(x,465,1.2,['#2d684d','#347653','#3d8054'][i%3]);}
   drawCastle();waterfall();
   for(let i=0;i<14;i++){const x=((i*137-world*.25)%1500+1500)%1500-80;tree(x,525,.72,['#1d573d','#286d48','#367b4d'][i%3]);}
   for(let i=0;i<45;i++){const x=((i*83-world*.34)%1450+1450)%1450-50,y=385+(i%7)*28;leaf(x,y,25+(i%4)*9,(i%5)*.55,['#27764b','#3a9657','#4ba55c','#1d6848'][i%4]);}
   const mist=ctx.createLinearGradient(0,380,0,610);mist.addColorStop(0,'rgba(203,245,202,0)');mist.addColorStop(.55,'rgba(198,241,190,.19)');mist.addColorStop(1,'rgba(36,104,64,0)');ctx.fillStyle=mist;ctx.fillRect(0,360,W,260);
  }
  function platform(x,y,w){const soil=ctx.createLinearGradient(0,y,0,H);soil.addColorStop(0,'#6b583b');soil.addColorStop(.16,'#513b2a');soil.addColorStop(1,'#30251d');ctx.fillStyle=soil;ctx.fillRect(x,y,w,H-y);ctx.fillStyle='#795538';ctx.fillRect(x,y+12,w,H-y-12);for(let yy=y+23;yy<H;yy+=32){ctx.fillStyle=yy%2?'#68432b':'#754a2d';ctx.fillRect(x,yy,w,4);ctx.strokeStyle='rgba(33,25,17,.4)';for(let xx=x+20;xx<x+w;xx+=90){ctx.beginPath();ctx.moveTo(xx,yy);ctx.lineTo(xx,yy+25);ctx.stroke();}}ctx.fillStyle='#2c6637';ctx.fillRect(x,y,w,14);ctx.fillStyle='#83bd4d';ctx.fillRect(x,y,w,4);ctx.fillStyle='rgba(222,245,166,.3)';ctx.fillRect(x,y+4,w,2);for(let xx=x+8;xx<x+w;xx+=30){leaf(xx,y+7,15,(xx%2)*.4,'#73b84a');}for(let i=0;i<18;i++){const rx=x+((i*71)%w),ry=y+28+(i*23)%(H-y-40);ctx.fillStyle='rgba(22,15,10,.2)';ctx.fillRect(rx,ry,6+(i%4)*3,2);}}
  function drawCoin(x,y){ctx.save();ctx.shadowColor='rgba(255,193,42,.55)';ctx.shadowBlur=18;ellipse(x,y,18,22,'#7a4511','#f7d56b',3);ellipse(x,y,14,18,'#ffcf39','#fff4a5',2);ellipse(x,y,10,14,'#e99a18','#bd7419',1);ctx.shadowBlur=0;ctx.fillStyle='#fff0a2';ctx.font='bold 17px Georgia';ctx.textAlign='center';ctx.fillText('★',x,y+6);ctx.restore();}
  function drawBlock(x,y){round(x-24,y-24,48,48,7,'#a95b20','#593319',5);round(x-18,y-18,36,36,4,'#f2bb42','#ffe48a',3);ctx.fillStyle='#fff3ad';ctx.font='bold 30px Georgia';ctx.textAlign='center';ctx.fillText('?',x,y+11);round(x-24,y+22,48,5,2,'#70401c');}
  function drawThorns(x,w){ctx.fillStyle='#244b36';ctx.fillRect(x,ground-4,w,12);for(let p=0;p<w;p+=24){path([[x+p,ground+5],[x+p+12,ground-44],[x+p+24,ground+5]],'#b6c8b1','#435d4d',2);path([[x+p+8,ground-2],[x+p+12,ground-35],[x+p+17,ground-2]],'#e5f0d9');}}
   function drawScorpion(x,y,phase){ctx.save();ctx.translate(x,y+Math.sin(elapsed*5+phase)*2);const shell=ctx.createLinearGradient(-35,-72,35,-8);shell.addColorStop(0,'#d58a4d');shell.addColorStop(.28,'#8b4528');shell.addColorStop(.72,'#51271e');shell.addColorStop(1,'#241b19');ellipse(0,-25,31,17,shell,'#241b19',3);for(let i=0;i<5;i++){ctx.strokeStyle='rgba(241,173,105,.34)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(-17+i*8,-29,5,12,-.12,0,Math.PI*2);ctx.stroke();}const head=ctx.createRadialGradient(20,-42,2,20,-28,24);head.addColorStop(0,'#e4a064');head.addColorStop(.45,'#a6502b');head.addColorStop(1,'#3b211c');ellipse(22,-30,17,13,head,'#241b19',3);for(const s of [-1,1]){ellipse(29,-35+s*3,2.8,2.8,'#f4c35f');line([[28,-27+s*3],[36,-24+s*8],[41,-18+s*12]],'#301d19',4);line([[41,-18+s*12],[48,-13+s*14]],'#a75b35',3);path([[47,-14+s*14],[56,-18+s*14],[52,-8+s*14]],'#b46b3c','#3b211b',2);line([[17,-41],[26,-52+s*3],[33,-50+s*5]],'#54281e',5);}for(let i=0;i<4;i++)for(const s of [-1,1]){const bx=-17+i*11;line([[bx,-18],[bx-8,-8+s*5],[bx-13,-1+s*8]],'#38221c',5);line([[bx-13,-1+s*8],[bx-19,-4+s*12]],'#9b5635',3);ellipse(bx-8,-8+s*5,3,3,'#d28a51');}line([[-23,-31],[-42,-43],[-49,-62],[-42,-78]],'#51271e',10);for(let i=0;i<4;i++){const yy=-48-i*7;ellipse(-43+i*1.5,yy,7-i*.7,7-i*.7,i%2?'#b9673d':'#75402b','#3b211b',2);}path([[-45,-74],[-53,-91],[-36,-83],[-31,-68]],'#d08a48','#3b211b',2);ctx.restore();}
   
   function drawHero(){ctx.save();ctx.translate(hero.x-world,hero.y);if(invulnerable>0&&Math.floor(elapsed*12)%2===0)ctx.globalAlpha=.48;const run=Math.sin(elapsed*11),skin=ctx.createLinearGradient(-12,-115,15,-70);skin.addColorStop(0,'#e0a77d');skin.addColorStop(.55,'#a96b4c');skin.addColorStop(1,'#57392f');const steel=ctx.createLinearGradient(-18,-80,22,-35);steel.addColorStop(0,'#b6c6c8');steel.addColorStop(.28,'#526b78');steel.addColorStop(.65,'#263d4b');steel.addColorStop(1,'#101e2b');const leather=ctx.createLinearGradient(-18,-42,18,-5);leather.addColorStop(0,'#75503a');leather.addColorStop(.5,'#382a25');leather.addColorStop(1,'#171a1a');ellipse(0,0,31,7,'rgba(0,0,0,.42)');path([[-8,-82],[-24,-76],[-39,-61],[-48,-19],[-32,-27],[-17,-49],[1,-59]],'#a12d3b','#4b2027',2);path([[-15,-75],[0,-83],[17,-75],[21,-42],[12,-30],[-15,-32],[-22,-48]],steel,'#101f2a',3);path([[-8,-73],[0,-79],[9,-73],[13,-46],[0,-40],[-12,-47]],'#718995','#d1d8d2',1);path([[-12,-71],[0,-78],[12,-71],[7,-60],[-8,-60]],'#a67b43','#392b20',2);round(-18,-42,36,9,3,leather,'#171a18',2);for(let i=0;i<4;i++)round(-13+i*8,-40,4,5,1,'#bd985a');line([[-12,-34],[-17+run*8,-17],[-21+run*9,-5]],leather,13);line([[11,-34],[16-run*8,-17],[21-run*9,-5]],leather,13);round(-31+run*8,-9,23,9,3,'#211d1a','#090d10',2);round(10-run*8,-9,23,9,3,'#211d1a','#090d10',2);line([[-12,-68],[-25,-53+run*3],[-19,-43]],skin,10);line([[15,-68],[25,-53-run*3],[22,-43]],skin,10);ellipse(0,-96,15,19,skin,'#3e2a24',2);path([[-16,-102],[-15,-114],[-5,-110],[2,-118],[12,-110],[16,-99],[10,-105],[2,-103],[-8,-105]],'#17191a','#080c0d',2);path([[-15,-105],[-12,-120],[-2,-114],[5,-122],[15,-108]],'#252a2b','#101516',2);round(-11,-91,23,5,2,'#513329');ellipse(7,-98,2,2,'#17100e');line([[-9,-87],[0,-84],[8,-87]],'#744332',2);ctx.save();ctx.translate(23,-53);const swing=attack>0?1-attack/.42:0,bladeAngle=attack>0?(-1.65+swing*2.05):-.22;if(attack>0){ctx.save();ctx.globalAlpha=Math.sin(swing*Math.PI)*.75;ctx.beginPath();ctx.arc(0,0,82,-2.35,-.12);ctx.strokeStyle='rgba(231,246,255,.9)';ctx.lineWidth=9;ctx.stroke();ctx.beginPath();ctx.arc(0,0,88,-2.25,-.2);ctx.strokeStyle='rgba(229,174,83,.65)';ctx.lineWidth=3;ctx.stroke();ctx.restore();}ctx.rotate(bladeAngle);path([[-4,0],[-3,-62],[0,-88],[4,-62],[4,0]],ctx.createLinearGradient(-5,-80,6,-80).addColorStop(0,'#516875'),'#34444c',2);path([[-1,-5],[0,-83],[2,-62],[2,-5]],'#f4f7f2');round(-13,-5,26,7,2,'#c69b4d','#47331c',2);round(-3,2,7,18,2,'#543321','#211812',2);ctx.restore();ctx.restore();}
   
function addParticles(x,y,color,n){for(let i=0;i<n;i++)particles.push({x,y,vx:rnd(-160,160),vy:rnd(-220,-45),life:rnd(.35,.9),color});}
  function hud(){const set=(id,v)=>{const el=$(id);if(el)el.textContent=v;};set('aqScore',score);set('aqCoins',coins);set('aqLife','×'+life);set('aqHearts','♥ '.repeat(life).trim());set('aqLevel',level+' / 50');set('aqTime',Math.floor(levelTime/60)+':'+String(Math.floor(levelTime%60)).padStart(2,'0'));const bar=$('aqProgress');if(bar)bar.style.width=Math.min(100,world/levelLength*100)+'%';}
  function reset(resetAll=true){if(resetAll){level=1;score=0;coins=0;life=5;}elapsed=0;world=0;levelLength=5200+level*145;levelTime=75+Math.min(45,level*1.5);attack=0;attackNeedsRelease=false;attackHitDone=false;invulnerable=0;hero={x:155,y:ground,vy:0,onGround:true};enemyList=[];coinList=[];hazards=[];blocks=[];particles=[];const gap=Math.max(390,690-level*5);for(let x=460;x<levelLength+650;x+=rnd(gap,gap+230)){enemyList.push({x,alive:true,phase:rnd(0,6)});for(let j=0;j<5;j++)coinList.push({x:x-250+j*48,y:ground-105-rnd(0,45),got:false});if(Math.random()<Math.min(.96,.58+level*.008))hazards.push({x:x+310,w:90+Math.min(35,level)});if(Math.random()<.72)blocks.push({x:x+110,y:ground-155,used:false});}hud();}
  function finish(win){running=false;overlay.hidden=false;if(win&&level<50){maxUnlocked=Math.max(maxUnlocked,level+1);try{localStorage.setItem('mrjArianaMaxLevel',String(maxUnlocked));}catch(e){}overlay.innerHTML='🏆 NIVO '+level+' FINI!<p>Ou debloke nivo '+(level+1)+' • Score: '+score+' • Pyès: '+coins+'</p><button id="aqPlay" type="button">▶ NIVO PWOCHEN</button>';$('aqPlay').addEventListener('click',()=>{level++;reset(false);start();});}else if(win){overlay.innerHTML='👑 CHAMPYON! OU FINI 50 NIVO YO!<p>Score: '+score+' • Pyès: '+coins+'</p><button id="aqPlay" type="button">↻ REJWE DEPI NIVO 1</button>';$('aqPlay').addEventListener('click',()=>{reset(true);start();});}else{overlay.innerHTML='💔 NIVO '+level+' — JWÈT FINI<p>Score: '+score+' • Pyès: '+coins+'</p><button id="aqPlay" type="button">↻ REESAYE NIVO A</button>';$('aqPlay').addEventListener('click',()=>{life=5;reset(false);start();});}}
  function hit(){if(invulnerable>0)return;life--;invulnerable=1.35;hero.vy=-480;addParticles(hero.x-world,hero.y-55,'#ff684f',14);hud();if(life<=0)finish(false);}
  function drawWorld(){forest();const offset=-(world%1280);for(let i=-1;i<3;i++)platform(offset+i*1280,ground,1280);
   for(const h of hazards){const x=h.x-world;if(x>-100&&x<W+100)drawThorns(x,h.w);}
   for(const b of blocks){const x=b.x-world;if(!b.used&&x>-60&&x<W+60)drawBlock(x,b.y);}
   for(const c of coinList){if(c.got)continue;const x=c.x-world;if(x>-40&&x<W+40)drawCoin(x,c.y+Math.sin(elapsed*5+c.x)*5);}
   for(const e of enemyList){if(e.alive){const x=e.x-world;if(x>-90&&x<W+90)drawScorpion(x,ground-4,e.phase);}}
  }
  function draw(){ctx.clearRect(0,0,W,H);drawWorld();drawHero();for(const p of particles){ctx.globalAlpha=clamp(p.life*2,0,1);ellipse(p.x,p.y,5,5,p.color);}ctx.globalAlpha=1;
   for(let i=0;i<22;i++){const fx=((i*173-world*.58)%1450+1450)%1450-60,fy=250+(i*47%260);ctx.globalAlpha=.3+.25*Math.sin(elapsed*3+i);ellipse(fx,fy,2.3,2.3,'#d8ff91');}ctx.globalAlpha=1;const vignette=ctx.createRadialGradient(W/2,H/2,180,W/2,H/2,850);vignette.addColorStop(0,'rgba(0,0,0,0)');vignette.addColorStop(1,'rgba(0,23,20,.28)');ctx.fillStyle=vignette;ctx.fillRect(0,0,W,H);}
  function update(dt){elapsed+=dt;levelTime=Math.max(0,levelTime-dt);world+=(205+Math.min(115,(level-1)*3.2))*dt;if(keys.left)hero.x-=230*dt;if(keys.right)hero.x+=230*dt;hero.x=clamp(hero.x,world+90,world+W*.48);
   if(keys.jump&&hero.onGround){hero.vy=-735;hero.onGround=false;}hero.vy+=gravity*dt;hero.y+=hero.vy*dt;if(hero.y>=ground){hero.y=ground;hero.vy=0;hero.onGround=true;}
   if(!keys.attack)attackNeedsRelease=false;
   if(keys.attack&&attack<=0&&!attackNeedsRelease){attack=.42;attackNeedsRelease=true;attackHitDone=false;addParticles(hero.x-world+40,hero.y-65,'#fff0a0',9);}
   if(attack>0){
    const swingProgress=1-attack/.42;
    if(!attackHitDone&&swingProgress>=.24&&swingProgress<=.72){
     attackHitDone=true;
     enemyList.forEach(e=>{const dx=e.x-hero.x;if(e.alive&&dx>8&&dx<132&&hero.y>ground-145){e.alive=false;score+=150;addParticles(e.x-world,ground-48,'#ffb04a',24);addParticles(e.x-world,ground-72,'#fff1b0',10);hud();}});
    }
    attack=Math.max(0,attack-dt);
   }
   blocks.forEach(b=>{if(!b.used&&Math.abs(b.x-hero.x)<34&&hero.y< b.y+30&&hero.y>b.y-55){b.used=true;coins+=5;score+=50;addParticles(b.x-world,b.y-25,'#ffd64a',12);hud();}});
   if(invulnerable>0)invulnerable-=dt;enemyList.forEach(e=>{if(e.alive&&Math.abs(e.x-hero.x)<48&&hero.y>=ground-42)hit();});
   coinList.forEach(c=>{if(!c.got&&Math.abs(c.x-hero.x)<30&&Math.abs(c.y-(hero.y-58))<70){c.got=true;coins++;score+=25;addParticles(c.x-world,c.y,'#ffd64a',8);hud();}});
   hazards.forEach(h=>{if(Math.abs(h.x+h.w/2-hero.x)<h.w/2+4&&hero.y>ground-58)hit();});
   particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=470*dt;p.life-=dt;});particles=particles.filter(p=>p.life>0);
   if(world>=levelLength)finish(true);else if(levelTime<=0)finish(false);
  }
  function loop(t){if(!running||disposed)return;raf=requestAnimationFrame(loop);const dt=Math.min((t-last)/1000||0,.035);last=t;if(!paused)update(dt);draw();}
  function start(){if(running)return;overlay.hidden=true;paused=false;running=true;last=performance.now();raf=requestAnimationFrame(loop);}
  function press(id,k){const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=true;});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>keys[k]=false));}
  press('aqLeft','left');press('aqRight','right');press('aqJump','jump');press('aqAttack','attack');
  const map={ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',ArrowUp:'jump',' ':'jump',x:'attack',j:'attack',X:'attack',J:'attack'};
  const down=e=>{if(map[e.key]){e.preventDefault();keys[map[e.key]]=true;}},up=e=>{if(map[e.key])keys[map[e.key]]=false;};
  document.addEventListener('keydown',down);document.addEventListener('keyup',up);
  $('aqPlay').addEventListener('click',start);
  $('aqPause').addEventListener('click',()=>{if(!running)return;paused=!paused;if(paused){overlay.hidden=false;overlay.innerHTML='⏸ JWÈT AN POZ<button id="aqPlay" type="button">▶ KONTINYE</button>';$('aqPlay').addEventListener('click',()=>{overlay.hidden=true;paused=false;});}else overlay.hidden=true;});
  $('aqRestart').addEventListener('click',()=>{running=false;cancelAnimationFrame(raf);reset(true);draw();overlay.hidden=false;overlay.innerHTML='MR JERY • JUNGLE QUEST<button id="aqPlay" type="button">▶ KÒMANSE NIVO 1</button>';$('aqPlay').addEventListener('click',start);});
  window.addEventListener('resize',resize);resize();reset();draw();
  cleanup=()=>{disposed=true;running=false;cancelAnimationFrame(raf);window.removeEventListener('resize',resize);document.removeEventListener('keydown',down);document.removeEventListener('keyup',up);};
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
