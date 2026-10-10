export const PRODUCTS = Object.freeze([
  Object.freeze({id:'kiwi',name:'Kiwi–Lime',stageWord:'KIWI–LIME',kicker:'VERDE. VIVACE. FRUCTAT.',description:'Gustul fructat de kiwi întâlnește nota citrică de lime. O combinație jucăușă, cu bule și multă personalitate.',image:'assets/kiwi-lime.png',theme:Object.freeze({scene:'#e9f2bc',oval:'#c3dc69',accent:'#416416',soft:'#f6f9dd'})}),
  Object.freeze({id:'citrus',name:'Citrus',stageWord:'CITRUS',kicker:'CITRICE. BULE. CULOARE.',description:'Note de lămâie, lime și grepfrut într-un gust citric plin de culoare. O aromă care aduce prospețime momentului tău.',image:'assets/citrus.png',theme:Object.freeze({scene:'#faebbd',oval:'#f4d373',accent:'#825207',soft:'#fff6da'})}),
  Object.freeze({id:'mango',name:'Mango Zero',stageWord:'MANGO ZERO',kicker:'TROPICAL. INTENS. ZEFRIVO.',description:'Gustul tropical de mango, într-o băutură cu bule și personalitate. O invitație la o pauză plină de culoare.',image:'assets/mango-zero.png',theme:Object.freeze({scene:'#f9d9c5',oval:'#f3ae80',accent:'#913617',soft:'#ffecdf'})})
]);

export function normalizeIndex(index, length=PRODUCTS.length) {
  if (!Number.isInteger(index) || !Number.isInteger(length) || length<1) throw new TypeError('Carousel indices and length must be valid integers.');
  return ((index % length) + length) % length;
}

export function framePositions(activeIndex) {
  const active=normalizeIndex(activeIndex);
  return PRODUCTS.map((_,index)=>index===active?'center':index===normalizeIndex(active+1)?'right':'left');
}

export function keyboardIndex(key, current) {
  if(key==='ArrowRight') return normalizeIndex(current+1);
  if(key==='ArrowLeft') return normalizeIndex(current-1);
  if(key==='Home') return 0;
  if(key==='End') return PRODUCTS.length-1;
  return null;
}

export function createCarousel(root, section) {
  let activeIndex=0;
  const frames=[...root.querySelectorAll('[data-product]')];
  const choices=[...root.querySelectorAll('[data-flavor-index]')];
  const name=root.querySelector('[data-flavor-name]');
  const copy=root.querySelector('[data-flavor-copy]');
  const kicker=root.querySelector('[data-flavor-kicker]');
  const stageWord=root.querySelector('[data-stage-word]');

  function select(index) {
    activeIndex=normalizeIndex(index);
    const product=PRODUCTS[activeIndex];
    const positions=framePositions(activeIndex);
    section.dataset.flavor=product.id;
    for(const [key,value] of Object.entries(product.theme)) section.style.setProperty(`--${key}`,value);
    name.textContent=product.name;
    copy.textContent=product.description;
    kicker.textContent=product.kicker;
    stageWord.textContent=product.stageWord;
    frames.forEach((frame,index)=>{
      const shown=index===activeIndex;
      frame.dataset.position=positions[index];
      frame.setAttribute('aria-hidden',String(!shown));
      frame.setAttribute('aria-label',shown?`${PRODUCTS[index].name}, sortimentul afișat`:PRODUCTS[index].name);
      frame.querySelector('img').alt=shown?`Sticlă Zefrivo ${PRODUCTS[index].name} de 500 ml`:'';
    });
    choices.forEach((choice,index)=>choice.setAttribute('aria-pressed',String(index===activeIndex)));
    return product;
  }

  root.querySelectorAll('[data-direction]').forEach(button=>button.addEventListener('click',()=>select(activeIndex+Number(button.dataset.direction))));
  choices.forEach(button=>button.addEventListener('click',()=>select(Number(button.dataset.flavorIndex))));
  root.addEventListener('keydown',event=>{
    if(event.altKey||event.ctrlKey||event.metaKey||event.shiftKey) return;
    const index=keyboardIndex(event.key,activeIndex);
    if(index!==null){event.preventDefault();select(index);}
  });

  let gesture=null;
  const stage=root.querySelector('.carousel-stage');
  stage.addEventListener('pointerdown',event=>{
    if(event.target.closest('button') || event.pointerType==='mouse') return;
    gesture={x:event.clientX,y:event.clientY,id:event.pointerId};
  });
  stage.addEventListener('pointerup',event=>{
    if(!gesture || gesture.id!==event.pointerId) return;
    const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;
    gesture=null;
    if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.3) select(activeIndex+(dx<0?1:-1));
  });
  stage.addEventListener('pointercancel',()=>{gesture=null;});
  select(0);
  return Object.freeze({select,get index(){return activeIndex;}});
}
