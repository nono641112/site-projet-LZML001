let tokens = [];

window.onload = function () {
    let fileInput = document.getElementById('fileInput');
    let fileDisplayArea = document.getElementById('fileDisplayArea');

    fileInput.addEventListener('change', function (e) {
        let file = fileInput.files[0];
        let textType = new RegExp("text.*");

        if (file.type.match(textType)) {
            var reader = new FileReader();

            reader.onload = function (e) {
                let text = reader.result;
                fileDisplayArea.innerText = text;
                segmentation(text);
                document.getElementById("logger").innerHTML = '<span class="infolog">Fichier chargé avec succès</span>';
            }

            reader.readAsText(file);
        } else {
            fileDisplayArea.innerText = "";
            document.getElementById("logger").innerHTML = '<span class="errorlog">Type de fichier non supporté !</span>';
        }
    });
};

function segmentation(text) {
    const delim = document.getElementById("delimID").value;
    const regex = new RegExp(`[${delim}]+`);
    tokens = text.split(regex).filter(t => t.length > 0);
    alert("Segmentation effectuée. Nombre de tokens : " + tokens.length);
}

function dictionnaire() {
    const freqMap = {};
    tokens.forEach(tok => {
        tok = tok.toLowerCase();
        freqMap[tok] = (freqMap[tok] || 0) + 1;
    });

    const sorted = Object.entries(freqMap).sort((a, b) => b[1] - a[1]);

    let html = "<table border='1'><tr><th>Mot</th><th>Fréquence</th></tr>";
    sorted.forEach(([mot, freq]) => {
        html += `<tr><td>${mot}</td><td>${freq}</td></tr>`;
    });
    html += "</table>";

    document.getElementById("page-analysis").innerHTML = html;
}
