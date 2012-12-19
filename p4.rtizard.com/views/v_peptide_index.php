<h2>Basic Protein Sequence Analysis</h2>
<ul id="masterMenu">
<? foreach($menuArray as $key => $value): ?>
<li> <a href=<?=$value ?>><?=$key ?></a>
<? endforeach; ?>
</ul>

<!-- Sequence Entry -->	
<h3>Instructions:</h3>

<div class='instruction'>
  <ol>
    <li>Start by entering a sequence below and tabbing out of the area. Editing by hand also works. Spaces and numbers will be removed.</li>
    <li>Don't have a sequence handy? Click <span id='demoSequence'>here</span> to use human MIS as a demonstration sequence.</li>
    <li>Want a longer demonstration sequence? Click <span id='demoSequence2'>here</span> to demo with human Factor VIII.</li>
    <li>Your formatted sequence will appear on the right. The chain length, molecular weight, isoelectric point, charge at pH 7, and molar extinction coefficient will be displayed above it.</li>
    <li>Click on one of the 20 amino acid residue buttons to count its appearances in your sequence, highlight it in the styled sequence, and list its properties.</li>
    <li>The color intensity of the 20 amino acid buttons encodes one of four possible values, selected from the radio buttons. Only the incidence count depends on your input sequence.</li>
  </ol>
</div>
<p><textarea name= 'inputSequence' title='Please paste your sequence here' cols='50' id='sequenceInput' class ='sequenceDisplay'></textarea></p>
<div class='error' id='sequenceError'></div>
<div id='dataBox'></div>
<div id='plainSequence' class ='sequenceDisplay'>
</div>

<div id='sequenceDisplay'>
    <div id='comment'>
  </div>
  <!-- <p><textarea name= 'styledSequence' title='Styled output here' cols='50' id='styledSequence' class ='sequenceDisplay alternateVisibility'></textarea></p>
-->
  <div id='styledSequence' title='Styled sequence output is displayed here' class ='sequenceDisplay alternateVisibility'> 
  </div>
</div>


<div id='residueButtons'>
</div>
 <div id='aaInfoBox'></div>

<div id='radioButtons'>
  <strong>Select property to colorize:</strong><br>
  <input type='radio' name='propertyType' value='count' checked><label for='count'>&nbsp;Incidence Count</label><br>
  <input type='radio' name='propertyType' value='molWt'><label for='molwt'>&nbsp;Molecular weight</label><br>
  <input type='radio' name='propertyType' value='pK'><label for='pk'>&nbsp;pK</label><br>
  <input type='radio' name='propertyType' value='extinction'><label for='extinction'>&nbsp;Extinction coefficient</label><br>	
  <div id='colorLegend'></div>
</div>

<div id='createQuiz'>Click to create a panel of 4 quizzes!</div>
<div id='visibilityToggle'>Click to hide the quiz</div>
<div id='quizArea' class='alternateVisibility'></div>

