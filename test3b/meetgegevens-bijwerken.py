import json,sqlite3,copy,hashlib,pathlib
base=pathlib.Path(__file__).resolve().parent;root=base.parent;out=base/'meetgegevens'
s=json.loads((out/'kruin-sheet-bron.json').read_text())
c=sqlite3.connect('file:'+str(root/'kruin-bases/kruin-v208-a813a3da24249575feb3.sqlite3')+'?mode=ro',uri=True)
k=json.loads(c.execute('select payload from kruin_basis').fetchone()[0]);old=copy.deepcopy(k)
confirmed={
 'klein-ingespeeld':{'VIER-2':(0,'west',70,33),'VIER-1':(2,'west',70,34),'VIER':(5,'west',70,35),'VIER+1':(10,'west',75,36),'VIER+2':(13,'west',80,37),'VIER+3':(20,'west',85,38),'VIJF-2':(5,'west',75,41),'VIJF':(20,'zuid',38,43),'VIJF+2':(25,'zuid',35,45),'VIJF+3':(33,None,None,46),'ZES-2':(22,'zuid',32,48),'ZES-1':(28,'zuid',31,49),'ZES':(30,'zuid',30,51),'ZES+1':(32,'zuid',28,52),'ZES+2':(35,'zuid',27,53),'ACHT-2':(37,'zuid',23,60),'ACHT-1':(40,'zuid',22,61),'ACHT':(45,'zuid',20,62)},
 'klein-nieuw':{'VIER-2':(0,'west',60,43),'VIER-1':(5,'west',70,44),'VIER':(None,'west',80,45),'VIER+1':(13,'west',90,46),'VIER+2':(None,'west',85,47),'VIER+3':(20,'zuid',40,48),'VIJF-2':(10,'west',85,51),'VIJF-1':(15,'west',80,52),'VIJF':(20,'zuid',38,53),'VIJF+1':(25,'zuid',35,54),'VIJF+2':(30,'zuid',30,55),'VIJF+3':(35,'zuid',25,56),'ZES-2':(None,'zuid',31,58),'ZES-1':(None,'zuid',32,59),'ZES':(30,'zuid',28,60),'ZES+1':(32,'zuid',25,61),'ZES+2':(35,'zuid',22,62),'ZEVEN-2':(30,None,None,64),'ZEVEN-1':(32,None,None,65),'ZEVEN':(35,None,None,66),'ZEVEN+1':(40,None,None,67),'ACHT-2':(34,None,None,69),'ACHT-1':(None,None,None,70),'ACHT':(43,None,None,71)},
 'groot-lkl':{'VIER':(None,'west',70,35),'VIJF':(20,'zuid',36,43),'ZES':(30,'zuid',28,51),'ZEVEN':(37,'zuid',22,57),'ACHT':(48,'zuid',18,62)},
}
profiles={}
changes=[]
west_normalizations=[]
def point(band,value,tab,cell,kind='stipwaarde',note=None):
 p={'band':band,'value':value,'status':'approved','source':'kruin_sqlite','measurement':True,'measurementKind':kind,'sourceRef':{'url':s['tabs'][tab]['url'],'tab':s['tabs'][tab]['title'],'cell':cell},'confirmedBy':'Kruin'}
 if note:p['note']=note
 return p

def romp_arrival(band,value,tab,cell,note=None):
 # Alleen opnieuw uit de sheet gelezen West-Rompen hebben Noord als nulpunt.
 # Bestaande appwaarden, eigen metingen en de bevestigde Kruis-A blijven canoniek.
 p=point(band,80-value if band=='west' else value,tab,cell,'stipwaarde',note)
 if band=='west':
  p['sheetPoint']={'band':'west','value':value,'zero':'noord'}
  p['numberingConversion']='80 - sheetValue'
 return p

def assign(track,key,p):
 track[key]=p
 part,side={'rompV':('romp','from'),'rompA':('romp','to'),'kopA':('kop','to'),'nekA':('nek','to'),'neusA':('neus','to'),'kruisA':('kruis','to')}[key]
 track.setdefault('linePoints',{}).setdefault(part,{})[side]=copy.deepcopy(p)

