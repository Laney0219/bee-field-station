// Continuous movement along the same collision-checked route shown by the arrows.
export function advanceWalk(position,path,index,distance,blocked){
 const p=[...position];let remaining=distance;
 while(index<path.length&&remaining>0){const target=path[index],dx=target[0]-p[0],dz=target[1]-p[1],length=Math.hypot(dx,dz);if(length<.035){p[0]=target[0];p[1]=target[1];index++;continue}
  const step=Math.min(length,remaining,.1),x=p[0]+dx/length*step,z=p[1]+dz/length*step;
  if(blocked(x,z))return {position:p,index,arrived:false,blocked:true};p[0]=x;p[1]=z;remaining-=step;if(step>=length-.001)index++;
 }
 return {position:p,index,arrived:index>=path.length,blocked:false};
}
export function turnTowards(current,target,dt){const difference=Math.atan2(Math.sin(target-current),Math.cos(target-current));return current+difference*(1-Math.exp(-dt*7));}
