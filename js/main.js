/* js/main.js
   Controls:
   - Navigation toggle
   - Fetching projects/data.json
   - Rendering featured & work lists
   - Project detail rendering via projects/project.html?id=slug
   - Filters
   - Lazy reveal animations (IntersectionObserver)
   - Accessibility helpers

   EDITING NOTES:
   - Add a new project to /projects/data.json. Use a unique "id" (slug).
   - Add project images to assets/images/projects/{id}/
*/

const NAV_TOGGLE_ID = 'nav-toggle';
const NAV_LIST_ID = 'nav-list';
// Use relative path so GitHub Pages works when the site is hosted in a subpath
const PROJECTS_JSON = 'projects/data.json';
const featuredGrid = document.getElementById('featured-grid');
const workGrid = document.getElementById('work-grid');

document.addEventListener('DOMContentLoaded', () => {
  setupNavToggle();
  initRevealObserver();
  // Only fetch projects when JS is available
  fetchProjects().then(projects=>{
    renderFeatured(projects);
    renderWorkGrid(projects);
    if (location.pathname.endsWith('/projects/project.html') || location.pathname.endsWith('/projects/project.html')) {
      renderProjectDetail(projects);
    }
  }).catch(err=>{
    console.error('Failed to load projects:', err);
  });
});

/* NAV TOGGLE */
function setupNavToggle(){
  const toggle = document.getElementById(NAV_TOGGLE_ID);
  const list = document.getElementById(NAV_LIST_ID);
  if(!toggle || !list) return;
  toggle.addEventListener('click', ()=>{
    const show = list.classList.toggle('show');
    toggle.setAttribute('aria-expanded', show ? 'true' : 'false');
  });
  // close menu on ESC
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') list.classList.remove('show');
  });
}

/* Fetch projects data */
async function fetchProjects(){
  const res = await fetch(PROJECTS_JSON, {cache: "no-cache"});
  if(!res.ok) throw new Error('Could not load projects/data.json');
  const data = await res.json();
  return data.projects || [];
}

/* Render Featured - picks featured: true */
function renderFeatured(projects){
  if(!featuredGrid) return;
  const featured = projects.filter(p=>p.featured).slice(0,6);
  featuredGrid.innerHTML = featured.map(renderFeaturedCard).join('');
  // Attach lazy reveals
  qsAll('.featured-grid .card').forEach(el=>el.classList.add('fade-in'));
}

/* small helper to create featured card HTML */
function renderFeaturedCard(p){
  const thumb = p.images && p.images[0] ? p.images[0] : '../assets/images/placeholder.jpg';
  return `
    <article class="card" tabindex="0" role="article" onclick="location.href='projects/project.html?id=${p.id}'" onkeypress="if(event.key==='Enter') location.href='projects/project.html?id=${p.id}'">
      <img class="thumb" loading="lazy" src="${thumb}" alt="${p.title} — image">
      <div>
        <h3>${escapeHtml(p.title)}</h3>
        <div class="meta">${escapeHtml(p.role || '')} ${p.year ? '• '+escapeHtml(p.year) : ''}</div>
        <p class="muted small">${escapeHtml((p.type || '').toUpperCase())}</p>
      </div>
    </article>
  `;
}

/* Render full work grid with filters */
function renderWorkGrid(projects){
  if(!workGrid) return;
  const container = workGrid;
  container.innerHTML = ''; // will be filled by JS cards
  // Attach filter buttons
  const filterButtons = document.querySelectorAll('.filter-button');
  filterButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      filterButtons.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter') || 'All';
      populateWorkGrid(projects, filter);
    });
  });
  populateWorkGrid(projects, 'All');
}

/* Populate the grid for a given filter */
function populateWorkGrid(projects, filter){
  const container = workGrid;
  const filtered = (filter === 'All') ? projects : projects.filter(p => (p.categories||[]).includes(filter));
  if(filtered.length === 0){
    container.innerHTML = '<p class="muted">No projects found for this category.</p>';
    return;
  }
  container.innerHTML = filtered.map(p=>renderProjectCard(p)).join('');
  // Add fade-in class for intersection observer
  qsAll('#work-grid .project-card').forEach(el=>el.classList.add('fade-in'));
}

