/* Reserved transport for future original/licensed LOCAL music.
 * No catalogue, remote addresses, Audio elements or network calls are shipped.
 * A future catalogue requires an explicit asset-rights entry before activation. */
export function createLicensedAudio(){
 let inVehicle=false,volume=.52,ducked=false;
 return {
  enterVehicle(){inVehicle=true;return Promise.resolve(false);},
  leaveVehicle(){inVehicle=false;},
  setVolume(v){volume=Number.isFinite(v)?Math.max(0,Math.min(1,v)):.52;return volume;},
  duck(v){ducked=!!v;},suspend(){},
  snapshot(){return {available:false,status:'off',inVehicle,volume,ducked};}
 };
}
