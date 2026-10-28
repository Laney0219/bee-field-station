import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceWalk,cameraRelativeMotion,normalizeYaw,turnTowards} from '../dist/walking.js';
import {findRoute} from '../dist/navigation.js';
import {qualityProfile} from '../dist/performance.js';
test('guided walking reaches fractional destination around an obstacle',()=>{
 const blocked=(x,z)=>Math.abs(x)<1.3&&Math.abs(z)<2;
 const destination=[6,0.2],path=findRoute([-6,.2],destination,blocked);assert.ok(path.length);
 let p=[-6,.2],index=0,arrived=false;
 for(let i=0;i<1200&&!arrived;i++){const moved=advanceWalk(p,path,index,2.7/60,blocked);assert.ok(!moved.blocked);assert.ok(!blocked(...moved.position));p=moved.position;index=moved.index;arrived=moved.arrived}
 assert.ok(arrived);assert.ok(Math.hypot(p[0]-destination[0],p[1]-destination[1])<.04);
});
test('large frame step cannot tunnel through collision',()=>{const moved=advanceWalk([0,0],[[4,0]],0,4,(x)=>x>1&&x<2);assert.ok(moved.blocked);assert.ok(moved.position[0]<=1)});
test('camera turns across wrap boundary without a full spin',()=>{const next=turnTowards(Math.PI-.1,-Math.PI+.1,.016);assert.ok(next>Math.PI-.1);assert.ok(next<Math.PI+.1)});
test('forward movement follows the view and wraps smoothly through a full turn',()=>{
 const [eastX,eastZ]=cameraRelativeMotion(0,1,0);assert.ok(Math.abs(eastX)<1e-9);assert.ok(eastZ<0);
 const [westX,westZ]=cameraRelativeMotion(0,1,Math.PI/2);assert.ok(westX<0);assert.ok(Math.abs(westZ)<1e-9);
 const [northX,northZ]=cameraRelativeMotion(0,1,Math.PI);assert.ok(Math.abs(northX)<1e-9);assert.ok(northZ>0);
 const [southX,southZ]=cameraRelativeMotion(0,1,Math.PI*1.5);assert.ok(southX>0);assert.ok(Math.abs(southZ)<1e-9);
 const angle=normalizeYaw(7*Math.PI);assert.ok(Math.abs(angle)<=Math.PI);assert.ok(Math.abs(Math.sin(angle))<1e-9);
});
test('quality levels cap pixel density and expensive shadows',()=>{assert.equal(qualityProfile('eco',true,3).shadows,false);assert.ok(qualityProfile('auto',true,3).ratio<=1);assert.ok(qualityProfile('high',false,3).ratio>qualityProfile('auto',false,3).ratio)});
