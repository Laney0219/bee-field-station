export function qualityProfile(mode,coarse,dpr=1){
 const cap=mode==='high'?1.6:mode==='eco'?.85:coarse?1:1.25;
 return {ratio:Math.min(dpr,cap),shadows:mode!=='eco',shadowSize:mode==='high'?2048:1024,shadowInterval:mode==='high'?.25:1};
}
export function createPerformance(renderer,sun,button){
 const coarse=matchMedia('(pointer:coarse)').matches;let mode='auto',frames=0,since=performance.now(),last=0,fps=0,slowWindows=0;
 try{const value=localStorage.getItem('bee-quality');if(['auto','eco','high'].includes(value))mode=value}catch{}
 let profile;
 function apply(){profile=qualityProfile(mode,coarse,devicePixelRatio);renderer.setPixelRatio(profile.ratio);renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=profile.shadows;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;if(sun.shadow.mapSize.x!==profile.shadowSize){sun.shadow.map?.dispose();sun.shadow.map=null;sun.shadow.mapSize.set(profile.shadowSize,profile.shadowSize)}button.textContent='畫質 '+({auto:'自動',eco:'省電',high:'精緻'}[mode]);button.title='切換畫質：自動、偏重流暢的省電模式、精緻模式';frames=0;since=performance.now();last=0;slowWindows=0;}
 button.onclick=()=>{mode={auto:'eco',eco:'high',high:'auto'}[mode];try{localStorage.setItem('bee-quality',mode)}catch{}apply()};apply();
 return {
  sample(now){if(last&&now-last>400){frames=0;since=now}last=now;frames++;if(now-since<2000)return;fps=Math.round(frames*1000/(now-since));frames=0;since=now;
   if(mode==='auto'){slowWindows=fps<35?slowWindows+1:0;if(slowWindows>=2&&renderer.getPixelRatio()>.7){renderer.setPixelRatio(Math.max(.7,renderer.getPixelRatio()-.15));renderer.setSize(innerWidth,innerHeight);slowWindows=0}}
   const stats=document.querySelector('#performanceStats');if(stats)stats.textContent=`目前約 ${fps} FPS · 像素比例 ${renderer.getPixelRatio().toFixed(2)} · ${renderer.info.render.calls} 次繪圖呼叫`;
  },
  get shadowInterval(){return profile.shadowInterval},
  get fps(){return fps},
  get mode(){return mode}
 };
}
