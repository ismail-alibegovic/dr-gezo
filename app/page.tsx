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
  {image:'ent-interior.jpg', title:'ORL ordinacija', detail:'Prostor za specijalistički pregled', position:'50% 50%'},
  {image:'clinic-room.jpg', title:'ORL dijagnostika', detail:'Prostor i oprema za specijalistički pregled', position:'50% 50%'},
  {image:'reception.jpg', title:'Dobro došli', detail:'Recepcija poliklinike', position:'50% 50%'},
  {image:'microscope.jpg', title:'Preciznost u detaljima', detail:'Oprema za ORL dijagnostiku', position:'42% 45%'},
  {image:'recovery.jpg', title:'Prostor za odmor', detail:'Poliklinika Dr. Gežo', position:'50% 50%'},
];
const faqs = [
  ['Kako zakazati pregled?', 'Pozovite poslovnicu Dobrinja na +387 33 450 102 ili poslovnicu Otoka na +387 33 526 400. Naš tim će vam pomoći da dogovorite termin.'],
  ['Gdje se nalaze vaše poslovnice?', 'Na Dobrinji II, u ulici Mustafe Kamerića 10, i na Otoci, u ulici Gradačačka 29a, u Sarajevu.'],
  ['Koje je radno vrijeme poliklinike?', 'Ponedjeljak–petak: 09:00–19:00. Subota: 09:00–17:00 na Dobrinji. Poslovnica Otoka ne radi subotom. Termin i radno vrijeme provjerite telefonom.'],
  ['Šta ponijeti na prvi pregled?', 'Prilikom zakazivanja pitajte naš tim o pripremi za vaš pregled i potrebnoj medicinskoj dokumentaciji.'],
  ['Gdje mogu pogledati cijene usluga?', 'Cjenovnik je dostupan na službenoj stranici drgezo.ba/cjenovnik. Za informacije o konkretnoj usluzi pozovite polikliniku.'],
];

