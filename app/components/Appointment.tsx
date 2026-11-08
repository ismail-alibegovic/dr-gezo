'use client';

import {useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent, type ReactNode} from 'react';
import {ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Check, CheckCircle2, ChevronDown, Copy, Mail, Phone} from 'lucide-react';

type Mode = 'booking' | 'contact';
type Fields = {name:string; phone:string; email:string; location:string; service:string; date:string; time:string; topic:string; message:string};
type Draft = {subject:string; body:string; details:[string,string][]};
const recipient = 'info@drgezo.ba';
const initial:Fields = {name:'',phone:'',email:'',location:'',service:'',date:'',time:'',topic:'',message:''};
const branches = [
  {id:'dobrinja',name:'Dobrinja II',address:'Mustafe Kamerića 10',phone:'033 450 102',tel:'+38733450102'},
  {id:'otoka',name:'Otoka',address:'Gradačačka 29a',phone:'033 526 400',tel:'+38733526400'},
];
const services = ['Specijalistički ORL pregled','Dijagnostika sluha','Pregled nosa i sinusa','Pregled grla i ždrijela','Konsultacije za ORL hirurgiju'];
const topics = ['Informacije o uslugama','Cijene pregleda','Priprema za pregled','Drugo pitanje'];

function clinicToday() {
  const parts = new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Sarajevo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const part=(type:string)=>parts.find(p=>p.type===type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}
function dateIssue(value:string, location:string, today:string) {
  if (!value) return '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)||Number.isNaN(Date.parse(value+'T12:00:00Z'))) return 'Odaberite ispravan datum.';
  if (today && value<today) return 'Odaberite današnji ili budući datum.';
  const day=new Date(value+'T12:00:00Z').getUTCDay();
  if(day===0) return 'Nedjeljom ne radimo. Odaberite drugi dan.';
  if(day===6&&location==='otoka') return 'Otoka ne radi subotom. Odaberite radni dan ili Dobrinju.';
  return '';
}
function formatDate(value:string) {
  return new Intl.DateTimeFormat('bs-BA',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Sarajevo'}).format(new Date(value+'T12:00:00Z'));
}
function validPhone(value:string) {return /^[+()\d\s.-]+$/.test(value)&&value.replace(/\D/g,'').length>=7&&value.replace(/\D/g,'').length<=15;}
function validEmail(value:string) {return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);}

function Field({id,label,error,optional=false,wide=false,children}: {id:string;label:string;error?:string;optional?:boolean;wide?:boolean;children:ReactNode}) {
  return <div className={`request-field${wide?' field-wide':''}${error?' field-invalid':''}`}><label htmlFor={id}>{label}{optional?<span>neobavezno</span>:null}</label>{children}{error?<p className="field-error" id={`${id}-error`}>{error}</p>:null}</div>;
}

function RequestForm({mode}: {mode:Mode}) {
  const [fields,setFields]=useState<Fields>(initial);
  const [errors,setErrors]=useState<Record<string,string>>({});
  const [today,setToday]=useState('');
  const [draft,setDraft]=useState<Draft|null>(null);
  const [copyState,setCopyState]=useState('');
  const formRef=useRef<HTMLFormElement>(null);
  const previewHeading=useRef<HTMLHeadingElement>(null);
  const messageRef=useRef<HTMLTextAreaElement>(null);
  const booking=mode==='booking';
  const prefix=booking?'booking':'contact';
  const day=fields.date?new Date(fields.date+'T12:00:00Z').getUTCDay():-1;
  const dateError=dateIssue(fields.date,fields.location,today);
  const times=day===6?['Prijepodne · 09:00–12:00','Poslijepodne · 12:00–17:00','Prema dogovoru']:['Prijepodne · 09:00–12:00','Sredina dana · 12:00–15:00','Poslijepodne · 15:00–19:00','Prema dogovoru'];

  useEffect(()=>setToday(clinicToday()),[]);
  useEffect(()=>{if(draft)previewHeading.current?.focus();},[draft]);

  function update(key:keyof Fields,value:string) {
    setFields(previous=>({...previous,[key]:value,...(key==='date'||key==='location'?{time:''}:{})}));
    setErrors(previous=>{const next={...previous};delete next[key];if(key==='date'||key==='location'){delete next.time;delete next.date;}return next;});
    setCopyState('');
  }
  function attributes(key:keyof Fields,required=false) {
    const error=errors[key]||(key==='date'?dateError:'');
    return {id:`${prefix}-${key}`,name:key,value:fields[key],required,'aria-invalid':!!error,'aria-describedby':error?`${prefix}-${key}-error`:undefined,onChange:(event:ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>update(key,event.target.value)};
  }

  function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next:Record<string,string>={};
    const values=Object.fromEntries(Object.entries(fields).map(([key,value])=>[key,value.trim()])) as Fields;
    if(!values.name)next.name='Unesite ime i prezime.';
    if(booking&&!validPhone(values.phone))next.phone='Unesite ispravan broj telefona.';
    if(!booking&&values.phone&&!validPhone(values.phone))next.phone='Provjerite broj telefona ili ostavite polje prazno.';
    if((!booking||values.email)&&!validEmail(values.email))next.email='Unesite ispravnu e-mail adresu.';
    if(booking){
      if(!branches.some(branch=>branch.id===values.location))next.location='Odaberite poslovnicu.';
      if(!services.includes(values.service))next.service='Odaberite vrstu pregleda.';
      const issue=dateIssue(values.date,values.location,clinicToday());
      if(!values.date)next.date='Odaberite željeni datum.';else if(issue)next.date=issue;
      if(!times.includes(values.time))next.time='Odaberite željeno vrijeme.';
    }else{
      if(!topics.includes(values.topic))next.topic='Odaberite temu upita.';
      if(!values.message)next.message='Napišite poruku.';
    }
    setErrors(next);
    if(Object.keys(next).length){requestAnimationFrame(()=>formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());return;}
    if(booking){
      const branch=branches.find(branch=>branch.id===values.location)!;
      const date=formatDate(values.date);
      setDraft({subject:`Zahtjev za ORL pregled — ${branch.name}`,details:[['Poslovnica',`${branch.name} · ${branch.address}`],['Usluga',values.service],['Željeni datum',date],['Željeno vrijeme',values.time],['Kontakt',`${values.name} · ${values.phone}`]],body:`Poštovani,\n\nželim dogovoriti termin pregleda.\n\nPoslovnica: ${branch.name} — ${branch.address}\nUsluga: ${values.service}\nŽeljeni datum: ${date}\nŽeljeno vrijeme: ${values.time}\n\nIme i prezime: ${values.name}\nTelefon: ${values.phone}${values.email?'\nE-mail: '+values.email:''}\n\nMolim vas da mi potvrdite mogućnost pregleda i konačan termin.\n\nHvala.`});
    }else{
      setDraft({subject:`Upit poliklinici — ${values.topic}`,details:[['Tema',values.topic],['Ime i prezime',values.name],['E-mail',values.email],...(values.phone?[['Telefon',values.phone] as [string,string]]:[])],body:`Poštovani,\n\n${values.message}\n\nIme i prezime: ${values.name}\nE-mail: ${values.email}${values.phone?'\nTelefon: '+values.phone:''}\n\nHvala.`});
    }
  }

  async function copyMessage() {
    if(!draft)return;
    try{await navigator.clipboard.writeText(`${draft.subject}\n\n${draft.body}`);setCopyState('Poruka je kopirana. Možete je zalijepiti u svoj e-mail.');}
    catch{messageRef.current?.closest('details')?.setAttribute('open','');messageRef.current?.focus();messageRef.current?.select();setCopyState('Označite i kopirajte poruku ispod.');}
  }

  if(draft)return <div className="request-preview">
    <div className="request-preview-icon"><CheckCircle2 size={25} strokeWidth={1.4}/></div>
    <p className="eyebrow blue">PREGLED {booking?'ZAHTJEVA':'PORUKE'}</p>
    <h3 ref={previewHeading} tabIndex={-1}>{booking?'Vaš zahtjev je spreman.':'Vaša poruka je spremna.'}</h3>
    <p className="request-preview-intro">Provjerite podatke, otvorite e-mail i pošaljite poruku poliklinici.</p>
    <dl className="request-summary">{draft.details.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <details className="prepared-message"><summary>Pogledajte pripremljenu poruku<ChevronDown size={16}/></summary><label className="sr-only" htmlFor={`${prefix}-prepared`}>Pripremljeni tekst poruke</label><textarea ref={messageRef} id={`${prefix}-prepared`} readOnly value={draft.body} rows={9}/></details>
    <a className="button request-submit mail-draft-link" href={`mailto:${recipient}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`}><Mail size={16}/><span>OTVORITE E-MAIL</span><ArrowUpRight size={16}/></a>
    <div className="request-preview-actions"><button type="button" onClick={()=>{setDraft(null);setCopyState('');requestAnimationFrame(()=>formRef.current?.querySelector<HTMLInputElement>('input')?.focus());}}><ArrowLeft size={15}/>Uredite podatke</button><button type="button" onClick={copyMessage}><Copy size={15}/>Kopirajte poruku</button></div>
    <p className="request-copy-status" role="status">{copyState}</p>
    {booking?<p className="request-note"><Check size={15}/>Termin je dogovoren nakon potvrde poliklinike.</p>:null}
  </div>;

  return <form ref={formRef} className="request-form" noValidate onSubmit={submit} aria-label={booking?'Zahtjev za zakazivanje pregleda':'Kontaktni upit poliklinici'}>
    <div className="request-form-heading"><h3>{booking?'Dogovorite svoj pregled.':'Kako vam možemo pomoći?'}</h3><p>{booking?'Odaberite željeni dolazak i ostavite kontakt.':'Za informacije o uslugama, cijenama ili pripremi za pregled.'}</p></div>
    {Object.keys(errors).length?<p className="request-error-summary" role="alert">Provjerite označena polja prije nastavka.</p>:null}
    <div className="request-fields">
      <Field id={`${prefix}-name`} label="Ime i prezime" error={errors.name}><input {...attributes('name',true)} type="text" autoComplete="name" maxLength={80} placeholder="Vaše ime i prezime"/></Field>
      <Field id={`${prefix}-${booking?'phone':'email'}`} label={booking?'Telefon':'E-mail'} error={errors[booking?'phone':'email']}><input {...attributes(booking?'phone':'email',true)} type={booking?'tel':'email'} inputMode={booking?'tel':'email'} autoComplete={booking?'tel':'email'} maxLength={booking?30:120} placeholder={booking?'+387 …':'ime@primjer.ba'}/></Field>
      {booking?<>
        <Field id="booking-location" label="Poslovnica" error={errors.location}><div className="request-select"><select {...attributes('location',true)}><option value="">Odaberite poslovnicu</option>{branches.map(branch=><option key={branch.id} value={branch.id}>{branch.name}</option>)}</select><ChevronDown size={15}/></div></Field>
        <Field id="booking-service" label="Vrsta pregleda" error={errors.service}><div className="request-select"><select {...attributes('service',true)}><option value="">Odaberite uslugu</option>{services.map(service=><option key={service}>{service}</option>)}</select><ChevronDown size={15}/></div></Field>
        <Field id="booking-date" label="Željeni datum" error={errors.date||dateError}><input {...attributes('date',true)} type="date" min={today||undefined}/></Field>
        <Field id="booking-time" label="Željeno vrijeme" error={errors.time}><div className="request-select"><select {...attributes('time',true)} disabled={!fields.date||!!dateError}><option value="">Odaberite dio dana</option>{times.map(time=><option key={time}>{time}</option>)}</select><ChevronDown size={15}/></div></Field>
      </>:<>
        <Field id="contact-topic" label="Tema upita" error={errors.topic}><div className="request-select"><select {...attributes('topic',true)}><option value="">Odaberite temu</option>{topics.map(topic=><option key={topic}>{topic}</option>)}</select><ChevronDown size={15}/></div></Field>
        <Field id="contact-phone" label="Telefon" optional error={errors.phone}><input {...attributes('phone')} type="tel" inputMode="tel" autoComplete="tel" maxLength={30} placeholder="+387 …"/></Field>
        <Field id="contact-message" label="Vaša poruka" wide error={errors.message}><textarea {...attributes('message',true)} rows={4} maxLength={600} placeholder="Napišite kako vam možemo pomoći…"/><span className="message-count" aria-hidden="true">{fields.message.length} / 600</span></Field>
      </>}
    </div>
    <p className="request-delivery"><Mail size={15}/><span>Za {recipient} pripremamo e-mail koji vi pregledate i šaljete.</span></p>
    <button type="submit" className="button request-submit"><span>{booking?'PREGLEDAJTE ZAHTJEV':'PREGLEDAJTE PORUKU'}</span><ArrowRight size={17}/></button>
    {booking?<p className="request-note"><CalendarDays size={15}/>Odabrani datum i vrijeme su vaša želja. Termin potvrđuje poliklinika.</p>:null}
  </form>;
}

export default function Appointment() {
  const [active,setActive]=useState<Mode>('booking');
  const tabs=useRef<(HTMLButtonElement|null)[]>([]);
  function tabKey(event:KeyboardEvent<HTMLButtonElement>,index:number) {
    let next=index;
    if(event.key==='ArrowRight'||event.key==='ArrowLeft')next=1-index;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=1;
    else return;
    event.preventDefault();setActive(next===0?'booking':'contact');tabs.current[next]?.focus();
  }
  return <section className="section appointment-section" id="zakazivanje" aria-labelledby="appointment-title">
    <div className="appointment-layout">
      <div className="appointment-copy"><p className="eyebrow blue">ZAKAŽITE SVOJ PREGLED</p><h2 id="appointment-title">Dogovorimo<br/>vaš dolazak.</h2><p className="intro">Odaberite uslugu i lokaciju koja vam odgovara. Naš tim će s vama dogovoriti konačan termin pregleda.</p></div>
      <div className="appointment-card"><div className="request-tabs" role="tablist" aria-label="Vrsta zahtjeva">{([['booking','Zakažite pregled',CalendarDays],['contact','Pošaljite upit',Mail]] as const).map(([mode,label,Icon],index)=><button key={mode} ref={el=>{tabs.current[index]=el;}} type="button" id={`request-tab-${mode}`} role="tab" aria-selected={active===mode} aria-controls={`request-panel-${mode}`} tabIndex={active===mode?0:-1} onClick={()=>setActive(mode)} onKeyDown={event=>tabKey(event,index)}><Icon size={16}/>{label}</button>)}</div>
        {(['booking','contact'] as const).map(mode=><div className="request-panel" key={mode} id={`request-panel-${mode}`} role="tabpanel" aria-labelledby={`request-tab-${mode}`} hidden={active!==mode}><RequestForm mode={mode}/></div>)}
      </div>
      <ol className="appointment-steps">{[['Odaberite pregled','Lokacija, usluga i željeni datum.'],['Pripremite zahtjev','Provjerite podatke i otvorite e-mail.'],['Sačekajte potvrdu','Tim poliklinike dogovara termin s vama.']].map(([title,copy],index)=><li key={title}><span>{String(index+1).padStart(2,'0')}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol>
      <div className="appointment-direct"><div><Phone size={18} strokeWidth={1.5}/><h3>Želite dogovor telefonom?</h3></div>{branches.map(branch=><a href={`tel:${branch.tel}`} key={branch.id}><span>{branch.name}</span><strong>{branch.phone}</strong><ArrowUpRight size={18}/></a>)}</div>
    </div>
  </section>;
}
