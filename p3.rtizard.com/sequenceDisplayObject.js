
$(document).ready(function() {

// Aa constructor function that initializes new aa objects.
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
  getOneLetter: function () { return this.oneLetter; } ,
  getName: function () { return this.name; } ,
  getThreeLetter: function () { return this.threeLetter; } ,
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
  },//end getChargeAtpH
  getMW : function(){
    return this.molWt;
  },
  getpK : function(){
    return this.pK;
  },
  getExtinction : function(){
    return this.extinction;
  },
  
}; // END of Aa.prototype

// buttonGroup OBJECT literal

var buttonGroup = {  // a literal object. Need not be instantiated. Only one 'instance' required. Syntax is different. Like "memory" game.
   
  drawGroup : function (){ // this is only done once at the beginning to create the 20 buttons. All other adjustments are by CSS
    var newHtml="";
    
    for(key in aa_array) { 
      var theLetter = aa_array[key].getOneLetter();
      var theName = aa_array[key].getName();
      newHtml +=  '<div class="button" id="'+theLetter+'" title="'+theName+'">'+theLetter+'</div>';
    }
    $('#residueButtons').html(newHtml);	
  } // end drawGroup
  ,
  
  clearClicked: function (){    // adjust the CSS so that all button text is black, in preparation for coloring a different one red
    $('.button').css('color','black');
  },
  
	clickOne : function (buttonClicked){
    $('#aaInfoBox').html('');
    $("#aaInfoBox").slideUp("fast");
    var letter = buttonClicked.html(); // let's see if this works! Yes, it does.
    //Call into sequenceCollection, supplying the letter to highlight, requesting new styled sequence
    sequenceCollection.restyle(letter);
    this.clearClicked(); // set all button text to black
    buttonClicked.css('color','red'); // now colorize the active one
    var html;
    
    //new Feature: list all properties for the aa below the residue button group
    var specLetter =''
        
    for(key in aa_array) { 
      specLetter = aa_array[key].getOneLetter();

      if(letter==specLetter){
        html = 'Amino Acid Properties';
        html += '<br>Name: '+aa_array[key].getName();
        html += '<br>1 Letter Code: '+specLetter;
        html += '<br>3 Letter Code: '+aa_array[key].getThreeLetter();
        html += '<br>Mol. weight: '+aa_array[key].getMW();
        html += '<br>pK: '+aa_array[key].getpK();
        html += '<br>Ext. coeff.: '+aa_array[key].getExtinction();
        $('#aaInfoBox').html(html);
        $("#aaInfoBox").slideDown("slow");
      }
    }
	}, // END OF clickOne

	paintButtonBackground : function (aaPropertyDisplay) {
	  var maxValue = 0;
    switch(aaPropertyDisplay) {
    case 'molWt': 
      
      for(key in aa_array) {      //first determine max value
        var MW=aa_array[key].getMW();
        if(MW>maxValue){
          maxValue = MW;
        }
      }
      // now that we know the maximum value, we can compare all others to this and use the opacity of the button to reflect the ratio.
      for(key in aa_array) {
        $('#'+aa_array[key].getOneLetter()).css('backgroundColor','rgba(255,0,0,'+0.6*aa_array[key].getMW()/maxValue+')');// here we let the max A channel value be 60%
      }
      
      $('#colorLegend').html('Darker <span id="legend1">button</span> background means higher molecular weight.');
      $('#legend1').css('backgroundColor', 'rgba(255,0,0,.4)');
    break;
    
    case 'pK': 
      //pK readout is different from others. Totally uncharged ones get white background
      //charged ones with pKs > 7 are in the blue range. Farthest from pH 7 is the strongest: highest pK.
      //charged ones less than 7 are in the yellow range. Farthest from pH 7 is the strongest: lowest pK.
      var nonZeroMinPk = 7; // Minimum value that is not zero
      for(key in aa_array) {       //first determine max value
        var pK = aa_array[key].getpK();
        if(pK>maxValue){
          maxValue = pK;
        }
        if((pK<nonZeroMinPk)&&(pK!=0)){
          nonZeroMinPk = pK; // we've found a better, lower value
        }
      }// end for
      
      // now we know the maximum and min values
      for(key in aa_array) {
        var pK = aa_array[key].getpK();
        if(pK>7){ // scale to the difference between pK and 7, compared to the maximum such value
          $('#'+aa_array[key].getOneLetter()).css('backgroundColor','rgba(153,153,255,'+1*(pK-7)/(maxValue-7)+')'); // here we let the max A channel value be 100%
        } else if (pK!=0){
         $('#'+aa_array[key].getOneLetter()).css('backgroundColor','rgba(204,204,0,'+1*(7-pK)/(7-nonZeroMinPk)+')');// here we let the max A channel value be 100%
        } else {  //uncharged: use white background
          $('#'+aa_array[key].getOneLetter()).css('backgroundColor','white');
        }
      }//end for
      
    $('#colorLegend').html('<span id="legend1">Yellow button</span> means acidic pK; <span id="legend2">violet</span>, basic pK. Darker is further from pH7.');
    $('#legend1').css('backgroundColor', 'rgba(204,204,0,.5)');
    $('#legend2').css('backgroundColor', 'rgba(153,153,255,.5)');
    break;
    
    case 'extinction': 
    for(key in aa_array) {
      //first determine max value
      var extinction=aa_array[key].getExtinction();
      if(extinction>maxValue){
        maxValue = extinction;
      }
    }
    // now that we know the maximum value, we can compare all others to this and use the opacity of the button to reflect the ratio.
    for(key in aa_array) {
      $('#'+aa_array[key].getOneLetter()).css('backgroundColor','rgba(0,0,255,'+0.6*aa_array[key].getExtinction()/maxValue+')');// here we let the max A channel value be 60%
    }
    $('#colorLegend').html('A colored <span id="legend1">button</span> shows an amino acid with absorption at 280nm (W>Y).');
    $('#legend1').css('backgroundColor', 'rgba(0,0,255,.2)');
    break;
    
    case 'count': 
    for(key in aa_array) {
      //first determine max value
      var count = aa_array[key].getCount();
      if(count>maxValue){
        maxValue = count;
      }
    }
      // now that we know the maximum value, we can compare all others to this and use the opacity of the button to reflect the ratio.
    for(key in aa_array) {
      $('#'+aa_array[key].getOneLetter()).css('backgroundColor','rgba(255,0,255,'+0.6*aa_array[key].getCount()/maxValue+')');// here we let the max A channel value be 60%
    }
    $('#colorLegend').html('Darker <span id="legend1">button</span> indicates higher count for that amino acid in your sequence.');
    $('#legend1').css('backgroundColor', 'rgba(255,0,255,.4)');
    break;
    
    default: 
    // console.log("unrecognized property value selected from radio buttons.")
    break;
    }	
	
	}// end of paintButtonBackground
	
} // end of buttonGroup

