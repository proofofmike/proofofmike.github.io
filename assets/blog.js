
async function fetchJSON(u){ const r = await fetch(u); return r.json(); }
async function fetchText(u){ const r = await fetch(u); return r.text(); }
function slugify(s){ return s.toLowerCase().replace(/\+/g,'plus').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
function mdToHtml(md){
  let h = md.replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>").replace(/^# (.*)$/gm,"<h1>$1</h1>").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/^- (.*)$/gm,"<li>$1</li>").replace(/\n{2,}/g,"</p><p>").replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2">$1</a>');
  h = h.replace(/(<li>.*<\/li>)/gs,"<ul>$1</ul>");
  return "<div class='post'><p>"+h+"</p></div>";
}
async function renderLatest(){ const m=await fetchJSON('/posts/posts.json'); if(!m.length) return; const md=await fetchText(m[0].source); document.getElementById('latest-post').innerHTML=mdToHtml(md); }
async function renderPostList(){
  const m=await fetchJSON('/posts/posts.json'); const box=document.getElementById('post-list'); if(!box) return;
  if(!m.length){ box.innerHTML='<p class="muted">No posts yet.</p>'; return; }
  box.innerHTML = m.map(p=>{ const link=p.source.replace('.md','.html'); const tags=(p.tags||[]).map(t=>`<a class="tag" href="/tags/${slugify(t)}.html">${t}</a>`).join(' '); return `<div class="item"><a class="btn" href="${link}">${p.title}</a> <span class="muted">${p.date}</span> ${tags}</div>`; }).join('');
}
async function renderTag(tag){
  const m=await fetchJSON('/posts/posts.json'); const box=document.getElementById('tag-list'); const hits=m.filter(p=>(p.tags||[]).map(x=>slugify(x)).includes(slugify(tag)));
  box.innerHTML = hits.map(p=>{ const link=p.source.replace('.md','.html'); return `<div class="item"><a class="btn" href="${link}">${p.title}</a> <span class="muted">${p.date}</span></div>`; }).join('') || `<p class='muted'>No posts for ${tag} yet.</p>`;
}
if(location.pathname.startsWith('/posts/') && location.pathname.endsWith('.html')){
  (async ()=>{
    const mdPath=location.pathname.replace('.html','.md'); const manifest=await fetchJSON('/posts/posts.json'); const meta=manifest.find(p=>('/posts/'+p.slug)===location.pathname || p.source.replace('.md','.html')===location.pathname); const md=await fetchText(mdPath); const body=mdToHtml(md); const title=meta?meta.title:'Post';
    const jsonld = meta ? JSON.stringify({"@context":"https://schema.org","@type":"BlogPosting","headline":meta.title,"datePublished":meta.date,"author":{"@type":"Person","name":"Mike"},"url":"https://proofofmike.com"+location.pathname}) : '';
    document.title = title + " — Proof Of Mike";
    document.body.innerHTML = `
      <div class="wrap">
        <div class="topbar">
          <header><img src="/images/bulldog.jpeg" class="avatar"><h1>Proof Of Mike</h1></header>
          <div class="rightlinks"><a href="/">Home</a><a href="/posts/">Blog</a><a href="/about.html">About</a><a href="/contact.html">Contact</a><a href="/tch/">TCH</a></div>
        </div>
        <div class="panel">${body}<div>${(meta?.tags||[]).map(t=>`<a class='tag' href='/tags/${slugify(t)}.html'>${t}</a>`).join(' ')}</div></div>
        <p class="foot">© ${new Date().getFullYear()} Proof Of Mike.</p>
      </div>
      <script type="application/ld+json">${jsonld}</script>
      <script src="https://cdn.counter.dev/script.js" data-id="523ea628-7b77-4913-83d7-01cf3417b330" data-utcoffset="-5"></script>
    `;
  })();
}
renderLatest();
