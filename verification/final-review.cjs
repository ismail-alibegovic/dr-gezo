const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const output='/workspace/work/final-review';
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const report=[];
 try {
  for(const width of [1440,390]){
   const page=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1});
   await page.emulateMedia({reducedMotion:'reduce'});
   const errors=[],failedResources=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('response',r=>{if(r.status()>=400)failedResources.push({url:r.url(),status:r.status()})});
   await page.goto('http://localhost:3000',{waitUntil:'networkidle'});
   await page.evaluate(async()=>{
    for(const img of document.images)img.loading='eager';
    await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));
    await document.fonts.ready;
   });
   const layout=await page.evaluate(()=>{
    const rect=s=>document.querySelector(s).getBoundingClientRect();
    const captionAlignment=[...document.querySelectorAll('.service-card')].map(c=>{
     const card=c.getBoundingClientRect(),title=c.querySelector('.card-overlay>div').getBoundingClientRect();
     return {bottomInset:Math.round(card.bottom-title.bottom),inside:title.bottom<=card.bottom&&title.top>=card.top};
    });
    const logo=rect('.logo'),cta=rect('.header-cta'),menu=rect('.mobile-menu');
    return {horizontalOverflow:document.documentElement.scrollWidth>innerWidth,
     brokenImages:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),
     headerAligned:logo.right<=cta.left&&(innerWidth>760||cta.right<=menu.left),
     captionAlignment,
     specialtyRows:[...document.querySelectorAll('.specialty-grid>a')].map(e=>Math.round(e.getBoundingClientRect().top)),
     robots:document.querySelector('meta[name=robots]')?.content};
   });
   assert.equal(layout.horizontalOverflow,false);assert.deepEqual(layout.brokenImages,[]);assert.equal(layout.headerAligned,true);
   assert.ok(layout.captionAlignment.every(c=>c.inside&&c.bottomInset>=12&&c.bottomInset<=22));
   assert.ok(layout.robots.includes('noindex'));
   if(width===390){
    await page.getByRole('button',{name:'Otvori meni'}).click();
    assert.equal(await page.getByRole('navigation').isVisible(),true);
    await page.getByRole('navigation').getByText('Naš tim',{exact:true}).click();
    assert.equal(await page.getByRole('navigation').isVisible(),false);
   }
   await page.locator('summary').first().click();
   assert.notEqual(await page.locator('details').first().getAttribute('open'),null);
   await page.locator('summary').first().click();
   assert.equal(await page.locator('details').first().getAttribute('open'),null);
   const slider=page.locator('.service-track');
   await page.getByRole('button',{name:'Sljedeće',exact:true}).first().click();
   await page.waitForFunction(()=>document.querySelector('.service-track').scrollLeft>50);
   await slider.evaluate(e=>e.scrollTo({left:0,behavior:'instant'}));
   await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
   assert.deepEqual(errors,[]);assert.deepEqual(failedResources,[]);
   const screenshot=`${output}/dr-gezo-${width}px.png`;
   await page.screenshot({path:screenshot,fullPage:true,animations:'disabled'});
   report.push({width,...layout,errors,failedResources,menuAndFAQ:'passed',carousel:'passed',screenshot});
   await page.close();
  }
  fs.writeFileSync(`${output}/verification.json`,JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