//Instantiate 20 objects inheriting from Aa.prototype, one for each amino acid, and store their properties. Following block is just to enable collapse of the code.
{ 
//Each will have a name, a one letter code, a three letter code, and a molecular weight.
//Zero for pK indicates that the side groups are uncharged. Acidic side groups have pKs less than 7, basic greater than 7
//Zero for extinction indicates that the side groups don't absorb UV light at 280nm (only W and Y do so).
//The boolean value addsToCharge is only significant for amino acids with charged side chains and the termini.
//Note that various sources have slightly different values for mol wt, pK, and extinction coefficient. These are from an old BioPerl implementation.
var A = new Aa('A','Ala','Alanine',71.08,0,0, 0, true);
var C = new Aa('C','Cys','Cysteine',103.14,8.3,0, 0, false); 
var D = new Aa('D','Asp','Aspartic Acid', 115.09, 3.91, 0, 0, false);
var E = new Aa('E','Glu','Glutamic Acid', 129.11, 4.25, 0, 0, false);
var F = new Aa('F','Phe','Phenylalanine', 147.17, 0, 0, 0, true);
var G = new Aa('G','Gly','Glycine', 57.05, 0, 0, 0, true);
var H = new Aa('H','His','Histidine', 137.14, 6.5, 0, 0, true);
var I = new Aa('I','Ile','Isoleucine', 113.16, 0, 0, 0, true);
var K = new Aa('K','Lys','Lysine', 128.17, 10.79, 0, 0, true);
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
} // end block of 22 object creation

