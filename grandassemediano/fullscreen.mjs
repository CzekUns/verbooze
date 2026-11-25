/* User-gesture fullscreen, without hiding game controls or changing camera zoom. */
export function mountFullscreen(button,{document:doc=globalThis.document,screen:display=globalThis.screen,onStatus=()=>{}}={}){
 if(!button||!doc)return null;
 const root=doc.documentElement,request=root?.requestFullscreen||root?.webkitRequestFullscreen;
 const exit=doc.exitFullscreen||doc.webkitExitFullscreen;
 const active=()=>!!(doc.fullscreenElement||doc.webkitFullscreenElement);
 function refresh(){const on=active();button.textContent=on?'⊡':'⛶';button.setAttribute('aria-pressed',String(on));button.setAttribute('aria-label',on?'Esci da schermo intero':'Attiva schermo intero');button.title=on?'Esci da schermo intero':'Schermo intero';}
 async function toggle(){
  try{
   if(active()){if(exit)await exit.call(doc);}
   else if(request){await request.call(root);try{await display?.orientation?.lock?.('landscape');}catch{} }
   else{onStatus('Schermo intero non supportato da questo browser.');return false;}
   onStatus('');refresh();return active();
  }catch{onStatus('Impossibile attivare lo schermo intero. Riprova dal browser.');refresh();return false;}
 }
 button.addEventListener('click',toggle);doc.addEventListener('fullscreenchange',refresh);doc.addEventListener('webkitfullscreenchange',refresh);refresh();
 if(!request){button.disabled=true;button.title='Schermo intero non supportato da questo browser';}
 return {toggle,refresh,supported:!!request};
}
