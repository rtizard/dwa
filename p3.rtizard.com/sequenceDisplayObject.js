
$(document).ready(function() {

// This is a constructor function that initializes new aa objects.
function Aa(oneLetter, threeLetter, name, molWt, pK, extinction, count, addsToCharge) {
this.oneLetter = oneLetter;
this.threeLetter = threeLetter;
this.name = name;
this.molWt = molWt;
this.pK = pK;
this.extinction = extinction;
this.count = count;
this.addsToCharge=addsToCharge;//boolean value determining whether charge is additive or subtractive to overall charge: false only for CDEY and Cterm
}

// Aa.prototype is unsurprisingly the prototype for all amino acid objects.
Aa.prototype = {

  setCount: function() { 
    var re = new RegExp(this.oneLetter, "g");
		residueMatch = strippedSequence.match(re);

		if(residueMatch!==null) {
			this.count = residueMatch.length;
		} else {
			this.count=0;
		}

  },
  getCount: function() { return this.count;},
  getMwContribution : function () { return this.count * this.molWt;},
  getExtinctionContribution : function () { return this.count * this.extinction;},
  getChargeAtpH : function(pH) {
    
    if(this.addsToCharge){ // true: we have potential to add charge to the molecule
      var concentrationRatio=Math.pow(10, this.pK - pH);
      var returnVal = (this.count)*(concentrationRatio)/(concentrationRatio+1);
      return returnVal;
    } else { // false: we have potential to subtract charge from the molecule
      var concentrationRatio=Math.pow(10, pH - this.pK);
      var returnVal =  (-1)*(this.count)*(concentrationRatio)/(concentrationRatio+1);
      return returnVal;
    }

  }//end getChargeAtpH
  
}; // END of Aa.prototype


//Instantiate 20 objects inheriting from Aa.prototype, one for each amino acid, store their properties.
//Each will have a name, a one letter code, a three letter code, and a molecular weight.
//Zero for pK indicates that the side groups are uncharged. Acidic side groups have pKs less than 7, basic greater than 7
//Zero for extinction indicates that the side groups don't absorb UV light at 280nm (only W and Y and, slightly, K do so).
//The boolean value addsToCharge is only significant for amino acids with charged side chains and the termini.

var A = new Aa('A','Ala','Alanine',71.08,0,0, 0, true);
var C = new Aa('C','Cys','Cysteine',103.14,8.3,0, 0, false); 
var D = new Aa('D','Asp','Aspartic Acid', 115.09, 3.91, 0, 0, false);
var E = new Aa('E','Glu','Glutamic Acid', 129.11, 4.25, 0, 0, false);
var F = new Aa('F','Phe','Phenylalanine', 147.17, 0, 0, 0, true);
var G = new Aa('G','Gly','Glycine', 57.05, 0, 0, 0, true);
var H = new Aa('H','His','Histidine', 137.14, 6.5, 0, 0, true);
var I = new Aa('I','Ile','Isoleucine', 113.16, 0, 0, 0, true);
var K = new Aa('K','Lys','Lysine', 128.17, 10.79, 10, 0, true);
var L = new Aa('L','Leu','Leucine', 113.16, 0, 0, 0, true);
var M = new Aa('M','Met','Methionine', 131.19, 0, 0, 0, true);
var N = new Aa('N','Asn','Asparagine', 114.1, 0, 0, 0, true);
var P = new Aa('P','Pro','Proline', 97.11, 0, 0, 0, true);
var Q = new Aa('Q','Gln','Glutamine', 128.13, 0, 0, 0, true);
var R = new Aa('R','Arg','Arginine', 156.18, 12.5, 0, 0, true);
var S = new Aa('S','Ser','Serine', 87.08, 0, 0, 0, true);
var T = new Aa('T','Thr','Threonine', 101.1, 0, 0, 0, true);
var V = new Aa('V','Val','Valine', 99.13, 0, 0, 0, true);
var W = new Aa('W','Trp','Tryptophan', 186.21, 0, 5500, 0, true);
var Y = new Aa('Y','Tyr','Tyrosine', 163.17, 10.95, 1490, 0, false);

//2 more objects inheriting from Aa.prototype. Used in pI calc only. count = 1 (by definition, one of each termini/chain), pK and addsToCharge values passed. 
var Nterm = new Aa('1','Nxx','Nterminus', 0, 8.56, 0, 1, true);// not included in aa_array, used in pI calc only, count=1
var Cterm = new Aa('2','Cxx','Cterminus', 0, 3.56, 0, 1, false);// not included in aa_array, used in pI calc only, count=1

var aa_array = [A,C,D,E,F,G,H,I,K,L,M,N,P,Q,R,S,T,V,W,Y]; // an array of the 20 objects just created. Lacks Nterm and Cterm, which aren't really aa.
var charged_array = [Nterm,Cterm,K,R,H,D,E,C,Y]; //charged amino acids and termini to be traversed for pI calculation

var aminoAcid_pK = {//note this is a remnant of the old parallel array system. Would be used by procedural code in newComputePi, which is inactive.
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

    var MW = computeMW(); //using the aa objects, compare with MW to find typos and thinkos    
//     var newpI = newComputePi();// using the old procedural approach on objects, Obsolete
    var pIObj = computePiObject();// new with animate objects
    var extinction = computeExtinctionCoefficient();
    determineButtonBckgrnd();
    messageDatabox = 'Chain length is '+strippedSequence.length+'<br>';
    messageDatabox+='Molecular Weight is '+MW+'<br>';
//     messageDatabox+='Isoelectric point (pI) with procedural logic is '+newpI+'<br>'; //Obsolete, but code still in the package
    messageDatabox+='Isoelectric point (pI) is '+pIObj+'<br>'; //Add the pI value
    messageDatabox+='Extinction coefficient is '+extinction+'<br>'; //Add the Extinction coefficient value
//     
// 
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

//using Aa.prototype derived objects
function computeExtinctionCoefficient() {
  var key;
	var extinctionCoefficient = 0;
	for (key in aa_array) {
    extinctionCoefficient += aa_array[key].getExtinctionContribution();
//     console.log("extinctionCoefficient partial is "+extinctionCoefficient);
	} // end For
 
return (Math.round(extinctionCoefficient*1000))/1000;//round off to 3 places to the right of the decimal

} //End of computeExtinctionCoefficient()


//NEW METHOD, now using the objects inheriting from Aa.prototype
function computeMW() {
  var key;
  var molecularWeight = 0;


	for (key in aa_array) {
    aa_array[key].setCount();
    molecularWeight += aa_array[key].getMwContribution();
//     console.log("molecularWeight partial is "+molecularWeight);
	} // end For
 
  return (Math.round(molecularWeight*1000))/1000;//round off to 3 places to the right of the decimal
} //END OF computeMW


// function newComputePi: only difference required is calling different calcChargeAtpH routine using ACDE... objects
//this code works, using the objects only as data source, but it is not invoked. Here for reference only. See computePiObject, in use.
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
 		console.log("Old Object style pH="+current_pH+"  crntCharge="+crntCharge); // this is amusing to review in the console
		lastCharge=crntCharge;
		//crntCharge=calcChargeAtpHObject(current_pH); //depends on Aa.prototype derived objects
		crntCharge=newCalcChargeAtpH(current_pH); //uses objects for properties only, but will run
    crntCharge=(Math.round(crntCharge*1000))/1000; //round off to 3 places to the right of the decimal
		
		if (crntCharge>0){
				current_pH=current_pH+currentStep;
		} else { 
				current_pH=current_pH-currentStep;
		}
		
		currentStep=currentStep/2;
	} //End while 
	
	return((Math.round(1000*current_pH))/1000);//rounded to 3 places after the decimal point
	

} // END OF FUNCTION newComputePi

function newCalcChargeAtpH(current_pH) {
  //# it's the sum of all the partial charges for the
  //# termini and all of the charged aa's, use the remnant of the aminoAcid_pK array for N and C terminus values, otherwise: ACDE... objects.
 var charge = partialCharge(aminoAcid_pK['Nterminus'], current_pH )//This is a positive contributor, one N terminus/molecule
 	- partialCharge(current_pH,aminoAcid_pK['Cterminus'] )	//negative, one C terminus/molecule
  	+ K.count * partialCharge(K.pK,current_pH)// positive, charge for single residue times the residue count
    + R.count * partialCharge(R.pK,current_pH)// positive
    + H.count * partialCharge(H.pK,current_pH)// positive
    - D.count * partialCharge(current_pH,D.pK)//negative
    - E.count * partialCharge(current_pH,E.pK)//negative
    - C.count * partialCharge(current_pH,C.pK)//negative
    - Y.count * partialCharge(current_pH,Y.pK); //negative
    return (charge);
} // end of function newCalcChargeAtpH which is obsolete despite its name

function partialCharge (p1,p2){
	// Concentration Ratio is 10**(pK-pH)for positive groups
  // and 10**(pH-pK)for negative groups. THE CORRECT ORDER OF p1 and p2 are supplied by calcChargeAtpH
	var concentrationRatio=Math.pow(10,p1-p2);
	return concentrationRatio/(concentrationRatio+1);
} // END OF FUNCTION partialCharge


function computePiObject() {
	// Start at pH 7. Determine charge, contributed by N and C termini and charged amino acid side chains (performed by calcChargeAtpH).
	// Adjust pH upward or downward by currentStep and recompute the charge. Step in the correct direction again, this
	// time stepping 1/2 as far.
	// Continue with smaller corrective steps until charge doesn't change at two successive pHs.
	// Algorithm and pK values taken from: http://doc.bioperl.org/releases/bioperl-1.4/Bio/Tools/pICalculator.html

	var current_pH=7;
	var currentStep=3.5;
	var lastCharge=0;
	var crntCharge=1;  //something different from lastCharge to force once through the while loop

	while (lastCharge!=crntCharge) {
// 		console.log("pH="+current_pH+"  crntCharge="+crntCharge); // this is amusing to review in the console
		lastCharge=crntCharge;
		crntCharge=calcChargeAtpHObject(current_pH); //depends on Aa.prototype derived objects
		//crntCharge=newCalcChargeAtpH(current_pH); //uses objects for properties only, but will run
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


function calcChargeAtpHObject(current_pH) {
//note that all values returned from objects are added together. Negative values are handled by the aa object.
var charge = 0;
for(key in charged_array) { //charged_array is global. Its composition: var charged_array = [Nterm,Cterm,K,R,H,D,E,C,Y];

charge += charged_array[key].getChargeAtpH(current_pH);
}

return charge;

} // end of calcChargeAtpHObject(current_pH)

}); // END document.ready

