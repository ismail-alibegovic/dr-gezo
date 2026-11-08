'use client';

import {useEffect, useRef, useState, type ReactNode} from 'react';
import {ChevronDown, ArrowUpRight, ArrowUp, ArrowDown, ArrowRight, Phone, Plus, Menu, X, Ear, Wind, AudioLines, Microscope, Stethoscope, ShieldCheck, MapPin, HeartPulse, Scan, CalendarDays, Mail, Activity, Clock} from 'lucide-react';
import Carousel from './components/Carousel';
import Appointment from './components/Appointment';

const official = 'https://www.drgezo.ba';
const services = [
  {title:'Specijalistički ORL pregledi', category:'PREGLEDI', copy:'Pažljiv pregled uha, nosa i grla. Prvi korak do jasne dijagnoze.', image:'otoscopy.jpg', position:'65% 50%', href:'/usluge/ambulantne-usluge', alt:'Specijalistički pregled uha otoskopom'},
  {title:'Dijagnostika sluha', category:'DIJAGNOSTIKA', copy:'Procjena sluha uz ORL opremu i individualan pristup pacijentu.', image:'audiometry.jpg', position:'38% 50%', href:'/usluge/ambulantne-usluge', alt:'Audiometar iz službene galerije Poliklinike Dr. Gežo'},
  {title:'Bolesti nosa i sinusa', category:'NOS I SINUSI', copy:'Specijalistička dijagnostika i liječenje za zdravlje nosa i sinusa.', image:'endoscopy.jpg', position:'48% 50%', href:'/usluge/ambulantne-usluge', alt:'Endoskopska ORL oprema iz službene galerije poliklinike'},
  {title:'Bolesti grla i ždrijela', category:'GRLO I GLAS', copy:'Stručna pažnja posvećena zdravlju grla, ždrijela i glasa.', image:'throat-examination.jpg', position:'40% 50%', href:'/usluge/ambulantne-usluge', alt:'Ljekarica pregleda grlo pacijenta'},
  {title:'ORL hirurgija', category:'HIRURŠKO LIJEČENJE', copy:'Operativno liječenje bolesti uha, nosa, sinusa, grla i vrata.', image:'instruments.jpg', position:'50% 50%', href:'/usluge/operacije-na-uhu', alt:'Hirurški instrumenti iz službene galerije Poliklinike Dr. Gežo'},
];
const doctors = [
  {name:'Doc. dr. sci. Alija Gežo', role:'Osnivač · doktor medicine', image:'doctor0.jpg', position:'50% 38%'},
  {name:'Prim. dr. Milan Mandilović', role:'Specijalista otorinolaringologije', image:'doctor1.jpg', position:'50% 35%'},
  {name:'Dr. Anid Gežo', role:'Specijalista otorinolaringologije', image:'doctor2.jpg', position:'50% 32%'},
  {name:'Prim. dr. Dragan Jovović', role:'Specijalista otorinolaringologije', image:'doctor3.jpg', position:'50% 24%'},
  {name:'Mr. sc. med. dr. Dalibor Bošković', role:'Specijalista anesteziologije s reanimatologijom', image:'doctor4.jpg', position:'50% 23%'},
];
const specialties = [
  ['ORL pregledi', Stethoscope], ['Dijagnostika sluha', AudioLines], ['Bolesti uha', Ear], ['Nos i sinusi', Wind],
  ['Grlo i ždrijelo', Activity], ['Operacije na uhu', Microscope], ['Hirurgija nosa i sinusa', Scan], ['Hirurgija grla i vrata', HeartPulse],
] as const;
const benefits = [
  ['Pregledi po dogovoru', CalendarDays], ['Dvije lokacije u Sarajevu', MapPin], ['Specijalistički pristup', Stethoscope], ['Dijagnostika i liječenje', Scan],
  ['Iskustvo od 1997. godine', ShieldCheck], ['Direktan kontakt s timom', Phone], ['Pažnja prema pacijentu', HeartPulse], ['Jasne informacije', Mail],
] as const;
const locations = [
  {name:'Dobrinja II', address:'Mustafe Kamerića 10', phone:'033 450 102', tel:'+38733450102', hours:'Pon–pet 09:00–19:00 · Sub 09:00–17:00'},
  {name:'Otoka', address:'Gradačačka 29a', phone:'033 526 400', tel:'+38733526400', hours:'Pon–pet 09:00–19:00 · Subotom ne radi'},
];
const gallery = [
  {image:'ent-interior.jpg', title:'ORL ordinacija', position:'50% 50%'},
  {image:'clinic-room.jpg', title:'Prostor za ORL dijagnostiku', position:'50% 50%'},
  {image:'reception.jpg', title:'Recepcija poliklinike', position:'50% 50%'},
  {image:'microscope.jpg', title:'Operacioni mikroskop', position:'42% 45%'},
  {image:'recovery.jpg', title:'Prostor za odmor', position:'50% 50%'},
];
const faqs = [
  ['Kako zakazati pregled?', 'Pozovite poslovnicu Dobrinja na +387 33 450 102 ili poslovnicu Otoka na +387 33 526 400. Naš tim će vam pomoći da dogovorite termin.'],
  ['Gdje se nalaze vaše poslovnice?', 'Na Dobrinji II, u ulici Mustafe Kamerića 10, i na Otoci, u ulici Gradačačka 29a, u Sarajevu.'],
  ['Koje je radno vrijeme poliklinike?', 'Ponedjeljak–petak: 09:00–19:00. Subota: 09:00–17:00 na Dobrinji. Poslovnica Otoka ne radi subotom. Termin i radno vrijeme provjerite telefonom.'],
  ['Šta ponijeti na prvi pregled?', 'Prilikom zakazivanja pitajte naš tim o pripremi za vaš pregled i potrebnoj medicinskoj dokumentaciji.'],
  ['Gdje mogu pogledati cijene usluga?', 'Cjenovnik je dostupan na službenoj stranici drgezo.ba/cjenovnik. Za informacije o konkretnoj usluzi pozovite polikliniku.'],
];

