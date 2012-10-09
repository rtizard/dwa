<!Doctype HTML>
<html
<head>
<Title>Alternative Raffle 1</Title>

<?php
$contestants = array ('Ethel' => 1, 'Leroy' => 2, 'Sam' => 3, 'Sandy' => 4);

//$contestants["Ethel"] = 1;
//$contestants["Leroy"] = 2;
//$contestants["Sam"]   = 3;
//$contestants["Sandy"] = 4;
//   shuffle ($contestants); shuffle replaces the keys with 0,1,2, and 3. Useless.
$winningNumber = rand(1,count($contestants)+1);
    
    if ($winningNumber>count($contestants)) {
    $winningNumber = $winningNumber . ". The house wins :(";
    }
    else {
//Who won? Tag their index appropriately.

foreach($contestants as $name => $result) {
	if($winningNumber == $result){
$contestants[$name] =$contestants[$name] . ": the winner!";
}
	}
}
?>

</head>
<body>

Refresh to play again <br><br>
    
The winning number is <?=$winningNumber?><br><br>

<?php foreach($contestants as $name => $result): ?>
<?=$name?> is <?=$result?><br>
<?php endforeach; ?>

</body>
</html>