for profile,records in confirmed.items():
 table='klein' if profile.startswith('klein') else 'groot'
 tab=profile if table=='klein' else 'raedthuys'
 tracks=copy.deepcopy(old['tracks'][table])
 for name,track in tracks.items():
  track['tableProfile']=profile
  track['retainedReferenceRevision']=old['beheerRevision']
 for name,(v,band,a,row) in records.items():
  track=tracks[name]
  if v is not None:
   col='L' if profile=='klein-ingespeeld' else 'J' if profile=='klein-nieuw' else 'M'
   p=point('oost',v,tab,col+str(row));assign(track,'rompV',p)
   changes.append({'profile':profile,'track':name,'field':'rompV','before':old['tracks'][table][name].get('rompV'),'after':p})
  if band:
   col=('M' if band=='west' or name.startswith('ACHT') else 'O') if profile=='klein-ingespeeld' else ('K' if band=='west' else 'M') if profile=='klein-nieuw' else ('O' if name=='ACHT' else 'N')
   p=romp_arrival(band,a,tab,col+str(row),'Kruin kiest A 38; sheetnotitie R 37 en A 40 afzonderlijk bewaard.' if profile=='klein-ingespeeld' and name=='VIJF' else None)
   if band=='west':west_normalizations.append({'profile':profile,'track':name,'field':'rompA','cell':col+str(row),'sheetValue':a,'appValue':p['value']})
   assign(track,'rompA',p);changes.append({'profile':profile,'track':name,'field':'rompA','before':old['tracks'][table][name].get('rompA'),'after':p})
  # De driehoekkolom is R op de band, nooit rechtstreeks Kop A op de stiplijn.
  if profile=='klein-nieuw':
   raw=s['tabs'][tab]['cells'].get('G'+str(row),'')
   try:r=float(raw.replace(',','.'))
   except ValueError:r=15 if name=='ZES' else None
   if r is not None:
    observation=point('noord',r,tab,'G'+str(row),'raakpunt')
    if name=='ZES':observation['bibliography']={'author':'A. Duon','title':'Modern Biljarten','page':27,'tableSize':'klein'}
    track.setdefault('railContactMeasurements',{})['kop']=observation
   rawR=s['tabs'][tab]['cells'].get('L'+str(row),'')
   if '⇓' in rawR:
    import re
    m=re.search(r'\d+(?:,\d+)?',rawR)
    if m:track.setdefault('railContactMeasurements',{})['romp']=point('zuid',float(m[0].replace(',','.')),tab,'L'+str(row),'raakpunt')
  if profile=='klein-ingespeeld' and name=='VIJF':track.setdefault('railContactMeasurements',{})['romp']=point('zuid',37,tab,'N43','raakpunt')
 # Missing measurements retain the old reference explicitly; they are not newly measured.
 profiles[profile]={'size':table,'label':{'klein-ingespeeld':'Klein · ingespeeld','klein-nieuw':'Klein · nieuw laken','groot-lkl':'Groot · LKL / Raedthuys'}[profile],'sourceTab':s['tabs'][tab]['title'],'sourceUrl':s['tabs'][tab]['url'],'tracks':tracks}

fel=copy.deepcopy(profiles['groot-lkl']['tracks']['VIER'])
assign(fel,'rompA',romp_arrival('west',60,'raedthuys','N35','Felle afstoot: sheet 60 = West 20; rollend LKL: sheet 70 = West 10.'))
west_normalizations.append({'profile':'groot-felle-afstoot','track':'VIER','field':'rompA','cell':'N35','sheetValue':60,'appValue':20})
fel['patternName']='Felle afstoot';fel['tableProfile']='groot-felle-afstoot'
profiles['groot-felle-afstoot']={'size':'groot','label':'Groot · Felle afstoot','pattern':'felleAfstoot','sourceTab':'Raedthuys-Ingespeeld','sourceUrl':s['tabs']['raedthuys']['url'],'tracks':{'VIER':fel},'incomplete':'Vertrek Romp V is nog niet gemeten; geen volledig spoor afleiden.'}
# Lijn 5 is Kruis A. Laatste expliciete correctie: VIJF naar West 10, niet Oost.
import re
cross_rows={'klein-ingespeeld':{'VIJF':43,'ZES':51,'ZEVEN':57,'ACHT':62},'klein-nieuw':{'VIJF':53,'ZES':60,'ZEVEN':66,'ACHT':71},'groot-lkl':{'VIJF':24,'ZES':32,'ZEVEN':38,'ACHT':43}}
for profile, rows in cross_rows.items():
 tab='groot' if profile=='groot-lkl' else profile
 col='N' if profile=='klein-nieuw' else 'P'
 for name,row in rows.items():
  raw=s['tabs'][tab]['cells'].get(col+str(row),'')
  m=re.search(r'([LK])\s*(\d+)',raw.replace('●','').replace(' ',''))
  if not m:raise ValueError((profile,name,raw))
  arrival_band='west' if name=='VIJF' else 'oost' if m[1]=='L' else 'noord'
  p=point(arrival_band,float(m[2]),tab,col+str(row))
  if name=='VIJF':p['bandCorrection']='Kruin: Kruis VIJF naar West; eerdere Oost-koppeling vervalt.'
  assign(profiles[profile]['tracks'][name],'kruisA',p)
  # De sheet bevat geen Been A. Een oud standaardgetal 10 mag deze nieuwe A niet verlengen.
  track=profiles[profile]['tracks'][name]
  track['beenA']={'band':'oost','value':None,'status':'calculated','source':'automatic'}
  track['linePoints']['been']['to']=copy.deepcopy(track['beenA'])
  track['linePoints']['been']['from']={'band':p['band'],'value':None,'status':'calculated','source':'automatic'}
  changes.append({'profile':profile,'track':name,'field':'kruisA','before':None,'after':p})