function Button({children, href='#zakazivanje', variant='dark', icon='plus'}: {children:ReactNode; href?:string; variant?:'dark'|'light'|'outline'|'ghost'; icon?:'plus'|'arrow'|'phone'}) {
  const Icon = icon==='plus'?Plus:icon==='phone'?Phone:ArrowUpRight;
  return <a className={`button button-${variant}`} href={href}><Icon size={14} strokeWidth={1.8}/><span>{children}</span></a>;
}
function MapLink({address, children}: {address:string; children:ReactNode}) {
  return <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Poliklinika Dr Gezo '+address+' Sarajevo')}`} target="_blank" rel="noreferrer">{children}<ArrowUpRight size={14}/></a>;
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const navigation = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!menu) return;
    navigation.current?.querySelector('a')?.focus();
    function close(event:globalThis.KeyboardEvent) {if (event.key==='Escape') {setMenu(false); menuButton.current?.focus();}}
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [menu]);

  return (
    <main>
      <a className="skip-link" href="#o-nama">Preskoči na sadržaj</a>

      <div className="hero" id="pocetna">
        <div className="hero-photo"><img src="/images/throat-examination.jpg" width={1800} height={1200} alt="Ljekarica tokom specijalističkog pregleda grla" fetchPriority="high"/></div>
        <div className="hero-tint" aria-hidden="true"/>
        <header className="site-header">
          <a className="brand" href="#pocetna" aria-label="Poliklinika Dr. Gežo — početna"><img src="/images/logo.png" width={250} height={63} alt="Poliklinika Dr. Gežo"/></a>
          <nav id="main-navigation" ref={navigation} className={menu?'open':''} aria-label="Glavna navigacija">
            {[['Početna','pocetna'],['Usluge','o-nama'],['Specijalnosti','usluge'],['Naš tim','tim'],['Lokacije','lokacije'],['Kontakt','zakazivanje']].map(([text, id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{text}</a>)}
          </nav>
          <a className="header-cta" href="#zakazivanje">ZAKAŽITE PREGLED</a>
          <button ref={menuButton} className="menu-toggle" aria-label={menu?'Zatvori meni':'Otvori meni'} aria-expanded={menu} aria-controls="main-navigation" onClick={() => setMenu(!menu)}>{menu?<X size={20}/>:<Menu size={20}/>}</button>
        </header>
        <section className="hero-body" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="kicker">SPECIJALISTIČKA ORL POLIKLINIKA · SARAJEVO</p>
            <h1 id="hero-title">BRIGA ZA VAŠ<br/><span className="hero-chip" aria-hidden="true"><img src="/images/otoscopy.jpg" width={1800} height={1200} alt=""/></span>SLUH, DAH<br/>I GLAS.</h1>
            <div className="actions"><Button variant="light">ZAKAŽITE PREGLED</Button><Button variant="ghost" icon="arrow" href="#tim">UPOZNAJTE NAŠ TIM</Button></div>
          </div>
          <dl className="hero-stats">
            <div><dt>Početak naše priče</dt><dd>1997.</dd></div>
            <div><dt>Adrese u Sarajevu</dt><dd>2</dd></div>
            <div><dt>Radnih dana sedmično</dt><dd>6</dd></div>
            <div><dt>Naša specijalnost</dt><dd>ORL</dd></div>
          </dl>
          <div className="hero-foot">
            <p>Za sve ono što čujete, udahnete i izgovorite. Specijalistički pregledi, dijagnostika i liječenje bolesti uha, nosa i grla — s iskustvom kojem vjerujete.</p>
            <a className="hero-scroll" href="#o-nama" aria-label="Saznajte više o poliklinici"><ArrowDown size={16}/></a>
          </div>
        </section>
      </div>

      <Carousel id="o-nama" kind="services" label="Medicinske usluge" title={<>Sve što vam treba za<br/>zdravlje uha, nosa i grla.</>} intro="Od prvog razgovora do dijagnoze i liječenja. ORL usluge u Sarajevu pružamo od 1997. godine, s pažnjom prema svakom pacijentu.">
        {services.map(service => <a key={service.title} className="service-card" href={official+service.href} target="_blank" rel="noreferrer" aria-label={`${service.title} — detalji na službenoj stranici`}>
          <img src={`/images/${service.image}`} width={800} height={533} style={{objectPosition:service.position}} alt={service.alt} loading="lazy"/>
          <div className="card-caption"><h3>{service.title}</h3><p>{service.copy}</p></div>
        </a>)}
      </Carousel>

      <section className="section specialties" id="usluge" aria-labelledby="services-title">
        <div className="section-heading"><div className="heading-group"><h2 id="services-title">Stručna briga za<br/>svaki aspekt ORL zdravlja.</h2><p className="intro">Dijagnostika i liječenje bolesti uha, nosa i grla — jasan plan, prilagođen vašim potrebama.</p></div><div className="actions"><Button>ZAKAŽITE PREGLED</Button><Button variant="outline" icon="arrow" href={`${official}/cjenovnik`}>CJENOVNIK</Button></div></div>
        <div className="specialty-grid">{specialties.map(([name,Icon]) => <a href={`${official}/usluge/ambulantne-usluge`} key={name} target="_blank" rel="noreferrer"><span className="tile-icon"><Icon size={18} strokeWidth={1.6}/></span><span>{name}</span></a>)}</div>
      </section>

      <Carousel id="tim" kind="doctors" label="Medicinski tim" title={<>Upoznajte naš<br/>medicinski tim.</>} intro="Iskustvo, znanje i pažnja koja počinje slušanjem. Ljudi kojima povjeravate svoje ORL zdravlje.">
        {doctors.map((doctor,index) => <a key={doctor.name} className="doctor-card" href={`${official}/nas-tim/doktori`} target="_blank" rel="noreferrer" aria-label={`${doctor.name} — biografija na službenoj stranici`}>
          <img src={`/images/${doctor.image}`} width={480} height={index>=3?640:300} alt={doctor.name} style={{objectPosition:doctor.position}} loading="lazy"/>
          <span className="card-tag">{index===4?'ANESTEZIOLOGIJA':'ORL'}</span>
          <div className="card-caption"><h3>{doctor.name}</h3><p>{doctor.role}</p><span className="card-arrow" aria-hidden="true"><ArrowUpRight size={13}/></span></div>
        </a>)}
      </Carousel>

      <section className="section benefits" aria-labelledby="approach-title">
        <div className="section-heading"><div className="heading-group"><h2 id="approach-title">Zdravstvena briga<br/>koja poštuje vaše vrijeme.</h2></div></div>
        <div className="benefit-grid">{benefits.map(([name,Icon]) => <div key={name}><Icon size={16} strokeWidth={1.6}/><span>{name}</span></div>)}</div>
      </section>

      <section className="section locations" id="lokacije" aria-labelledby="locations-title">
        <div className="section-heading"><div className="heading-group"><h2 id="locations-title">Jedna posvećenost.<br/>Dvije adrese u Sarajevu.</h2><p className="intro">Odaberite lokaciju koja vam odgovara. Za termin nas kontaktirajte telefonom ili putem forme.</p></div></div>
        <div className="location-grid">
          {locations.map((location,index) => <article key={location.name}>
            <div className="location-head"><span className="tile-icon"><MapPin size={18} strokeWidth={1.6}/></span><div><h3>{location.name}</h3><p>{location.address}, Sarajevo</p></div><span className="location-index">0{index+1}</span></div>
            <p className="location-hours"><Clock size={14}/>{location.hours}</p>
            <div className="location-links"><a href={`tel:${location.tel}`} aria-label={`Pozovite ${location.name}: ${location.phone}`}>{location.phone}</a><MapLink address={location.address}>Prikaži na mapi</MapLink></div>
          </article>)}
          <article className="location-contact">
            <div className="location-head"><span className="tile-icon"><Mail size={18} strokeWidth={1.6}/></span><div><h3>Pišite nam</h3><p>Odgovaramo u radnom vremenu.</p></div></div>
            <p className="location-hours"><CalendarDays size={14}/>Zahtjev za pregled pripremite online</p>
            <div className="location-links"><a href="mailto:info@drgezo.ba">info@drgezo.ba</a><a href="#zakazivanje">Zakažite<ArrowUpRight size={14}/></a></div>
          </article>
        </div>
      </section>

      <Carousel id="prostori" kind="gallery" label="Prostori i oprema poliklinike" title={<>Prostor osmišljen<br/>za vašu udobnost.</>} intro="Upoznajte naše ordinacije i opremu za ORL preglede i dijagnostiku.">
        {gallery.flatMap((item,index) => {
          const card = <a className="gallery-card" key={item.image} href={`${official}/foto-galerija`} target="_blank" rel="noreferrer" aria-label={`${item.title} — foto galerija`}><img src={`/images/${item.image}`} width={800} height={533} style={{objectPosition:item.position}} alt={item.title} loading="lazy"/></a>;
          return index===1 ? [<div className="gallery-note" key="note"><p>Savremena<br/>ORL oprema</p></div>, card] : [card];
        })}
      </Carousel>

      <Appointment/>

      <section className="section faq" aria-labelledby="faq-title">
        <div className="faq-intro"><h2 id="faq-title">Česta pitanja</h2><p className="intro">Trebate dodatne informacije? Pozovite nas ili pišite — rado ćemo vam pomoći.</p><a className="text-link" href="mailto:info@drgezo.ba">info@drgezo.ba<ArrowUpRight size={14}/></a></div>
        <div className="faq-list">{faqs.map(([question,answer]) => <details key={question}><summary><span>{question}</span><ChevronDown size={16}/></summary><p>{answer}</p></details>)}</div>
      </section>

      <section className="final-cta" id="kontakt" aria-labelledby="contact-title">
        <div className="final-photo"><img src="/images/wellbeing-wide.jpg" width={1800} height={1200} alt="Žena uživa u svježem zraku u prirodi" loading="lazy"/></div>
        <div className="final-inner">
          <div className="final-copy"><h2 id="contact-title">VAŠE ZDRAVLJE<br/>ZASLUŽUJE<br/>POSEBNU PAŽNJU.</h2><p>Prvi korak je razgovor. Javite nam se i dogovorite svoj pregled u jednoj od naših poslovnica.</p></div>
          <div className="final-actions"><Button variant="light" href="#zakazivanje">ZAKAŽITE PREGLED</Button><Button variant="ghost" icon="phone" href="tel:+38733450102">DOBRINJA · 033 450 102</Button><Button variant="ghost" icon="phone" href="tel:+38733526400">OTOKA · 033 526 400</Button></div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-wordmark" aria-hidden="true">DR. GEŽO</div>
        <div className="footer-grid">
          <div className="footer-intro"><p>Specijalistička poliklinika za zdravlje uha, nosa i grla. Iskustvo od 1997. godine, dvije adrese u Sarajevu.</p><a href="mailto:info@drgezo.ba">info@drgezo.ba</a></div>
          <div><h4>Poliklinika</h4><a href="#o-nama">Usluge</a><a href="#usluge">Specijalnosti</a><a href="#tim">Medicinski tim</a><a href="#prostori">Prostori</a><a href="#zakazivanje">Zakažite pregled</a><a href={`${official}/cjenovnik`}>Cjenovnik</a></div>
          {locations.map(location => <div key={location.name}><h4>{location.name}</h4><p>{location.address}<br/>71000 Sarajevo</p><a href={`tel:${location.tel}`}>{location.phone}</a><p>{location.hours}</p><MapLink address={location.address}>Kako do nas</MapLink></div>)}
        </div>
        <div className="footer-bottom"><span>© 2026 Poliklinika Dr. Gežo · Sarajevo</span><a href={official} target="_blank" rel="noreferrer">Službena stranica<ArrowUpRight size={12}/></a><a href="#pocetna" className="back-to-top">Nazad na vrh<ArrowUp size={12}/></a></div>
      </footer>
    </main>
  );
}
