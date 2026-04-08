const TAGS={dev:{cls:'tt-dev',label:'dev'},design:{cls:'tt-design',label:'design'},qa:{cls:'tt-qa',label:'qa'},review:{cls:'tt-review',label:'review'}};
const COLS=['todo','inprogress','done'];
const WHO=['AM','JL','SK','RN','TB'];
let tasks=JSON.parse(localStorage.getItem('tf2')||'null')||[
  {id:1,title:'Redesign navigation component',tag:'design',pri:'high',due:'2025-05-10',col:'todo',who:'JL'},
  {id:2,title:'Implement dark mode toggle',tag:'dev',pri:'med',due:'2025-05-12',col:'inprogress',who:'AM'},
  {id:3,title:'Write unit tests for auth module',tag:'qa',pri:'high',due:'2025-05-08',col:'todo',who:'SK'},
  {id:4,title:'Review pull request #47',tag:'review',pri:'low',due:'2025-05-09',col:'done',who:'RN'},
  {id:5,title:'Mobile responsive fixes',tag:'dev',pri:'med',due:'2025-05-14',col:'inprogress',who:'TB'},
  {id:6,title:'Update colour tokens',tag:'design',pri:'low',due:'2025-05-15',col:'todo',who:'JL'},
];
let nid=Math.max(...tasks.map(t=>t.id),0)+1,dragId=null;
function save(){localStorage.setItem('tf2',JSON.stringify(tasks));}
function render(){
  const q=document.getElementById('searchInput').value.toLowerCase();
  COLS.forEach(col=>{
    const zone=document.getElementById('col-'+col);
    const all=tasks.filter(t=>t.col===col);
    const show=all.filter(t=>t.title.toLowerCase().includes(q));
    document.getElementById('cnt-'+col).textContent=all.length;
    zone.innerHTML=show.length?show.map(t=>`
      <div class="task" draggable="true" data-id="${t.id}">
        <div class="task-top">
          <span class="task-tag ${TAGS[t.tag].cls}">${TAGS[t.tag].label}</span>
          <span class="task-title">${t.title}</span>
        </div>
        <div class="task-foot">
          <span class="task-dot dot-${t.pri}"></span>
          <span class="task-due">${t.due||''}</span>
          <span class="task-who">${t.who}</span>
          <button class="task-del" data-del="${t.id}">×</button>
        </div>
      </div>`).join(''):`<div class="col-hint">${q?'no match':'empty'}</div>`;
    zone.querySelectorAll('.task').forEach(el=>{
      el.addEventListener('dragstart',function(e){
        dragId=+this.dataset.id;
        e.dataTransfer.setData('text/plain',String(dragId));
        e.dataTransfer.effectAllowed='move';
        requestAnimationFrame(()=>this.classList.add('is-dragging'));
      });
      el.addEventListener('dragend',function(){
        this.classList.remove('is-dragging');
        document.querySelectorAll('.col-body').forEach(z=>z.classList.remove('drag-over'));
        dragId=null;
      });
    });
    zone.querySelectorAll('[data-del]').forEach(btn=>btn.addEventListener('click',e=>{
      e.stopPropagation();
      tasks=tasks.filter(t=>t.id!==+btn.dataset.del);
      save();render();
    }));
  });
  const total=tasks.length,done=tasks.filter(t=>t.col==='done').length;
  document.getElementById('stTotal').textContent=total;
  document.getElementById('stProg').textContent=tasks.filter(t=>t.col==='inprogress').length;
  document.getElementById('stDone').textContent=done;
  document.getElementById('stPct').textContent=total?Math.round(done/total*100)+'%':'0%';
}
function setupZones(){
  COLS.forEach(col=>{
    const z=document.getElementById('col-'+col);
    z.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='move';z.classList.add('drag-over');});
    z.addEventListener('dragleave',e=>{if(!z.contains(e.relatedTarget))z.classList.remove('drag-over');});
    z.addEventListener('drop',e=>{
      e.preventDefault();z.classList.remove('drag-over');
      const id=+(e.dataTransfer.getData('text/plain')||dragId);
      if(!id)return;
      const t=tasks.find(x=>x.id===id);
      if(t&&t.col!==col){t.col=col;save();render();}
    });
  });
}
function openModal(){document.getElementById('overlay').classList.add('open');}
function closeModal(){document.getElementById('overlay').classList.remove('open');}
function addTask(){
  const title=document.getElementById('tTitle').value.trim();
  if(!title)return;
  tasks.push({id:nid++,title,tag:document.getElementById('tTag').value,pri:document.getElementById('tPri').value,due:document.getElementById('tDue').value,col:'todo',who:WHO[Math.floor(Math.random()*WHO.length)]});
  document.getElementById('tTitle').value='';
  save();render();closeModal();
}
document.getElementById('searchInput').addEventListener('input',render);
document.getElementById('tTitle').addEventListener('keydown',e=>{if(e.key==='Enter')addTask();});
setupZones();render();