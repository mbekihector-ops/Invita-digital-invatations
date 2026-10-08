function openBuilder(){document.getElementById("builder").style.display="block"}
function closeBuilder(){document.getElementById("builder").style.display="none"}
function selectTemplate(name){openBuilder();document.getElementById("eventType").value=name.includes("Birthday")?"Birthday":name.includes("Graduation")?"Graduation":name.includes("Wedding")?"Wedding":"Other event"}
function previewInvite(){
 const host=document.getElementById("host").value||"Your Name";
 const date=document.getElementById("date").value||"Your special date";
 const loc=document.getElementById("location").value||"Your location";
 document.getElementById("preview").innerHTML=`<div class="preview-card"><div class="eyebrow">YOU'RE INVITED</div><h3>${host}</h3><p>${document.getElementById("eventType").value}</p><p><b>${date}</b><br>${loc}</p></div>`;
}
window.onclick=function(e){if(e.target===document.getElementById("builder"))closeBuilder()}