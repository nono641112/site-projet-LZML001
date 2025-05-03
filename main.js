let tokens = [];
let lignes = [];

window.onload = function () {
    let fileInput = document.getElementById('fileInput');
    let fileDisplayArea = document.getElementById('fileDisplayArea');

    fileInput.addEventListener('change', function (e) {
        let file = fileInput.files[0];
        let textType = new RegExp("text.*");

        if (file && file.type.match(textType)) {
            let reader = new FileReader();
            reader.onload = function (e) {
                const texte = reader.result;
                fileDisplayArea.innerText = texte;
                document.getElementById("logger").innerHTML = '<span class="infolog">Fichier chargé avec succès</span>';
                segmentation(texte);
                segmentationLignes(texte);
            };
            reader.readAsText(file);
        } else {
            fileDisplayArea.innerText = "";
            document.getElementById("logger").innerHTML = '<span class="errorlog">Type de fichier non supporté !</span>';
        }
    });
};

function segmentation(texte) {
    let delim = document.getElementById("delimID").value;
    let reg = new RegExp("[" + delim + "]+");
    tokens = texte.split(reg).filter(t => t.length > 0);
}

function segmentationLignes(texte) {
    lignes = texte.split(/\r?\n/).filter(l => l.trim().length > 0);
}

function dictionnaire() {
    if (tokens.length === 0) {
        document.getElementById("logger").innerHTML = '<span class="errorlog">Erreur : Aucun fichier chargé !</span>';
        return;
    }
    document.getElementById("logger").innerHTML = '<span class="infolog">Dictionnaire généré avec succès</span>';

    let counts = {};
    for (let token of tokens) {
        counts[token] = (counts[token] || 0) + 1;
    }

    let sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    let hapaxCount = sorted.filter(([mot, freq]) => freq === 1).length;

    let output = "<table border='1'><tr><th>Mot</th><th>Fréquence</th></tr>";
    for (let [mot, freq] of sorted) {
        output += `<tr><td>${mot}</td><td>${freq}</td></tr>`;
    }
    output += "</table>";
    output += `<p><strong>Nombre de hapax (mots n'apparaissant qu'une seule fois) :</strong> ${hapaxCount}</p>`;

    document.getElementById("page-analysis").innerHTML = output;
}

function grep() {
    if (lignes.length === 0) {
        document.getElementById("logger").innerHTML = '<span class="errorlog">Erreur : Aucun fichier chargé !</span>';
        return;
    }

    let pole = document.getElementById("poleID").value.trim();
    if (pole.length === 0) {
        document.getElementById("logger").innerHTML = '<span class="errorlog">Erreur : Aucun pôle spécifié !</span>';
        return;
    }

    document.getElementById("logger").innerHTML = '<span class="infolog">Recherche effectuée avec succès</span>';

    let reg = new RegExp("(" + pole + ")", "gi");

    let output = "<ul>";
    for (let ligne of lignes) {
        if (reg.test(ligne)) {
            let ligneColoriee = ligne.replace(reg, "<span style='color:red'>$1</span>");
            output += `<li>${ligneColoriee}</li>`;
        }
    }
    output += "</ul>";

    document.getElementById("page-analysis").innerHTML = output;
}

function hapax() {
    if (tokens.length === 0) {
        document.getElementById("logger").innerHTML = '<span class="errorlog">Erreur : Aucun fichier chargé !</span>';
        return;
    }

    let freqs = {};
    for (let mot of tokens) {
        freqs[mot] = (freqs[mot] || 0) + 1;
    }

    let hapaxList = [];
    for (let mot in freqs) {
        if (freqs[mot] === 1) {
            hapaxList.push(mot);
        }
    }

    document.getElementById("logger").innerHTML = '<span class="infolog">Liste des hapax générée avec succès</span>';

    let output = "<p><strong>Nombre de hapax :</strong> " + hapaxList.length + "</p>";
    output += "<ul>";
    for (let mot of hapaxList) {
        output += "<li>" + mot + "</li>";
    }
    output += "</ul>";

    document.getElementById("page-analysis").innerHTML = output;
}
