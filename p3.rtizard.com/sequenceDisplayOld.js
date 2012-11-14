//initialize values, this needn't wait for page load to be complete
$(document).ready(function() {

//Trying to use A as an example of an object to keep all these properties:

var A = {
oneLetter:'A',
threeLetter:'Ala',
name:'Alanine',
molWt: 71.08,
pK: 0,
extinction: 0,
count: 0,
};

var C = {
oneLetter:'C',
threeLetter:'Cys',
name:'Cysteine',
molWt: 103.14,
pK: 8.3,
extinction: 0,
count: 0,
};

var D = {
oneLetter:'D',
threeLetter:'Asp',
name:'Aspartic Acid',
molWt: 115.09,
pK: 3.91,	
extinction: 0,
count: 0,
};

var E = {
oneLetter:'E',
threeLetter:'Glu',
name:'Glutamic Acid',
molWt: 129.11,
pK: 4.25,
extinction: 0,
count: 0,
};

var F = {
oneLetter:'F',
threeLetter:'Phe',
name:'Phenylalanine',
molWt: 147.17,
pK: 0,
extinction: 0,
count: 0,
};

var G = {
oneLetter:'G',
threeLetter:'Gly',
name:'Glycine',
molWt: 57.05,
pK: 0,
extinction: 0,
count: 0,
};

var H = {
oneLetter:'H',
threeLetter:'His',
name:'Histidine',
molWt: 137.14,
pK: 6.5,
extinction: 0,
count: 0,
};

var I = {
oneLetter:'I',
threeLetter:'Ile',
name:'Isoleucine',
molWt: 113.16,
pK: 0,
extinction: 0,
count: 0,
};

var K = {
oneLetter:'K',
threeLetter:'Lys',
name:'Lysine',
molWt: 128.17,
pK: 10.79,
extinction: 10,
count: 0,
};

var L = {
oneLetter:'L',
threeLetter:'Leu',
name:'Leucine',
molWt: 113.16,
pK: 0,
extinction: 0,
count: 0,
};

var M = {
oneLetter:'M',
threeLetter:'Met',
name:'Methionine',
molWt: 131.19,
pK: 0,
extinction: 0,
count: 0,
};

var N = {
oneLetter:'N',
threeLetter:'Asn',
name:'Asparagine',
molWt: 114.1,
pK: 0,
extinction: 0,
count: 0,
};

var P = {
oneLetter:'P',
threeLetter:'Pro',
name:'Proline',
molWt: 97.11,
pK: 0,
extinction: 0,
count: 0,
};

var Q = {
oneLetter:'Q',
threeLetter:'Gln',
name:'Glutamine',
molWt: 128.13,
pK: 0,
extinction: 0,
count: 0,
};

var R = {
oneLetter:'R',
threeLetter:'Arg',
name:'Arginine',
molWt: 156.18,
pK: 12.5,
extinction: 0,
count: 0,
};

var S = {
oneLetter:'S',
threeLetter:'Ser',
name:'Serine',
molWt: 87.08,
pK: 12.5,
extinction: 0,
count: 0,
};

var T = {
oneLetter:'T',
threeLetter:'Thr',
name:'Threonine',
molWt: 101.1,
pK: 0,
extinction: 0,
count: 0,
};

var V = {
oneLetter:'V',
threeLetter:'Val',
name:'Valine',
molWt: 99.13,
pK: 0,
extinction: 0,
count: 0,
};

var W = {
oneLetter:'W',
threeLetter:'Trp',
name:'Tryptophan',
molWt: 186.21,
pK: 0,
extinction: 5500,
count: 0,
};

var Y = {
oneLetter:'Y',
threeLetter:'Tyr',
name:'Tyrosine',
molWt: 163.17,
pK: 10.95,
extinction: 1490,
count: 0,
};


var aa_array = [A,C,D,E,F,G,H,I,K,L,M,N,P,Q,R,S,T,V,W,Y];
var temp;
for ( temp in aa_array){
  console.log ('temp is '+temp);
  console.log ('aa_array sub temp name is '+aa_array[temp].name+' ');
}

//console.log("aminoAcid_pK was loaded");
var aminoAcid_MW = {
	"A":71.08,
	"C":103.14,
	"D":115.09,
	"E":129.11,
	"F":147.17,
	"G":57.05,
	"H":137.14,
	"I":113.16,
	"K":128.17,
	"L":113.16,
	"M":131.19,
	"N":114.1,
	"P":97.11,
	"Q":128.13,
	"R":156.18,
	"S":87.08,
	"T":101.1,
	"V":99.13,
	"W":186.21,
	"Y":163.17
};

var aminoAcid_pK = {
	"A":0,					//note entries with value 0 could be removed without affecting pI computation, leaving us with 7 non-zero
	"C":8.3,				//but we'll leave all zero entries in in case we choose to create a quiz or a learning tool
	"D":3.91,				//Note also the pK for Nterminus and Cterminus make this array larger than the others
	"E":4.25,
	"F":0,
	"G":0,
	"H":6.5,
	"I":0,
	"K":10.79,
	"L":0,
	"M":0,
	"N":0,
	"P":0,
	"Q":0,
	"R":12.5,
	"S":0,
	"T":0,
	"V":0,
	"W":0,
	"Y":10.95,
	"Nterminus":8.56,
	"Cterminus":3.56,
};

var aminoAcid_Extinction = { //Note that only 3 amino acids--W > Y >> K--absorb light at wavelength of 280nm
	"A":0,
	"C":0,
	"D":0,
	"E":0,
	"F":0,
	"G":0,
	"H":0,
	"I":0,
	"K":10,
	"L":0,
	"M":0,
	"N":0,
	"P":0,
	"Q":0,
	"R":0,
	"S":0,
	"T":0,
	"V":0,
	"W":5500,
	"Y":1490
};


var aminoAcid_Count = {
	"A":0,
	"C":0,
	"D":0,
	"E":0,
	"F":0,
	"G":0,
	"H":0,
	"I":0,
	"K":0,
	"L":0,
	"M":0,
	"N":0,
	"P":0,
	"Q":0,
	"R":0,
	"S":0,
	"T":0,
	"V":0,
	"W":0,
	"Y":0
};


//variables available everywhere within "ready" -- pseudo global
var strippedSequence;
//easier to create the buttons in code than in html!
drawResidueButtons();
//console.log('A.name is '+A.name);


$('#sequenceInput').blur(function() { //Note that Safari and Chrome run this code on blur. Firefox does not. Need general method.
	console.log("blur detected");
	$('#comment').html('');// New sequence: clear any pre-existing comment ("H was found x times")
	$('.button').css('color','black');// New sequence: return all buttons to black

		// now that the sequence will be available, allow the browser to set the height of that element
	$('#styledSequence').css({'height':'auto'});

	// getStyledSequence does not use the new aa objects A,C,D, etc.
	var styledVersion = getStyledSequence();

	var messageDatabox ="";
	 
	if (strippedSequence!="") {
		var MW = computeMW();
		var newMW = newComputeMW(); //using the aa objects, compare with MW to find typos and thinkos
    var pI = computePi();
    var Extinction = computeExtinctionCoefficient();
    messageDatabox = 'Chain length is '+strippedSequence.length+'<br>';
    messageDatabox+='Molecular Weight is '+MW+'<br>';
    messageDatabox+='New Molecular Weight is '+newMW+'<br>';
    messageDatabox+='Estimated isoelectric point (pI) is '+pI+'<br>'; //Add the pI value
    messageDatabox+='Estimated extinction coefficient is '+Extinction+'<br>'; //Add the Extinction coefficient value
    
	} else {
	messageDatabox = 'No valid sequence characters were input. Try again?<br>';
	}
	
	$('#dataBox').html(messageDatabox);
  $('#styledSequence').html(styledVersion);
    
});
	
function drawResidueButtons(){
	var newHtml="";
	
	for(key in aminoAcid_Count) {
	  newHtml += '<div class="button" id="'+key+'">'+key+'</div>';
	}
		
	console.log(newHtml);
	$('#residueButtons').html(newHtml);	
}               //End of drawResidueButtons	

	$('.button').live("click",function(){
		var letter = $(this).html();
		console.log(letter+" button clicked");
		var re = new RegExp(letter, "g");
		var styledVersion = getStyledSequence();//this obliterates earlier stuff done to the sequence, added <span> tags at this point.
		var numberFound = styledVersion.match(re);
		console.log (numberFound);
		var annotatedSequence = styledVersion.replace(re, '<span class="red">'+letter+'</span>'	);//since we've made strippedSequence we might as well use it here.
		$('#styledSequence').html(annotatedSequence);
		$('#comment').html('<span class="red">'+letter+'</span> was found '+ numberFound.length +' times.');
		//Return any pre-existing buttons colored red back to black
		$('.button').css('color','black');
		//now turn this button red
		$(this).css('color','red'); 
		return false;
	});

function getStyledSequence() {  // for now strips out spaces, coordinate numbers, etc. without styling the sequence. COME BACK.


	var re = new RegExp('[ACDEFGHIKLMNPQRSTVWY]', "g");//filters out all but 20 valid amino acid codes
	var workingSequence=$('#sequenceInput').val();
	workingSequence = workingSequence.toUpperCase();
console.log("workingSequence is "+ workingSequence);
	var	basicSequence = workingSequence.match(re);//basicSequence is an object with single character values: "RATE" -> "R","A","T","E"
console.log("basicSequence is "+ basicSequence);//char,char,char,char,
//console.log("basicSequence.length is "+ basicSequence.length);  //string of length 2X sequence
	
	if (basicSequence!=null){
  	strippedSequence = basicSequence.join('');
  } else {
    strippedSequence = "";
	}
	
	$('#plainSequence').html(strippedSequence);//put the stripped (no spaces, numbers, just pure sequence) seq into plainSequence for the time being
	
	//NOW work seriously on styling the sequence for display
	var numFullLines = strippedSequence.length/50;
	console.log('numFullLines before rounding = '+numFullLines);
	var numFullLines = Math.floor(numFullLines);

	var partialLineLength = strippedSequence.length % 50;
	console.log('numFullLines = '+numFullLines+'  partialLineLength ='+ partialLineLength);
	var styledVersion = '';
	var IndexLine = "";//need to compose a 50-long index line with ticks every 10 residues. Regular spaces collapse. &nbsp OK.
	
	for ( var i=0; i<5; i++){
		IndexLine +="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp.";
	}
	IndexLine += '<br>';
	var styledVersion = '';
	var next50 = "";

	for ( i=0; i<numFullLines; i++){
		styledVersion += IndexLine;
		next50 = strippedSequence.substring(i*50,(i+1)*50);
		styledVersion += next50+"&nbsp&nbsp"+(i+1)*50+'<br><br>';
	}
	
	if(partialLineLength!=0){
		//truncate index line appropriately:
		console.log(partialLineLength);
		IndexLine = '';//prepare to customize an index line for the less-than-50 residue line
		next50 = strippedSequence.substring((numFullLines)*50);//will be padded later
		console.log('next50 before padding ='+next50);
		for(i=0; i<partialLineLength; i++){
			
			if((i+1)%10==0){
			IndexLine += '.';
			} else {
			IndexLine += '&nbsp';
			}
		}
		console.log('partialLineLength = '+partialLineLength);
		for(i=partialLineLength; i<50; i++){  //NOW pad out the sequence line so that co-ordinates in right margin line up.
		next50 += '&nbsp';
		}
		console.log("IndexLine ="+IndexLine);
		styledVersion += IndexLine+'<br>';
		styledVersion += next50+"&nbsp&nbsp"+strippedSequence.length+'<br><br>';

	} //end IF
	return styledVersion;
}// END OF getStyledSequence

function computeExtinctionCoefficient() {
	var extinctionCoefficient = 0;
	
	for(key in aminoAcid_Count) {
	extinctionCoefficient+=aminoAcid_Count[key]*aminoAcid_Extinction[key];
	}
	
return (Math.round(extinctionCoefficient*1000))/1000;//round off to 3 places to the right of the decimal

} //End of computeExtinctionCoefficient()

function computeMW() {
	var residueCount = 0;
	var residueMatch = "";
	
	for(key in aminoAcid_Count) {
		re = new RegExp(key, "g");
		residueMatch = strippedSequence.match(re);//since we've made strippedSequence we might as well use it here.

		if(residueMatch!==null) {
			residueCount = residueMatch.length;
			} else {
			residueCount=0;
			}

		aminoAcid_Count[key] = residueCount;
	} // end For

  //now do the molecular weight (MW) determination
  var molecularWeight = 0;

	for(key in aminoAcid_Count) {
	  molecularWeight+=aminoAcid_Count[key]*aminoAcid_MW[key];
	}
	
  return (Math.round(molecularWeight*1000))/1000;//round off to 3 places to the right of the decimal

} //END OF FUNCTION computeMW

function newComputeMW() {
  var key;
  var residueCount;
	var residueMatch;
			console.log('entering newComputeMW');

	for ( temp in aa_array){
  console.log ('temp is '+temp);
  console.log ('aa_array sub temp name is '+aa_array[temp].oneLetter+' ');
}

	for(key in aa_array) {
		re = new RegExp(aa_array[key].oneLetter, "g");
		residueMatch = strippedSequence.match(re);//since we've made strippedSequence we might as well use it here.

		if(residueMatch!==null) {
			residueCount = residueMatch.length;
			} else {
			residueCount=0;
			}

		aa_array[key].count = residueCount;
		console.log('residueCount for '+aa_array[key].oneLetter+' = '+residueCount);
		console.log('aa_array[key].count for '+aa_array[key].oneLetter+' = '+aa_array[key].count);

	} // end For

  //now do the molecular weight (MW) determination
  var molecularWeight = 0;

	for(key in aa_array) {
	  molecularWeight+=(aa_array[key].count)*(aa_array[key].molWt);
	}
	
  return (Math.round(molecularWeight*1000))/1000;//round off to 3 places to the right of the decimal


}

function computePi() {
	// Start at pH 7. Determine charge, contributed by N and C termini and charged amino acid side chains (performed by calcChargeAtpH).
	// Adjust pH upward or downward by currentStep and recompute the charge. Step in the correct direction again, this
	// time stepping 1/2 as far.
	// Continue with smaller corrective steps until charge doesn't change at two successive pHs.
	
	var current_pH=7;
	var currentStep=3.5;
	var lastCharge=0;
	var crntCharge=1;  //something different from lastCharge to force once through the while loop
	
	while (lastCharge!=crntCharge) {
		console.log("pH="+current_pH+"  crntCharge="+crntCharge);
		lastCharge=crntCharge;
		crntCharge=calcChargeAtpH(current_pH);
		crntCharge=(Math.round(crntCharge*1000))/1000; //round off to 3 places to the right of the decimal
		
		if (crntCharge>0){
				current_pH=current_pH+currentStep;
		} else { 
				current_pH=current_pH-currentStep;
		}
		
		currentStep=currentStep/2;
	} //End while 
	
	return((Math.round(1000*current_pH))/1000);//rounded to 3 places after the decimal point
	
	// Final value has been reached: current_pH is our PI
	//var messageDatabox = $('#dataBox').html(messageDatabox);//fetch current value of the data box message
	//messageDatabox+='<br>Estimated isoelectric point (pI) is '+(Math.round(1000*current_pH))/1000; //Add the pI value
	//$('#dataBox').html(messageDatabox); // write back the augmented value
	
} // END OF FUNCTION computePi


function calcChargeAtpH(current_pH) {

  //# it's the sum of all the partial charges for the
  //# termini and all of the charged aa's
 
 var $charge = partialCharge(aminoAcid_pK['Nterminus'], current_pH )//This is a positive contributor, one N terminus/molecule
 	- partialCharge(current_pH,aminoAcid_pK['Cterminus'] )	//negative, one C terminus/molecule
  	+ aminoAcid_Count['K'] * partialCharge(aminoAcid_pK['K'],current_pH)// positive, charge for single residue times the residue count
    + aminoAcid_Count['R'] * partialCharge(aminoAcid_pK['R'],current_pH)// positive
    + aminoAcid_Count['H'] * partialCharge(aminoAcid_pK['H'],current_pH)// positive
    - aminoAcid_Count['D'] * partialCharge(current_pH,aminoAcid_pK['D'])//negative
    - aminoAcid_Count['E'] * partialCharge(current_pH,aminoAcid_pK['E'])//negative
    - aminoAcid_Count['C'] * partialCharge(current_pH,aminoAcid_pK['C'])//negative
    - aminoAcid_Count['Y'] * partialCharge(current_pH,aminoAcid_pK['Y']); //negative
    return ($charge);
}

function partialCharge (p1,p2){
	// Concentration Ratio is 10**(pK-pH)for positive groups
  // and 10**(pH-pK)for negative groups. THE CORRECT ORDER OF p1 and p2 are supplied by calcChargeAtpH
	var concentrationRatio=Math.pow(10,p1-p2);
	return concentrationRatio/(concentrationRatio+1);
} // END OF FUNCTION partialCharge

}); // END document.ready