k['measurementTables']=profiles;k['defaultMeasurementTables']={'klein':'klein-ingespeeld','groot':'groot-lkl'}
k['tracks']['klein']=copy.deepcopy(profiles['klein-ingespeeld']['tracks']);k['tracks']['groot']=copy.deepcopy(profiles['groot-lkl']['tracks'])
# Lijn 5 is een gemeenschappelijke lijnnaam, ook binnen de 6–7-bander.
# Kruin bevestigt: de geteste Lijn 5 geldt ook voor het bijbehorende 6–7-patroon.
for profile in profiles.values():
 for name,track in profile['tracks'].items():
  if name.startswith('ZESZEVEN'):
   tested_name={'ZESZEVEN':'VIJF','ZESZEVEN_ZES':'ZES','ZESZEVEN_ZEVEN':'ZEVEN'}.get(name)
   tested=profile['tracks'].get(tested_name,{}).get('kruisA') if tested_name else None
   if tested and tested.get('measurement'):
    imported=copy.deepcopy(tested)
    imported['sharedTestedLine']={'fromPattern':'LKL','fromTrack':tested_name,'toPattern':'sixSeven','confirmedBy':'Kruin'}
    assign(track,'kruisA',imported)
    changes.append({'profile':track['tableProfile'],'track':name,'field':'kruisA','before':old['tracks'][profile['size']].get(name,{}).get('linePoints',{}).get('kruis',{}).get('to'),'after':imported})
   pair=track.get('linePoints',{}).get('kruis',{})
   if pair.get('to'):track['kruisA']=copy.deepcopy(pair['to'])
   if pair.get('from'):track['kruisV']=copy.deepcopy(pair['from'])
   track['lineFiveStatus']='measured' if pair.get('to',{}).get('measurement') else 'existing_reference_or_estimate'