// OBJECT SEQUENCE COLLECTION STARTS HERE AND STORES ALL VERSIONS OF THE SEQUENCE 
var sequenceCollection = {  // a literal object. Need not be instantiated. Only one 'instance' required. Syntax is different. Like "memory" game.

  // What the user input:
  inputSequence: "",
  
  // What was input stripped of characters that aren't valid AA codes;
  strippedSequence: "",
  
  // Our styled sequence, with 50 char lines, an index lines with dots at 10 aa intervals, and possibly span tags for colorization.
  styledSequence: "",
  
  // Height of the styled sequence, when it is automatically sized
  styledSequenceHeight: 0,
  
  styledSeqHeightCutoff : '400px',
  
  // Limit height of the styled sequence, true or false. Default is false. Only applies if native sequence height > styledSeqHeightCutoff.
  limitStyledSequenceHeight: false,
  
  //demo sequence for human MIS
  demoSequence: "        10         20         30         40         50         60 \nMRDLPLTSLA LVLSALGALL GTEALRAEEP AVGTSGLIFR EDLDWPPGSP QEPLCLVALG \n\n        70         80         90        100        110        120 \nGDSNGSSSPL RVVGALSAYE QAFLGAVQRA RWGPRDLATF GVCNTGDRQA ALPSLRRLGA \n\n       130        140        150        160        170        180 \nWLRDPGGQRL VVLHLEEVTW EPTPSLRFQE PPPGGAGPPE LALLVLYPGP GPEVTVTRAG \n\n       190        200        210        220        230        240 \nLPGAQSLCPS RDTRYLVLAV DRPAGAWRGS GLALTLQPRG EDSRLSTARL QALLFGDDHR \n\n       250        260        270        280        290        300 \nCFTRMTPALL LLPRSEPAPL PAHGQLDTVP FPPPRPSAEL EESPPSADPF LETLTRLVRA \n\n       310        320        330        340        350        360 \nLRVPPARASA PRLALDPDAL AGFPQGLVNL SDPAALERLL DGEEPLLLLL RPTAATTGDP \n\n       370        380        390        400        410        420 \nAPLHDPTSAP WATALARRVA AELQAAAAEL RSLPGLPPAT APLLARLLAL CPGGPGGLGD \n\n       430        440        450        460        470        480 \nPLRALLLLKA LQGLRVEWRG RDPRGPGRAQ RSAGATAADG PCALRELSVD LRAERSVLIP \n\n       490        500        510        520        530        540 \nETYQANNCQG VCGWPQSDRN PRYGNHVVLL LKMQVRGAAL ARPPCCVPTA YAGKLLISLS \n\n       550        560 \nEERISAHHVP NMVATECGCR \n",
  //demo sequence for human Factor VIII (longer chain than MIS)
  demoSequence2: "MQIELSTCFFLCLLRFCFSATRRYYLGAVELSWDYMQSDLGELPVDARFPPRVPKSFPFNTSVVYKKTLFVEFTDHLFNIAKPRPPWMGLLGPTIQAEVYDTVVITLKNMASHPVSLHAVGVSYWKASEGAEYDDQTSQREKEDDKVFPGGSHTYVWQVLKENGPMASDPLCLTYSYLSHVDLVKDLNSGLIGALLVCREGSLAKEKTQTLHKFILLFAVFDEGKSWHSETKNSLMQDRDAASARAWPKMHTVNGYVNRSLPGLIGCHRKSVYWHVIGMGTTPEVHSIFLEGHTFLVRNHRQASLEISPITFLTAQTLLMDLGQFLLFCHISSHQHDGMEAYVKVDSCPEEPQLRMKNNEEAEDYDDDLTDSEMDVVRFDDDNSPSFIQIRSVAKKHPKTWVHYIAAEEEDWDYAPLVLAPDDRSYKSQYLNNGPQRIGRKYKKVRFMAYTDETFKTREAIQHESGILGPLLYGEVGDTLLIIFKNQASRPYNIYPHGITDVRPLYSRRLPKGVKHLKDFPILPGEIFKYKWTVTVEDGPTKSDPRCLTRYYSSFVNMERDLASGLIGPLLICYKESVDQRGNQIMSDKRNVILFSVFDENRSWYLTENIQRFLPNPAGVQLEDPEFQASNIMHSINGYVFDSLQLSVCLHEVAYWYILSIGAQTDFLSVFFSGYTFKHKMVYEDTLTLFPFSGETVFMSMENPGLWILGCHNSDFRNRGMTALLKVSSCDKNTGDYYEDSYEDISAYLLSKNNAIEPRSFSQNSRHPSTRQKQFNATTIPENDIEKTDPWFAHRTPMPKIQNVSSSDLLMLLRQSPTPHGLSLSDLQEAKYETFSDDPSPGAIDSNNSLSEMTHFRPQLHHSGDMVFTPESGLQLRLNEKLGTTAATELKKLDFKVSSTSNNLISTIPSDNLAAGTDNTSSLGPPSMPVHYDSQLDTTLFGKKSSPLTESGGPLSLSEENNDSKLLESGLMNSQESSWGKNVSSTESGRLFKGKRAHGPALLTKDNALFKVSISLLKTNKTSNNSATNRKTHIDGPSLLIENSPSVWQNILESDTEFKKVTPLIHDRMLMDKNATALRLNHMSNKTTSSKNMEMVQQKKEGPIPPDAQNPDMSFFKMLFLPESARWIQRTHGKNSLNSGQGPSPKQLVSLGPEKSVEGQNFLSEKNKVVVGKGEFTKDVGLKEMVFPSSRNLFLTNLDNLHENNTHNQEKKIQEEIEKKETLIQENVVLPQIHTVTGTKNFMKNLFLLSTRQNVEGSYDGAYAPVLQDFRSLNDSTNRTKKHTAHFSKKGEEENLEGLGNQTKQIVEKYACTTRISPNTSQQNFVTQRSKRALKQFRLPLEETELEKRIIVDDTSTQWSKNMKHLTPSTLTQIDYNEKEKGAITQSPLSDCLTRSHSIPQANRSPLPIAKVSSFPSIRPIYLTRVLFQDNSSHLPAASYRKKDSGVQESSHFLQGAKKNNLSLAILTLEMTGDQREVGSLGTSATNSVTYKKVENTVLPKPDLPKTSGKVELLPKVHIYQKDLFPTETSNGSPGHLDLVEGSLLQGTEGAIKWNEANRPGKVPFLRVATESSAKTPSKLLDPLAWDNHYGTQIPKEEWKSQEKSPEKTAFKKKDTILSLNACESNHAIAAINEGQNKPEIEVTWAKQGRTERLCSQNPPVLKRHQREITRTTLQSDQEEIDYDDTISVEMKKEDFDIYDEDENQSPRSFQKKTRHYFIAAVERLWDYGMSSSPHVLRNRAQSGSVPQFKKVVFQEFTDGSFTQPLYRGELNEHLGLLGPYIRAEVEDNIMVTFRNQASRPYSFYSSLISYEEDQRQGAEPRKNFVKPNETKTYFWKVQHHMAPTKDEFDCKAWAYFSDVDLEKDVHSGLIGPLLVCHTNTLNPAHGRQVTVQEFALFFTIFDETKSWYFTENMERNCRAPCNIQMEDPTFKENYRFHAINGYIMDTLPGLVMAQDQRIRWYLLSMGSNENIHSIHFSGHVFTVRKKEEYKMALYNLYPGVFETVEMLPSKAGIWRVECLIGEHLHAGMSTLFLVYSNKCQTPLGMASGHIRDFQITASGQYGQWAPKLARLHYSGSINAWSTKEPFSWIKVDLLAPMIIHGIKTQGARQKFSSLYISQFIIMYSLDGKKWQTYRGNSTGTLMVFFGNVDSSGIKHNIFNPPIIARYIRLHPTHYSIRSTLRMELMGCDLNSCSMPLGMESKAISDAQITASSYFTNMFATWSPSKARLHLQGRSNAWRPQVNNPKEWLQVDFQKTMKVTGVTTQGVKSLLTSMYVKEFLISSSQDGHQWTLFFQNGKVKVFQGNQDSFTPVVNSLDPPLLTRYLRIHPQSWVHQIALRMEVLGCEAQDLY",
   
  useDemoSequence: function(){//called on click from the use demo list item.
    $('#sequenceInput').val(this.demoSequence);
    this.processInputSequence();
  },
  
  useDemoSequence2: function(){//called on click from the use demo list item.
    $('#sequenceInput').val(this.demoSequence2);
    this.processInputSequence();
  },
    
  processInputSequence : function(){// called on blur from the sequence input area (and from this.useDemoSequence)
    //Filters all characters that aren't valid amino acid codes to give strippedSequence, then styles that sequence
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
    
    // now that the sequence is available, allow the browser to set the height of that element
    $('#styledSequence').css({'height':'auto'});
    $('#styledSequence').html(styledVersion); // DIV VERSION --supports styling but no scroll bars?
    this.styledSequenceHeight = $('#styledSequence').css('height');
    
    // drive computation in the object which manages the dataMessageBox:
    displayComputedValues.processNewSequence(this.strippedSequence);
    //does this sequence call for the button to toggle between quiz and full sequence?
    Quizmanager.handleToggleAppearance();
    
    this.resizeStyledSequenceView();//if quiz already visible when a new seq is input, avoid crash of the two areas
    // Finally, paint the background:
    buttonGroup.paintButtonBackground($('input[type=radio]:checked').attr('value'));//paintButtonBackground needs the property from the radio buttons
  }, //END processInputSequence
  
  isSeqHeightExceeded : function (){
    //parseInt converts 1000px to 1000, an integer. This is larger than 700, an integer. If left as strings, 1000px < 700px (alphabetical) so comparison is wrong.
    return (parseInt(this.styledSequenceHeight) > parseInt(this.styledSeqHeightCutoff));// limit currently at 400px
  },

  resizeStyledSequenceView : function (){//replaces shrink and grow methods
    if (this.isSeqHeightExceeded()){ // if <= 400px (value of styledSeqHeightCutoff) the sequence can always be full size
      if(Quizmanager.isQuizDisplayed()){
      $('#styledSequence').css({'height': this.styledSeqHeightCutoff,'overflow-y': 'auto'}); // presents a vertical scroll bar if content otherwise hidden
    } else {
      $('#styledSequence').css({'height': this.styledSequenceHeight});
    }
  }

  }, // END resizeStyledSequenceView
  
  restyle : function(letter){// called on button click to highlight the relevant base in red throughout the styled sequence
    if(this.strippedSequence !=""){
      var re = new RegExp(letter, "g"); // create a RegExp Object matching this amino acid single letter code in a global fashion
      this.processInputSequence();//this obliterates earlier stuff done to the sequence, i.e. removes coloring <span> tags 
      var styledVersion = this.styledSequence;
      var numberFound = styledVersion.match(re);
      this.styledSequence = styledVersion.replace(re, '<span class="red">'+letter+'</span>'	);// colorizing span tags added here using replace
      $('#styledSequence').html(this.styledSequence); 
      var specLetter =''
        
      for(key in aa_array) { //scan the AA objects to get the name of the amino acid with single letter code 'letter'
        specLetter = aa_array[key].getOneLetter();
        if(letter==specLetter){
          var matchingName = aa_array[key].getName();
        }
      }
      $('#comment').html(matchingName+' (<span class="red">'+letter+'</span>) was found '+ numberFound.length +' times.');// compose the comment with name and letter (latter colorized)
   }

   }// END OF restyle

} // END OF literal object sequenceCollection

