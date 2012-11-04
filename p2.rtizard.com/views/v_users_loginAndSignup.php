<div id="loginContainer">
<h1 class="pageTitle">Welcome to BlipTide!</h1>
<form id="loginForm" method='POST' action='/users/p_login'>
<p class="formTitle">Returning? Please log in.</p>
   
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
<br><br>

<form id="signupForm" method='POST' action='/users/p_signup'>
<p class="formTitle">New here? Please sign up.</p>

	First Name<br>
	<input type='text' name='first_name'>
	<br><br>
	
	Last Name<br>
	<input type='text' name='last_name'>
	<br><br>

	Email<br>
	<input type='text' name='email'>
	<br><br>
	
	Password<br>
	<input type='password' name='password'>
	<br><br>
	
	<? if($signupErrorMessage !== ""): ?>
		<div class='error'>
		<?=$signupErrorMessage; ?>
		</div>
		<br>
	<? endif; ?>

 
    <input type='submit' value="Submit">

</form> 
</div>
