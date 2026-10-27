export function createTaskFlow(root,station){
 const question=root.querySelector('.question');const read=document.createElement('section'),quiz=document.createElement('section');read.id='taskRead';read.className='taskRead';quiz.id='taskQuiz';quiz.className='taskQuiz';quiz.hidden=true;
 const elements=[...root.children],qIndex=elements.indexOf(question);elements.slice(2,qIndex).forEach(e=>read.append(e));elements.slice(qIndex).forEach(e=>quiz.append(e));
 const steps=document.createElement('nav');steps.className='taskSteps';steps.setAttribute('aria-label','關卡進行步驟');steps.innerHTML='<button id="flowRead" aria-current="step">01 閱讀線索</button><button id="flowQuiz">02 完成挑戰</button><span id="flowDone">03 通關</span>';
 root.append(steps);
 if(station.listening){const audio=read.querySelector('audio');const common=document.createElement('div');common.className='taskAudio';common.append(audio);const vocab=read.querySelector('.vocab');if(vocab)common.append(vocab);root.append(common);steps.querySelector('#flowRead').textContent='01 聽力線索';}
 root.append(read,quiz);
 const reference=read.querySelector('.stages')||read.querySelector('.diagram');if(reference){const copy=reference.cloneNode(true);copy.classList.add('questionReference');quiz.insertBefore(copy,question)}
 const toolbar=document.createElement('div');toolbar.className='taskToolbar';toolbar.innerHTML='<button class="primary" id="beginChallenge">'+(station.listening?'聽完了，開始挑戰 →':'閱讀完成，開始挑戰 →')+'</button>';read.append(toolbar);
 const back=document.createElement('button');back.id='backToReading';back.className='backToReading';back.textContent=station.listening?'← 重看聽力提示':'← 返回教材找線索';quiz.prepend(back);
 let done=false;
 function view(name){read.hidden=name!=='read';quiz.hidden=name!=='quiz';for(const [id,on] of [['flowRead',name==='read'],['flowQuiz',name==='quiz']]){const e=root.querySelector('#'+id);if(on)e.setAttribute('aria-current','step');else e.removeAttribute('aria-current')}root.closest('.panel').scrollTop=0;}
 steps.querySelector('#flowRead').onclick=()=>view('read');steps.querySelector('#flowQuiz').onclick=()=>view('quiz');back.onclick=()=>view('read');toolbar.querySelector('button').onclick=()=>{view('quiz');(quiz.querySelector('input')||quiz.querySelector('.option')||question).focus({preventScroll:true})};
 return {complete(){done=true;quiz.classList.add('solved');view('quiz');steps.querySelector('#flowQuiz').removeAttribute('aria-current');steps.querySelector('#flowDone').setAttribute('aria-current','step');const feedback=quiz.querySelector('#feedback');feedback.tabIndex=-1;feedback.focus({preventScroll:true})},get done(){return done}};
}
