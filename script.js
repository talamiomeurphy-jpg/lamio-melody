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
        
        const autreField = document.getElementById('styleAutreField');
        if (value === 'Autre') {
            autreField.style.display = 'block';
        } else {
            autreField.style.display = 'none';
            document.getElementById('styleAutre').value = '';
        }
    });
});

// Voix (Dynamique)
document.querySelectorAll('.voice-card').forEach(card => {
    card.addEventListener('click', function() {
        if (this.classList.contains('disabled')) return;
        
        const grid = this.parentElement;
        grid.querySelectorAll('.voice-card').forEach(c => c.classList.remove('selected'));
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

// Formule
document.querySelectorAll('[data-field="formule"]').forEach(card => {
    card.addEventListener('click', function() {
        const grid = this.parentElement;
        grid.querySelectorAll('.occasion-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        formData.formule = this.getAttribute('data-value');
        updateVoiceSelection(this.getAttribute('data-value'));
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
            if (formData.style === 'Autre') {
                const styleAutre = document.getElementById('styleAutre').value.trim();
                if (!styleAutre) {
                    alert('Veuillez préciser le style musical.');
                    return false;
                }
                formData.styleDetail = styleAutre;
            }
            if (!formData.formule) {
                alert('Veuillez choisir une formule.');
                return false;
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
// GESTION DYNAMIQUE DES VOIX SELON LA FORMULE
// ==========================================
function updateVoiceSelection(formuleValue) {
    const voiceSection = document.getElementById('voiceSection');
    const voicePromptText = document.getElementById('voicePromptText');
    const voiceCards = document.querySelectorAll('.voice-card');
    
    voiceSection.style.display = 'block';
    
    voiceCards.forEach(card => {
        card.classList.remove('selected', 'disabled');
    });
    formData.voix = '';

    if (formuleValue.includes('Essentielle')) {
        voicePromptText.textContent = '🎵 Vous avez choisi la formule Essentielle. La voix masculine est sélectionnée automatiquement.';
        voiceCards.forEach(card => {
            if (card.getAttribute('data-value') === 'Masculine') {
                card.classList.add('selected');
                formData.voix = 'Masculine';
            } else {
                card.classList.add('disabled');
            }
        });
    } else if (formuleValue.includes('Premium')) {
        voicePromptText.textContent = '🎵 Vous avez choisi la formule Premium. Choisissez maintenant la voix que vous préférez pour votre chanson :';
        voiceCards.forEach(card => {
            if (card.getAttribute('data-value') === 'Duo') {
                card.classList.add('disabled');
            }
        });
    } else if (formuleValue.includes('Prestige')) {
        voicePromptText.textContent = '🎵 Vous avez choisi la formule Prestige. Choisissez maintenant le type de voix que vous préférez :';
    }
}

// ==========================================
// GÉNÉRATION DU RÉSUMÉ
// ==========================================
function generateSummary() {
    const formule = getFormuleDisplayName();
    const prix = getFormulePrice();
    
    const occasionFinale = formData.occasion === 'Autre' ? (formData.occasionDetail || 'Autre') : formData.occasion;
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

function getFormuleDisplayName() {
    if (!formData.formule) return 'Non spécifiée';
    if (formData.formule.includes('Essentielle')) return 'Essentielle';
    if (formData.formule.includes('Premium')) return 'Premium';
    if (formData.formule.includes('Prestige')) return 'Prestige';
    return formData.formule;
}

function getFormulePrice() {
    if (!formData.formule) return '';
    if (formData.formule.includes('1500')) return '1 500 FCFA';
    if (formData.formule.includes('3000')) return '3 000 FCFA';
    if (formData.formule.includes('5000')) return '5 000 FCFA';
    return '';
}

// ==========================================
// SOUMISSION DE LA COMMANDE
// ==========================================
// ==========================================
// SOUMISSION DE LA COMMANDE
// ==========================================
async function submitOrder() {
    const occasionFinale = formData.occasion === 'Autre' ? (formData.occasionDetail || 'Autre') : formData.occasion;
    const styleFinal = formData.style === 'Autre' ? (formData.styleDetail || 'Autre') : formData.style;
    const formule = getFormuleDisplayName();
    const prix = getFormulePrice();
    
    // Utiliser de vrais émojis compatibles WhatsApp
    const whatsappMessage = `🎵 *Nouvelle commande Lamio Melody* 🎵\n\n` +
        `🎉 *Occasion :* ${occasionFinale}\n` +
        `👤 *Destinataire :* ${formData.destPrenom} (${formData.destRelation})\n` +
        `🎵 *Style :* ${styleFinal}\n` +
        `🎤 *Voix :* ${formData.voix}\n` +
        `😊 *Émotion :* ${formData.emotion}\n\n` +
        `⭐ *Pourquoi important(e) :*\n${formData.pourquoiImportante}\n\n` +
        `📖 *Souvenir :*\n${formData.souvenir}\n\n` +
        `${formData.qualites && formData.qualites.length > 0 ? ` *Qualités :* ${formData.qualites.join(', ')}\n\n` : ''}` +
        `${formData.surnom ? `😂 *Surnom :* ${formData.surnom}\n\n` : ''}` +
        `${formData.expressionFrequente ? `💬 *Expression fréquente :* ${formData.expressionFrequente}\n\n` : ''}` +
        `${formData.phraseIntegrer ? `✨ *Phrase à intégrer :* ${formData.phraseIntegrer}\n\n` : ''}` +
        `💌 *Message final :*\n${formData.messageFinal}\n\n` +
        `${formData.lieuImportant ? `📍 *Lieu important :* ${formData.lieuImportant}\n` : ''}` +
        `${formData.dateImportante ? `📅 *Date importante :* ${formData.dateImportante}\n` : ''}\n` +
        ` *Client :* ${formData.clientPrenom}\n` +
        `📲 *WhatsApp :* ${formData.clientWhatsapp}\n` +
        `${formData.clientEmail ? `📧 *Email :* ${formData.clientEmail}\n` : ''}\n\n` +
        `💎 *Formule :* ${formule} (${prix})\n\n` +
        `🙏 *Merci de confirmer ma commande*`;
    
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
    
    // Rafraîchir la page après 3 secondes (comme Ctrl+F5)
    setTimeout(() => {
        window.location.reload(true);
    }, 3000);
}

// ==========================================
// SÉLECTION DE TARIF (DEPUIS LA PAGE D'ACCUEIL)
// ==========================================
function selectTarif(formule) {
    showFormulaire();
    
    setTimeout(() => {
        let formuleValue = '';
        if (formule === 'Essentielle') formuleValue = 'Essentielle - Voix Masculine (1500 FCFA)';
        else if (formule === 'Premium') formuleValue = 'Premium - Voix au choix (3000 FCFA)';
        else if (formule === 'Prestige') formuleValue = 'Prestige - Toutes voix + Duo (5000 FCFA)';
        
        if (formuleValue) {
            formData.formule = formuleValue;
            
            // Sélectionner la carte de formule
            const cards = document.querySelectorAll('#formuleGrid .occasion-card');
            cards.forEach(card => {
                card.classList.remove('selected');
                if (card.getAttribute('data-value') === formuleValue) {
                    card.classList.add('selected');
                }
            });
            
            // Verrouiller la section formule
            const formuleSection = document.getElementById('formuleSection');
            formuleSection.classList.add('form-section-locked');
            
            const label = formuleSection.querySelector('.form-label');
            if (!label.querySelector('.locked-badge')) {
                const badge = document.createElement('span');
                badge.className = 'locked-badge';
                badge.textContent = '🔒 Choix verrouillé';
                label.appendChild(badge);
            }

            // Mettre à jour les voix disponibles
            updateVoiceSelection(formuleValue);
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

    if (helperDiv.style.display === 'block') {
        helperDiv.style.display = 'none';
        return;
    }

    let occasion = formData.occasion;
    if (!occasion || occasion === 'Autre') {
        occasion = 'Anniversaire';
    }

    const questions = inspirationData[occasion] || inspirationData['Anniversaire'];
    list.innerHTML = questions.map(q => `<li>${q}</li>`).join('');

    helperDiv.style.display = 'block';
    helperDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}