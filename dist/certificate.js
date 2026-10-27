export function certificateData(name,completed,escaped,issuedAt=new Date().toISOString()){
 if(!escaped||completed!==11)throw new Error('完成十一關並開啟出口後，才能領取證書。');
 const clean=String(name??'').replace(/[\u0000-\u001f\u007f]/g,'').trim().replace(/\s+/g,' ');
 if(!clean)throw new Error('請輸入證書上的姓名。');
 if([...clean].length>24)throw new Error('姓名請在 24 個字以內。');
 if(!Number.isFinite(Date.parse(issuedAt)))throw new Error('證書日期無效，請重新領取。');
 return {name:clean,issuedAt,date:new Intl.DateTimeFormat('zh-TW',{timeZone:'Asia/Taipei',year:'numeric',month:'long',day:'numeric'}).format(new Date(issuedAt))};
}
export function drawCertificate(data){
 const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=1130;const c=canvas.getContext('2d');
 c.fillStyle='#fbf8ed';c.fillRect(0,0,1600,1130);c.strokeStyle='#b58f43';c.lineWidth=4;c.strokeRect(36,36,1528,1058);c.lineWidth=1;c.strokeRect(51,51,1498,1028);
 function hex(x,y,r){c.beginPath();for(let i=0;i<6;i++){const a=i*Math.PI/3;const px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;i?c.lineTo(px,py):c.moveTo(px,py)}c.closePath();c.stroke()}
 c.strokeStyle='#ddcfaa';for(const [x,y] of [[95,98],[1505,98],[95,1032],[1505,1032]]){hex(x,y,25);hex(x,y,15)}
 c.textAlign='center';c.fillStyle='#8c713c';c.font='24px sans-serif';c.fillText('BEE FIELD STATION · CERTIFICATE OF COMPLETION',800,140);
 c.fillStyle='#294532';c.font='600 65px "Noto Serif TC","Microsoft JhengHei",serif';c.fillText('蜜境研究站',800,254);c.font='500 48px "Noto Serif TC","Microsoft JhengHei",serif';c.fillText('過關證書',800,334);
 c.strokeStyle='#b58f43';c.lineWidth=2;c.beginPath();c.moveTo(540,381);c.lineTo(1060,381);c.stroke();c.fillStyle='#79816c';c.font='25px sans-serif';c.fillText('茲證明',800,444);
 c.fillStyle='#294532';let size=84;c.font=`600 ${size}px "Noto Serif TC","Microsoft JhengHei",serif`;while(c.measureText(data.name).width>1260&&size>35){size-=2;c.font=`600 ${size}px "Noto Serif TC","Microsoft JhengHei",serif`}c.fillText(data.name,800,558);
 c.strokeStyle='#ded5bd';c.lineWidth=1;c.beginPath();c.moveTo(410,599);c.lineTo(1190,599);c.stroke();
 c.fillStyle='#4f6049';c.font='29px "Noto Sans TC","Microsoft JhengHei",sans-serif';c.fillText('已完成全部十一項閱讀與觀察任務，並成功開啟研究站出口。',800,681);c.fillText('理解蜜蜂的構造、分工、生命週期、授粉與棲地保護。',800,735);
 c.strokeStyle='#b58f43';c.lineWidth=3;hex(800,849,62);c.fillStyle='#96743b';c.font='600 24px sans-serif';c.fillText('棲地',800,843);c.fillText('守護者',800,877);
 c.fillStyle='#6b785f';c.font='25px sans-serif';c.fillText('頒發日期  '+data.date,800,975);c.font='20px sans-serif';c.fillStyle='#9b977f';c.fillText('蜜境研究站 · 中英雙語沉浸式閱讀探索',800,1031);
 return canvas;
}
export function mountCertificate(host,{completed,escaped,saved,onSave}){
 host.innerHTML='<div class="certificateEntry"><label for="certificateName">證書上的姓名</label><div class="certificateNameRow"><input id="certificateName" class="answerInput" maxlength="48" autocomplete="name" placeholder="請輸入姓名，例如：王小明"><button class="primary" id="issueCertificate">領取過關證書 →</button></div><p class="fine">姓名與證書只保存在這個瀏覽器，可隨時修改後重新產生。</p><p id="certificateMessage" role="status"></p></div><div id="certificateResult" hidden><img id="certificatePreview" alt="具名過關證書預覽"><div class="certificateActions"><a id="downloadCertificate" class="primary">下載證書 PNG ↓</a><button id="printCertificate">列印／存成 PDF</button></div><p class="fine">手機或 iPad 也可長按證書圖片儲存。列印時建議選 A4 橫向。</p></div>';
 const input=host.querySelector('#certificateName'),message=host.querySelector('#certificateMessage'),issue=host.querySelector('#issueCertificate');if(saved?.name)input.value=saved.name;
 async function generate(){let data;try{data=certificateData(input.value,completed,escaped,saved?.issuedAt)}catch(e){message.textContent=e.message;input.focus();return}issue.disabled=true;message.textContent='正在製作你的過關證書…';
  if(document.fonts?.ready)await Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,1500))]);if(!host.isConnected)return;
  const canvas=drawCertificate(data),url=canvas.toDataURL('image/png'),preview=host.querySelector('#certificatePreview');preview.src=url;preview.alt=data.name+'的蜜境研究站過關證書，頒發日期 '+data.date;
  const link=host.querySelector('#downloadCertificate');link.href=url;link.download='蜜境研究站過關證書_'+data.name.replace(/[<>:"/\\|?*]/g,'_')+'.png';
  host.querySelector('#certificateResult').hidden=false;onSave({name:data.name,issuedAt:data.issuedAt});saved={name:data.name,issuedAt:data.issuedAt};message.textContent='證書已頒發給 '+data.name+'。';issue.textContent='更新姓名並重新產生';issue.disabled=false;
  host.querySelector('#printCertificate').onclick=()=>{let printArea=document.querySelector('#certificatePrintArea');if(!printArea){printArea=document.createElement('div');printArea.id='certificatePrintArea';document.body.append(printArea)}const image=new Image();image.src=url;image.alt=preview.alt;printArea.replaceChildren(image);window.print()};
 }
 issue.onclick=generate;input.addEventListener('keydown',e=>{if(e.key==='Enter')generate()});if(saved?.name)generate();
}