/* Project card HTML */
function renderProjectCard(p){
  const thumb = p.images && p.images[0] ? p.images[0] : 'assets/images/placeholder.jpg';
  const categories = (p.categories || []).join(' • ');
  return `
    <a class="project-card" href="projects/project.html?id=${p.id}" aria-label="${escapeHtml(p.title)} project">
      <div class="thumb">
        <img loading="lazy" class="thumb-img" src="${thumb}" alt="${p.title} — project image" style="width:100%;height:100%;object-fit:cover;">
      </div>
      <div class="info">
        <p class="title">${escapeHtml(p.title)}</p>
        <p class="sub">${escapeHtml(p.role || '')} ${p.year ? ' • '+escapeHtml(p.year) : ''}</p>
        <p class="muted small">${escapeHtml(categories)}</p>
      </div>
    </a>
  `;
}

/* Project detail rendering (projects/project.html?id=slug) */
function renderProjectDetail(projects){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const target = document.getElementById('project-content');
  if(!target) return;
  const project = projects.find(p=>p.id===id);
  if(!project){
    target.innerHTML = `<p class="muted">Project not found. Check projects/data.json for the project id. Received id="${id}".</p>`;
    return;
  }

  // Build project HTML; only show sections if data exists
  let html = `
    <article class="project-hero">
      <div>
        <h1 class="page-heading">${escapeHtml(project.title)}</h1>
        <p class="muted">${escapeHtml(project.type || '')} ${project.year ? ' • '+escapeHtml(project.year) : ''}</p>
      </div>
      <aside class="project-meta" aria-labelledby="project-meta">
        <h2 id="project-meta" class="small">Project details</h2>
        <p><strong>Role</strong><br>${escapeHtml(project.role || '—')}</p>
        ${project.achievement ? `<p><strong>Achievement</strong><br>${escapeHtml(project.achievement)}</p>` : ''}
        ${project.event ? `<p><strong>Event</strong><br>${escapeHtml(project.event)}</p>` : ''}
      </aside>
    </article>
  `;

  // Concept / My role / Process
  if(project.concept) html += sectionHtml('CONCEPT', project.concept);
  if(project.myRole) html += sectionHtml('MY ROLE', project.myRole);
  if(project.process) html += sectionHtml('PROCESS', project.process);

  // Visuals / Gallery
  if(project.images && project.images.length){
    html += '<section class="project-section"><h3>Visuals / Gallery</h3><div class="project-gallery">';
    project.images.forEach(src=>{
      // note: images are used as-is. Replace assets/images/projects/{id}/ with real files.
      html += `<img class="gallery-img" loading="lazy" src="${src}" alt="${escapeHtml(project.title)} — visual">`;
    });
    html += '</div></section>';
  }

  // Embedded videos
  if(project.videos && project.videos.length){
    html += '<section class="project-section"><h3>Final Work</h3>';
    project.videos.forEach(v=>{
      html += `<div class="video-frame" style="margin-top:12px"><iframe src="${v}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;min-height:360px;border-radius:6px"></iframe></div>`;
    });
    html += '</section>';
  }

  // External links
  if(project.links && project.links.length){
    html += '<section class="project-section"><h3>External links</h3><ul>';
    project.links.forEach(l=>{
      html += `<li><a href="${l.url}" target="_blank" rel="noopener">${escapeHtml(l.label || l.url)}</a></li>`;
    });
    html += '</ul></section>';
  }

  // Final note
  html += `<section class="project-section muted small"><p>Replace project images, videos, and text in /projects/data.json and upload media to /assets/images/projects/${project.id}/. See README.md for complete editing instructions.</p></section>`;

  target.innerHTML = html;

  // hook reveals
  qsAll('.gallery-img').forEach(img=>img.classList.add('fade-in'));
  qsAll('.project-section').forEach(s=>s.classList.add('fade-in'));
  runRevealObserver(); // trigger observation for new elements
}

/* Helpers for project sections */
function sectionHtml(title, body){
  return `<section class="project-section"><h3>${title}</h3><div>${body}</div></section>`;
}

/* Intersection Observer for reveals */
let observer;
function initRevealObserver(){
  const opts = {threshold: 0.06};
  observer = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('is-visible');
        observer.unobserve(e.target);
      }
    });
  }, opts);
  // pre-run: find .fade-in elements
  if(document.readyState !== 'loading') runRevealObserver();
}
function runRevealObserver(){
  if(!observer) initRevealObserver();
  qsAll('.fade-in').forEach(el=>{
    observer.observe(el);
  });
}

/* Utilities */
function qsAll(sel){
  return Array.from(document.querySelectorAll(sel));
}
function escapeHtml(str){
  if(!str) return '';
  return String(str).replace(/[&<>"']/g, s=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;" }[s]));
}
