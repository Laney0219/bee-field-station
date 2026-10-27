// Keep background audio separate from question recordings so listening stays clear.
export function createBackgroundAudio(button,report){
 const audio=new Audio('assets/bee-field-ambience.mp3');audio.id='backgroundAmbience';audio.loop=true;audio.preload='none';audio.volume=.25;audio.setAttribute('playsinline','');document.body.append(audio);
 let enabled=true,started=false,listening=false,revision=0;
 try{enabled=localStorage.getItem('bee-background-audio')!=='off'}catch{}
 function label(){button.textContent=enabled?(listening?'背景音 暫停':'背景音 開'):'背景音 關';button.setAttribute('aria-label',enabled?'關閉蜜蜂背景音':'開啟蜜蜂背景音');button.setAttribute('aria-pressed',String(enabled));}
 async function sync(){const current=++revision;label();if(!enabled||!started||listening||document.hidden){audio.pause();return}try{await audio.play()}catch(error){if(current!==revision||error.name==='AbortError')return;enabled=false;label();report('背景音尚未播放，請點擊「背景音 關」重試。')}}
 function remember(){try{localStorage.setItem('bee-background-audio',enabled?'on':'off')}catch{}}
 button.onclick=()=>{enabled=!enabled;remember();sync()};
 document.addEventListener('visibilitychange',sync);
 label();
 return {start(){started=true;return sync()},setListening(value){listening=value;sync()}};
}
