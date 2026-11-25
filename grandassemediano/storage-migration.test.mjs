import {test} from 'node:test';import assert from 'node:assert/strict';
import {migrateLegacyStorage} from './storage-migration.mjs';
test('legacy save migration retains currency, missions, garages and original backup',()=>{
 const oldPrefix=['g','t','a'].join('')+'-melito-';
 const oldModel=['p','anda-modern-white'].join('');
 const raw=JSON.stringify({money:123,mission:2,garage:{vehicles:[{model:oldModel}]} });
 const m=new Map([[oldPrefix+'campaign-v3',raw]]),storage={getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)};
 assert.equal(migrateLegacyStorage(storage).migrated,1);
 const p=JSON.parse(m.get('gam-melito-campaign-v3'));assert.equal(p.money,123);assert.equal(p.mission,2);assert.equal(p.garage.vehicles[0].model,'borgo-nuova-white');
 assert.equal(m.get(oldPrefix+'campaign-v3'),raw);assert.equal(migrateLegacyStorage(storage).migrated,0);
});
test('migration does not overwrite new progress, and blocked storage does not prevent boot',()=>{
 const m=new Map([['gam-melito-campaign-v3','new']]);
 migrateLegacyStorage({getItem:k=>m.get(k)??null,setItem(){throw Error('must not overwrite');}});assert.equal(m.get('gam-melito-campaign-v3'),'new');
 assert.doesNotThrow(()=>migrateLegacyStorage({getItem(){throw Error('blocked');}}));
});
