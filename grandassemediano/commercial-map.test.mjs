import {test} from 'node:test';import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';import {sanitizeCommercialMap} from './commercial-map.mjs';
import {mapFingerprint} from './urban-infill.mjs';
test('commercial map preserves all coordinates, IDs, kinds, road names and fingerprint',async()=>{
 const map=JSON.parse(await readFile(new URL('./data/melito-map.json',import.meta.url))),out=sanitizeCommercialMap(map);
 assert.equal(mapFingerprint(out),mapFingerprint(map));assert.deepEqual(out.roads,map.roads);
 assert.deepEqual(out.pois.map(({n,...p})=>p),map.pois.map(({n,...p})=>p));
 assert.deepEqual(sanitizeCommercialMap(out),out,'idempotent for static snapshot and cache');
 assert.equal(out.pois.find(p=>p.k==='bank').n,'Banca civica 01');
 const old={pois:[{id:1,k:'bank',n:'Unreviewed commercial name',x:1,y:2}],buildings:[{id:2,n:'Unknown shop',p:[1,2]}]};
 assert.equal(sanitizeCommercialMap(old).pois[0].n,'Banca civica 01');assert.equal(old.pois[0].n,'Unreviewed commercial name');
});
