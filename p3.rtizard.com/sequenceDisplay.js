//initialize values, this needn't wait for page load to be complete
$(document).ready(function() {

//20 objects, one for each amino acid, store their properties.
//Each will have a name, a one letter code, a three letter code, and a molecular weight.
//Zero for pK indicates that the side groups are uncharged. Acidic side groups have pKs less than 7, basic greater than 7
//Zero for extinction indicates that the side groups don't absorb UV light at 280nm (only W and Y and, slightly, K do so).

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
pK: 0,
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

var aa_array = [A,C,D,E,F,G,H,I,K,L,M,N,P,Q,R,S,T,V,W,Y]; // an array of the 20 objects just created

var aminoAcid_pK = {//note this is a remnant of the old parallel array system. works fine for N and C termini.
	"Nterminus":8.56,
	"Cterminus":3.56,
};

//strippedSequence: an additional variable available everywhere within "ready" 
var strippedSequence = '';
var aaPropertyDisplay = 'count';//need to build a pull-down menu to select this. Or radio buttons, in fact, for starters.

//easier to create the buttons in code than in html and on page load!
drawResidueButtons();


$('#sequenceInput').blur(function() { //Note that Safari and Chrome run this code on blur. Firefox does not. Why not? Need general method.
//	console.log("blur detected");
	$('#comment').html('');// New sequence: clear any pre-existing comment ("H was found x times")
	$('.button').css('color','black');// New sequence: return all buttons to black

		// now that the sequence will be available, allow the browser to set the height of that element
	$('#styledSequence').css({'height':'auto'});

	// getStyledSequence does not need the new aa objects ACDE...
	var styledVersion = getStyledSequence();

	var messageDatabox ="";
	 
	if (strippedSequence!="") {
		var newMW = newComputeMW(); //using the aa objects, compare with MW to find typos and thinkos
    var newpI = newComputePi();
    var newExtinction = newComputeExtinctionCoefficient();
    determineButtonBckgrnd();
    messageDatabox = 'Chain length is '+strippedSequence.length+'<br>';
    messageDatabox+='New Molecular Weight is '+newMW+'<br>';
    messageDatabox+='New Estimated isoelectric point (pI) is '+newpI+'<br>'; //Add the pI value
    messageDatabox+='New extinction coefficient is '+newExtinction+'<br>'; //Add the Extinction coefficient value
    

	} else {
	messageDatabox = 'No valid sequence characters were input. Try again?<br>';
	}
	
	$('#dataBox').html(messageDatabox);
  $('#styledSequence').html(styledVersion);
    
}); // END of .blur function
	
function drawResidueButtons(){
	var newHtml="";
	
	for(key in aa_array) {
	  newHtml += '<div class="button" id="'+aa_array[key].oneLetter+'">'+aa_array[key].oneLetter+'</div>';
	}
		
	// console.log(newHtml);
	$('#residueButtons').html(newHtml);	
}               //End of drawResidueButtons	

	$('.button').live("click",function(){
		var letter = $(this).html();
		if (strippedSequence!=""){
		var re = new RegExp(letter, "g");
		var styledVersion = getStyledSequence();//this obliterates earlier stuff done to the sequence, added <span> tags at this point.
		var numberFound = styledVersion.match(re);
		var annotatedSequence = styledVersion.replace(re, '<span class="red">'+letter+'</span>'	);//since we've made strippedSequence we might as well use it here.
		$('#styledSequence').html(annotatedSequence);
		$('#comment').html('<span class="red">'+letter+'</span> was found '+ numberFound.length +' times.');
		//Return any pre-existing buttons colored red back to black
		$('.button').css('color','black');
		//now turn this button red
		$(this).css('color','red');
		}
		return false;
	});


$('input[name=propertyType]').click(function() {
	//the 'global' variable to match radio button selected.
	  aaPropertyDisplay = $(this).attr('value');
		// console.log(aaPropertyDisplay);
		determineButtonBckgrnd(); // make the changes to background of buttons
		
});

	// $('.button').live("mouseenter",function(){
// 	 console.log("mouseenter detected"); 
//   });
//   
// 	$('.button').live("mouseleave",function(){
// 	 console.log("mouseleave detected"); 
//   });
  
  
  
function determineButtonBckgrnd(){
  var maxValue = 0;
  
  //first determine max value for whatever
switch(aaPropertyDisplay) {
case 'molWt': 
  
  for(key in aa_array) {
//     console.log ('maxValue is ' + maxValue+ ' and next value is '+aa_array[key].molWt);
    if(aa_array[key].molWt>maxValue){
    maxValue = aa_array[key].molWt;
    }
	}
  // now that we know the maximum value, we can compare all others to this and use the opacity of the button to reflect the ratio.
  for(key in aa_array) {
  		$('#'+aa_array[key].oneLetter).css('backgroundColor','rgba(255,0,0,'+0.6*aa_array[key].molWt/maxValue+')');
  }
break;

case 'pK': 
for(key in aa_array) {
     // console.log ('maxValue is ' + maxValue+ ' and next value is '+aa_array[key].pK);
    if(aa_array[key].pK>maxValue){
    maxValue = aa_array[key].pK;
    }
	}
  // now that we know the maximum value, we can compare all others to this and use the opacity of the button to reflect the ratio.
  for(key in aa_array) {
  		$('#'+aa_array[key].oneLetter).css('backgroundColor','rgba(0,255,0,'+0.6*aa_array[key].pK/maxValue+')');
  }
break; // Stop here

case 'extinction': 
for(key in aa_array) {
    // console.log ('maxValue is ' + maxValue+ ' and next value is '+aa_array[key].extinction);
    if(aa_array[key].extinction>maxValue){
    maxValue = aa_array[key].extinction;
    }
	}
  // now that we know the maximum value, we can compare all others to this and use the opacity of the button to reflect the ratio.
  for(key in aa_array) {
  		$('#'+aa_array[key].oneLetter).css('backgroundColor','rgba(0,0,255,'+0.6*aa_array[key].extinction/maxValue+')');
  }
break; // Stop here

case 'count': 
for(key in aa_array) {
    // console.log ('maxValue is ' + maxValue+ ' and next value is '+aa_array[key].molWt);
    if(aa_array[key].count>maxValue){
    maxValue = aa_array[key].count;
    }
	}
  // now that we know the maximum value, we can compare all others to this and use the opacity of the button to reflect the ratio.
  for(key in aa_array) {
  		$('#'+aa_array[key].oneLetter).css('backgroundColor','rgba(255,0,255,'+0.6*aa_array[key].count/maxValue+')');
  }
break;

default: 
// console.log("unrecognized property value selected from radio buttons.")
break; // stop here
}

}   //END determineButtonBckgrnd

function getStyledSequence() {  // for now strips out spaces, coordinate numbers, etc. without styling the sequence. COME BACK.


	var re = new RegExp('[ACDEFGHIKLMNPQRSTVWY]', "g");//filters out all but 20 valid amino acid codes
	var workingSequence=$('#sequenceInput').val();
	workingSequence = workingSequence.toUpperCase();
	var	basicSequence = workingSequence.match(re);//basicSequence is an object with single character values: "RATE" -> "R","A","T","E"
	
	if (basicSequence!=null){
  	strippedSequence = basicSequence.join('');
  } else {
    strippedSequence = "";
	}
	
	//$('#plainSequence').html(strippedSequence);//put the stripped (no spaces, numbers, just pure sequence) seq into plainSequence for the time being
	
	//NOW work seriously on styling the sequence for display
	var numFullLines = strippedSequence.length/50;
	var numFullLines = Math.floor(numFullLines);

	var partialLineLength = strippedSequence.length % 50;
	var styledVersion = '';
	var IndexLine = "";
	
	//Compose a 50-long index line with ticks every 10 residues. Regular spaces collapse, so use &nbsp.
	
	for ( var i=0; i<5; i++){
		IndexLine +="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp.";
	}
	IndexLine += '<br>';
	var styledVersion = '';
	var next50 = "";

	for ( i=0; i<numFullLines; i++){
		styledVersion += IndexLine;
		next50 = strippedSequence.substring(i*50,(i+1)*50);
		styledVersion += next50+"&nbsp&nbsp"+(i+1)*50+'<br>';
		//styledVersion += next50+"&nbsp&nbsp"+(i+1)*50+'<br><br>';
  }
	
	if(partialLineLength!=0){
		//truncate index line appropriately:
		IndexLine = '';//prepare to customize an index line for the less-than-50 residue line
		next50 = strippedSequence.substring((numFullLines)*50);//will be padded later
		
		for(i=0; i<partialLineLength; i++){
			
			if((i+1)%10==0){
			IndexLine += '.';
			} else {
			IndexLine += '&nbsp';
			}
		}
		for(i=partialLineLength; i<50; i++){  //NOW pad out the sequence line so that co-ordinates in right margin line up.
		next50 += '&nbsp';
		}
		styledVersion += IndexLine+'<br>';
		styledVersion += next50+"&nbsp&nbsp"+strippedSequence.length+'<br><br>';

	} //end IF
	
	return styledVersion;
}// END OF getStyledSequence

function newComputeExtinctionCoefficient() {
	var extinctionCoefficient = 0;
	
	for(key in aa_array) {
    extinctionCoefficient+=aa_array[key].extinction *aa_array[key].count;
	}
	
return (Math.round(extinctionCoefficient*1000))/1000;//round off to 3 places to the right of the decimal

} //End of newComputeExtinctionCoefficient()


//NEW METHOD, first of batch using the ACDE... objects instead of parallel arrays
function newComputeMW() {
  var key;
  var residueCount;
	var residueMatch;

	for(key in aa_array) {
		re = new RegExp(aa_array[key].oneLetter, "g");
		residueMatch = strippedSequence.match(re);//since we've made strippedSequence we might as well use it here.

		if(residueMatch!==null) {
			residueCount = residueMatch.length;
			} else {
			residueCount=0;
			}

		aa_array[key].count = residueCount;

	} // end For

  //now do the molecular weight (MW) determination
  var molecularWeight = 0;

	for(key in aa_array) {
	  molecularWeight+=(aa_array[key].count)*(aa_array[key].molWt);
	}
	
  return (Math.round(molecularWeight*1000))/1000;//round off to 3 places to the right of the decimal
} //END OF newComputeMW


// function newComputePi: only difference required is calling different calcChargeAtpH routine using ACDE... objects
function newComputePi() {
	// Start at pH 7. Determine charge, contributed by N and C termini and charged amino acid side chains (performed by calcChargeAtpH).
	// Adjust pH upward or downward by currentStep and recompute the charge. Step in the correct direction again, this
	// time stepping 1/2 as far.
	// Continue with smaller corrective steps until charge doesn't change at two successive pHs.
	
	var current_pH=7;
	var currentStep=3.5;
	var lastCharge=0;
	var crntCharge=1;  //something different from lastCharge to force once through the while loop
	
	while (lastCharge!=crntCharge) {
// 		console.log("pH="+current_pH+"  crntCharge="+crntCharge); // this is amusing to review in the console
		lastCharge=crntCharge;
		crntCharge=newCalcChargeAtpH(current_pH);
		crntCharge=(Math.round(crntCharge*1000))/1000; //round off to 3 places to the right of the decimal
		
		if (crntCharge>0){
				current_pH=current_pH+currentStep;
		} else { 
				current_pH=current_pH-currentStep;
		}
		
		currentStep=currentStep/2;
	} //End while 
	
	return((Math.round(1000*current_pH))/1000);//rounded to 3 places after the decimal point
	

} // END OF FUNCTION computePi


function newCalcChargeAtpH(current_pH) {

  //# it's the sum of all the partial charges for the
  //# termini and all of the charged aa's, use the remnant of the aminoAcid_pK array for N and C terminus values, otherwise: ACDE... objects.

 var $charge = partialCharge(aminoAcid_pK['Nterminus'], current_pH )//This is a positive contributor, one N terminus/molecule
 	- partialCharge(current_pH,aminoAcid_pK['Cterminus'] )	//negative, one C terminus/molecule
  	+ K.count * partialCharge(K.pK,current_pH)// positive, charge for single residue times the residue count
    + R.count * partialCharge(R.pK,current_pH)// positive
    + H.count * partialCharge(H.pK,current_pH)// positive
    - D.count * partialCharge(current_pH,D.pK)//negative
    - E.count * partialCharge(current_pH,E.pK)//negative
    - C.count * partialCharge(current_pH,C.pK)//negative
    - Y.count * partialCharge(current_pH,Y.pK); //negative
    return ($charge);
}

function partialCharge (p1,p2){
	// Concentration Ratio is 10**(pK-pH)for positive groups
  // and 10**(pH-pK)for negative groups. THE CORRECT ORDER OF p1 and p2 are supplied by calcChargeAtpH
	var concentrationRatio=Math.pow(10,p1-p2);
	return concentrationRatio/(concentrationRatio+1);
} // END OF FUNCTION partialCharge

}); // END document.ready

