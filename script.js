/* =====================================================
   LAMIO MELODY — V5 GLASS • script.js
   Règles : zéro alert() • zéro reload • Supabase jamais bloquant
   ===================================================== */
let currentStep = 1;
const totalSteps = 4;
let formData = {};

/* ---------- TOASTS (remplacent tous les alert) ---------- */
function toast(msg, type = 'info') {
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.setAttribute('role', 'status');
  el.innerHTML = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('is-visible'));
  setTimeout(() => { el.classList.remove('is-visible'); setTimeout(() => el.remove(), 400); }, 3800);
}

/* ---------- NAVIGATION ENTRE VUES ---------- */
function showHome() {
  document.getElementById('homePage').style.display = 'block';
  document.getElementById('formulaire').classList.remove('active');
  document.getElementById('confirmation').classList.remove('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function showFormulaire() {
  document.getElementById('homePage').style.display = 'none';
  document.getElementById('formulaire').classList.add('active');
  document.getElementById('confirmation').classList.remove('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const a = document.querySelector(`.nav-link[href="#${id}"]`);
    if (a) a.classList.add('active');
  }
}
function toggleMenu() {
  const m = document.getElementById('navMenu'), b = document.querySelector('.mobile-menu-btn');
  let o = document.querySelector('.nav-overlay');
  if (!o) { o = document.createElement('div'); o.className = 'nav-overlay'; o.onclick = toggleMenu; document.body.appendChild(o); }
  m.classList.toggle('active'); b.classList.toggle('active'); o.classList.toggle('active');
  document.body.style.overflow = m.classList.contains('active') ? 'hidden' : '';
}
document.querySelectorAll('.nav-link').forEach(i => i.addEventListener('click', () => { if (window.innerWidth <= 768) toggleMenu(); }));

/* ---------- CARTES DE CHOIX (générique) ---------- */
function bindCards(field, cb) {
  document.querySelectorAll(`[data-field="${field}"]`).forEach(card => card.addEventListener('click', function () {
    this.parentElement.querySelectorAll('.card-choice').forEach(c => c.classList.remove('selected'));
    this.classList.add('selected');
    const v = this.getAttribute('data-value');
    formData[field] = v;
    if (cb) cb(v);
  }));
}

/* MODE : libellés adaptés + aperçu */
bindCards('mode', v => {
  const label = document.getElementById('starNameLabel'), input = document.getElementById('starName');
  const L = {
    celebrer: ['Le nom à chanter *', 'Ex : Maman Justine, Coach Boris, Tatie Mado…'],
    raconter: ['Le nom de la personne (ou le tien) *', 'Ex : Jeannette, ou ton propre nom…'],
    ambiancer: ['Le nom de la star de la fête *', 'Ex : Kevin, la team Poto-Poto…'],
    promouvoir: ['Le nom de la boutique / marque *', 'Ex : Boutique SAKURA, Maquis Chez Tantine…']
  };
  label.textContent = L[v][0]; input.placeholder = L[v][1];
  updatePreview();
});
bindCards('occasion', v => {
  const f = document.getElementById('occasionAutreField');
  f.style.display = (v === 'Autre') ? 'block' : 'none';
  if (v !== 'Autre') document.getElementById('occasionAutre').value = '';
});
bindCards('style', v => {
  const f = document.getElementById('styleAutreField');
  f.style.display = (v === 'Autre') ? 'block' : 'none';
  if (v !== 'Autre') document.getElementById('styleAutre').value = '';
  updatePreview();
});
bindCards('ambiance', () => updatePreview());
bindCards('langue', () => updatePreview());
bindCards('formule', v => { updateVoiceSelection(v); updatePreview(); });

/* ---------- VOIX DYNAMIQUES ---------- */
document.querySelectorAll('.voice-card').forEach(card => card.addEventListener('click', function () {
  if (this.classList.contains('disabled')) return;
  this.parentElement.querySelectorAll('.voice-card').forEach(c => c.classList.remove('selected'));
  this.classList.add('selected');
  formData.voix = this.getAttribute('data-value');
}));
function updateVoiceSelection(f) {
  const sec = document.getElementById('voiceSection'), txt = document.getElementById('voicePromptText'), cards = document.querySelectorAll('.voice-card');
  sec.style.display = 'block';
  cards.forEach(c => c.classList.remove('selected', 'disabled'));
  formData.voix = '';
  if (f.includes('Essentielle')) {
    txt.textContent = '🎵 Essentielle : la voix masculine est choisie automatiquement.';
    cards.forEach(c => { if (c.getAttribute('data-value') === 'Masculine') { c.classList.add('selected'); formData.voix = 'Masculine'; } else c.classList.add('disabled'); });
  } else if (f.includes('Premium')) {
    txt.textContent = '🎵 Premium : choisis ta voix (masculine ou féminine) :';
    cards.forEach(c => { if (c.getAttribute('data-value') === 'Duo') c.classList.add('disabled'); });
  } else if (f.includes('Prestige')) {
    txt.textContent = '🎵 Prestige : toutes les voix sont ouvertes, choisis :';
  }
}

/* ---------- VERROU FORMULE DEPUIS LES TARIFS ---------- */
function selectTarif(t) {
  showFormulaire();
  setTimeout(() => {
    const map = { 'Essentielle': 'Essentielle - Voix Masculine (1500 FCFA)', 'Premium': 'Premium - Voix au choix (3000 FCFA)', 'Prestige': 'Prestige - Toutes voix + Duo (5000 FCFA)' };
    const v = map[t]; if (!v) return;
    formData.formule = v;
    document.querySelectorAll('#formuleGrid .card-choice').forEach(c => { c.classList.remove('selected'); if (c.getAttribute('data-value') === v) c.classList.add('selected'); });
    const sec = document.getElementById('formuleSection');
    sec.classList.add('form-section-locked');
    const label = sec.querySelector('.label');
    if (label && !label.querySelector('.locked-badge')) { const b = document.createElement('span'); b.className = 'locked-badge'; b.textContent = '🔒 Choix verrouillé'; label.appendChild(b); }
    updateVoiceSelection(v); updatePreview();
    toast(`✅ Formule <strong>${t}</strong> verrouillée. Continue !`, 'success');
  }, 300);
}

/* ---------- REMIX : "Je veux la même idée" ---------- */
document.querySelectorAll('.btn-remix').forEach(btn => btn.addEventListener('click', () => {
  const d = btn.dataset;
  showFormulaire();
  setTimeout(() => {
    const click = (f, v) => { const c = document.querySelector(`[data-field="${f}"][data-value="${v}"]`); if (c) c.click(); };
    click('mode', d.mode); click('occasion', d.occasion); click('style', d.style); click('ambiance', d.ambiance);
    const q = document.getElementById('quartier'); if (q) q.value = d.mots;
    updatePreview();
    toast('💡 Idée chargée ! Il ne te reste qu\'à donner le nom.', 'success');
  }, 350);
}));

/* ---------- ÉTAPES ---------- */
function go(n) {
  document.querySelector(`.f-step[data-step="${currentStep}"]`).classList.remove('active');
  const c = document.querySelector(`.circle[data-step="${currentStep}"]`);
  c.classList.remove('active');
  if (n > currentStep) c.classList.add('completed'); else c.classList.remove('completed');
  currentStep = n;
  document.querySelector(`.f-step[data-step="${n}"]`).classList.add('active');
  document.querySelector(`.circle[data-step="${n}"]`).classList.add('active');
  if (n === totalSteps) generateSummary();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function nextStep() { if (!validateStep()) return; if (currentStep < totalSteps) go(currentStep + 1); }
function prevStep() { if (currentStep > 1) go(currentStep - 1); }

function validateStep() {
  switch (currentStep) {
    case 1:
      if (!formData.mode) { toast('🎯 Choisis ce que ta chanson doit faire.', 'error'); return false; }
      if (!document.getElementById('starName').value.trim()) { toast('⭐ Donne le nom à chanter : c\'est la star !', 'error'); return false; }
      if (!formData.occasion) { toast('🎉 Choisis une occasion.', 'error'); return false; }
      if (formData.occasion === 'Autre' && !document.getElementById('occasionAutre').value.trim()) { toast('Précise l\'occasion.', 'error'); return false; }
      formData.starName = document.getElementById('starName').value.trim();
      return true;
    case 2:
      if (!formData.style) { toast('🎵 Choisis un style de musique.', 'error'); return false; }
      if (formData.style === 'Autre' && !document.getElementById('styleAutre').value.trim()) { toast('Précise le style.', 'error'); return false; }
      if (!formData.ambiance) { toast('🎭 Choisis une ambiance.', 'error'); return false; }
      if (!formData.langue) { toast('🗣️ Choisis la langue de la chanson.', 'error'); return false; }
      if (!formData.formule) { toast('💎 Choisis ta formule (ou retourne aux Tarifs).', 'error'); return false; }
      if (!formData.voix) { toast('🎤 Choisis un type de voix.', 'error'); return false; }
      return true;
    case 3: {
      const q = [...document.querySelectorAll('.quality-checkbox:checked')].map(c => c.value);
      formData.qualites = q;
      formData.surnom = document.getElementById('surnom').value.trim();
      formData.quartier = document.getElementById('quartier').value.trim();
      formData.histoire = document.getElementById('histoire').value.trim();
      formData.expression = document.getElementById('expression').value.trim();
      formData.message = document.getElementById('message').value.trim();
      formData.interdit = document.getElementById('interdit').value.trim();
      const ok = q.length || formData.surnom || formData.quartier || formData.histoire || formData.expression || formData.message;
      if (!ok) { toast('✨ Donne au moins un élément (qualité, surnom, quartier…) ou clique sur « Je n\'ai pas d\'idée ».', 'error'); return false; }
      return true;
    }
    case 4:
      if (!document.getElementById('clientPrenom').value.trim() || !document.getElementById('clientWhatsapp').value.trim()) { toast('📱 Ton prénom et ton WhatsApp sont obligatoires.', 'error'); return false; }
      formData.clientPrenom = document.getElementById('clientPrenom').value.trim();
      formData.clientWhatsapp = document.getElementById('clientWhatsapp').value.trim();
      return true;
  }
  return true;
}

/* ---------- APERÇU VIVANT ---------- */
const TITLES = {
  celebrer: n => `${n}, la star du jour`,
  raconter: n => `Le parcours de ${n}`,
  ambiancer: n => `C'est la fête de ${n}`,
  promouvoir: n => `${n}, l'hymne`
};
const LYRICS = {
  celebrer: n => `« ${n}, ${n} » — tout le quartier lève la voix,\n${n}, ${n}, un nom qui brille comme ça.`,
  raconter: n => `Il y a des parcours qui méritent une chanson,\ncelle de ${n}, écrite pour de bon.`,
  ambiancer: n => `Faites de la place, ${n} entre en scène,\nce soir on danse jusqu'à perdre haleine !`,
  promouvoir: n => `Chez ${n}, vous êtes les bienvenus,\nqualité et sourire, c'est le bien commun.`
};
function updatePreview() {
  const t = document.getElementById('previewTitle'), l = document.getElementById('previewLyrics'), m = document.getElementById('previewMeta');
  if (!t) return;
  const n = (document.getElementById('starName')?.value.trim()) || '';
  if (!formData.mode || !n) {
    t.textContent = 'Titre provisoire : —';
    l.textContent = 'Donne le nom et le mode pour voir un avant-goût des paroles…';
    m.textContent = '';
    return;
  }
  t.textContent = 'Titre provisoire : ' + TITLES[formData.mode](n);
  l.textContent = LYRICS[formData.mode](n);
  m.textContent = `${formData.style || 'Style ?'} • ${formData.ambiance || 'Ambiance ?'} • ${formData.langue || 'Langue ?'} • ${formName() !== '—' ? formName() : 'Formule ?'}`;
}
document.getElementById('starName')?.addEventListener('input', updatePreview);

/* ---------- INSPIRATION PAR MODE (français simple) ---------- */
const inspirationData = {
  celebrer: ['😂 Quel surnom affectueux ou drôle on lui donne ?', '🏆 De quoi est-il/elle le champion(ne) au quartier ou en famille ?', '📍 Quel quartier, quelle passion fait sa fierté ?'],
  raconter: ['📖 Quel moment de sa vie mérite d\'être chanté ?', '⭐ Quelle qualité l\'a fait tenir bon ?', '💌 Quel message tu veux qu\'il/elle retienne ?'],
  ambiancer: ['😂 Son surnom d\'ambiance ou son cri de guerre ?', '🥁 Sa danse ou son expression préférée en fête ?', '🏆 Son titre de gloire en soirée ?'],
  promouvoir: ['🏪 Qu\'est-ce qui rend ta boutique unique ?', '💬 Quelle phrase les clients disent toujours ?', '📍 Dans quel quartier te trouve-t-on ?']
};
function showInspirationQuestions() {
  const h = document.getElementById('inspirationHelper'), l = document.getElementById('inspirationQuestionsList');
  if (h.style.display === 'block') { h.style.display = 'none'; return; }
  const qs = inspirationData[formData.mode] || inspirationData.celebrer;
  l.innerHTML = qs.map(q => `<li>${q}</li>`).join('');
  h.style.display = 'block';
}

/* ---------- RÉSUMÉ ---------- */
const occ = () => formData.occasion === 'Autre' ? (document.getElementById('occasionAutre').value || 'Autre') : formData.occasion;
const sty = () => formData.style === 'Autre' ? (document.getElementById('styleAutre').value || 'Autre') : formData.style;
function formName() { return formData.formule?.includes('Essentielle') ? 'Essentielle' : formData.formule?.includes('Premium') ? 'Premium' : formData.formule?.includes('Prestige') ? 'Prestige' : '—'; }
function formPrice() { return formData.formule?.includes('1500') ? '1 500 FCFA' : formData.formule?.includes('3000') ? '3 000 FCFA' : formData.formule?.includes('5000') ? '5 000 FCFA' : ''; }
function generateSummary() {
  document.getElementById('summaryContent').innerHTML = `
    <div class="sum-grid">
      <div class="sum-item"><p class="sum-label">🎯 Mode</p><p>${formData.mode}</p></div>
      <div class="sum-item"><p class="sum-label">🌟 Nom à chanter</p><p>${formData.starName}</p></div>
      <div class="sum-item"><p class="sum-label">🎉 Occasion</p><p>${occ()}</p></div>
      <div class="sum-item"><p class="sum-label">🎵 Son</p><p>${sty()} • ${formData.ambiance}</p></div>
      <div class="sum-item"><p class="sum-label">🗣️ Langue</p><p>${formData.langue}</p></div>
      <div class="sum-item"><p class="sum-label">🎤 Voix</p><p>${formData.voix}</p></div>
      <div class="sum-item"><p class="sum-label">💎 Formule</p><p>${formName()} — ${formPrice()}</p></div>
      <div class="sum-item"><p class="sum-label">📱 Contact</p><p>${formData.clientPrenom} • ${formData.clientWhatsapp}</p></div>
    </div>
    ${formData.qualites?.length ? `<div class="sum-section"><p class="sum-label">🏆 Qualités</p><p>${formData.qualites.join(', ')}</p></div>` : ''}
    ${formData.surnom ? `<div class="sum-section"><p class="sum-label">😂 Surnom</p><p>${formData.surnom}</p></div>` : ''}
    ${formData.quartier ? `<div class="sum-section"><p class="sum-label">📍 Quartier / passion</p><p>${formData.quartier}</p></div>` : ''}
    ${formData.histoire ? `<div class="sum-section"><p class="sum-label">🗣️ Raconté en vrac</p><p>${formData.histoire}</p></div>` : ''}
    ${formData.expression ? `<div class="sum-section"><p class="sum-label">💬 Expression</p><p>${formData.expression}</p></div>` : ''}
    ${formData.message ? `<div class="sum-section"><p class="sum-label">💌 Message à glisser</p><p>${formData.message}</p></div>` : ''}
    ${formData.interdit ? `<div class="sum-section"><p class="sum-label">🚫 Ne PAS dire (secret)</p><p>${formData.interdit}</p></div>` : ''}`;
}

/* ---------- ENVOI : Supabase non bloquant + WhatsApp + anti-popup ---------- */
function submitOrder() {
  if (!validateStep()) return;
  const msg = `🎵 *COMMANDE LAMIO MELODY* 🎵\n\n` +
    `🎯 *Mode :* ${formData.mode}\n` +
    `🌟 *Nom à chanter :* ${formData.starName}\n` +
    `🎉 *Occasion :* ${occ()}\n` +
    `🎵 *Style :* ${sty()} • ${formData.ambiance}\n` +
    `🗣️ *Langue :* ${formData.langue}\n` +
    `🎤 *Voix :* ${formData.voix}\n` +
    `💎 *Formule :* ${formName()} (${formPrice()})\n\n` +
    `${formData.qualites?.length ? `🏆 *Qualités :* ${formData.qualites.join(', ')}\n` : ''}` +
    `${formData.surnom ? `😂 *Surnom :* ${formData.surnom}\n` : ''}` +
    `${formData.quartier ? `📍 *Quartier / passion :* ${formData.quartier}\n` : ''}` +
    `${formData.histoire ? `🗣️ *Raconté en vrac :* ${formData.histoire}\n` : ''}` +
    `${formData.expression ? `💬 *Expression :* ${formData.expression}\n` : ''}` +
    `${formData.message ? `💌 *Message :* ${formData.message}\n` : ''}` +
    `${formData.interdit ? `🚫 *NE PAS DIRE :* ${formData.interdit}\n` : ''}\n` +
    `👤 *Client :* ${formData.clientPrenom}\n📲 *WhatsApp :* ${formData.clientWhatsapp}\n\n` +
    `🙏 *Merci de confirmer ma commande*`;
  window.whatsappMessageBackup = msg;
  /* Supabase en arrière-plan : le client n'attend jamais */
  try {
    const sb = supabase.createClient('https://cfneuwhgmopaguemjchf.supabase.co', 'sb_publishable_a5hxJyzGt03kuCTUnkAxig_BksoIlH0');
    sb.from('orders').insert([{
      lm_voice: formData.voix, occasion: occ(), dest_prenom: formData.starName, dest_relation: formData.mode,
      style_musical: sty(), emotion: formData.ambiance, pourquoi_importante: formData.quartier || '',
      souvenir: formData.histoire || '', qualites: (formData.qualites || []).join(', '), surnom: formData.surnom || '',
      expression_frequente: formData.expression || '', phrase_integrer: formData.message || '',
      message_final: `Langue : ${formData.langue}${formData.interdit ? ' • 🚫 Ne pas dire : ' + formData.interdit : ''}`,
      lieu_important: '', date_importante: '', client_prenom: formData.clientPrenom,
      client_whatsapp: formData.clientWhatsapp, client_email: '', formule: formName(), prix: formPrice(),
      est_pour_moi: formData.mode === 'celebrer', statut: 'en_attente_validation', created_at: new Date().toISOString()
    }]).then(({ error }) => { if (error) console.log('Supabase :', error); }).catch(e => console.log('Supabase :', e));
  } catch (e) { console.log('Supabase :', e); }
  const popup = window.open(`https://wa.me/242065186967?text=${encodeURIComponent(msg)}`, '_blank');
  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    const w = document.getElementById('popupWarning'); w.style.display = 'block'; w.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    document.getElementById('popupWarning').style.display = 'none';
    document.getElementById('formulaire').classList.remove('active');
    document.getElementById('confirmation').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    localStorage.removeItem('lamioMelody_rawValues');
  }
}
function retryWhatsApp() {
  if (!window.whatsappMessageBackup) { toast('Vérifie tes champs et réessaie.', 'error'); return; }
  const popup = window.open(`https://wa.me/242065186967?text=${encodeURIComponent(window.whatsappMessageBackup)}`, '_blank');
  if (popup && !popup.closed) {
    document.getElementById('popupWarning').style.display = 'none';
    document.getElementById('formulaire').classList.remove('active');
    document.getElementById('confirmation').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else toast('Blocage persistant : autorise les popups dans ton navigateur.', 'error');
}

/* ---------- LECTEUR AUDIO ---------- */
let curAudio = null, curBtn = null;
function playAudio(src, btn, durId) {
  if (curAudio && curBtn === btn) { if (curAudio.paused) { curAudio.play(); btn.textContent = '⏸'; } else { curAudio.pause(); btn.textContent = '▶'; } return; }
  if (curAudio) { curAudio.pause(); if (curBtn) curBtn.textContent = '▶'; }
  curAudio = new Audio(src); curBtn = btn;
  curAudio.addEventListener('loadedmetadata', () => { const el = document.getElementById(durId); if (el) el.textContent = `${Math.floor(curAudio.duration / 60)}:${String(Math.floor(curAudio.duration % 60)).padStart(2, '0')}`; });
  curAudio.addEventListener('ended', () => btn.textContent = '▶');
  curAudio.addEventListener('error', () => { btn.textContent = '❌'; toast('Audio introuvable : ' + src, 'error'); });
  curAudio.play(); btn.textContent = '⏸';
}

/* ---------- COMPTEUR + SAUVEGARDE AUTO ---------- */
document.getElementById('histoire')?.addEventListener('input', function () {
  const c = this.parentElement.querySelector('.char-counter');
  if (c) c.textContent = `${this.value.length}/500`;
});
function autoSave() {
  const raw = {};
  document.querySelectorAll('#orderForm input, #orderForm textarea').forEach(i => { if (i.id && i.type !== 'checkbox') raw[i.id] = i.value; });
  localStorage.setItem('lamioMelody_rawValues', JSON.stringify(raw));
}
document.querySelectorAll('#orderForm input, #orderForm textarea').forEach(el => el.addEventListener('input', autoSave));
window.addEventListener('DOMContentLoaded', () => {
  const s = localStorage.getItem('lamioMelody_rawValues');
  if (s) { const v = JSON.parse(s); for (const [id, val] of Object.entries(v)) { const el = document.getElementById(id); if (el && val) el.value = val; } }
});