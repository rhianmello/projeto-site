(() => {
  const $ = id => document.getElementById(id);
  const T = str => window.CPI18n?.t(str)||str;
  const KEY = 'curriculopro-extras';
  const fields = ['birthdate','maritalStatus','nationality','cnh','cnhCategory','travel','relocation','showExtras'];
  const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
  fields.forEach(id => { const el=$(id); if(el && saved[id] != null) el.type === 'checkbox' ? el.checked=!!saved[id] : el.value=saved[id]; });
  function saveExtras(){ const d={}; fields.forEach(id=>{const el=$(id); if(el)d[id]=el.type==='checkbox'?el.checked:el.value;}); localStorage.setItem(KEY,JSON.stringify(d)); }
  function ageFromDate(v){ if(!v)return ''; const b=new Date(v+'T00:00:00'), now=new Date(); let a=now.getFullYear()-b.getFullYear(); if(now.getMonth()<b.getMonth() || (now.getMonth()===b.getMonth()&&now.getDate()<b.getDate()))a--; return a>=0&&a<130?String(a):''; }
  function renderExtras(){
    const preview=$('resumePreview'); if(!preview)return;
    let box=$('optionalPreview'); if(box)box.remove();
    if(!$('showExtras')?.checked)return;
    const items=[]; const age=ageFromDate($('birthdate')?.value);
    if(age)items.push(T('Idade')+': '+age+' '+T('anos'));
    if($('maritalStatus')?.value)items.push(T('Estado civil')+': '+T($('maritalStatus').value));
    if($('nationality')?.value)items.push(T('Nacionalidade')+': '+$('nationality').value);
    if($('cnh')?.value){let x=T('CNH')+': '+T($('cnh').value); if($('cnhCategory')?.value)x+=' — '+T('categoria')+' '+$('cnhCategory').value; items.push(x);}
    if($('travel')?.value)items.push(T('Disponibilidade para viagens')+': '+T($('travel').value));
    if($('relocation')?.value)items.push(T('Disponibilidade para mudança')+': '+T($('relocation').value));
    if(!items.length)return;
    box=document.createElement('div'); box.id='optionalPreview'; box.className='cv-section optional-section'; box.textContent=T('INFORMAÇÕES ADICIONAIS');
    const content=document.createElement('div'); content.className='cv-skills optional-items'; content.textContent=items.join(' • '); box.appendChild(content); preview.appendChild(box);
  }
  window.renderExtras=renderExtras;
  fields.forEach(id=>{const el=$(id);if(el){el.addEventListener('input',()=>{saveExtras();renderExtras()});el.addEventListener('change',()=>{saveExtras();renderExtras()});}});
  $('resumeForm')?.addEventListener('submit',()=>setTimeout(renderExtras,20));
  document.addEventListener('click',e=>{if(e.target.closest('#downloadPdf,#downloadPdfSide'))setTimeout(renderExtras,10);});
  setTimeout(renderExtras,100);
})();
