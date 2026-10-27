// Eight-neighbour A* on a one-metre grid. Same obstacle test as player movement.
export function findRoute(start,end,blocked){
 const key=(x,z)=>x+','+z,inside=(x,z)=>x>=-22&&x<=22&&z>=-20&&z<=26;
 const clear=(a,b)=>{const n=Math.max(1,Math.ceil(Math.hypot(a[0]-b[0],a[1]-b[1])/.15));for(let i=0;i<=n;i++){const t=i/n;if(blocked(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t))return false}return true};
 const candidates=[];for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){const p=[Math.round(start[0])+dx,Math.round(start[1])+dz];if(inside(...p)&&!blocked(...p)&&clear(start,p))candidates.push(p)}candidates.sort((a,b)=>Math.hypot(a[0]-start[0],a[1]-start[1])-Math.hypot(b[0]-start[0],b[1]-start[1]));
 if(!candidates.length)return [];const [sx,sz]=candidates[0],tx=Math.round(end[0]),tz=Math.round(end[1]);
 const open=[],cost=new Map([[key(sx,sz),0]]),parent=new Map(),closed=new Set();let goal=null;
 const push=n=>{open.push(n);let i=open.length-1;while(i>0){const p=(i-1)>>1;if(open[p].f<=n.f)break;open[i]=open[p];i=p}open[i]=n};
 const pop=()=>{const first=open[0],last=open.pop();if(open.length){let i=0;while(i*2+1<open.length){let c=i*2+1;if(c+1<open.length&&open[c+1].f<open[c].f)c++;if(open[c].f>=last.f)break;open[i]=open[c];i=c}open[i]=last}return first};push({x:sx,z:sz,g:0,f:0});
 while(open.length){const cur=pop(),ck=key(cur.x,cur.z);if(closed.has(ck))continue;closed.add(ck);if(cur.x===tx&&cur.z===tz&&clear([cur.x,cur.z],end)){goal=cur;break}
 for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){if(!dx&&!dz)continue;const x=cur.x+dx,z=cur.z+dz,k=key(x,z);if(!inside(x,z)||blocked(x,z)||closed.has(k))continue;if(dx&&dz&&(blocked(cur.x+dx,cur.z)||blocked(cur.x,cur.z+dz)))continue;const g=cur.g+Math.hypot(dx,dz);if(g>=(cost.get(k)??Infinity))continue;cost.set(k,g);parent.set(k,ck);push({x,z,g,f:g+Math.hypot(x-tx,z-tz)})}}
 if(!goal)return [];const result=[];let k=key(goal.x,goal.z);while(k){result.push(k.split(',').map(Number));k=parent.get(k)}result.reverse();if(Math.hypot(result.at(-1)[0]-end[0],result.at(-1)[1]-end[1])>.01)result.push([...end]);return result;
}
