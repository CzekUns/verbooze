"""Refresh hashes while retaining reviewed provenance/status. New files start blocked.
Run from any directory. This inventories files and makes no legal clearance assertion.
"""
from pathlib import Path
import csv,hashlib
root=Path(__file__).resolve().parents[1];target=root/'asset-rights-inventory.csv'
old={r['path']:r for r in csv.DictReader(target.open())} if target.exists() else {}
files=[p for p in (root/'assets').rglob('*') if p.is_file()]
files += [p for p in [root/'cover.svg',root.parent/'assets/gam-hero.webp'] if p.exists()]
rows=[]
for p in sorted(files):
 rel='../assets/gam-hero.webp' if p==root.parent/'assets/gam-hero.webp' else p.relative_to(root).as_posix()
 b=p.read_bytes();row=old.get(rel,{'path':rel,'group':'cover' if p.name=='cover.svg' else 'non classificato','provenance':'Importato: origine e concessione da documentare','rights_status':'BLOCCANTE: catena dei diritti non completa'})
 row.update(bytes=len(b),sha256=hashlib.sha256(b).hexdigest());rows.append(row)
with target.open('w',newline='') as f:
 w=csv.DictWriter(f,fieldnames=['path','bytes','sha256','group','provenance','rights_status'],lineterminator='\n');w.writeheader();w.writerows(rows)
print(str(len(rows))+' asset/source files inventoried; no rights automatically granted')
