export function restoreProgress(ids,stations){const done=new Set();for(const s of stations){if(ids.includes(s.id))done.add(s.id);else break}return done}
export const nextTask=(stations,done)=>stations.find(s=>!done.has(s.id));
export const canEnter=(station,stations,done)=>done.has(station.id)||station.id===nextTask(stations,done)?.id;
