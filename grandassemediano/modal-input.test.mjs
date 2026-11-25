import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';

// Exercise the actual registered keydown body; callbacks for world actions are spies.
const game=await readFile(new URL('./game.mjs',import.meta.url),'utf8');
const start=game.indexOf('  // Q37: con il telefono aperto');
const end=game.indexOf(" });\n window.addEventListener('keyup'",start);
assert.ok(start>0&&end>start,'locate the game keyboard listener');
const body=game.slice(start,end);
function fixture({pause=false,map=false,dialog=false,bank=false,phone=()=>false}={}){
 const elements={'pause-menu':{hidden:!pause},dialog:{hidden:!dialog},fullmap:{hidden:!map}};
 const state={ready:true,mapOpen:map,bankInterior:bank?{}:null,player:{car:-1},cars:[{}]};
 const pressed={},calls=[];
 const env={state,pressed,isMotorcycle:()=>false,pause:elements['pause-menu'],$:id=>elements[id]||{hidden:true},phoneUi:{key:phone},isDialogueOpen:()=>false,
  closePause:()=>{calls.push('closePause');elements['pause-menu'].hidden=true;},
  openPause:()=>{calls.push('openPause');elements['pause-menu'].hidden=false;},
  toggleBigMap:()=>{calls.push('toggleBigMap');state.mapOpen=!state.mapOpen;},
  toggleVehicle:()=>{calls.push('toggleVehicle');state.player.car=0;},
  interactMission:()=>calls.push('interactMission'),openRiderApp:()=>calls.push('openRiderApp')};
 const handler=runInNewContext('(e=>{'+body+'})',env);
 const key=(key,extra={})=>{const event={key,code:key===' '?'Space':'',repeat:false,preventDefault(){this.prevented=true;},...extra};handler(event);return event;};
 return {key,state,pressed,calls,elements};
}
test('pause owns world shortcuts and movement; Escape closes it without leaving the bank',()=>{
 const f=fixture({pause:true,bank:true}),bank=f.state.bankInterior;
 for(const k of ['e','f','j','m','w','ArrowUp',' '])f.key(k);
 assert.deepEqual(f.calls,[]);assert.deepEqual(f.pressed,{});assert.equal(f.state.player.car,-1);
 f.key('Escape');assert.deepEqual(f.calls,['closePause']);assert.equal(f.state.bankInterior,bank);
});
test('phone navigation is consumed before the pause close shortcut',()=>{
 const f=fixture({pause:true,phone:()=>true});f.key('Escape');assert.deepEqual(f.calls,[]);assert.equal(f.elements['pause-menu'].hidden,false);
 const p=fixture({pause:true});p.key('p',{repeat:true});assert.deepEqual(p.calls,[]);p.key('p');assert.deepEqual(p.calls,['closePause']);
});
test('full map blocks car, missions and movement; M or Escape only closes the map',()=>{
 for(const close of ['m','Escape']){
  const f=fixture({map:true});for(const k of ['e','f','j','w'])f.key(k);
  assert.deepEqual(f.calls,[]);assert.deepEqual(f.pressed,{});f.key(close);
  assert.deepEqual(f.calls,['toggleBigMap']);assert.equal(f.state.mapOpen,false);
 }
});
test('message blocks gameplay and closes on Escape, Enter or Space without opening pause',()=>{
 for(const close of ['Escape','Enter',' ']){
  const f=fixture({dialog:true});for(const k of ['e','f','j','w'])f.key(k);
  assert.deepEqual(f.calls,[]);assert.deepEqual(f.pressed,{});f.key(close);
  assert.equal(f.elements.dialog.hidden,true);assert.deepEqual(f.calls,[]);
 }
});
test('normal world still receives E and movement when no overlay is open',()=>{
 const f=fixture();f.key('e');assert.deepEqual(f.calls,['toggleVehicle']);f.key('w');assert.equal(f.pressed.up,true);
});
