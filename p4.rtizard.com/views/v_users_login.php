<div id="smallLoginContainer">
<h1 class="pageTitle">Welcome to Sequence Support!</h1>

<form id="soleLoginForm" method='POST' action='/users/p_login'>

<p class="formTitle"><?=$banner ?></p>
   
   Email<br>
    <input type='text' name='email'>
    
    <br><br>
    
    Password<br>
    <input type='password' name='password'>
 
    <br><br>

	
   <? if($loginErrorMessage !== ""): ?>
		<div class='error'>
		<?=$loginErrorMessage; ?>
		</div>
		<br>
	<? endif; ?>

    <input type='submit' value="Submit">
 
</form>
</div>