function Button({children, href='#zakazivanje', secondary=false}: {children:ReactNode; href?:string; secondary?:boolean}) {
  return <a className={`button${secondary?' button-secondary':''}`} href={href}>{secondary?<ArrowUpRight size={14}/>:<Plus size={14}/>}<span>{children}</span></a>;
}
function MapLink({address, children}: {address:string; children:ReactNode}) {
  return <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Poliklinika Dr Gezo '+address+' Sarajevo')}`} target="_blank" rel="noreferrer">{children}<ArrowUpRight size={15}/></a>;
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
      <div className="hero-shell" id="pocetna">
        <header>
          <a className="brand" href="#pocetna" aria-label="Poliklinika Dr. Gežo — početna"><img src="/images/logo.png" width={250} height={63} alt="Poliklinika Dr. Gežo"/></a>
          <nav id="main-navigation" ref={navigation} className={menu?'open':''} aria-label="Glavna navigacija">
            {[['Početna','pocetna'],['O nama','o-nama'],['Usluge','usluge'],['Naš tim','tim'],['Lokacije','lokacije'],['Kontakt','zakazivanje']].map(([text, id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{text}</a>)}
          </nav>
          <a className="button header-cta" href="#zakazivanje">ZAKAŽITE PREGLED<ArrowUpRight size={13}/></a>
          <button ref={menuButton} className="mobile-menu" aria-label={menu?'Zatvori meni':'Otvori meni'} aria-expanded={menu} aria-controls="main-navigation" onClick={() => setMenu(!menu)}>{menu?<X size={22}/>:<Menu size={22}/>}</button>
        </header>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-photo"><img src="/images/ent-examination.jpg" width={1800} height={1200} alt="Specijalistički pregled uha" fetchPriority="high"/></div>
          <div className="hero-wash"/>
          <div className="hero-content"><p className="eyebrow">SPECIJALISTIČKA ORL POLIKLINIKA · SARAJEVO</p><h1 id="hero-title">BRIGA ZA VAŠ<br/>SLUH, DAH<br/>I GLAS.</h1><div className="actions"><Button>ZAKAŽITE PREGLED</Button><Button secondary href="#tim">UPOZNAJTE NAŠ TIM</Button></div></div>
          <div className="hero-facts"><div><strong>1997.</strong><span>Početak naše priče</span></div><div><strong>2</strong><span>Adrese u Sarajevu</span></div><div><strong>ORL</strong><span>Naša specijalnost</span></div></div>
          <p className="hero-bottom">Za sve ono što čujete, udahnete i izgovorite.<br/>Iskustvo kojem vjerujete. Pažnja posvećena vama.</p>
          <a className="hero-scroll" href="#o-nama" aria-label="Saznajte više o poliklinici"><ArrowDown size={17}/></a>
        </section>
      </div>

      <Carousel id="o-nama" kind="services" label="Medicinske usluge" title={<>Sve što vam treba za<br/>zdravlje uha, nosa i grla.</>} intro={<>Od prvog razgovora do dijagnoze i liječenja. ORL usluge u Sarajevu<br className="desktop-break"/> pružamo od 12. septembra 1997. godine, s pažnjom prema svakom pacijentu.</>}>
        {services.map((service, index) => <a key={service.title} className="service-card" href={official+service.href} target="_blank" rel="noreferrer" aria-label={`${service.title} — detalji na službenoj stranici`}>
          <img src={`/images/${service.image}`} width={800} height={533} style={{objectPosition:service.position}} alt={service.alt} loading="lazy"/>
          <div className="service-shade"/><span className="service-tag">{String(index+1).padStart(2,'0')} / {service.category}</span>
          <div className="service-caption"><h3>{service.title}</h3><p>{service.copy}</p><span className="service-link">Saznajte više<ArrowUpRight size={17}/></span></div>
        </a>)}
      </Carousel>

      <section className="section specialties" id="usluge" aria-labelledby="services-title">
        <div className="section-heading"><div className="heading-group"><p className="eyebrow blue">USMJERENI NA ONO ŠTO JE VAŽNO</p><h2 id="services-title">Stručna briga.<br/>Za svaki aspekt ORL zdravlja.</h2><p className="intro">Dijagnostika i liječenje bolesti uha, nosa i grla.<br className="desktop-break"/> Jasan plan, prilagođen vašim potrebama.</p></div><div className="actions"><Button>ZAKAŽITE PREGLED</Button><Button secondary href={`${official}/cjenovnik`}>CJENOVNIK</Button></div></div>
        <div className="specialty-grid">{specialties.map(([name,Icon]) => <a href={`${official}/usluge/ambulantne-usluge`} key={name} target="_blank" rel="noreferrer"><span className="specialty-icon"><Icon size={23} strokeWidth={1.5}/></span><span>{name}</span><ArrowUpRight className="specialty-arrow" size={14}/></a>)}</div>
      </section>

      <Carousel id="tim" kind="doctors" label="Medicinski tim" title={<>Upoznajte<br/>naš medicinski tim.</>} intro={<>Iskustvo, znanje i pažnja koja počinje slušanjem.<br className="desktop-break"/> Ljudi kojima povjeravate svoje ORL zdravlje.</>}>
        {doctors.map((doctor,index) => <a key={doctor.name} className="doctor-card" href={`${official}/nas-tim/doktori`} target="_blank" rel="noreferrer" aria-label={`${doctor.name} — biografija na službenoj stranici`}>
          <div className="doctor-photo"><img src={`/images/${doctor.image}`} width={480} height={index>=3?640:300} alt={doctor.name} style={{objectPosition:doctor.position}} loading="lazy"/><span className="doctor-tag">{index===4?'ANESTEZIOLOGIJA':'MEDICINSKI TIM'}</span></div>
          <div className="doctor-info"><h3>{doctor.name}</h3><p>{doctor.role}</p><span>Upoznajte doktora<ArrowUpRight size={17}/></span></div>
        </a>)}
      </Carousel>

      <section className="section approach" aria-labelledby="approach-title"><div className="section-heading"><div><p className="eyebrow blue">PAŽNJA U SVAKOM KORAKU</p><h2 id="approach-title">Zdravstvena briga<br/>koja poštuje vaše vrijeme.</h2></div><p className="section-aside">Od zakazivanja do razgovora s ljekarom.<br/>Tu smo da vaš dolazak učinimo jednostavnijim.</p></div>
        <div className="benefit-grid">{benefits.map(([name,Icon]) => <div key={name}><Icon size={19} strokeWidth={1.5}/><span>{name}</span></div>)}</div>
      </section>

      <section className="section locations" id="lokacije" aria-labelledby="locations-title"><div className="section-heading"><div><p className="eyebrow blue">BLIZU VAS</p><h2 id="locations-title">Jedna posvećenost.<br/>Dvije adrese u Sarajevu.</h2></div><p className="section-aside">Odaberite lokaciju koja vam odgovara.<br/>Za termin nas kontaktirajte telefonom.</p></div>
        <div className="location-grid">{locations.map((location,index) => <article key={location.name}><div className="location-top"><span>0{index+1} / SARAJEVO</span><MapPin size={19} strokeWidth={1.3}/></div><h3>{location.name}</h3><p className="location-address">{location.address}</p><p className="location-hours"><Clock size={14}/>{location.hours}</p><div className="location-links"><a href={`tel:${location.tel}`} aria-label={`Pozovite ${location.name}: ${location.phone}`}>{location.phone}<ArrowUpRight size={21}/></a><MapLink address={location.address}>Prikaži na mapi</MapLink></div></article>)}</div>
      </section>

      <Carousel id="prostori" kind="gallery" label="Prostori i oprema poliklinike" title={<>Prostor za povjerenje.<br/>Pažnja u svakom detalju.</>} intro="Upoznajte naše ordinacije i opremu za ORL preglede i dijagnostiku.">
        {gallery.map(item => <a className="gallery-card" key={item.image} href={`${official}/foto-galerija`} target="_blank" rel="noreferrer"><div className="gallery-photo"><img src={`/images/${item.image}`} width={800} height={533} style={{objectPosition:item.position}} alt={item.title} loading="lazy"/></div><div className="gallery-caption"><h3>{item.title}</h3><span>{item.detail}</span></div></a>)}
      </Carousel>

      <Appointment/>

      <section className="section faq" aria-labelledby="faq-title"><div><p className="eyebrow blue">DOBRO JE ZNATI</p><h2 id="faq-title">Česta pitanja.</h2><p className="intro">Trebate dodatne informacije?<br/>Pozovite nas. Rado ćemo vam pomoći.</p><a className="text-link" href="mailto:info@drgezo.ba">info@drgezo.ba<ArrowUpRight size={16}/></a></div><div className="faq-list">{faqs.map(([question,answer],index) => <details key={question}><summary><span className="faq-number">0{index+1}</span><span>{question}</span><ChevronDown size={14}/></summary><p>{answer}</p></details>)}</div></section>

      <section className="final-cta" id="kontakt" aria-labelledby="contact-title"><div className="final-photo"><img src="/images/ent-consultation.jpg" width={1800} height={1200} alt="ORL pregled uha otoskopom" loading="lazy"/></div><div className="final-shade"/><div className="final-content"><p className="eyebrow">TU SMO ZA VAS</p><h2 id="contact-title">VAŠE ZDRAVLJE<br/>ZASLUŽUJE<br/>POSEBNU<br/>PAŽNJU.</h2><p>Prvi korak je razgovor.<br/>Javite nam se i dogovorite svoj pregled.</p></div><div className="final-actions"><Button href="#zakazivanje">ZAKAŽITE PREGLED</Button><Button secondary href="tel:+38733450102">POZOVITE DOBRINJU</Button><Button secondary href="tel:+38733526400">POZOVITE OTOKU</Button></div></section>

      <footer>
        <div className="footer-brand-row"><span className="footer-kicker">POLIKLINIKA DR. GEŽO · SARAJEVO</span><a className="back-to-top" href="#pocetna" aria-label="Nazad na vrh"><ArrowUp size={19}/></a></div>
        <div className="footer-wordmark" aria-label="Dr. Gežo">DR. GEŽO</div>
        <div className="footer-grid"><div className="footer-intro"><h3>Stručnost koja sluša.<br/>Briga koja traje.</h3><p>Specijalistička poliklinika za zdravlje<br/>uha, nosa i grla.</p><a className="footer-email" href="mailto:info@drgezo.ba">info@drgezo.ba<ArrowUpRight size={17}/></a></div><div className="footer-navigation"><h4>POLIKLINIKA</h4><a href="#o-nama">O nama</a><a href="#usluge">Naše usluge</a><a href="#tim">Medicinski tim</a><a href="#prostori">Prostori poliklinike</a><a href="#zakazivanje">Zakažite pregled</a><a href={`${official}/cjenovnik`}>Cjenovnik</a></div>{locations.map(location => <div className="footer-location" key={location.name}><h4>{location.name.toUpperCase()}</h4><p>{location.address}<br/>71000 Sarajevo</p><a className="footer-phone" href={`tel:${location.tel}`}>{location.phone}<ArrowUpRight size={18}/></a><MapLink address={location.address}>Kako do nas</MapLink></div>)}</div>
        <div className="footer-hours"><span><Clock size={16}/>RADNO VRIJEME</span><p>Pon–pet <strong>09:00–19:00</strong></p><p>Subota · Dobrinja <strong>09:00–17:00</strong></p><p className="footer-hours-note">Otoka ne radi subotom.</p></div>
        <div className="footer-bottom"><a href={official} target="_blank" rel="noreferrer">Službena stranica<ArrowUpRight size={12}/></a></div>
      </footer>
    </main>
  );
}
