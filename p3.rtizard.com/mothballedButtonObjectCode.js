//BUTTON CONSTRUCTOR
function AaButton(oneLetter) {
this.oneLetter = oneLetter;
this.clicked = false;
this.color = ''; //rgba white
} // end of function AaButton

// BUTTON PROTOTYPE
AaButton.prototype = {

  setClick: function(state) { 
  this.clicked = state; 
  },
   
draw: function (){
  var html;
  


  html =  '<div class="button" id="'+this.oneLetter+'">'+this.oneLetter+'</div>';
//     console.log ('this.oneLetter is '+this.oneLetter);
  return html;
}
 
}; // END of AaButton.prototype

var A_button = new AaButton('A');
var C_button = new AaButton('C');
var D_button = new AaButton('D');
var E_button = new AaButton('E');
var F_button = new AaButton('F');
var G_button = new AaButton('G');
var H_button = new AaButton('H');
var I_button = new AaButton('I');
var K_button = new AaButton('K');
var L_button = new AaButton('L');
var M_button = new AaButton('M');
var N_button = new AaButton('N');
var P_button = new AaButton('P');
var Q_button = new AaButton('Q');
var R_button = new AaButton('R');
var S_button = new AaButton('S');
var T_button = new AaButton('T');
var V_button = new AaButton('V');
var W_button = new AaButton('W');
var Y_button = new AaButton('Y');
