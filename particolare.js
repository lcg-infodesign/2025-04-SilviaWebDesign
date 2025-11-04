let data

function preload() {
  data = loadTable("assets/sipri-report-explosions.csv", "CSV", "header");
}

function setup() {
  createCanvas(400, 400);

  let parametri = getURLParams();

  console.log (parametri);

  let selezionato = data.findRows(parametri.country, "country")[0];

  /*let elementiPerStato = [
    "region",
    "purpose",
    "name",
    "type",
    "year"
  ]*/

  let elementiPerStato = [
    "mb",
    "Ms",
    "depth",
    "year"
  ]

background(255);

for(let i=0; i < elementiPerStato.length; i++) {
  let nomeElemento = elementiPerStato[i];
  let valoreElemento = selezionato.get(nomeElemento);
  
  let angle = map(i, 0, elementiPerStato.length, 0, 360);
  let lunghezzaBarra = floor(map(valoreElemento, -100, 2000, 20, 200))

  push();
  //mi sposto al centro
  translate(windowWidth/2, windowHeight/2);
  angleMode(DEGREES);
  rotate(angle);
  line (20, 0, lunghezzaBarra + 200, 0);
  pop();

  //console.log(angle, lunghezzaBarra)
}
}

function draw()  {
  
}

