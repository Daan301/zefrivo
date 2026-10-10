import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {PRODUCTS,normalizeIndex,framePositions,keyboardIndex} from '../dist/carousel.mjs';

test('navigation wraps through all three products in both directions',()=>{
  let next=0;
  const visited=[];
  for(let n=0;n<6;n++){visited.push(PRODUCTS[next].id);next=normalizeIndex(next+1);}
  assert.deepEqual(visited,['kiwi','citrus','mango','kiwi','citrus','mango']);
  assert.equal(PRODUCTS[normalizeIndex(-1)].id,'mango');
  assert.equal(normalizeIndex(-3),0);
});

test('every selection has one central product and two distinct lateral frames',()=>{
  for(let active=0;active<3;active++){
    const positions=framePositions(active);
    assert.equal(positions.filter(x=>x==='center').length,1);
    assert.equal(positions[active],'center');
    assert.deepEqual([...positions].sort(),['center','left','right']);
    assert.equal(positions[normalizeIndex(active+1)],'right');
    assert.equal(positions[normalizeIndex(active-1)],'left');
  }
});

test('keyboard navigation supports wrapping, first/last and leaves unrelated keys alone',()=>{
  assert.equal(keyboardIndex('ArrowRight',2),0);
  assert.equal(keyboardIndex('ArrowLeft',0),2);
  assert.equal(keyboardIndex('Home',2),0);
  assert.equal(keyboardIndex('End',0),2);
  assert.equal(keyboardIndex('Tab',1),null);
  assert.equal(keyboardIndex('Enter',1),null);
});

function luminance(hex){
  const channels=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);
  return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
}
function contrast(a,b){const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
test('each product has its own description and theme with readable text contrast',()=>{
  assert.equal(new Set(PRODUCTS.map(p=>p.description)).size,3);
  assert.equal(new Set(PRODUCTS.map(p=>p.theme.scene)).size,3);
  assert.equal(new Set(PRODUCTS.map(p=>p.theme.accent)).size,3);
  for(const product of PRODUCTS){
    assert.ok(contrast('#073c28',product.theme.scene)>4.5);
    assert.ok(contrast(product.theme.accent,product.theme.scene)>4.5);
    assert.ok(contrast(product.theme.accent,'#faf8ee')>4.5);
  }
});

test('the initial HTML shows only Kiwi–Lime; lateral content is hidden by CSS',()=>{
  const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
  const css=readFileSync(new URL('../dist/styles.css',import.meta.url),'utf8');
  assert.equal((html.match(/data-position="center"/g)||[]).length,1);
  assert.equal((html.match(/class="product-frame"[^>]*aria-hidden="true"/g)||[]).length,2);
  assert.match(css,/\.product-frame:not\(\[data-position=center\]\) \.frame-content\{opacity:0;visibility:hidden\}/);
  assert.match(html,/aria-live="polite" aria-atomic="true"/);
  assert.match(css,/@media\(max-width:420px\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});

test('all local HTML and CSS assets exist and internal links point to real sections',()=>{
  const base=dirname(fileURLToPath(new URL('../dist/index.html',import.meta.url)));
  const html=readFileSync(resolve(base,'index.html'),'utf8');
  const css=readFileSync(resolve(base,'styles.css'),'utf8');
  const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
  const assets=[...html.matchAll(/(?:src|href)="([^"#][^"]*)"/g),...css.matchAll(/url\('([^']+)'\)/g)].map(m=>m[1]);
  for(const asset of assets) assert.ok(existsSync(resolve(base,asset)),asset);
  for(const [,id] of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.has(id),id);
  for(const product of PRODUCTS)assert.ok(existsSync(resolve(base,product.image)));
});
