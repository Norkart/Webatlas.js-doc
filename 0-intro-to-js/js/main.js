
//start først etter at alt er ferdig lastet
$(document).ready(function() {

	//definerer en ny liste (array)
	var liste = [];

	//loop 100 ganger. i holder iteratoren
	for (var i=0;i<100;i++) {
		//lager en ny liste og fyller den med innhold
		var tmpListe = [i,"tekstnr: " + i];
		//"dytt" tmplisten inn som verdi i hovedlisten. Dette blir da en todimensjonal liste
		liste.push(tmpListe);
	}

	console.log(liste);

	//for each loop (foreach). Looper igjennom objekter der "k" er indeksen til verdien
	for(var k in liste) {
		//henter ut verdien "vi er på" fra listen
		var verdi = liste[k];

		//lager et nytt DOM-element
		var $nyDiv = $("<div>").html(k + " : " + verdi[0] + " | " + verdi[1]);
		
		//velger <body>-elementet o legger til nyDiv på slutten
		$("body").append($nyDiv);

		//sjekker om vi har oddetall eller partall
		if(k % 2) {
			$nyDiv.addClass("annehver");
		} else {
			//vi gjør ingenting
		}
	}

	//velg ut alle som har klassen "annehver" og skjul + vis de
	$(".annehver").hide("slow").delay(1500).show("slow");
});