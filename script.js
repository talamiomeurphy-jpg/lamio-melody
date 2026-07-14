// ==========================================
// VARIABLES GLOBALES
// ==========================================
let currentStep = 1;
const totalSteps = 6;
let formData = {};

// ==========================================
// NAVIGATION
// ==========================================
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) activeLink.classList.add('active');
    }
}

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

// ==========================================
// GESTION DES CHOIX "AUTRE"
// ==========================================

// Occasion - Afficher/masquer le champ "Autre"
document.querySelectorAll('[data-field="occasion"]').forEach(card => {
    card.addEventListener('click', function() {
        const grid = this.parentElement;
        grid.querySelectorAll('.occasion-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        
        const value = this.getAttribute('data-value');
        formData.occasion = value;
        
        // Afficher/masquer le champ "Autre"
        const autreField = document.getElementById('occasionAutreField');
        if (value === 'Autre') {
            autreField.style.display = 'block';
        } else {
            autreField.style.display = 'none';
            document.getElementById('occasionAutre').value = '';
        }
    });
});

// Style musical - Afficher/masquer le champ "Autre"
document.querySelectorAll('[data-field="style"]').forEach(card => {
    card.addEventListener('click', function() {
        const grid = this.parentElement;
        grid.querySelectorAll('.occasion-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        
        const value = this.getAttribute('data-value');
        formData.style = value;
        
        // Afficher/masquer le champ "Autre"
        const autreField = document.getElementById('styleAutreField');
        if (value === 'Autre') {
            autreField.style.display = 'block';
        } else {
            autreField.style.display = 'none';
            document.getElementById('styleAutre').value = '';
        }
    });
});

// Voix
document.querySelectorAll('[data-field="voix"]').forEach(card => {
    card.addEventListener('click', function() {
        const grid = this.parentElement;
        grid.querySelectorAll('.occasion-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        formData.voix = this.getAttribute('data-value');
    });
});

// Émotion
document.querySelectorAll('[data-field="emotion"]').forEach(card => {
    card.addEventListener('click', function() {
        const grid = this.parentElement;
        grid.querySelectorAll('.occasion-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        formData.emotion = this.getAttribute('data-value');
    });
});

// ==========================================
// COMPTEURS DE CARACTÈRES
// ==========================================
document.querySelectorAll('.form-textarea[maxlength]').forEach(textarea => {
    textarea.addEventListener('input', function() {
        const max = this.getAttribute('maxlength');
        const counter = this.parentElement.querySelector('.char-counter');
        if (counter) {
            counter.textContent = `${this.value.length}/${max}`;
        }
    });
});

// ==========================================
// NAVIGATION ENTRE ÉTAPES
// ==========================================
function nextStep() {
    if (!validateStep()) return;
    
    if (currentStep < totalSteps) {
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`.step-circle[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`.step-circle[data-step="${currentStep}"]`).classList.add('completed');
        
        currentStep++;
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
        document.querySelector(`.step-circle[data-step="${currentStep}"]`).classList.add('active');
        
        if (currentStep === 6) {
            generateSummary();
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function prevStep() {
    if (currentStep > 1) {
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`.step-circle[data-step="${currentStep}"]`).classList.remove('active');
        
        currentStep--;
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
        document.querySelector(`.step-circle[data-step="${currentStep}"]`).classList.remove('completed');
        document.querySelector(`.step-circle[data-step="${currentStep}"]`).classList.add('active');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ==========================================
// VALIDATION DES ÉTAPES
// ==========================================
function validateStep() {
    switch(currentStep) {
        case 1:
            if (!formData.occasion) {
                alert('Veuillez sélectionner une occasion.');
                return false;
            }
            // Si "Autre" est sélectionné, vérifier que le champ est rempli
            if (formData.occasion === 'Autre') {
                const occasionAutre = document.getElementById('occasionAutre').value.trim();
                if (!occasionAutre) {
                    alert('Veuillez préciser l\'occasion.');
                    return false;
                }
                formData.occasionDetail = occasionAutre;
            }
            
            const prenom = document.getElementById('destPrenom').value.trim();
            const relation = document.getElementById('destRelation').value;
            if (!prenom) {
                alert('Veuillez entrer le prénom du destinataire.');
                return false;
            }
            if (!relation) {
                alert('Veuillez sélectionner votre relation.');
                return false;
            }
            formData.destPrenom = prenom;
            formData.destRelation = relation;
            return true;
        
        case 2:
            if (!formData.style) {
                alert('Veuillez sélectionner un style musical.');
                return false;
            }
            // Si "Autre" est sélectionné, vérifier que le champ est rempli
            if (formData.style === 'Autre') {
                const styleAutre = document.getElementById('styleAutre').value.trim();
                if (!styleAutre) {
                    alert('Veuillez préciser le style musical.');
                    return false;
                }
                formData.styleDetail = styleAutre;
            }
            
            if (!formData.voix) {
                alert('Veuillez sélectionner un type de voix.');
                return false;
            }
            if (!formData.emotion) {
                alert('Veuillez sélectionner une émotion.');
                return false;
            }
            return true;
        
        case 3:
            const pourquoi = document.getElementById('pourquoiImportante').value.trim();
            const souvenir = document.getElementById('souvenir').value.trim();
            if (!pourquoi) {
                alert('Veuillez expliquer pourquoi cette personne est importante.');
                return false;
            }
            if (!souvenir) {
                alert('Veuillez raconter un souvenir.');
                return false;
            }
            formData.pourquoiImportante = pourquoi;
            formData.souvenir = souvenir;
            return true;
        
        case 4:
            // Récupérer les qualités cochées
            const qualites = [];
            document.querySelectorAll('.quality-checkbox:checked').forEach(cb => {
                qualites.push(cb.value);
            });
            formData.qualites = qualites;
            
            formData.surnom = document.getElementById('surnom').value;
            formData.expressionFrequente = document.getElementById('expressionFrequente').value;
            formData.phraseIntegrer = document.getElementById('phraseIntegrer').value;
            return true;
        
        case 5:
            const messageFinal = document.getElementById('messageFinal').value.trim();
            if (!messageFinal) {
                alert('Veuillez entrer le message final.');
                return false;
            }
            formData.messageFinal = messageFinal;
            formData.lieuImportant = document.getElementById('lieuImportant').value;
            formData.dateImportante = document.getElementById('dateImportante').value;
            return true;
        
        case 6:
            const clientPrenom = document.getElementById('clientPrenom').value.trim();
            const clientWhatsapp = document.getElementById('clientWhatsapp').value.trim();
            if (!clientPrenom) {
                alert('Veuillez entrer votre prénom.');
                return false;
            }
            if (!clientWhatsapp) {
                alert('Veuillez entrer votre numéro WhatsApp.');
                return false;
            }
            formData.clientPrenom = clientPrenom;
            formData.clientWhatsapp = clientWhatsapp;
            formData.clientEmail = document.getElementById('clientEmail').value;
            return true;
        
        default:
            return true;
    }
}

// ==========================================
// GÉNÉRATION DU RÉSUMÉ
// ==========================================
function generateSummary() {
    const formule = getFormuleFromVoix();
    const prix = getPrixFromVoix();
    
    // Déterminer l'occasion finale
    const occasionFinale = formData.occasion === 'Autre' ? (formData.occasionDetail || 'Autre') : formData.occasion;
    
    // Déterminer le style final
    const styleFinal = formData.style === 'Autre' ? (formData.styleDetail || 'Autre') : formData.style;
    
    const summaryHTML = `
        <div class="summary-grid">
            <div class="summary-item">
                <p class="summary-label"> Occasion</p>
                <p>${occasionFinale}</p>
            </div>
            <div class="summary-item">
                <p class="summary-label">👤 Destinataire</p>
                <p>${formData.destPrenom} (${formData.destRelation})</p>
            </div>
            <div class="summary-item">
                <p class="summary-label">🎵 Style musical</p>
                <p>${styleFinal}</p>
            </div>
            <div class="summary-item">
                <p class="summary-label">🎤 Voix</p>
                <p>${formData.voix}</p>
            </div>
            <div class="summary-item">
                <p class="summary-label">😊 Émotion</p>
                <p>${formData.emotion}</p>
            </div>
            <div class="summary-item">
                <p class="summary-label">💎 Formule choisie</p>
                <p>${formule} - ${prix}</p>
            </div>
        </div>
        ${formData.pourquoiImportante ? `
        <div class="summary-section">
            <p class="summary-label">⭐ Pourquoi important(e)</p>
            <p>${formData.pourquoiImportante}</p>
        </div>
        ` : ''}
        ${formData.souvenir ? `
        <div class="summary-section">
            <p class="summary-label">📖 Souvenir</p>
            <p>${formData.souvenir}</p>
        </div>
        ` : ''}
        ${formData.qualites && formData.qualites.length > 0 ? `
        <div class="summary-section">
            <p class="summary-label">🏆 Qualités</p>
            <p>${formData.qualites.join(', ')}</p>
        </div>
        ` : ''}
        ${formData.surnom ? `
        <div class="summary-section">
            <p class="summary-label">😂 Surnom</p>
            <p>${formData.surnom}</p>
        </div>
        ` : ''}
        ${formData.expressionFrequente ? `
        <div class="summary-section">
            <p class="summary-label">🙏 Expression fréquente</p>
            <p>${formData.expressionFrequente}</p>
        </div>
        ` : ''}
        ${formData.phraseIntegrer ? `
        <div class="summary-section">
            <p class="summary-label">✨ Phrase à intégrer</p>
            <p>${formData.phraseIntegrer}</p>
        </div>
        ` : ''}
        <div class="summary-section">
            <p class="summary-label">💌 Message final</p>
            <p>${formData.messageFinal}</p>
        </div>
        ${formData.lieuImportant ? `
        <div class="summary-section">
            <p class="summary-label"> Lieu important</p>
            <p>${formData.lieuImportant}</p>
        </div>
        ` : ''}
        ${formData.dateImportante ? `
        <div class="summary-section">
            <p class="summary-label">📅 Date importante</p>
            <p>${formData.dateImportante}</p>
        </div>
        ` : ''}
        <div class="summary-section">
            <p class="summary-label"> Vos coordonnées</p>
            <p>
                <strong>Prénom :</strong> ${formData.clientPrenom}<br>
                <strong>WhatsApp :</strong> ${formData.clientWhatsapp}<br>
                ${formData.clientEmail ? `<strong>Email :</strong> ${formData.clientEmail}` : ''}
            </p>
        </div>
    `;
    
    document.getElementById('summaryContent').innerHTML = summaryHTML;
}

function getFormuleFromVoix() {
    if (formData.voix && formData.voix.includes('Masculin')) return 'Essentielle';
    if (formData.voix && formData.voix.includes('Féminin')) return 'Premium';
    if (formData.voix && formData.voix.includes('Duo')) return 'Prestige';
    return 'Non spécifiée';
}

function getPrixFromVoix() {
    if (formData.voix && formData.voix.includes('1500')) return '1 500 FCFA';
    if (formData.voix && formData.voix.includes('3000')) return '3 000 FCFA';
    if (formData.voix && formData.voix.includes('5000')) return '5 000 FCFA';
    return '';
}

// ==========================================
// SOUMISSION DE LA COMMANDE
// ==========================================
async function submitOrder() {
    // Déterminer les valeurs finales
    const occasionFinale = formData.occasion === 'Autre' ? (formData.occasionDetail || 'Autre') : formData.occasion;
    const styleFinal = formData.style === 'Autre' ? (formData.styleDetail || 'Autre') : formData.style;
    const formule = getFormuleFromVoix();
    const prix = getPrixFromVoix();
    
    // Générer le message WhatsApp
    const whatsappMessage = ` Nouvelle commande Lamio Melody\n\n` +
        `🎉 Occasion : ${occasionFinale}\n` +
        `👤 Destinataire : ${formData.destPrenom} (${formData.destRelation})\n` +
        `🎵 Style : ${styleFinal}\n` +
        `🎤 Voix : ${formData.voix}\n` +
        `😊 Émotion : ${formData.emotion}\n\n` +
        `⭐ Pourquoi important(e) :\n${formData.pourquoiImportante}\n\n` +
        `📖 Souvenir :\n${formData.souvenir}\n\n` +
        `${formData.qualites && formData.qualites.length > 0 ? ` Qualités : ${formData.qualites.join(', ')}\n\n` : ''}` +
        `${formData.surnom ? `😂 Surnom : ${formData.surnom}\n\n` : ''}` +
        `${formData.expressionFrequente ? `🙏 Expression fréquente : ${formData.expressionFrequente}\n\n` : ''}` +
        `${formData.phraseIntegrer ? `✨ Phrase à intégrer : ${formData.phraseIntegrer}\n\n` : ''}` +
        `💌 Message final :\n${formData.messageFinal}\n\n` +
        `${formData.lieuImportant ? `📍 Lieu important : ${formData.lieuImportant}\n` : ''}` +
        `${formData.dateImportante ? ` Date importante : ${formData.dateImportante}\n` : ''}\n` +
        ` Client : ${formData.clientPrenom}\n` +
        `📲 WhatsApp : ${formData.clientWhatsapp}\n` +
        `${formData.clientEmail ? `📧 Email : ${formData.clientEmail}\n` : ''}\n\n` +
        ` Formule : ${formule} (${prix})\n\n` +
        `Merci de confirmer ma commande 🙏`;
    
    // Sauvegarder dans Supabase (si configuré)
    try {
        const SUPABASE_URL = 'https://cfneuwhgmopaguemjchf.supabase.co';
        const SUPABASE_ANON_KEY = 'sb_publishable_a5hxJyzGt03kuCTUnkAxig_BksoIlH0';
        const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        const { error } = await supabaseClient.from('orders').insert([{
            lm_voice: formData.voix,
            occasion: occasionFinale,
            dest_prenom: formData.destPrenom,
            dest_relation: formData.destRelation,
            style_musical: styleFinal,
            emotion: formData.emotion,
            pourquoi_importante: formData.pourquoiImportante,
            souvenir: formData.souvenir,
            qualites: formData.qualites ? formData.qualites.join(', ') : '',
            surnom: formData.surnom,
            expression_frequente: formData.expressionFrequente,
            phrase_integrer: formData.phraseIntegrer,
            message_final: formData.messageFinal,
            lieu_important: formData.lieuImportant,
            date_importante: formData.dateImportante,
            client_prenom: formData.clientPrenom,
            client_whatsapp: formData.clientWhatsapp,
            client_email: formData.clientEmail,
            formule: formule,
            prix: prix,
            statut: 'en_attente_validation',
            created_at: new Date().toISOString()
        }]);
        
        if (error) console.error('Erreur Supabase:', error);
    } catch (e) {
        console.log('Supabase non configuré');
    }
    
    // Ouvrir WhatsApp
    window.open(`https://wa.me/242065186967?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
    
    // Afficher confirmation
    document.getElementById('formulaire').classList.remove('active');
    document.getElementById('confirmation').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// SÉLECTION DE TARIF
// ==========================================
function selectTarif(formule) {
    showFormulaire();
    
    setTimeout(() => {
        let voixValue = '';
        if (formule === 'Essentielle') voixValue = 'Masculin (Essentielle - 1500 FCFA)';
        else if (formule === 'Premium') voixValue = 'Féminin (Premium - 3000 FCFA)';
        else if (formule === 'Prestige') voixValue = 'Duo (Prestige - 5000 FCFA)';
        
        if (voixValue) {
            formData.voix = voixValue;
            const cards = document.querySelectorAll('[data-step="2"] .occasion-card');
            cards.forEach(card => {
                card.classList.remove('selected');
                if (card.getAttribute('data-value') === voixValue) {
                    card.classList.add('selected');
                }
            });
        }
    }, 300);
}

// ==========================================
// SYSTÈME D'INSPIRATION INTELLIGENT
// ==========================================
const inspirationData = {
    'Anniversaire': [
        "⭐ Pourquoi est-il/elle si important(e) pour vous aujourd'hui ?",
        "📖 Racontez votre meilleur souvenir d'anniversaire ou de moment joyeux passé ensemble.",
        "💡 Quelle est la qualité que vous admirez le plus chez lui/elle ?"
    ],
    'Amour': [
        "⭐ Qu'est-ce que cette personne a changé de beau dans votre vie ?",
        "📖 Racontez le moment précis (rencontre, premier rendez-vous) où vous avez su que c'était la bonne personne.",
        "💡 Quel est votre petit rituel ou moment de complicité préféré à deux ?"
    ],
    'Mariage': [
        "⭐ Pourquoi avez-vous choisi cette personne pour partager votre vie ?",
        "📖 Racontez une anecdote de votre rencontre, de la demande ou d'un moment fort de votre relation.",
        "💡 Quel est votre plus beau projet ou rêve d'avenir ensemble ?"
    ],
    'Fête': [
        "⭐ Pourquoi est-il/elle la personne qui met le plus de joie et d'ambiance autour de vous ?",
        "📖 Racontez votre meilleur souvenir de fête, de vacances ou de moment de détente passé ensemble.",
        "💡 Quel est son plat, sa danse ou son expression préférée quand il/elle s'amuse ?"
    ],
    'Hommage': [
        "⭐ En quoi cette personne a-t-elle marqué votre vie ou celle de votre famille de manière indélébile ?",
        "📖 Quel est le plus beau ou le plus fort souvenir que vous gardez d'elle/lui ?",
        "💡 Quelle est la meilleure leçon ou le meilleur conseil qu'il/elle vous a donné ?"
    ],
    'Réussite': [
        "⭐ Pourquoi êtes-vous si fier/fière de lui/d'elle aujourd'hui ?",
        "📖 Racontez un moment où vous l'avez vu(e) se battre, travailler dur ou surmonter une difficulté.",
        "💡 Quel est votre plus grand souhait pour la suite de son parcours ?"
    ],
    'Naissance': [
        "⭐ En quoi l'arrivée de ce bébé a-t-elle illuminé votre vie ou votre famille ?",
        "📖 Racontez le moment précis de sa naissance ou votre toute première rencontre.",
        "💡 Quel petit détail, sourire ou habitude de bébé vous attendrit le plus ?"
    ],
    'Autre': [
        "⭐ Qu'est-ce qui rend cette occasion ou cette personne si unique pour vous ?",
        "📖 Racontez l'événement ou le moment précis qui vous a donné envie d'offrir cette chanson.",
        "💡 Quel message ou quelle émotion voulez-vous absolument lui transmettre ?"
    ]
};

function showInspirationQuestions() {
    const helperDiv = document.getElementById('inspirationHelper');
    const list = document.getElementById('inspirationQuestionsList');

    // Si c'est déjà ouvert, on le ferme
    if (helperDiv.style.display === 'block') {
        helperDiv.style.display = 'none';
        return;
    }

    // Récupérer l'occasion choisie, ou utiliser une valeur par défaut
    let occasion = formData.occasion;
    if (!occasion || occasion === 'Autre') {
        occasion = 'Anniversaire'; // Fallback intelligent
    }

    // Récupérer les questions correspondantes
    const questions = inspirationData[occasion] || inspirationData['Anniversaire'];

    // Injecter les questions dans la liste
    list.innerHTML = questions.map(q => `<li>${q}</li>`).join('');

    // Afficher la boîte
    helperDiv.style.display = 'block';
    
    // Scroll doux vers la boîte pour que l'utilisateur la voie bien
    helperDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
