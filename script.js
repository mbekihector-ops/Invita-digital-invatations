
let currentLanguage = 'sw';
let currency = 'USD';
const rates = {USD: 1, TZS: 2600}; // Kiwango cha mfano tu, si bei ya malipo halisi.
let selectedCard = null;
const cardDetails = [
  {sw:'Mwaliko wa Harusi – 01',en:'Wedding Invitation – 01',kind:'Harusi',kindEn:'Wedding',price:15,style:'wedding'},
  {sw:'Mwaliko wa Kuzaliwa – 01',en:'Birthday Invitation – 01',kind:'Sherehe ya kuzaliwa',kindEn:'Birthday',price:10,style:'birthday'},
  {sw:'Mwaliko wa Masomo – 01',en:'Graduation Invitation – 01',kind:'Mahafali',kindEn:'Graduation',price:10,style:'graduation'},
  {sw:'Mwaliko wa Mtoto – 01',en:'Baby Celebration – 01',kind:'Hafla ya mtoto',kindEn:'Baby celebration',price:10,style:'baby'}
];
function setLanguage(lang){
  currentLanguage=lang;
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-sw][data-en]').forEach(el=>{const val=el.dataset[lang];if(val!==undefined)el.textContent=val;});
  document.getElementById('swBtn').classList.toggle('active',lang==='sw');
  document.getElementById('enBtn').classList.toggle('active',lang==='en');
  updatePrices();
}
function updatePrices(){document.querySelectorAll('[data-price]').forEach(el=>{const amount=Number(el.dataset.price);el.textContent=currency==='USD'?'$'+amount.toFixed(2):'TSh '+Math.round(amount*rates.TZS).toLocaleString('en-US');});}
function showMessage(kind){
 const sw={browse:'Karibu! Kadi za mialiko zinaonekana hapa chini.',wedding:'Umechagua kategoria ya harusi.',birthday:'Umechagua kategoria ya sherehe za kuzaliwa.',graduation:'Umechagua kategoria ya mahafali.',baby:'Umechagua kategoria ya hafla ya mtoto.',house:'Umechagua kategoria ya mila na desturi.',business:'Umechagua kategoria ya matukio ya biashara.',more:'Kategoria nyingine zitaongezwa baadaye.',all:'Kwa sasa hizi ndizo kadi za mfano zilizopo.'};
 const en={browse:'Welcome! Browse the invitation cards below.',wedding:'Wedding category selected.',birthday:'Birthday category selected.',graduation:'Graduation category selected.',baby:'Baby celebration category selected.',house:'Cultural events category selected.',business:'Business events category selected.',more:'More categories will be added later.',all:'These are the sample cards currently available.'};
 toast(currentLanguage==='sw'?sw[kind]:en[kind]);
 if(kind==='browse'||kind==='all')document.querySelector('.cards')?.scrollIntoView({behavior:'smooth',block:'center'});
 if(['wedding','birthday','graduation','baby'].includes(kind)){const i={wedding:0,birthday:1,graduation:2,baby:3}[kind];openCard(i);}
}
function toast(message){const el=document.getElementById('toast');el.textContent=message;el.style.display='block';clearTimeout(window.__toastTimer);window.__toastTimer=setTimeout(()=>el.style.display='none',3200);}
function openCard(index){
 selectedCard=cardDetails[index]; if(!selectedCard)return;
 document.getElementById('modalTitle').textContent=currentLanguage==='sw'?selectedCard.sw:selectedCard.en;
 document.getElementById('modalDescription').textContent=currentLanguage==='sw'?'Jaza taarifa za tukio lako ili kuunda muhtasari wa mwaliko.':'Enter your event details to create an invitation preview.';
 document.getElementById('invitePreview').hidden=true;
 document.getElementById('inviteForm').reset();
 document.getElementById('cardModal').hidden=false;
 document.body.classList.add('modal-open');
}
function closeModal(id){document.getElementById(id).hidden=true;if(document.querySelectorAll('.modal-backdrop:not([hidden])').length===0)document.body.classList.remove('modal-open');}
function makeInvitePreview(){
 const form=document.getElementById('inviteForm');if(!form.reportValidity())return;
 const d=new FormData(form), box=document.getElementById('invitePreview');
 const date=d.get('eventDate')?new Date(d.get('eventDate')+'T12:00:00').toLocaleDateString(currentLanguage==='sw'?'sw-TZ':'en-GB',{day:'numeric',month:'long',year:'numeric'}):'';
 box.innerHTML='';
 const eyebrow=document.createElement('p');eyebrow.textContent=currentLanguage==='sw'?'UNAKARIBISHWA':'YOU ARE INVITED';
 const title=document.createElement('h3');title.textContent=d.get('eventName');
 const kind=document.createElement('p');kind.textContent=currentLanguage==='sw'?selectedCard.kind:selectedCard.kindEn;
 const when=document.createElement('p');when.textContent=[date,d.get('eventTime')].filter(Boolean).join(' · ');
 const venue=document.createElement('p');venue.textContent=d.get('venue');
 [eyebrow,title,kind,when,venue].forEach(el=>box.appendChild(el));
 if(d.get('message')){const msg=document.createElement('p');msg.textContent=d.get('message');box.appendChild(msg);}
 box.hidden=false;box.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function shareInvite(){
 const box=document.getElementById('invitePreview');if(box.hidden){toast(currentLanguage==='sw'?'Tengeneza muhtasari kwanza.':'Create the preview first.');return;}
 const text=box.innerText;
 if(navigator.share){navigator.share({title:'KadiNova invitation',text}).catch(()=>{});}else if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(()=>toast(currentLanguage==='sw'?'Muhtasari umenakiliwa. Unaweza kuutuma WhatsApp.':'Preview copied. You can send it on WhatsApp.')).catch(()=>toast(text));}else{toast(text);}
}
function openPayment(){document.getElementById('paymentModal').hidden=false;document.body.classList.add('modal-open');}
document.addEventListener('DOMContentLoaded',()=>{
 const cards=[...document.querySelectorAll('.cards .card')];
 cards.forEach((card,index)=>{
   card.addEventListener('click',e=>{if(e.target.closest('.buy'))return;openCard(index);});
   card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openCard(index);}});
   const img=card.querySelector('.preview img');if(img){const fallback=()=>{const preview=img.closest('.preview');preview.classList.add('image-fallback');preview.dataset.fallbackTitle=['♡\nHARUSI','🎂\nSHEREHE','🎓\nMAHAFALI','♡\nHAFla YA MTOTO'][index]||'KadiNova';};img.addEventListener('error',fallback);if(img.complete&&img.naturalWidth===0)fallback();}
   const buy=card.querySelector('.buy');if(buy){buy.addEventListener('click',e=>{e.stopPropagation();openPayment();});buy.removeAttribute('onclick');}
 });
 document.getElementById('closeModal').addEventListener('click',()=>closeModal('cardModal'));
 document.getElementById('closePayment').addEventListener('click',()=>closeModal('paymentModal'));
 document.getElementById('inviteForm').addEventListener('submit',e=>{e.preventDefault();makeInvitePreview();});
 document.getElementById('shareInvite').addEventListener('click',shareInvite);
 document.querySelectorAll('[data-payment]').forEach(btn=>btn.addEventListener('click',()=>{document.getElementById('paymentFeedback').textContent=currentLanguage==='sw'?'Umechagua '+btn.dataset.payment+'. Muunganisho wa malipo halisi bado haujawekwa.':'You selected '+btn.dataset.payment+'. Live payment integration is not set up yet.';}));
 document.querySelectorAll('nav button').forEach((btn,index)=>btn.addEventListener('click',()=>{
   document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
   const targets=[document.querySelector('.hero'),document.querySelector('.cards'),document.getElementById('cardModal'),document.querySelector('.note'),document.querySelector('.buy'),document.getElementById('contact')];
   if(index===2){openCard(0);return;}if(index===4){openPayment();return;}if(index===3){document.querySelector('.note')?.scrollIntoView({behavior:'smooth'});return;}
   const target=index===1?document.querySelector('.cards'):index===5?document.getElementById('contact'):document.querySelector('.hero');target?.scrollIntoView({behavior:'smooth',block:'start'});
 }));
 document.querySelector('.tools span:last-child')?.addEventListener('click',()=>{currency=currency==='USD'?'TZS':'USD';updatePrices();toast(currentLanguage==='sw'?'Sarafu ya kuonyesha bei imebadilishwa kuwa '+currency+'.':'Display currency changed to '+currency+'.');});
 document.querySelector('.tools span:first-child')?.addEventListener('click',()=>{const q=prompt(currentLanguage==='sw'?'Tafuta aina ya mwaliko:':'Search invitation type:');if(q){const card=cards.find(c=>c.innerText.toLowerCase().includes(q.toLowerCase()));if(card)card.scrollIntoView({behavior:'smooth',block:'center'});else toast(currentLanguage==='sw'?'Hakuna kadi iliyopatikana kwa neno hilo.':'No card found for that search.');}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal('cardModal');closeModal('paymentModal');}});
 document.querySelectorAll('.modal-backdrop').forEach(bg=>bg.addEventListener('click',e=>{if(e.target===bg)closeModal(bg.id);}));
 updatePrices();
});
