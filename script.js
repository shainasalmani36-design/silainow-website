(() => {
  const homes = [
    {id:1,title:'Sunlit 3 BHK with a garden view',locality:'Whitefield, Bengaluru',city:'Bengaluru',price:12800000,priceLabel:'₹1.28 Cr',area:'1,640 sq.ft.',beds:3,baths:2,type:'Apartment',status:'Ready to move',badge:'VERIFIED',image:'photo-1600607687939-ce8a6c25118c',seller:'Ananya Rao',sellerType:'Owner',avatar:'AR',verified:true,kind:'Buy'},
    {id:2,title:'Calm, airy home near the metro',locality:'HSR Layout, Bengaluru',city:'Bengaluru',price:9200000,priceLabel:'₹92 L',area:'1,280 sq.ft.',beds:2,baths:2,type:'Apartment',status:'Ready to move',badge:'OWNER LISTING',image:'photo-1600566753086-00f18fb6b3ea',seller:'Rahul Mehta',sellerType:'Owner',avatar:'RM',verified:true,kind:'Buy'},
    {id:3,title:'A little more room to grow',locality:'Sarjapur Road, Bengaluru',city:'Bengaluru',price:16500000,priceLabel:'₹1.65 Cr',area:'2,050 sq.ft.',beds:3,baths:3,type:'Villa',status:'Under construction',badge:'NEW PROJECT',image:'photo-1600607687920-4e2a09cf159d',seller:'Aarav Homes',sellerType:'Builder',avatar:'AH',verified:true,kind:'Buy'},
    {id:4,title:'Thoughtful 2 BHK, move-in ready',locality:'JP Nagar, Bengaluru',city:'Bengaluru',price:7800000,priceLabel:'₹78 L',area:'1,115 sq.ft.',beds:2,baths:2,type:'Apartment',status:'Ready to move',badge:'VERIFIED',image:'photo-1600047509807-ba8f99d2cdde',seller:'Kavya Nair',sellerType:'Agent',avatar:'KN',verified:true,kind:'Buy'},
    {id:5,title:'A quiet home, close to everything',locality:'Indiranagar, Bengaluru',city:'Bengaluru',price:54000,priceLabel:'₹54,000/mo',area:'1,420 sq.ft.',beds:2,baths:2,type:'Apartment',status:'Ready to move',badge:'OWNER LISTING',image:'photo-1600210492486-724fe5c67fb0',seller:'Priya Shah',sellerType:'Owner',avatar:'PS',verified:true,kind:'Rent'},
    {id:6,title:'Warm interiors with a private terrace',locality:'Koramangala, Bengaluru',city:'Bengaluru',price:82000,priceLabel:'₹82,000/mo',area:'1,850 sq.ft.',beds:3,baths:3,type:'Independent house',status:'Ready to move',badge:'VERIFIED',image:'photo-1600607687920-4e2a09cf159d',seller:'Mihir Desai',sellerType:'Agent',avatar:'MD',verified:true,kind:'Rent'},
    {id:7,title:'Modern 2 BHK beside the park',locality:'Powai, Mumbai',city:'Mumbai',price:19500000,priceLabel:'₹1.95 Cr',area:'1,210 sq.ft.',beds:2,baths:2,type:'Apartment',status:'Ready to move',badge:'VERIFIED',image:'photo-1600566753190-17f0baa2a6c3',seller:'Neha Kulkarni',sellerType:'Owner',avatar:'NK',verified:true,kind:'Buy'},
    {id:8,title:'A bright family home in a green pocket',locality:'Kondapur, Hyderabad',city:'Hyderabad',price:11200000,priceLabel:'₹1.12 Cr',area:'1,560 sq.ft.',beds:3,baths:2,type:'Apartment',status:'Ready to move',badge:'OWNER LISTING',image:'photo-1600607687939-ce8a6c25118c',seller:'Sana Khan',sellerType:'Agent',avatar:'SK',verified:true,kind:'Buy'},
    {id:9,title:'Open-plan living with a city view',locality:'Baner, Pune',city:'Pune',price:9900000,priceLabel:'₹99 L',area:'1,370 sq.ft.',beds:2,baths:2,type:'Apartment',status:'Under construction',badge:'NEW PROJECT',image:'photo-1600566753086-00f18fb6b3ea',seller:'Pinnacle Realty',sellerType:'Builder',avatar:'PR',verified:true,kind:'New Projects'}
  ];
  const $ = (selector, scope=document) => scope.querySelector(selector);
  const $$ = (selector, scope=document) => [...scope.querySelectorAll(selector)];
  const grid = $('#propertyGrid'), modal = $('#modal'), modalContent = $('#modalContent');
  let purpose = 'Buy', showingAll = false, mapMode = false, activeBedroom = 'Any', activeAvailability = 'Any', verifiedOnly = false, toastTimer;
  const saved = new Set(JSON.parse(localStorage.getItem('haven-saved') || '[]'));
  const compared = new Set();

  const imageUrl = (id, width=900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;
  const showToast = (message) => { const toast=$('#toast'); toast.textContent=message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove('show'),2600); };
  const escapeHtml = (value='') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function filteredHomes(){
    const location = $('#locationInput').value.trim().toLowerCase();
    const type = $('#typeFilter').value, budget = $('#budgetFilter').value;
    let result = homes.filter(home => {
      const locationMatch = !location || home.locality.toLowerCase().includes(location) || home.city.toLowerCase().includes(location) || (location === 'bengaluru' && home.city==='Bengaluru');
      const kindMatch = purpose === 'New Projects' ? home.badge==='NEW PROJECT' : home.kind===purpose;
      const typeMatch = type==='Any type' || home.type.toLowerCase()===type.toLowerCase();
      const budgetMatch = budget==='Any budget' || (budget==='under-1' && home.price<10000000) || (budget==='1-2' && home.price>=10000000 && home.price<=20000000) || (budget==='2-plus' && home.price>20000000);
      const bedMatch = activeBedroom==='Any' || (activeBedroom==='3' ? home.beds>=3 : home.beds===Number(activeBedroom));
      return locationMatch && kindMatch && typeMatch && budgetMatch && bedMatch && (activeAvailability==='Any' || home.status===activeAvailability) && (!verifiedOnly || home.verified);
    });
    const sort=$('#sortSelect').value;
    if(sort==='price-low') result.sort((a,b)=>a.price-b.price);
    if(sort==='price-high') result.sort((a,b)=>b.price-a.price);
    return showingAll ? result : result.slice(0,6);
  }

  function card(home){
    return `<article class="property-card" data-id="${home.id}">
      <div class="card-image"><img src="${imageUrl(home.image,900)}" alt="Interior of ${escapeHtml(home.title)}" loading="lazy"><span class="card-badge">${home.badge==='VERIFIED'?'✓ ':''}${home.badge}</span><span class="card-type">${escapeHtml(home.type)}</span><button class="save-button ${saved.has(home.id)?'saved':''}" data-save="${home.id}" aria-label="${saved.has(home.id)?'Remove from':'Add to'} shortlist">${saved.has(home.id)?'♥':'♡'}</button></div>
      <div class="card-body"><div class="card-price-row"><div><div class="card-price">${home.priceLabel}</div><div class="price-sub">${home.kind==='Rent'?'per month':'All inclusive'}</div></div><label class="compare-check"><input type="checkbox" data-compare="${home.id}" ${compared.has(home.id)?'checked':''}> Compare</label></div><h3 class="card-title">${escapeHtml(home.title)}</h3><p class="card-location">⌖ &nbsp;${escapeHtml(home.locality)}</p><div class="card-specs"><span><b>${home.beds}</b> beds</span><span><b>${home.baths}</b> baths</span><span><b>${home.area}</b></span></div><div class="card-foot"><div class="seller-info"><span class="seller-avatar">${home.avatar}</span><span class="seller-name">${escapeHtml(home.seller)}<small>${home.sellerType} · ${home.verified?'Verified':'Listed'} seller</small></span></div><button class="contact-card" data-inquire="${home.id}">Contact seller</button></div></div>
    </article>`;
  }

  function render(){
    const result=filteredHomes(); grid.innerHTML=result.map(card).join('');
    const total=homes.filter(h=> purpose==='New Projects'?h.badge==='NEW PROJECT':h.kind===purpose).length;
    $('#resultCount').textContent=result.length; $('#emptyState').hidden=result.length>0;
    $('#loadMore').parentElement.hidden=result.length===0 || result.length>=total;
    $('#mapPanel').hidden=!mapMode; $('.listing-layout').classList.toggle('map-mode',mapMode);
    $('#viewToggle').innerHTML=mapMode?'<span class="grid-symbol">▦</span><span>List view</span>':'<span class="grid-symbol">▦</span><span>Map view</span>';
    $('#viewToggle').setAttribute('aria-label',mapMode?'Switch to list view':'Switch to map view');
    $('#filterButton .filter-count').hidden=!(activeBedroom!=='Any'||activeAvailability!=='Any'||verifiedOnly);
    $('#filterButton .filter-count').textContent=(activeBedroom!=='Any'?1:0)+(activeAvailability!=='Any'?1:0)+(verifiedOnly?1:0);
    renderChips(); renderCompare();
  }
  function renderChips(){
    const chips=[]; if($('#typeFilter').value!=='Any type')chips.push(['type', $('#typeFilter').value]); if($('#budgetFilter').value!=='Any budget')chips.push(['budget',$('#budgetFilter option:checked').textContent]); if(activeBedroom!=='Any')chips.push(['bedroom',`${activeBedroom}+ bedrooms`]); if(activeAvailability!=='Any')chips.push(['availability',activeAvailability]); if(verifiedOnly)chips.push(['verified','Verified only']);
    $('#activeFilters').innerHTML=chips.map(([key,label])=>`<button class="filter-chip" data-chip="${key}">${escapeHtml(label)} <span>×</span></button>`).join('');
  }
  function renderCompare(){
    const bar=$('#compareBar'); bar.hidden=compared.size===0; $('#compareCount').textContent=compared.size;
    $('#compareThumbs').innerHTML=[...compared].map(id=>homes.find(h=>h.id===id)).filter(Boolean).map(h=>`<img src="${imageUrl(h.image,120)}" alt="${escapeHtml(h.title)}">`).join('');
  }
  function setPurpose(value){purpose=value; $$('.search-tabs button').forEach(b=>b.classList.toggle('selected',b.dataset.purpose===value)); $$('.main-nav a').forEach(a=>a.classList.toggle('active',a.textContent.trim().toLowerCase()===value.toLowerCase())); render();}
  function openModal(content){modalContent.innerHTML=content; modal.showModal();}
  function closeModal(){if(modal.open)modal.close();}

  $$('.search-tabs button').forEach(button=>button.addEventListener('click',()=>setPurpose(button.dataset.purpose)));
  $$('.main-nav a[data-mode], .footer-col a[data-mode]').forEach(link=>link.addEventListener('click',()=>setPurpose(link.dataset.mode)));
  $('#searchForm').addEventListener('submit',e=>{e.preventDefault();showingAll=true;render();$('#homes').scrollIntoView({behavior:'smooth',block:'start'});});
  $$('.quick-locations button').forEach(b=>b.addEventListener('click',()=>{$('#locationInput').value=b.dataset.location;showingAll=true;render();}));
  $$('.city-card').forEach(b=>b.addEventListener('click',()=>{$('#locationInput').value=b.dataset.city;setPurpose('Buy');showingAll=true;render();$('#homes').scrollIntoView({behavior:'smooth'});}));
  $('#typeFilter').addEventListener('change',()=>{showingAll=true;render();}); $('#budgetFilter').addEventListener('change',()=>{showingAll=true;render();}); $('#sortSelect').addEventListener('change',render);
  $('#loadMore').addEventListener('click',()=>{showingAll=true;render();});
  $('#clearFilters').addEventListener('click',()=>{$('#locationInput').value='Bengaluru';$('#typeFilter').value='Any type';$('#budgetFilter').value='Any budget';activeBedroom='Any';activeAvailability='Any';verifiedOnly=false;showingAll=false;render();});
  $('#viewToggle').addEventListener('click',()=>{mapMode=!mapMode;render();});
  $('#filterButton').addEventListener('click',()=>$('#filterModal').showModal());
  $('#applyFilters').addEventListener('click',()=>{activeBedroom=$('#bedroomFilter').value;activeAvailability=$('#availabilityFilter').value;verifiedOnly=$('#verifiedFilter').checked;showingAll=true;$('#filterModal').close();render();});
  $('#resetFilterModal').addEventListener('click',()=>{$('#bedroomFilter').value='Any';$('#availabilityFilter').value='Any';$('#verifiedFilter').checked=false;activeBedroom='Any';activeAvailability='Any';verifiedOnly=false;showingAll=true;render();});
  $('#filterModal .modal-close').addEventListener('click',()=>$('#filterModal').close());
  $('#activeFilters').addEventListener('click',e=>{const chip=e.target.closest('[data-chip]');if(!chip)return;const key=chip.dataset.chip;if(key==='type')$('#typeFilter').value='Any type';if(key==='budget')$('#budgetFilter').value='Any budget';if(key==='bedroom'){activeBedroom='Any';$('#bedroomFilter').value='Any';}if(key==='availability'){activeAvailability='Any';$('#availabilityFilter').value='Any';}if(key==='verified'){verifiedOnly=false;$('#verifiedFilter').checked=false;}render();});
  grid.addEventListener('click',e=>{
    const saveButton=e.target.closest('[data-save]'); if(saveButton){const id=Number(saveButton.dataset.save);saved.has(id)?saved.delete(id):saved.add(id);localStorage.setItem('haven-saved',JSON.stringify([...saved]));render();showToast(saved.has(id)?'Added to your shortlist':'Removed from your shortlist');return;}
    const contact=e.target.closest('[data-inquire]');if(contact){const home=homes.find(h=>h.id===Number(contact.dataset.inquire));inquiry(home);}
    const check=e.target.closest('[data-compare]');if(check){const id=Number(check.dataset.compare);if(check.checked&&compared.size>=3){check.checked=false;showToast('Compare up to 3 homes at a time');return;}check.checked?compared.add(id):compared.delete(id);renderCompare();}
  });
  $('#mapPanel').addEventListener('click',e=>{const pin=e.target.closest('[data-home]');if(pin){const home=homes.find(h=>h.id===Number(pin.dataset.home));if(home)inquiry(home);}});
  $('#clearCompare').addEventListener('click',()=>{compared.clear();render();});
  $('#compareAction').addEventListener('click',()=>{const selected=[...compared].map(id=>homes.find(h=>h.id===id)).filter(Boolean);if(selected.length<2){showToast('Choose at least 2 homes to compare');return;}openModal(`<span class="eyebrow">SIDE BY SIDE</span><h2>Compare your shortlisted homes</h2><p>Take a closer look at the details that matter.</p><div class="comparison">${selected.map(h=>`<div class="comparison-card"><img src="${imageUrl(h.image,500)}" alt=""><h3>${escapeHtml(h.title)}</h3><b>${h.priceLabel}</b><p>${escapeHtml(h.locality)}</p><small>${h.beds} beds · ${h.baths} baths · ${h.area}</small><p>${h.sellerType} · ${escapeHtml(h.seller)}</p></div>`).join('')}</div>`);});
  $('#loginBtn').addEventListener('click',login); $('#postBtn').addEventListener('click',postListing); $('#postBannerBtn').addEventListener('click',postListing); $$('.post-link').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();postListing();}));
  function inquiry(home){openModal(`<span class="eyebrow">A NOTE TO THE SELLER</span><h2>Ask about this home</h2><p>${escapeHtml(home.title)} · ${escapeHtml(home.locality)} · <b>${home.priceLabel}</b></p><form class="dialog-form" data-flow="inquiry"><label>Your name<input name="name" placeholder="e.g. Aditi Sharma" required></label><label>Mobile number<input name="phone" type="tel" pattern="[0-9 +()-]{8,16}" placeholder="10-digit mobile number" required></label><label>What would you like to know?<textarea name="message" placeholder="I'm interested in arranging a visit..." required></textarea></label><button class="button-dark">Send inquiry <span>→</span></button><small class="dialog-note">Your details are shared with this listing's seller.</small></form>`);}
  function login(){openModal(`<span class="eyebrow">WELCOME TO HAVEN</span><h2>Find your way home.</h2><p>Sign in to save your shortlist and pick up where you left off.</p><form class="dialog-form" data-flow="login"><label>Mobile number<input name="phone" type="tel" pattern="[0-9 +()-]{8,16}" placeholder="Enter your mobile number" required></label><button class="button-dark">Continue with OTP <span>→</span></button><small class="dialog-note">We'll send a one-time code to verify your number.</small></form>`);}
  function postListing(){openModal(`<span class="eyebrow">SHARE YOUR PROPERTY</span><h2>Meet your next buyer or tenant.</h2><p>Tell us a little about the property. Your listing goes live after a quick verification.</p><form class="dialog-form" data-flow="listing"><label>Your name<input name="name" placeholder="Owner or agent name" required></label><label>Mobile number<input name="phone" type="tel" pattern="[0-9 +()-]{8,16}" placeholder="10-digit mobile number" required></label><label>I am a<select name="role"><option>Owner</option><option>Agent</option><option>Builder</option></select></label><label>Listing location<input name="location" placeholder="City and neighbourhood" required></label><label>Property type<select name="type"><option>Apartment</option><option>Independent house</option><option>Villa</option><option>Plot</option></select></label><label>Listing purpose<select name="purpose"><option>For sale</option><option>For rent</option></select></label><button class="button-dark">Continue to property details <span>→</span></button><small class="dialog-note">Free to post · Secure verification · Your leads sent directly to you</small></form>`);}
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal();}); $('.modal-close').addEventListener('click',closeModal);
  modal.addEventListener('submit',e=>{const form=e.target.closest('.dialog-form');if(!form)return;e.preventDefault();if(!form.reportValidity())return;const flow=form.dataset.flow;const name=escapeHtml(new FormData(form).get('name')||'');let title='';let body='';if(flow==='inquiry'){title='Your inquiry is on its way.';body=`Thanks, ${name}. The seller will contact you to help arrange a visit.`;}else if(flow==='login'){title='Your one-time code is ready.';body='This demo shows the sign-in flow. In a live site, a secure OTP would be sent to your mobile number.';}else{title='Your listing is saved for verification.';body=`Thanks, ${name}. Add property photos and details in your seller dashboard. Our team will review the listing before it goes live.`;}modalContent.innerHTML=`<div class="success-panel"><span class="success-check">✓</span><span class="eyebrow">${flow==='listing'?'VERIFICATION IN PROGRESS':'ALL SET'}</span><h2>${title}</h2><p>${body}</p>${flow==='listing'?'<button class="button-dark" id="finishListing">Continue to dashboard <span>→</span></button>':'<button class="button-secondary" id="doneButton">Done</button>'}</div>`;$('#doneButton')?.addEventListener('click',closeModal);$('#finishListing')?.addEventListener('click',()=>{modalContent.innerHTML='<div class="success-panel"><span class="success-check">✓</span><span class="eyebrow">SELLER DASHBOARD</span><h2>One more step to go.</h2><p>Property details, photos and documents can be added in your full seller account. Your draft is ready for verification once those details are submitted.</p><button class="button-secondary" id="doneButton">Done</button></div>';$('#doneButton').addEventListener('click',closeModal);});});
  $('#newsletter').addEventListener('submit',e=>{e.preventDefault();$('#newsletterMessage').textContent='You’re on the list. Talk soon!';e.target.reset();});
  $('.detect-location').addEventListener('click',()=>showToast('Location access will be available in the full app'));
  $$('.city-arrows button').forEach(b=>b.addEventListener('click',()=>{const first=$('.city-grid');first.scrollBy({left:b.textContent.includes('→')?240:-240,behavior:'smooth'});}));
  $('.mobile-menu').addEventListener('click',e=>{const nav=$('.main-nav');nav.classList.toggle('open');e.currentTarget.textContent=nav.classList.contains('open')?'×':'☰';});
  render();
})();
