<form method='POST' action='/users/p_login'>
<p class="formTitle">Returning? Please log in.</p>
   
   Email<br>
    <input type='text' name='email'>
    
    <br><br>
    
    Password<br>
    <input type='password' name='password'>
 
    <br><br>

	
   <? if($errorMessage !== ""): ?>
		<div class='error'>
		<?=$errorMessage; ?>
		</div>
		<br>
	<? endif; ?>

    <input type='submit' value="Submit">
 
</form>