var displayComputedValues = { // literal object for managing the dataMessageBox of properties for the input sequence

  MW : '',
  pI : '',
  chargeAtpH7: '',
  extinction : '',
  messageDatabox : '',
  
  processNewSequence : function(strippedSequence){
    MW = this.computeMW(); //using the aa objects    
    pI = this.computePi();// new with animate objects
    chargeAtpH7 = this.calcChargeAtpH(7);
    extinction = this.computeExtinctionCoefficient();
    chargeAtpH7 = this.calcChargeAtpH(7);
    chargeAtpH7 = Math.round(chargeAtpH7*1000)/1000; // round to thousandths
    messageDatabox ="";

    if (strippedSequence!="") {
      messageDatabox = '<strong>Properties of your Protein:</strong><br>';
      messageDatabox += 'Chain length is '+strippedSequence.length+' amino acids.<br>';
      messageDatabox+='Molecular weight is '+MW+' daltons.<br>';
      messageDatabox+='Isoelectric point (pI) is '+pI+'.<br>'; //Add the pI value
      messageDatabox+='Charge at pH 7 is '+chargeAtpH7+'.<br>'; //Add the charge at neutral pH
      messageDatabox+='Extinction coefficient is '+extinction+' M<sup>-1</sup>cm<sup>-1</sup>.<br>'; //Add the Extinction coefficient value
    } else {
      messageDatabox = 'No valid sequence characters were input. Try again?<br>';
    }
   $('#dataBox').html(messageDatabox);
        
  }, // end of processNewSequence
              
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

//QUIZ CONSTRUCTOR -- Required because we want to implement multiple quizzes side by side
function Quiz(quiz_id,category1,category2) { 

  this.correctCount = 0;
  this.incorrectCount = 0;
  this.scoreboard = '';
  this.leftChoice = null; // null signifies no choice made in the column, else it will be the object clicked upon
  this.rightChoice = null; // ditto
  this.id = quiz_id;

  // Build the parallel arrays of data. column1 and column2 will become non-parallel shortly. Reference arrays will remain unshuffled to verify correctness of user's guesses.
  this.referenceColumn1 = [];
  this.referenceColumn2 = [];
  this.column1 = [];
  this.column2 = [];
  
  for (key in aa_array){
    this.referenceColumn1.push(aa_array[key][category1]); //Item1 in the reference array for column1 corresponds to item1 in the array for column2. i.e. correct match 
    this.referenceColumn2.push(aa_array[key][category2]);
    this.column1.push(aa_array[key][category1]);
    this.column2.push(aa_array[key][category2]);
  }
  
  //Shuffle the display arrays with function shuffle(obj) provided by Susan.
  shuffle(this.column1);
  shuffle(this.column2);
  var html = $('#quizArea').html();
    if(html==""){
      html="<h3 id='quizHead'>For each quiz, click an element in the left column and the one in the right column that matches it.</h3>";
    }

  var header1 = category1;//slightly crude table headers are e.g. 'oneLetter'
  var header2 = category2;
  html += '<div class="quizBox" id='+this.id+'Box><div class=scoreboard><br>Correct:0<br>Incorrect:0</div><table class="quizTable">';
  html +='<tr><th>'+header1+'</th><th>'+header2+'</th></tr>'
  for (var i =0; i<20;i++){
    html+='<tr><td class="left ' +quiz_id+'">'+this.column1[i]+'</td><td class="right ' +quiz_id+'">'+this.column2[i]+'</td><tr>';
  }
  html+='</table></div>';//terminating table, adding scoreboard, and terminating quizBox div

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
    if (objectClicked.html()!=''){ // disregard already matched and erased items
    var className = objectClicked.attr('class');
    var classArray = className.split(/ /);
    
    if (classArray[0]=='left'){  //left column click
      if (this.leftChoice == null) {
        this.leftChoice = objectClicked;
        objectClicked.css('backgroundColor','pink');// turn it pink while we think further!        
      } else { // there already is a left column button clicked. By defn, no right color button to compare to. 
        this.leftChoice.css('backgroundColor','white');// 
        this.leftChoice = objectClicked;
      }
    } else { //right column click
      if (this.rightChoice == null) {
        this.rightChoice = objectClicked;
        objectClicked.css('backgroundColor','pink');// turn it pink while we think further!        
      } else { // there already is a right column button clicked. By defn, no left color button to compare to. 
        this.rightChoice.css('backgroundColor','white');// 
        this.rightChoice = objectClicked;
      }
    } 
    var currentObject = this; // Bypasses problem that in the setTimout statement, 'this' is taken to mean the window object.
    $('.good').hide(); // previous 'good' and 'bad' statements in the scoreboard are both removed
    $('.bad').hide();// 'good' and 'bad' statements are  removed
    setTimeout(function() { currentObject.findSuccessOrFailure(); },250);//allow the click to register in the user's eye
  } // END if html not blank in clicked

  }, // END of getClickfromListener
  
  findSuccessOrFailure : function(){
    if ((this.leftChoice != null) && (this.rightChoice != null)) { // we have both left and right column choices. Do they match?
      for ( i=0; i<20; i++){
        if (this.referenceColumn1[i]==this.leftChoice.html()){
          var indexFound = i;
        }
      }
      if (this.referenceColumn2[indexFound]==this.rightChoice.html()){ // CORRECT CHOICE
        this.leftChoice.html('');
        this.rightChoice.html('');
        this.leftChoice.css('backgroundColor','gray');
        this.rightChoice.css('backgroundColor','gray');
        this.leftChoice = null;
        this.rightChoice = null;
        this.correctCount++;
        this.scoreboard = '<span class="good">Correct Answer!</span><br>';
      } else { // WRONG CHOICE
        this.incorrectCount++;
        this.leftChoice.css('backgroundColor','white');
        this.rightChoice.css('backgroundColor','white');
        this.leftChoice = null;
        this.rightChoice = null;
        this.scoreboard = '<span class="bad">Sorry, that is incorrect.</span><br>';
      }
      
      this.scoreboard += 'Correct: '+this.correctCount+'<br>';
      this.scoreboard += 'Incorrect: '+this.incorrectCount+'<br>';
      $('#'+this.id+'Box .scoreboard').html(this.scoreboard);
    } // END check for both choices non-null        
        
  } // END of findSuccessOrFailure
  
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
  
  quizIsDisplayed : false,// displayed vs. hidden, changes with each toggle click, of course only once createQuiz has happened
  
  quizIsActive : false,// quizzes drawn whether visible or not, once createQuiz has happened, this will be true for good
  
  isQuizDisplayed : function (){
    return this.quizIsDisplayed;
  },
  
  isQuizActive : function (){
    return this.quizIsActive;
  },
  
visibilityToggleClicked : function (){
    this.quizIsDisplayed = !(this.quizIsDisplayed);
    sequenceCollection.resizeStyledSequenceView(); 
    
    if(this.quizIsDisplayed){
      $('#quizArea').show();
      $('#visibilityToggle').html('Click to hide the quiz area');
    } else {
      $('#quizArea').hide();
      $('#visibilityToggle').html('Click to show the quiz area');

    }
  },
  
  handleToggleAppearance : function (){
    if((sequenceCollection.isSeqHeightExceeded())&&(this.isQuizActive())){ // logic: we want to see the button if quizzes were ever invoked, not whether they are currently displayed or not.
      $('#visibilityToggle').show();//button to switch between full sequence display (without quiz) and shortened display with quiz
    } else {
      $('#visibilityToggle').hide();
    }
  },

createQuiz : function(){ //set up a particular four quizzes at once. Broaden this to respect user's preference?
  Quizmanager.potentialQuiz['quiz1'] = new Quiz('quiz1','oneLetter','threeLetter');//a simple test
  Quizmanager.potentialQuiz['quiz2'] = new Quiz('quiz2','oneLetter','name');//a simple test
  Quizmanager.potentialQuiz['quiz3'] = new Quiz('quiz3','threeLetter','name');//a simple test
  Quizmanager.potentialQuiz['quiz4'] = new Quiz('quiz4','oneLetter','pK');//a simple test
  this.quizIsDisplayed = true; // visible? toggles
  this.quizIsActive = true; // will be true ever after
  $('#createQuiz').hide(); //hide the button (just clicked) which make quizzes
  sequenceCollection.resizeStyledSequenceView();
  this.handleToggleAppearance();
 }

} // end of literal object Quizmanager

