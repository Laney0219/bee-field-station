import test from 'node:test';
import assert from 'node:assert/strict';
import {createBackgroundAudio} from '../dist/background-audio.js';
test('background loops after start, pauses for listening and hidden tabs, and respects mute',async()=>{
 let media;const handlers={};const settings=new Map();
 globalThis.Audio=class{constructor(src){this.src=src;this.paused=true;media=this}setAttribute(){}async play(){this.paused=false}pause(){this.paused=true}};
 globalThis.document={hidden:false,body:{append(){}},addEventListener:(name,fn)=>handlers[name]=fn};
 globalThis.localStorage={getItem:key=>settings.get(key)??null,setItem:(key,value)=>settings.set(key,value)};
 const button={textContent:'',setAttribute(){}};const background=createBackgroundAudio(button,()=>{});
 assert.ok(media.paused);await background.start();assert.equal(media.loop,true);assert.equal(media.paused,false);
 background.setListening(true);assert.equal(media.paused,true);assert.match(button.textContent,/暫停/);
 background.setListening(false);assert.equal(media.paused,false);
 document.hidden=true;await handlers.visibilitychange();assert.equal(media.paused,true);
 document.hidden=false;await handlers.visibilitychange();assert.equal(media.paused,false);
 button.onclick();assert.equal(media.paused,true);assert.equal(settings.get('bee-background-audio'),'off');
 background.setListening(true);background.setListening(false);assert.equal(media.paused,true);
 button.onclick();assert.equal(media.paused,false);assert.equal(settings.get('bee-background-audio'),'on');
});
