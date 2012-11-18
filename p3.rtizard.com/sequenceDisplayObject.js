
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
		residueMatch = sequenceCollection.strippedSequence.match(re);

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

//let's rewrite everything yet again to dispose of the button objects and put everything in an enhanced buttonGroup object
// this exploits the power of css better than the individual buttons could do.
//code that was removed is in mothballedButtonObjectCode.js
var buttonGroup = {  // a literal object. Need not be instantiated. Only one 'instance' required. Syntax is different. Like "memory" game.
   
  drawGroup : function (){ // this is only done once at the beginning. All other adjustments are by CSS
    var newHtml="";
    
    for(key in aa_array) {
        newHtml +=  '<div class="button" id="'+aa_array[key].oneLetter+'">'+aa_array[key].oneLetter+'</div>';
    }
    $('#residueButtons').html(newHtml);	
  } // end drawGroup
  ,
  
  clearClicked: function (){
    //now adjust the css so that all color is black
    $('.button').css('color','black');// New sequence: return all buttons to black
  },
  
	clickOne : function (buttonClicked){
	var letter = buttonClicked.html(); // let's see if this works! Yes, it does.
	
	//Call into sequenceCollection, supplying the letter to highlight, requesting new styled sequence
	sequenceCollection.restyle(letter);
	this.clearClicked();
  buttonClicked.css('color','red');// New sequence: return all buttons to black
	},
	
	paintButtonBackground : function (aaPropertyDisplay) {
	  var maxValue = 0;
    switch(aaPropertyDisplay) {
    case 'molWt': 
      
      for(key in aa_array) {
      //first determine max value
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
      //first determine max value
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
      //first determine max value
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
      //first determine max value
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
	
	}// end of paintButtonBackground
	
} // end of buttonGroup


	
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

// OBJECT SEQUENCE COLLECTION STARTS HERE AND STORES ALL VERSIONS OF THE SEQUENCE 
var sequenceCollection = {  // a literal object. Need not be instantiated. Only one 'instance' required. Syntax is different. Like "memory" game.

  // What the user input:
  inputSequence: "",
  
  // What was input stripped of characters that aren't valid AA codes;
  strippedSequence: "",
  
  // Our styled sequence, with 50 char lines, an index lines with dots at 10 aa intervals, and possibly span tags for colorization.
  styledSequence: "",
  
 //    $('#sequenceInput').blur: function() { //SEQUENCE INPUT LIKELY DETECTED
//     console.log('data change detected');
//     sequenceCollection.processInputSequence();	    
//   }; // END of .blur function FOR SEQUENCE INPUT
//   ,
  
  processInputSequence : function(){// called on blur from the sequence input area
    var freshInput = $('#sequenceInput').val();
    this.inputSequence = freshInput;
    var re = new RegExp('[ACDEFGHIKLMNPQRSTVWY]', "g");//filters out all but 20 valid amino acid codes
    freshInput = freshInput.toUpperCase();
    var	basicSequence = freshInput.match(re);//basicSequence is an object with single character values: "RATE" -> "R","A","T","E"
    
    if (basicSequence!=null){
      workingSequence = basicSequence.join('');
    } else {
      workingSequence = "";
    }
    
    this.strippedSequence = workingSequence;
    var numFullLines = workingSequence.length/50;
    var numFullLines = Math.floor(numFullLines); // eliminate the remainder, giving us integer division
    var partialLineLength = this.strippedSequence.length % 50;
    var styledVersion = '';
    var IndexLine = "";

    //Compose a 50-long index line with ticks every 10 residues. Regular spaces collapse, so use &nbsp;.
    
    for ( var i=0; i<5; i++){
      IndexLine +="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.";
    }
    IndexLine += '<br>';
    var styledVersion = '';
    var next50 = "";
  
    for ( i=0; i<numFullLines; i++){
      styledVersion += IndexLine;
      next50 = this.strippedSequence.substring(i*50,(i+1)*50);
      styledVersion += next50+'&nbsp;&nbsp;'+(i+1)*50+'<br>';
    }
    
    if(partialLineLength!=0){
      //truncate index line appropriately:
      IndexLine = '';//prepare to customize an index line for the less-than-50 residue line
      next50 = this.strippedSequence.substring((numFullLines)*50);//will be padded later
      
      for(i=0; i<partialLineLength; i++){
        
        if((i+1)%10==0){
          IndexLine += '.';
        } else {
          IndexLine += '&nbsp;';
        }
      }
      for(i=partialLineLength; i<50; i++){  //NOW pad out the sequence line so that co-ordinates in right margin line up.
        next50 += '&nbsp;';
      }
      styledVersion += IndexLine+'<br>';
      styledVersion += next50+'&nbsp;&nbsp;'+this.strippedSequence.length+'<br><br>';
  
    } //end IF  if(partialLineLength!=0)
    
      this.styledSequence = styledVersion;
      $('#comment').html('');// New sequence: clear any pre-existing comment ("H was found x times")
      $('.button').css('color','black');// New sequence: return all buttons to black
      
      // now that the sequence will be available, allow the browser to set the height of that element
      $('#styledSequence').css({'height':'auto'});
  
     
     $('#styledSequence').html(styledVersion);
     //drive computation in the other object:
     displayComputedValues.processNewSequence(this.strippedSequence);
      // Finally, paint the background:
      //console.log ('radio button is '+$('input[type=radio]:checked').attr('value'));
      buttonGroup.paintButtonBackground($('input[type=radio]:checked').attr('value'));//paintButtonBackground needs the property from the radio buttons
  }, //end processInputSequence
  
  restyle : function(letter){// called on button click to highlight the relevant base in red
    if(this.strippedSequence !=""){
      var re = new RegExp(letter, "g");
      this.processInputSequence();//this obliterates earlier stuff done to the sequence, added <span> tags at this point.
      var styledVersion = this.styledSequence;
      var numberFound = styledVersion.match(re);
      this.styledSequence = styledVersion.replace(re, '<span class="red">'+letter+'</span>'	);
      $('#styledSequence').html(this.styledSequence);
      $('#comment').html('<span class="red">'+letter+'</span> was found '+ numberFound.length +' times.');
    }

   }// END OF restyle

} // END OF literal object sequenceCollection


var displayComputedValues = {// literal object for managing the dataMessageBox

  MW : '',
  pI : '',
  extinction : '',
  messageDatabox : '',
  
  processNewSequence : function(strippedSequence){
         MW = this.computeMW(); //using the aa objects    
         pI = this.computePi();// new with animate objects
         extinction = this.computeExtinctionCoefficient();
         messageDatabox ="";

      if (strippedSequence!="") {
        messageDatabox = 'Chain length is '+strippedSequence.length+'<br>';
        messageDatabox+='Molecular Weight is '+MW+'<br>';
        messageDatabox+='Isoelectric point (pI) is '+pI+'<br>'; //Add the pI value
        messageDatabox+='Extinction coefficient is '+extinction+'<br>'; //Add the Extinction coefficient value
      } else {
        messageDatabox = 'No valid sequence characters were input. Try again?<br>';
      }
     $('#dataBox').html(messageDatabox);
          
  }, // end of processNewSequence
              
  //using Aa.prototype derived objects
 computeExtinctionCoefficient : function() {
  var key;
	var extinctionCoefficient = 0;
	for (key in aa_array) {
    extinctionCoefficient += aa_array[key].getExtinctionContribution();
	} // end For
 
  return (Math.round(extinctionCoefficient*1000))/1000;//round off to 3 places to the right of the decimal

  }, //End of computeExtinctionCoefficient()


 computeMW : function() {
  var key;
  var molecularWeight = 0;

	for (key in aa_array) {
    aa_array[key].setCount();
    molecularWeight += aa_array[key].getMwContribution();
	} // end For
 
  return (Math.round(molecularWeight*1000))/1000;//round off to 3 places to the right of the decimal
}, //END OF computeMW

 computePi: function() {
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
		lastCharge=crntCharge;
		crntCharge=this.calcChargeAtpH(current_pH); //depends on Aa.prototype derived objects
    crntCharge=(Math.round(crntCharge*1000))/1000; //round off to 3 places to the right of the decimal
		
		if (crntCharge>0){
				current_pH=current_pH+currentStep;
		} else { 
				current_pH=current_pH-currentStep;
		}
		
		currentStep=currentStep/2;
	} //End while 
	
	return((Math.round(1000*current_pH))/1000);//rounded to 3 places after the decimal point
	
  }, // END OF FUNCTION computePi


 calcChargeAtpH: function(current_pH) {
    //note that all values returned from objects are added together. Negative values are handled by the aa object.
    var charge = 0;
    for(key in charged_array) { //charged_array is global. Its composition: var charged_array = [Nterm,Cterm,K,R,H,D,E,C,Y];
    
    charge += charged_array[key].getChargeAtpH(current_pH);
  }

  return charge;

} // end of calcChargeAtpH(current_pH)

} //END OF literal object displayComputedValues


//QUIZ CONSTRUCTOR
function Quiz(quiz_id,category1,category2) { 
     // alert(arguments.callee.name); returns Quiz

  this.correctCount = 0;
  this.incorrectCount = 0;
  this.scoreboard = '';
  this.leftChoice = null; // null signifies no choice made in the column, else it will be the object clicked upon
  this.rightChoice = null; // ditto
  this.id = quiz_id;
//   console.log ('id at time of quiz1 creation is '+this.id);
  // Build the parallel arrays of data. column1 and column2 will become non-parallel shortly. Reference arrays will remain unshuffled.
   this.referenceColumn1 = [];
   this.referenceColumn2 = [];
   this.column1 = [];
   this.column2 = [];
  
  for (key in aa_array){
    this.referenceColumn1.push(aa_array[key][category1]);
    this.referenceColumn2.push(aa_array[key][category2]);
    this.column1.push(aa_array[key][category1]);
    this.column2.push(aa_array[key][category2]);
  }
  
  //Shuffle the display arrays with function shuffle(obj) provided by Susan.
  shuffle(this.column1);
  shuffle(this.column2);
  var html = $('#quizArea').html();
  html += '<div class="quizBox" id='+this.id+'Box><table class="quizTable">';
  for (var i =0; i<20;i++){
    html+='<tr><td class="left ' +quiz_id+'">'+this.column1[i]+'</td><td class="right ' +quiz_id+'">'+this.column2[i]+'</td><tr>';
  }
  html+='</table><div class=scoreboard></div></div>';//terminating table, adding scoreboard, and terminating quizBox div
  
  $('#quizArea').html(html);

	/*-------------------------------------------------------------------------------------------------
	From: http://dzone.com/snippets/array-shuffle-javascript
	-------------------------------------------------------------------------------------------------*/

	 function shuffle(obj){ 
    	for(var j, x, i = obj.length; i; j = parseInt(Math.random() * i), x = obj[--i], obj[i] = obj[j], obj[j] = x);
    	return obj;
    }

} // end of Quiz constructor

// QUIZ PROTOTYPE
Quiz.prototype = {



  getClickfromListener : function(objectClicked){
    var i;
    console.log ('within quiz content= '+objectClicked.html());
    
    if (objectClicked.html()!=''){ // disregard already matched and erased items
    
    //console.log ('within quiz class= '+objectClicked.attr('class'));
    console.log ('callee is '+arguments.callee.name); // returns ""
  // alert(arguments.callee.name); //returns nothing?
    console.log ('quiz id element from getClickFromListener is '+this.id);
    console.log ('class is '+objectClicked.attr('class'));
    var className = objectClicked.attr('class');
    var classArray = className.split(/ /);
    console.log ('classname element 0 followed by element 1: '+classArray[0]+ ' '+classArray[1]); // e.g. 0:right 1:quiz4
    
    if (classArray[0]=='left'){  //left column click
      //new try from scratch, assuming findSuccessOrFailure is available
       if (this.leftChoice == null) {
        this.leftChoice = objectClicked;
        objectClicked.css('backgroundColor','pink');// turn it pink while we think further!
        //this.findSuccessOrFailure();//we'll let findSuccessOrFailure do the rest
        
        
      } else { // there already is a left column button clicked. By defn, no right color button to compare to. 
        this.leftChoice.css('backgroundColor','white');// 
        this.leftChoice = objectClicked;
      }
    } else { //right column click
      if (this.rightChoice == null) {
        this.rightChoice = objectClicked;
        objectClicked.css('backgroundColor','pink');// turn it pink while we think further!
        //this.findSuccessOrFailure();//we'll let findSuccessOrFailure do the rest
        
        
      } else { // there already is a right column button clicked. By defn, no left color button to compare to. 
        this.rightChoice.css('backgroundColor','white');// 
        this.rightChoice = objectClicked;
      }
        
    } 
       crnt = this; // note that this refers to the window object in the next statement. This is clunky but seems to work.
       setTimeout(function() { crnt.findSuccessOrFailure(); },500);
      // modeled on  setTimeout(function() { writeNumber.html("1"); },1000);

     // setTimeout(crnt.findSuccessOrFailure(),1000); //wait one second to allow the pink click to register with user
    } // end if html not blank in clicked

  }, // end of getClickfromListener
  
  findSuccessOrFailure : function(){
   //  console.log('this.leftChoice.html() is '+this.leftChoice.html());
//     console.log('this.rightChoice.html() is '+this.rightChoice.html());

    if ((this.leftChoice != null) && (this.rightChoice != null)) { // we have both left and right column choices. Do they match?
//       console.log ('this.leftChoice.html is '+ this.leftChoice.html());
      for ( i=0; i<20; i++){
//         console.log ('this.referenceColumn1[i] is '+ this.referenceColumn1[i]);
        if (this.referenceColumn1[i]==this.leftChoice.html()){
          var indexFound = i;
//           console.log ('index found at '+i);
        }
      }
//       console.log ('indexFound and this.referenceColumn2[indexFound] and this.rightChoice.html() are '+indexFound+' '+this.referenceColumn2[indexFound]+' '+this.rightChoice.html());
      if (this.referenceColumn2[indexFound]==this.rightChoice.html()){
        //alert ('success');
        //add metrics here
        this.leftChoice.html('');
        this.rightChoice.html('');
        this.leftChoice.css('backgroundColor','gray');
        this.rightChoice.css('backgroundColor','gray');
        this.leftChoice = null;
        this.rightChoice = null;
        this.correctCount++;
        this.scoreboard = 'Correct Answer!<br>';
        
      } else {
        //alert ('failure');
        this.incorrectCount++;
        this.leftChoice.css('backgroundColor','white');
        this.rightChoice.css('backgroundColor','white');
        this.leftChoice = null;
        this.rightChoice = null;
        this.scoreboard = 'Sorry, that is incorrect.<br>';
        
}
      
      this.scoreboard += 'Correct: '+this.correctCount+'<br>';
      this.scoreboard += 'Incorrect: '+this.incorrectCount+'<br>';
      console.log('this.id is ' +this.id);
      $('#'+this.id+'Box .scoreboard').html(this.scoreboard);
    } // end check for both choices non-null
     
        
        
        
  } // end of findSuccessOrFailure
  
}; // END of Quiz.prototype

var quiz1;
var quiz2;
var quiz3;
var quiz4;
var crnt;

var Quizmanager ={

   potentialQuiz : {
    'quiz1' : quiz1,
    'quiz2' : quiz2,
    'quiz3' : quiz3,
    'quiz4' : quiz4,
  },

createQuiz : function(){ //set up a particular four quizzes at once. Broaden this to respect choice of user?
// console.log ('inside Quizmanager.createQuiz');
Quizmanager.potentialQuiz['quiz1'] = new Quiz('quiz1','oneLetter','threeLetter');//a simple test
Quizmanager.potentialQuiz['quiz2'] = new Quiz('quiz2','oneLetter','name');//a simple test
Quizmanager.potentialQuiz['quiz3'] = new Quiz('quiz3','threeLetter','name');//a simple test
Quizmanager.potentialQuiz['quiz4'] = new Quiz('quiz4','oneLetter','pK');//a simple test
console.log ('value of id inside quiz1 from outside is '+Quizmanager.potentialQuiz['quiz1'].id)
// quiz1 = new Quiz('quiz1','oneLetter','threeLetter');//a simple test
// quiz2 = new Quiz('quiz2','oneLetter','name');//a simple test
// quiz3 = new Quiz('quiz3','threeLetter','name');//a simple test
// quiz4 = new Quiz('quiz4','oneLetter','pK');//a simple test
}

} // end of literal object Quizmanager

 //EXECUTION BEGINS HERE 

//Create the buttons in code
buttonGroup.drawGroup(); // using the button group object


//that's basically it. Now we listen.

  //LISTENERS:
  
  //        sequence input detected
  $('#sequenceInput').blur(function() {sequenceCollection.processInputSequence(); }); 
  
  //       one of the AA buttons was clicked
  $('.button').live("click",function(){var buttonClicked = $(this);buttonGroup.clickOne(buttonClicked);});
  
  //        radio button click detected, selecting a new aa property to display
  $('input[name=propertyType]').click(function() {aaPropertyDisplay = $(this).attr('value');
    buttonGroup.paintButtonBackground(aaPropertyDisplay); // make the changes to background of buttons
  });

  $('#createQuiz').click(function(){
//  quiz1 = new Quiz('quiz1','oneLetter','threeLetter');//a simple test
//   quiz2 = new Quiz('quiz2','oneLetter','name');//a simple test
    Quizmanager.createQuiz();
  });
  
  $('td').live("click", function(){
  // console.log('content in listener is '+$(this).html());
//   console.log ('class in listeneris '+$(this).attr('class'));
  // from the class, figure out which quiz object to address this click to:
  var className = $(this).attr('class'); // something like 'right quiz4'
  var classArray = className.split(/ /);
//   console.log ('classname in listener element 0 followed by element 1: '+classArray[0]+ ' '+classArray[1]); // e.g. 0:right 1:quiz4
  Quizmanager.potentialQuiz[classArray[1]].getClickfromListener($(this));
  });
  
  
  
	// $('.button').live("mouseenter",function(){
// 	 console.log("mouseenter detected"); 
//   });
//   
// 	$('.button').live("mouseleave",function(){
// 	 console.log("mouseleave detected"); 
//   });
  
  
}); // END document.ready

