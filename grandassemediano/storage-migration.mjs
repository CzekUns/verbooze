/* Legacy identifiers below are retained ONLY to migrate existing browser saves.
 * Never rendered, never used for new assets or outgoing connections. Keep old keys as backup. */
const MODELS={"panda-fire": "borgo-classica", "panda-modern": "borgo-nuova", "punto-188": "alba", "ypsilon-2003": "luna", "grande-punto-2005": "aurora", "ypsilon-2011": "selce", "tipo-hatchback-2016": "corallo", "fiat-500l-2012": "faro", "clio-iv-2012": "quarzo", "golf-vii-2012": "onda", "corsa-e-2014": "iris", "peugeot-208-2012": "sabbia", "qashqai-j11-2013": "altura", "duster-2010": "sentiero", "doblo-2010": "cargo", "fiorino-2008": "bottega", "seicento-1998": "nido", "fiat-500-2007": "vela", "fiat-uno-1983": "riva", "smart-fortwo-2007": "mira", "scooter-sh": "scooter-urbano"};
function models(value){
 if(typeof value==='string'){for(const [old,next] of Object.entries(MODELS).sort((a,b)=>b[0].length-a[0].length))if(value===old||value.startsWith(old+'-')||value.startsWith('moto-'+old+'-'))value=value.replace(old,next);return value.replace(/^ape-/, 'triciclo-');}
 if(Array.isArray(value))return value.map(models);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,models(v)]));
 return value;
}
export function migrateLegacyStorage(storage){
 if(!storage)return {migrated:0};let migrated=0;
 for(const suffix of ['campaign-v3','audio-v1','loading-screen-last-v1','slot-v1','poker-v1','biliardo-v1','novita-giudizi-v1','osm-v1']){
  try{const key='gam-melito-'+suffix;if(storage.getItem(key)!==null)continue;
   const raw=storage.getItem('gta-melito-'+suffix);if(raw===null)continue;
   let value=raw;try{value=JSON.stringify(models(JSON.parse(raw)));}catch{}
   storage.setItem(key,value);migrated++;
  }catch{/* blocked storage does not prevent boot; original save is untouched */}
 }
 return {migrated};
}
