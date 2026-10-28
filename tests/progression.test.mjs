import test from 'node:test';
import assert from 'node:assert/strict';
import {restoreProgress,nextTask,canEnter} from '../dist/progression.js';
import {stations} from '../dist/content.js';
test('new game permits only first task; each success unlocks exactly one new task',()=>{
 const done=restoreProgress([],stations);
 for(let i=0;i<stations.length;i++){
  assert.equal(nextTask(stations,done).id,stations[i].id);
  for(let j=0;j<stations.length;j++)assert.equal(canEnter(stations[j],stations,done),j<=i);
  done.add(stations[i].id);
 }
 assert.equal(nextTask(stations,done),undefined);
});
test('legacy out-of-order progress cannot unlock future levels',()=>{
 assert.deepEqual([...restoreProgress([1,2,5,11],stations)],[1,2]);
 assert.equal(nextTask(stations,restoreProgress([11],stations)).id,1);
});
test('ordered saved progress continues and completed tasks remain reviewable',()=>{
 const done=restoreProgress([3,1,2],stations);assert.equal(nextTask(stations,done).id,4);assert.ok(canEnter(stations[0],stations,done));assert.ok(!canEnter(stations[4],stations,done));
});
