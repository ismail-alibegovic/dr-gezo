const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const output='/workspace/work/ent-review';
const rails=[['o-nama','Medicinske usluge'],['tim','Medicinski tim'],['prostori','Prostori i oprema poliklinike']];

(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const report=[];
 try{
  for(const width of [320,390,640,768,1024,1440,1920]){
   const page=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1,hasTouch:width<=768,isMobile:width<=640});
   const errors=[],resources=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('response',r=>{if(r.status()>=400)resources.push({url:r.url(),status:r.status()})});
   await page.emulateMedia({reducedMotion:'reduce'});
   await page.goto('http://localhost:3000',{waitUntil:'networkidle'});
   await page.evaluate(async()=>{for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));await document.fonts.ready});
   const layout=await page.evaluate(()=>{
    const box=s=>document.querySelector(s).getBoundingClientRect();
    const logo=box('.brand'),cta=box('.header-cta'),menu=box('.mobile-menu');
    const railDimensions=[...document.querySelectorAll('.carousel-track')].map(t=>({id:t.id,heights:[...t.children].map(e=>Math.round(e.getBoundingClientRect().height)),widths:[...t.children].map(e=>Math.round(e.getBoundingClientRect().width))}));
    const clippedText=[...document.querySelectorAll('h1,h2,h3,p,.footer-wordmark')].filter(e=>!e.classList.contains('sr-only')&&e.clientWidth&&e.scrollWidth>e.clientWidth+2).map(e=>e.className||e.textContent.slice(0,70));
    return {overflow:document.documentElement.scrollWidth>innerWidth+1,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),clippedText,headerAligned:logo.right<=cta.left&&(innerWidth>900||cta.right<=menu.left+1),railDimensions,smallButtons:[...document.querySelectorAll('button')].filter(e=>{const r=e.getBoundingClientRect();return r.width&& (r.width<43||r.height<43)}).map(e=>e.getAttribute('aria-label')),font:document.fonts.check('400 16px Inter','čćšđž'),palette:[getComputedStyle(document.documentElement).getPropertyValue('--blue').trim(),getComputedStyle(document.documentElement).getPropertyValue('--cyan').trim()],robots:document.querySelector('meta[name=robots]').content};
   });
   assert.equal(layout.overflow,false,`overflow at ${width}`);assert.deepEqual(layout.broken,[]);assert.deepEqual(layout.clippedText,[]);assert.equal(layout.headerAligned,true);assert.deepEqual(layout.smallButtons,[]);assert.equal(layout.font,true);assert.deepEqual(layout.palette,['#3156a3','#42b3e5']);assert.ok(layout.robots.includes('noindex'));
   for(const rail of layout.railDimensions){assert.equal(new Set(rail.heights).size,1,`unequal card heights ${width} ${rail.id}`);assert.equal(new Set(rail.widths).size,1,`unequal card widths ${width} ${rail.id}`)}
   const carouselChecks=[];
   const session=width===390?await page.context().newCDPSession(page):null;
   for(const [id,label] of rails){
    const section=page.locator(`#${id}`),track=page.locator(`#${id}-track`);
    const previous=section.getByRole('button',{name:`Prethodno — ${label}`,exact:true});
    const next=section.getByRole('button',{name:`Sljedeće — ${label}`,exact:true});
    assert.equal(await previous.isDisabled(),true);assert.equal(await next.isDisabled(),false);
    await next.click();await page.waitForFunction(id=>document.getElementById(id+'-track').scrollLeft>5,id);
    await page.waitForFunction(id=>!document.getElementById(id).querySelectorAll('button')[0].disabled,id);assert.equal(await previous.isDisabled(),false);
    await track.focus();await track.press('End');
    await page.waitForFunction(id=>document.getElementById(id).querySelectorAll('button')[1].disabled,id);
    assert.equal(await next.isDisabled(),true);
    await track.press('Home');await page.waitForFunction(id=>document.getElementById(id).querySelectorAll('button')[0].disabled,id);
    await track.press('ArrowRight');await page.waitForFunction(id=>document.getElementById(id+'-track').scrollLeft>5,id);
    await track.press('Home');await page.waitForFunction(id=>document.getElementById(id).querySelectorAll('button')[0].disabled,id);
    let swipe='not applicable';
    if(session){
     await track.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
     const rect=await track.boundingBox();
     const startX=rect.x+rect.width*.77,y=rect.y+Math.min(rect.height*.45,160);
     await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:startX,y}]});
     for(let i=1;i<=10;i++){await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:startX-i*18,y}]});await page.waitForTimeout(18)}
     await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
     await page.waitForFunction(id=>document.getElementById(id+'-track').scrollLeft>40,id);
     assert.equal(new URL(page.url()).host,'localhost:3000');
     swipe='passed';
     await page.waitForFunction(id=>{const el=document.getElementById(id+'-track');const now=performance.now();const history=window.__swipeHistory;if(!history||history.id!==id||Math.abs(history.left-el.scrollLeft)>.5){window.__swipeHistory={id,left:el.scrollLeft,time:now};return false}return now-history.time>220},id);
     await track.focus();await track.press('Home');await page.waitForFunction(id=>document.getElementById(id).querySelectorAll('button')[0].disabled,id);
    }
    carouselChecks.push({id,buttons:'passed',endpoints:'passed',keyboard:'passed',swipe});
   }
   if(width===1440){
    await page.emulateMedia({reducedMotion:'no-preference'});
    const track=page.locator('#o-nama-track');
    await page.locator('#o-nama').getByRole('button',{name:'Sljedeće — Medicinske usluge',exact:true}).click();
    const initial=await track.evaluate(e=>({left:e.scrollLeft,maximum:e.scrollWidth-e.clientWidth}));
    assert.ok(initial.left<initial.maximum,'smooth transition should not jump immediately');
    await page.waitForFunction(()=>document.querySelector('#o-nama .arrows button:last-child').disabled);
    await page.emulateMedia({reducedMotion:'reduce'});await track.focus();await track.press('Home');
    await page.waitForFunction(()=>document.querySelector('#o-nama .arrows button:first-child').disabled);
   }
   if(width<=900){
    const button=page.getByRole('button',{name:'Otvori meni',exact:true});
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await button.click();
    assert.equal(await page.getByRole('navigation',{name:'Glavna navigacija'}).isVisible(),true);
    await page.keyboard.press('Escape');assert.equal(await button.getAttribute('aria-expanded'),'false');assert.equal(await button.evaluate(e=>e===document.activeElement),true);
   }
   await page.locator('summary').first().click();assert.notEqual(await page.locator('details').first().getAttribute('open'),null);await page.locator('summary').first().click();
   assert.deepEqual(errors,[]);assert.deepEqual(resources,[]);
   let accessibility;
   if(width===1440||width===390){
    await page.addScriptTag({path:'/workspace/work/art-direction/axe.min.js'});
    accessibility=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return {violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),photoContrastManualReview:r.incomplete.filter(i=>i.id==='color-contrast').reduce((a,i)=>a+i.nodes.length,0)}});
    assert.deepEqual(accessibility.violations,[]);
   }
   if([390,768,1440].includes(width)){
    await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo({top:0,behavior:'instant'})});await page.mouse.move(1,1);
    await page.screenshot({path:`${output}/dr-gezo-${width}px.png`,fullPage:true,animations:'disabled'});
   }
   report.push({width,...layout,carousels:carouselChecks,errors,resources,accessibility});
   console.log(JSON.stringify({width,status:'passed',carousels:carouselChecks,accessibility}));
   await page.close();
  }
  fs.writeFileSync(`${output}/verification.json`,JSON.stringify(report,null,2));
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exit(1)});
