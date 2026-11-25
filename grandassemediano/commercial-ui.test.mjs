import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {mountFullscreen} from './fullscreen.mjs';
import {STORY} from './campaign.mjs';
test('fullscreen enters and exits from a user gesture, including rejected orientation lock',async()=>{
 const doc={addEventListener(){},documentElement:{async requestFullscreen(){doc.fullscreenElement=this;}},async exitFullscreen(){doc.fullscreenElement=null;}};
 const button={setAttribute(){},addEventListener(){}};
 const ui=mountFullscreen(button,{document:doc,screen:{orientation:{lock:async()=>{throw Error('unsupported');}}}});
 assert.equal(await ui.toggle(),true);assert.equal(await ui.toggle(),false);
});
test('unsupported fullscreen is disabled and unavailable request cannot throw',async()=>{
 const button={setAttribute(){},addEventListener(){}};
 const ui=mountFullscreen(button,{document:{documentElement:{},addEventListener(){}}});
 assert.equal(ui.supported,false);assert.equal(button.disabled,true);assert.equal(await ui.toggle(),false);
});
test('spawn mission remains playable as a message without the initial NPC',()=>{
 assert.equal(STORY[0].steps[0].speaker,'MESSAGGIO');assert.equal(STORY[0].steps[0].verb,'LEGGI');
});
test('no station or satellite connection in shipped entry points',async()=>{
 const text=(await Promise.all(['game.mjs','index.html','licensed-audio.mjs'].map(f=>readFile(new URL(f,import.meta.url),'utf8')))).join('\n');
 assert.doesNotMatch(text,/stream[0-9]*\.xdevel|fluidstream|newradio|arcgisonline|createSatelliteOverlay|createCarRadio/);
 assert.match(text,/href="..\/index.html"/);
});
