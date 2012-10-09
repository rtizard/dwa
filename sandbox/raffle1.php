<!DOCTYPE html>
<html>
<head>
    <title>Raffle v1</title>

    <?php
    # Who are our contestants? 
        $contestants["Ethel"] = "";
        $contestants["Leroy"] = "";
        $contestants["Sam"]   = "";
        $contestants["Sandy"] = "";
            
    # Pick and print a winning number 
        $how_many_contestants = count($contestants);
        $winning_number       = rand(1,$how_many_contestants);
        
    # Loop through contestants, seeing if any won 
        foreach($contestants as $index => $this_contestant) {
            
            # Generate a random number
            $random_number = rand(1,$how_many_contestants);
            
            # See if their generated random  number mathches the winning number
            if($random_number == $winning_number) {
                $contestants[$index] = "Winner!";
            }
            else {
                $contestants[$index] = "Loser :(";            
            }        
        }
    ?>
    
</head>    
<body>
    Refresh to play again <br><br>
    
    The winning number is <?=$winning_number?>!<br><br>
        
    <?php foreach($contestants as $contestant => $winner_or_loser): ?>
        <?=$contestant?> is a <?=$winner_or_loser?><br>
    <?php endforeach; ?>
</body>
</html>