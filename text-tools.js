const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const input=$('#textInput'),msg=$('#message'),id=document.body.dataset.tool;
let prev='';
function say(t){msg.textContent=t}
function stats(){
  const t=input.value,w=t.trim()?t.trim().split(/\s+/).length:0;
  $('#words').textContent=w;
  $('#chars').textContent=[...t].length;
  $('#noSpaces').textContent=[...t.replace(/\s/g,'')].length;
  $('#lines').textContent=t?t.split('\n').length:0;
  $('#read').textContent=(w?Math.max(1,Math.ceil(w/200)):0)+' min';
}
function apply(fn,note){prev=input.value;input.value=fn(input.value);stats();say(note)}
const acts={
 upper:()=>apply(t=>t.toUpperCase(),'Changed to UPPERCASE.'),
 lower:()=>apply(t=>t.toLowerCase(),'Changed to lowercase.'),
 title:()=>apply(t=>t.toLowerCase().replace(/(^|[\s"(\[-])(\p{L})/gu,(m,a,b)=>a+b.toUpperCase()),'Changed to Title Case.'),
 sentence:()=>apply(t=>t.toLowerCase().replace(/(^\s*|[.!?।]\s+|\n\s*)(\p{L})/gu,(m,a,b)=>a+b.toUpperCase()),'Changed to Sentence case.'),
 dupes:()=>{
  const ic=$('#ic').checked,tr=$('#tr').checked,seen=new Set();let n=0;
  const out=input.value.split('\n').filter(l=>{
    let k=tr?l.trim():l;if(ic)k=k.toLowerCase();
    if(k==='')return true;
    if(seen.has(k)){n++;return false}
    seen.add(k);return true;
  });
  apply(()=>out.join('\n'),n?'Removed '+n+' duplicate line'+(n>1?'s':'')+'.':'No duplicate lines found.');
 },
 spaces:()=>{
  const rl=$('#rl').checked;
  apply(t=>{let l=t.split('\n').map(x=>x.trim().replace(/[ \t]+/g,' '));if(rl)l=l.filter(Boolean);return l.join('\n')},'Extra spaces removed.');
 },
 copy:async()=>{
  try{await navigator.clipboard.writeText(input.value);say('Text copied.')}
  catch(e){input.select();say('Press Copy in your browser menu to copy the selected text.')}
 },
 undo:()=>{const c=input.value;input.value=prev;prev=c;stats();say('Last change undone.')},
 clear:()=>{if(input.value){prev=input.value}input.value='';stats();say('Text cleared. Use Undo to bring it back.')}
};
$$('[data-act]').forEach(b=>b.addEventListener('click',()=>acts[b.dataset.act]()));
input.addEventListener('input',stats);
$('#theme').addEventListener('click',()=>{
  const n=document.documentElement.dataset.theme==='dark'?'light':'dark';
  document.documentElement.dataset.theme=n;
  try{localStorage.setItem('theme',n)}catch(e){}
});
$('#y').textContent=new Date().getFullYear();
$('#s-words').classList.toggle('hl',id==='words');
$('#s-chars').classList.toggle('hl',id==='chars');
stats();
