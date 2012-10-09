<!DOCTYPE html>
<html>
<head>
    <title>Test</title>

    <?php
    $this_var = "TESTING";
       ?>
    
</head>    
<body>
    Refresh to play again <br><br>
    

 
   this_var is <?php echo $this_var?> (with explicit echo)!<br><br>

This does not work with the = short_open_tag replacing echo, I need to edit my php.ini file.<br><br>

Also, my SSH session into ASO has failed with a broken pipe and attempts to reconnect time out. UGH.<br><br>

          this_var is <?php= $this_var?> (with long tag and =)!<br><br>

</body>
</html>