//CREATE THE BUTTONS IN CODE
  buttonGroup.drawGroup(); // using the button group object, draw the 20 buttons

  $("#sequenceInput").tooltip();//jQuery enhanced tooltip for both sequence display areas
  $("#styledSequence").tooltip();
  $('#visibilityToggle').hide();//button to switch between full sequence display (without quiz) and shortened display with quiz

  //LISTENERS:
  
  //        sequence input detected
  $('#sequenceInput').blur(function() {sequenceCollection.processInputSequence(); }); 
  
   //        use the demo sequence rather than one input directly
  $('#demoSequence').click(function(){sequenceCollection.useDemoSequence(); });
   
   //        By popular demand, another longer demo sequence
  $('#demoSequence2').click(function(){sequenceCollection.useDemoSequence2(); });
  
  //       one of the AA buttons was clicked
  $('.button').live("click",function(){var buttonClicked = $(this);buttonGroup.clickOne(buttonClicked);});
  
  //        radio button click detected, selecting a new aa property to display
  $('input[name=propertyType]').click(function() {aaPropertyDisplay = $(this).attr('value');
    buttonGroup.paintButtonBackground(aaPropertyDisplay); // make the changes to background of buttons
  });
  
  //        the user asked for the default quiz set to be created. Make the quiz set and hide the button
  $('#createQuiz').click(function(){ Quizmanager.createQuiz();   });
 
  //        the user clicked to hide/reveal the quiz area and the full styled sequence
  $('#visibilityToggle').click(function(){Quizmanager.visibilityToggleClicked()});


  //        the user selected a value from one of the quizzes. Give it to the correct quiz
  $('td').live("click", function(){
  var className = $(this).attr('class'); // something like 'right quiz4'
  var classArray = className.split(/ /); //classArray[1] will have the object name for the quiz, required below
  Quizmanager.potentialQuiz[classArray[1]].getClickfromListener($(this));
  });
    
}); // END document.ready

