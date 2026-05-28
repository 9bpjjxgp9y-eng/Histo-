let slides = [];
let currentPresentationIndex = 0;

// Chargement sauvegarde
function loadFromStorage() {
    const saved = localStorage.getItem('journalGuerreSlides');
    if(saved) {
        slides = JSON.parse(saved);
    } else {
        // Créer 30 slides par défaut avec design vintage
        for(let i = 1; i <= 30; i++) {
            slides.push({
                titre: i === 1 ? "LA MÉDECINE AU FRONT" : 
                       (i === 2 ? "BLESSURES PAR ÉCLATS D'OBUS" :
                       (i === 3 ? "HÔPITAUX DE CAMPAGNE" :
                       (i === 4 ? "GANGRÈNE GAZEUSE" :
                       (i === 5 ? "INFIRMIÈRES VOLONTAIRES" :
                       (i === 6 ? "CHIRURGIE D'URGENCE" :
                       (i === 7 ? "ÉVACUATION DES BLESSÉS" :
                       (i === 8 ? "MUTILATIONS FACIALES" :
                       (i === 9 ? "PROTHÈSES DE GUERRE" :
                       (i === 10 ? "GAZ DE COMBAT" :
                       (i === 11 ? "AMBULANCES À CHEVAL" :
                       (i === 12 ? "MÉDECINS AU FEU" :
                       (i === 13 ? "INFECTIONS NOSOCOMIALES" :
                       (i === 14 ? "RADIOLOGIE DE CAMPAGNE" :
                       (i === 15 ? "TRANCÉES & MALADIES" :
                       (i === 16 ? "LE PANSEMENT D'URGENCE" :
                       (i === 17 ? "TRANSPORT SANITAIRE" :
                       (i === 18 ? "CROIX-ROUGE" :
                       (i === 19 ? "MORPHINE & DOULEUR" :
                       (i === 20 ? "AMPUTATIONS" :
                       (i === 21 ? "HÔPITAL DE VAL-DE-GRÂCE" :
                       (i === 22 ? "MÉDECINE ALLEMANDE" :
                       (i === 23 ? "SOINS PSYCHIATRIQUES" :
                       (i === 24 ? "POILUS BLESSÉS" :
                       (i === 25 ? "AMBULANCE AUTOCHIR" :
                       (i === 26 ? "DÉSINFECTION" :
                       (i === 27 ? "MÉTALLURGIE DES PROTHÈSES" :
                       (i === 28 ? "HOMÉOPATHIE DE GUERRE" :
                       (i === 29 ? "CIMETIÈRES MILITAIRES" :
                       "MÉMOIRE DES GUÉRISSEURS")))))))))))))))))))))))))),
                colonne1: "[Insérez votre texte sur ce sujet...]",
                colonne2: "[Deuxième colonne : anecdotes, témoignages, données médicales...]",
                imageData: null
            });
        }
    }
    renderAllSlides();
    updateCounter();
}

function renderAllSlides() {
    const container = document.getElementById('slidesContainer');
    container.innerHTML = '';
    slides.forEach((slide, idx) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'slide';
        slideDiv.id = `slide-${idx}`;
        
        // Titre
        const titre = document.createElement('div');
        titre.className = 'titre-article';
        titre.contentEditable = true;
        titre.innerText = slide.titre;
        titre.addEventListener('blur', (e) => { slides[idx].titre = e.target.innerText; saveToStorage(); });
        
        // Colonnes
        const cols = document.createElement('div');
        cols.className = 'colonnes';
        
        const col1 = document.createElement('div');
        col1.className = 'colonne';
        const textarea1 = document.createElement('textarea');
        textarea1.value = slide.colonne1;
        textarea1.addEventListener('change', (e) => { slides[idx].colonne1 = e.target.value; saveToStorage(); });
        col1.appendChild(textarea1);
        
        const col2 = document.createElement('div');
        col2.className = 'colonne';
        const textarea2 = document.createElement('textarea');
        textarea2.value = slide.colonne2;
        textarea2.addEventListener('change', (e) => { slides[idx].colonne2 = e.target.value; saveToStorage(); });
        col2.appendChild(textarea2);
        
        cols.appendChild(col1);
        cols.appendChild(col2);
        
        // Zone image
        const imgZone = document.createElement('div');
        imgZone.className = 'image-zone';
        imgZone.addEventListener('click', () => uploadImage(idx));
        if(slide.imageData) {
            const img = document.createElement('img');
            img.src = slide.imageData;
            imgZone.appendChild(img);
        } else {
            const empty = document.createElement('div');
            empty.className = 'empty-img';
            empty.innerText = '📷 Cliquer pour ajouter une photo d\'époque';
            imgZone.appendChild(empty);
        }
        
        slideDiv.appendChild(titre);
        slideDiv.appendChild(imgZone);
        slideDiv.appendChild(cols);
        container.appendChild(slideDiv);
    });
    document.getElementById('totalSlidesNum').innerText = slides.length;
}

function uploadImage(slideIdx) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if(file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                slides[slideIdx].imageData = ev.target.result;
                saveToStorage();
                renderAllSlides();
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function saveToStorage() {
    localStorage.setItem('journalGuerreSlides', JSON.stringify(slides));
}

function updateCounter() {
    const current = document.getElementById('currentSlideNum');
    const total = document.getElementById('totalSlidesNum');
    if(current && total) {
        // Scrolling pour slide visible
        const container = document.getElementById('slidesContainer');
        const slideElements = document.querySelectorAll('.slide');
        for(let i = 0; i < slideElements.length; i++) {
            const rect = slideElements[i].getBoundingClientRect();
            if(rect.top >= 0 && rect.top < window.innerHeight - 200) {
                current.innerText = i+1;
                break;
            }
        }
        total.innerText = slides.length;
    }
}

// Mode présentation avec transitions
function startPresentation() {
    const overlay = document.getElementById('presentationOverlay');
    const presentationDiv = document.getElementById('presentationSlide');
    overlay.style.display = 'block';
    currentPresentationIndex = 0;
    showPresentationSlide(currentPresentationIndex);
    
    document.addEventListener('keydown', presentationKeyHandler);
}

function presentationKeyHandler(e) {
    if(e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextPresentationSlide();
    } else if(e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        prevPresentationSlide();
    } else if(e.key === 'Escape') {
        endPresentation();
    }
}

function showPresentationSlide(index) {
    const presentationDiv = document.getElementById('presentationSlide');
    const slide = slides[index];
    const slideHTML = `
        <div class="slide-presentation">
            <div style="font-size: 48px; font-weight: bold; border-bottom: 3px solid #c8a86e; margin-bottom: 30px;">${slide.titre}</div>
            ${slide.imageData ? `<div style="text-align:center; margin:20px 0;"><img src="${slide.imageData}" style="max-width:80%; max-height:350px; border:2px solid #8b6946;"></div>` : ''}
            <div style="display:flex; gap:30px;">
                <div style="flex:1; font-size:22px; line-height:1.4;">${slide.colonne1.replace(/\n/g,'<br>')}</div>
                <div style="flex:1; font-size:22px; line-height:1.4;">${slide.colonne2.replace(/\n/g,'<br>')}</div>
            </div>
            <div style="position:fixed; bottom:20px; left:20px; color:#8b6946; font-style:italic;">Page ${index+1}/${slides.length}</div>
        </div>
    `;
    presentationDiv.innerHTML = slideHTML;
    presentationDiv.style.animation = 'none';
    presentationDiv.offsetHeight;
    presentationDiv.style.animation = 'fadeIn 0.5s';
}

function nextPresentationSlide() {
    if(currentPresentationIndex < slides.length - 1) {
        currentPresentationIndex++;
        showPresentationSlide(currentPresentationIndex);
    }
}

function prevPresentationSlide() {
    if(currentPresentationIndex > 0) {
        currentPresentationIndex--;
        showPresentationSlide(currentPresentationIndex);
    }
}

function endPresentation() {
    const overlay = document.getElementById('presentationOverlay');
    overlay.style.display = 'none';
    document.removeEventListener('keydown', presentationKeyHandler);
}

// Événements
document.getElementById('saveBtn').addEventListener('click', () => { saveToStorage(); alert('Journal sauvegardé !'); });
document.getElementById('presentationBtn').addEventListener('click', startPresentation);
document.getElementById('exitPresentation').addEventListener('click', endPresentation);
document.getElementById('prevBtn').addEventListener('click', () => { window.scrollBy(0, -700); setTimeout(updateCounter,200); });
document.getElementById('nextBtn').addEventListener('click', () => { window.scrollBy(0, 700); setTimeout(updateCounter,200); });
document.getElementById('addSlideBtn').addEventListener('click', () => {
    slides.push({
        titre: "Nouvel article",
        colonne1: "Votre texte ici...",
        colonne2: "Deuxième colonne...",
        imageData: null
    });
    renderAllSlides();
    saveToStorage();
    updateCounter();
});

window.addEventListener('scroll', updateCounter);
loadFromStorage();
