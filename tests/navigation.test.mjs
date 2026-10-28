import test from 'node:test';
import assert from 'node:assert/strict';
import {findRoute} from '../dist/navigation.js';
test('route avoids wall and uses its opening without crossing corners',()=>{
 const blocked=(x,z)=>x===0&&z!==5;
 const route=findRoute([-6,0],[6,0],blocked);
 assert.ok(route.length>0);
 assert.ok(route.some(([x,z])=>x===0&&z===5));
 for(let i=0;i<route.length;i++){const [x,z]=route[i];assert.ok(!blocked(x,z));if(i){const [a,b]=route[i-1];assert.ok(Math.abs(x-a)<=1&&Math.abs(z-b)<=1);if(x!==a&&z!==b){assert.ok(!blocked(a,z));assert.ok(!blocked(x,b))}}}
 assert.ok(Math.hypot(route.at(-1)[0]-6,route.at(-1)[1])<=1.4);
});
test('unreachable route returns empty path rather than pointing through obstacles',()=>{
 assert.deepEqual(findRoute([-5,0],[5,0],x=>x===0),[]);
});
test('navigation supports all eleven farm station coordinates',()=>{
 const positions=[[-9,-7],[-15,-7],[-9,5],[-15,5],[0,-14],[9,5],[15,5],[15,-7],[-15,-15],[0,10],[9,-15],[0,10.8]];
 let start=[0,8];for(const [x,z] of positions){const target=[x,z+3.2],route=findRoute(start,target,()=>false);assert.ok(route.length,`No route to ${target}`);start=target}
});