k['tracks']['klein']=copy.deepcopy(profiles['klein-ingespeeld']['tracks']);k['tracks']['groot']=copy.deepcopy(profiles['groot-lkl']['tracks'])
k['sourceNotes']={'bibliography':[{'author':'A. Duon','title':'Modern Biljarten','tableSize':'klein','pages':[27]}],'lineDefinitions':{'5':{'key':'kruis','name':'Lijn 5','appliesTo':['lkl','sixSeven'],'values':['V','A'],'arrivalBandCodes':{'L':'oost','K':'noord'},'arrivalBandOverrides':{'VIJF':'west'},'keepMeasurementsPerPattern':True,'shareTestedLineWithSixSeven':True}},'numbering':{'westRomp':{'sheetZero':'noord','appZero':'zuid','conversion':'80 - sheetValue','keepExtendedValues':True,'scope':'newly imported Romp A only'}},'notation':{'triangleDown':'R: raakpunt op de band; geen V/A-stipwaarde','V':'Vertrek van de lijn op de stiplijn','A':'Aankomst van de lijn op de stiplijn'},'missingValues':'Bestaande Kruinreferentie behouden waar geen nieuwe zekere meting is opgegeven; retainedReferenceRevision identificeert de oude basis.'}
k['patternSettings']['felleAfstoot']={'labels':{'nl':'Felle afstoot'},'framework':['neus','romp'],'tracks':['VIER'],'table':'groot','rompArrival':20,'sheetRompArrival':60,'source':'Raedthuys-Ingespeeld!N35','incomplete':True}
k['source']='kruin_spreadsheet_confirmed';k['measurementRevision']=hashlib.sha256(json.dumps({'profiles':profiles,'sourceNotes':k['sourceNotes']},sort_keys=True,ensure_ascii=False).encode()).hexdigest()
k['beheerRevision']=k['measurementRevision']
(base/'kruinwaarden-generated-v208.js').write_text('window.THREEB_KRUIN_VALUES='+json.dumps(k,ensure_ascii=False,separators=(',',':'))+';\n')
(out/'kruin-wijzigingen.json').write_text(json.dumps({'sourceRevision':old['beheerRevision'],'measurementRevision':k['measurementRevision'],'changes':changes,'westNumberingCorrections':west_normalizations,'pending':[],'confirmations':{'VIJF klein ingespeeld':'V20 A38; R37 los bewaren','VIJF Kruis':'A West 10; herstelt foutieve Oost-koppeling, ook in de overgenomen lijn van ZESZEVEN','ACHT-1 klein ingespeeld':'A22','ZES groot':'A28','ACHT groot':'V48','VIER groot':'LKL West 10 (sheet 70), Felle afstoot West 20 (sheet 60)','Duon':'Modern Biljarten, A. Duon, p.27; R15 op klein nieuw'}},ensure_ascii=False,indent=2)+'\n')
print('Profielen:',list(profiles),'bevestigde V/A-updates:',len(changes),'revision',k['measurementRevision'][:12])
print('West-Rompen genormaliseerd:',len(west_normalizations))
for row in west_normalizations:print(row['profile'],row['track'],str(row['sheetValue'])+' -> West '+str(row['appValue']))

# Zelfstandige SQLite-meeteditie, met dezelfde basisstructuur als de Kruinarchieven.
import subprocess
config=json.loads(subprocess.check_output(['node','-e',"const vm=require('vm'),fs=require('fs');const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(process.argv[1],'utf8'),c);process.stdout.write(JSON.stringify(c.window.THREEB_START_CONFIG));",str(base/'config-v208.js')],text=True))
dbpath=base/'kruin-meetgegevens-v208.sqlite3'
if dbpath.exists():dbpath.unlink()
db=sqlite3.connect(dbpath)
db.executescript('CREATE TABLE kruin_basis(id TEXT PRIMARY KEY,label TEXT,payload TEXT,app_config TEXT); CREATE TABLE spoor_values(table_name TEXT,pattern TEXT,snapshot TEXT,PRIMARY KEY(table_name,pattern)); CREATE TABLE meetprofielen(profiel TEXT PRIMARY KEY,tafelmaat TEXT,naam TEXT,standaard INTEGER,payload TEXT); CREATE TABLE meetbron_cellen(tab TEXT,cel TEXT,notatie TEXT,url TEXT,PRIMARY KEY(tab,cel));')
basis_id='kruin-v208-meetprofielen-'+k['measurementRevision'][:12]
db.execute('INSERT INTO kruin_basis VALUES(?,?,?,?)',(basis_id,'Kruin · meetprofielen',json.dumps(k,ensure_ascii=False,separators=(',',':')),json.dumps(config,ensure_ascii=False,separators=(',',':'))))
for key,profile in profiles.items():db.execute('INSERT INTO meetprofielen VALUES(?,?,?,?,?)',(key,profile['size'],profile['label'],int(k['defaultMeasurementTables'].get(profile['size'])==key),json.dumps(profile,ensure_ascii=False,separators=(',',':'))))
for tab in s['tabs'].values():
 for cell,value in tab['cells'].items():db.execute('INSERT INTO meetbron_cellen VALUES(?,?,?,?)',(tab['title'],cell,value,tab['url']))
db.commit()
assert db.execute('PRAGMA integrity_check').fetchone()[0]=='ok'
assert json.loads(db.execute('SELECT payload FROM kruin_basis').fetchone()[0])==k
db.close()
print('SQLite:',dbpath.name,'integriteit en JS-gelijkheid OK')
