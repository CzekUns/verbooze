/* Derived OSM database: business names fictionalized by category; geometry/IDs unchanged.
 * Streets, squares, public town hall and churches retain geographical names.
 * Also applied to legacy cached map data before any storefront is created. */
const LABELS={"fuel": "Distributore", "post_office": "Sportello postale", "bar": "Bar di quartiere", "clothes": "Abbigliamento", "hairdresser": "Parrucchiere", "supermarket": "Supermercato", "computer": "Informatica", "cafe": "Caffetteria", "furniture": "Arredamenti", "variety_store": "Bazar", "car": "Autosalone", "pharmacy": "Farmacia", "bank": "Banca civica", "fast_food": "Rosticceria", "stationery": "Cartoleria", "car_repair": "Officina", "pastry": "Pasticceria", "car_parts": "Autoricambi", "yes": "Laboratorio meccanico", "hardware": "Colorificio", "restaurant": "Trattoria", "butcher": "Macelleria", "school": "Scuola di quartiere", "houseware": "Casalinghi", "lighting": "Illuminazione", "department_store": "Emporio", "bakery": "Panificio", "parcel_locker": "Ritiro pacchi", "craft": "Bottega artigiana"};
export function sanitizeCommercialMap(map){
 const names=new Map(),counts={};
 const pois=(map.pois||[]).map(p=>{
  if(p.k==='townhall')return {...p};
  const i=counts[p.k]=(counts[p.k]||0)+1,n=(LABELS[p.k]||'Attività')+' '+String(i).padStart(2,'0');
  names.set(p.n,n);return {...p,n};
 });
 const buildings=(map.buildings||[]).map(b=>({...b,...(b.n&&!/chiesa|municipio|scuola|ospedale/i.test(b.n)?{n:names.get(b.n)||'Edificio commerciale'}:{})}));
 return {...map,pois,buildings};
}
