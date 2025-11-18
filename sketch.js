//estraggo i dati dal dataset FATTO
//filtrare i dati per anno FATTO
// il n di sfere deve essere = al numero di esplosioni in quell'anno
// preparare valori da usare: potenza MIN e MAX + map
// decidere dove disegnare le sfere sul piano
// la grandezza delle sfere deve variare per la potenza di ogni esplosione

let data;
let padding= 40;
let numeroEsplosioni = 0; let divider;
let potenzeAnno = [];
let paesiAnno = [];
//let rMin = 10; let rMax = 60;
const COL_ANNO     = "year";   
const COL_POTENZA  = "yield_u";  
const COL_STATO = "country";


let annoSelezionato = 1961;    // cambia qui l’anno che vuoi visualizzare
let minAnno, maxAnno;

let sliderAnno;
//let angle = 0;


function preload() {
  data = loadTable("assets/sipri-report-explosions.csv", "CSV", "header");
}



function setup() {
  createCanvas(windowWidth, windowHeight);
  background(20);

  let anniColonna = data.getColumn(COL_ANNO).map(Number);
  minAnno = min(anniColonna);
  maxAnno = max(anniColonna);

  // se l'anno iniziale è fuori range, lo correggo
  if (annoSelezionato < minAnno || annoSelezionato > maxAnno) {
    annoSelezionato = minAnno;
  }

  sliderAnno = createSlider(minAnno, maxAnno, annoSelezionato, 1);
  sliderAnno.position(20, 50);      // posizione sullo schermo
  sliderAnno.style('width', '200px');

  sliderAnno.input(() => {
  annoSelezionato = sliderAnno.value();
  aggiornaAnno();
  redraw();
});
  // 1) estraggo i dati dell'anno selezionato
  aggiornaAnno();

  console.log("Anno:", annoSelezionato);
  console.log("Numero esplosioni:", numeroEsplosioni);
  console.log("Potenze:", potenzeAnno);

}

function draw() {
  background(20);

  if (numeroEsplosioni === 0) {
    fill(255);
    textAlign(CENTER, CENTER);
    text("Nessuna esplosione per l'anno " + annoSelezionato, width / 2, height / 2);
    return;
  }

  // 2) trovo min e max delle potenze per mappare le dimensioni
  let minPot = min(potenzeAnno);
  let maxPot = max(potenzeAnno);

  // 3) calcolo quante sfere per riga (disposizione a griglia)
  let perRiga = ceil(sqrt(numeroEsplosioni)); // griglia quasi quadrata
  let spacingX = width  / (perRiga + 1);
  let spacingY = height / (perRiga + 1);

  noStroke();

  for (let i = 0; i < numeroEsplosioni; i++) {
    let col = i % perRiga;
    let row = floor(i / perRiga);

    let x = (col + 1) * spacingX + padding;
    let y = (row + 1) * spacingY + padding;

    let potenza = potenzeAnno[i];
    let paese   = paesiAnno[i];
    fill(colorePerPaese(paese));

    // 4) mappo la potenza in un raggio (es. tra 10 e 60 px)
    let r = map(potenza, minPot, maxPot, 10, 40);

    circle(x, y, r * 2);
  }

  // titolo
  fill(255);
  textAlign(LEFT, TOP);
  textSize(16);
  text("Anno: " + annoSelezionato + " — Esplosioni: " + numeroEsplosioni, 20, 20);
  disegnaLegenda(minPot, maxPot);
}


// ---------------------------------------------------
// Funzione che estrae tutte le esplosioni di un anno
// ---------------------------------------------------

function getDatiAnno(annoSelezionato) {
  let numeroEsplosioni = 0;
  let potenze = [];
  let paesi = [];

  for (let i = 0; i < data.getRowCount(); i++) {
    let anno = data.getNum(i, COL_ANNO);

    if (anno === annoSelezionato) {
      let potenza = data.getNum(i, COL_POTENZA);

      // Se per qualche motivo c'è un valore sporco, lo salto
      if (isNaN(potenza)) {
        console.warn("Potenza NaN alla riga", i, "— valore grezzo:", data.getString(i, COL_POTENZA));
        continue;
      }

      let paese = data.getString(i, COL_STATO); // "country" 

      numeroEsplosioni++;
      potenze.push(potenza);
      paesi.push(paese);
    }
  }

  return {
    numeroEsplosioni: numeroEsplosioni,
    potenze: potenze,
    paesi: paesi

  };
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW && annoSelezionato < maxAnno) {
    annoSelezionato++;
    sliderAnno.value(annoSelezionato); // <-- sincronizza lo slider
    aggiornaAnno();
    redraw();
  } else if (keyCode === LEFT_ARROW && annoSelezionato > minAnno) {
    annoSelezionato--;
    sliderAnno.value(annoSelezionato); // <-- sincronizza lo slider
    aggiornaAnno();
    redraw();
  }
}

function aggiornaAnno() {
  let risultato = getDatiAnno(annoSelezionato);
  numeroEsplosioni = risultato.numeroEsplosioni;
  potenzeAnno      = risultato.potenze;
  paesiAnno        = risultato.paesi;
}


function colorePerPaese(paese) {
  switch (paese) {
    case "USSR":
      return color(255, 80, 60);   // rosso
    case "USA":
      return color(60, 140, 255);  // blu
    case "FRANCE":
      return color(60, 255, 170);  // verde acqua
    case "UK":
      return color(200, 100, 255); // viola
    case "CHINA":
      return color(200, 100, 0); // GIALLO
    case "INDIA":
      return color(0, 100, 200); 
    case "PAKIST":
      return color(50, 100, 50); 
    default:
      return color(200);           // grigio 
  }

}

function disegnaLegenda(minPot, maxPot) {
  let x0 = 20;
  let y0 = 80;
  let lineHeight = 20;

  textAlign(LEFT, TOP);
  textSize(12);
  fill(255);
  noStroke();
  text("Legenda", x0, y0);
  y0 += lineHeight;

  // --- Colori per paese ---
  let paesiLegenda = ["USA", "USSR", "UK", "FRANCE", "CHINA", "INDIA", "PAKIST"];
  
  for (let i = 0; i < paesiLegenda.length; i++) {
    let paese = paesiLegenda[i];
    let colore =  colorePerPaese(paese);

    // quadratino colore
    fill(colore);
    stroke(0);
    rect(x0, y0 + i * lineHeight, 12, 12);

    // etichetta testo
    noStroke();
    fill(255);
    let label = paese;
    text(label, x0 + 20, y0 + i * lineHeight - 2);
  }

 
}

