const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const output='/workspace/work/appointment-review';
function futureDay(today,day){for(let n=1;n<=14;n++){const d=new Date(today+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);if(d.getUTCDay()===day)return d.toISOString().slice(0,10)}}
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:1100},permissions:['clipboard-read','clipboard-write']});
 const page=await context.newPage();const errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()!=='GET')requests.push({method:r.method(),url:r.url()})});
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://localhost:3000',{waitUntil:'networkidle'});
 assert.equal(await page.locator('.header-cta').getAttribute('href'),'#zakazivanje');await page.locator('.header-cta').click();
 const booking=page.getByRole('form',{name:'Zahtjev za zakazivanje pregleda'});
 await booking.getByRole('button',{name:'PREGLEDAJTE ZAHTJEV'}).click();
 assert.equal(await booking.locator('[aria-invalid=true]').count(),6);
 assert.equal(await page.locator('#booking-name').evaluate(e=>e===document.activeElement),true);
 await page.locator('#booking-name').fill('Testni Pacijent');await page.locator('#booking-phone').fill('+387 61 123 456');
 await page.locator('#booking-location').selectOption('otoka');await page.locator('#booking-service').selectOption('Specijalistički ORL pregled');
 const today=await page.locator('#booking-date').getAttribute('min');
 const past=new Date(today+'T12:00:00Z');past.setUTCDate(past.getUTCDate()-1);
 await page.locator('#booking-date').fill(past.toISOString().slice(0,10));await booking.getByRole('button',{name:'PREGLEDAJTE ZAHTJEV'}).click();assert.match(await page.locator('#booking-date-error').innerText(),/budući/);
 await page.locator('#booking-date').fill(futureDay(today,0));assert.match(await page.locator('#booking-date-error').innerText(),/Nedjeljom/);assert.equal(await page.locator('#booking-time').isDisabled(),true);
 await page.locator('#booking-date').fill(futureDay(today,6));await booking.getByRole('button',{name:'PREGLEDAJTE ZAHTJEV'}).click();assert.match(await page.locator('#booking-date-error').innerText(),/Otoka ne radi subotom/);
 await page.locator('#booking-location').selectOption('dobrinja');assert.equal(await page.locator('#booking-date-error').count(),0);assert.equal(await page.locator('#booking-time').isDisabled(),false);
 await page.locator('#booking-time').selectOption('Poslijepodne · 12:00–17:00');await booking.getByRole('button',{name:'PREGLEDAJTE ZAHTJEV'}).click();
 assert.equal(await page.getByRole('heading',{name:'Vaš zahtjev je spreman.'}).isVisible(),true);
 let href=await page.locator('#request-panel-booking .mail-draft-link').getAttribute('href');assert.ok(href.startsWith('mailto:info@drgezo.ba?'));assert.match(decodeURIComponent(href),/Dobrinja II/);assert.match(decodeURIComponent(href),/12:00–17:00/);assert.match(decodeURIComponent(href),/Testni Pacijent/);
 await page.locator('#request-panel-booking').getByRole('button',{name:'Kopirajte poruku'}).click();assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/Testni Pacijent/);
 await page.locator('#request-panel-booking').getByRole('button',{name:'Uredite podatke'}).click();assert.equal(await page.locator('#booking-name').inputValue(),'Testni Pacijent');
 await page.locator('#booking-location').selectOption('otoka');await page.locator('#booking-date').fill(futureDay(today,1));await page.locator('#booking-time').selectOption('Prema dogovoru');await booking.getByRole('button',{name:'PREGLEDAJTE ZAHTJEV'}).click();href=await page.locator('#request-panel-booking .mail-draft-link').getAttribute('href');assert.match(decodeURIComponent(href),/Otoka/);
 await page.getByRole('tab',{name:'Pošaljite upit',exact:true}).click();const contact=page.getByRole('form',{name:'Kontaktni upit poliklinici'});
 await contact.getByRole('button',{name:'PREGLEDAJTE PORUKU'}).click();assert.equal(await contact.locator('[aria-invalid=true]').count(),4);
 await page.locator('#contact-name').fill('Testni Korisnik');await page.locator('#contact-email').fill('pogresno');await page.locator('#contact-topic').selectOption('Informacije o uslugama');await page.locator('#contact-message').fill('Molim informacije o ORL pregledu.');await contact.getByRole('button',{name:'PREGLEDAJTE PORUKU'}).click();assert.equal(await page.locator('#contact-email').getAttribute('aria-invalid'),'true');
 await page.locator('#contact-email').fill('test@example.com');await contact.getByRole('button',{name:'PREGLEDAJTE PORUKU'}).click();href=await page.locator('#request-panel-contact .mail-draft-link').getAttribute('href');assert.match(decodeURIComponent(href),/Molim informacije o ORL pregledu/);assert.match(decodeURIComponent(href),/test@example.com/);
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:undefined,configurable:true}));await page.locator('#request-panel-contact').getByRole('button',{name:'Kopirajte poruku'}).click();assert.equal(await page.locator('#contact-prepared').isVisible(),true);assert.equal(await page.locator('#contact-prepared').evaluate(e=>e.selectionEnd-e.selectionStart===e.value.length),true);
 await page.getByRole('tab',{name:'Pošaljite upit',exact:true}).focus();await page.keyboard.press('Home');assert.equal(await page.getByRole('tab',{name:'Zakažite pregled',exact:true}).getAttribute('aria-selected'),'true');await page.keyboard.press('End');assert.equal(await page.getByRole('tab',{name:'Pošaljite upit',exact:true}).getAttribute('aria-selected'),'true');
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);console.log('Forms: required fields, phone/email validation, past dates, Sunday closure, Otoka Saturday closure, Dobrinja Saturday hours, review/edit, mail drafts, copy/fallback and keyboard tabs passed. No messages sent.');
 await context.close();
 const results=[];
 for(const width of [320,390,768,1024,1440]){
  const p=await browser.newPage({viewport:{width,height:1100},hasTouch:width<641,isMobile:width<641});await p.emulateMedia({reducedMotion:'reduce'});await p.goto('http://localhost:3000',{waitUntil:'networkidle'});await p.evaluate(async()=>{for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));await document.fonts.ready});
  const layout=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,clipped:[...document.querySelectorAll('#zakazivanje h2,#zakazivanje h3,#zakazivanje p,#zakazivanje label')].filter(e=>e.clientWidth&&e.scrollWidth>e.clientWidth+2).map(e=>e.textContent),broken:[...document.images].filter(i=>!i.naturalWidth).length}));assert.equal(layout.overflow,false);assert.deepEqual(layout.clipped,[]);assert.equal(layout.broken,0);
  if(width===1440||width===390){await p.locator('#zakazivanje').screenshot({path:`${output}/booking-${width}.png`});await p.getByRole('tab',{name:'Pošaljite upit',exact:true}).click();await p.locator('#zakazivanje').screenshot({path:`${output}/contact-${width}.png`});await p.addScriptTag({path:'/workspace/work/art-direction/axe.min.js'});const axe=await p.evaluate(async()=>{let r=await axe.run(document.querySelector('#zakazivanje'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});assert.deepEqual(axe,[]);}
  results.push({width,...layout});await p.close();
 }
 fs.writeFileSync(`${output}/verification.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
