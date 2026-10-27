import * as T from './vendor/three.module.js';
import {natureKit} from './nature.js';
let cachedViewer=null;
export function mountSpecimen(host){if(!cachedViewer)cachedViewer=createViewer();return cachedViewer.mount(host)}
function createViewer(){
 const canvas=document.createElement('canvas');canvas.setAttribute('aria-label','可拖曳旋轉的蜜蜂三維模型');
 const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
 const scene=new T.Scene();scene.background=new T.Color('#e7ebdf');scene.add(new T.HemisphereLight(0xf0f4ff,0xb3aa81,2.1));const key=new T.DirectionalLight(0xffe7bd,3.2);key.position.set(3,5,4);scene.add(key);const rim=new T.DirectionalLight(0xd4e6ff,1.7);rim.position.set(-3,2,-3);scene.add(rim);
 let seed=57;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};const nature=natureKit(scene,renderer,rand);nature.bee(0,0,0,1);
 const camera=new T.PerspectiveCamera(38,1,.1,30);let angle=.95,elevation=.48,dist=3.7,drag=null,raf=null,host=null;function invalidate(){if(host&&!raf)raf=requestAnimationFrame(frame)}
 function size(){if(!host)return;const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();invalidate()}const observer=new ResizeObserver(size);
 canvas.addEventListener('pointerdown',e=>{drag={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId)});
 canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;angle-=(e.clientX-drag.x)*.009;elevation=T.MathUtils.clamp(elevation+(e.clientY-drag.y)*.006,-.65,1.2);drag.x=e.clientX;drag.y=e.clientY;invalidate()});
 canvas.addEventListener('pointerup',()=>drag=null);canvas.addEventListener('pointercancel',()=>drag=null);
 function frame(){raf=null;if(!host?.clientWidth||!host?.clientHeight)return;camera.position.set(Math.sin(angle)*Math.cos(elevation)*dist,Math.sin(elevation)*dist,Math.cos(angle)*Math.cos(elevation)*dist-.2);camera.lookAt(0,-.02,-.2);renderer.render(scene,camera)}
 return {mount(nextHost){host=nextHost;host.replaceChildren(canvas);observer.observe(host);size();host.parentElement.querySelector('[data-zoom-in]').onclick=()=>{dist=Math.max(2.4,dist-.35);invalidate()};host.parentElement.querySelector('[data-zoom-out]').onclick=()=>{dist=Math.min(5.5,dist+.35);invalidate()};return ()=>{cancelAnimationFrame(raf);raf=null;observer.disconnect();drag=null;canvas.remove();host=null}}};
}
