<!DOCTYPE html>
<html>
<head>
	<title><?=@$title; ?></title>

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />	
	
	<!-- JS -->
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js"></script>
				
	<!-- Controller Specific JS/CSS -->
	<?php echo @$client_files; ?>
	
</head>

<body>	

	<div id='menu'>
	
		<!-- Menu for users who are logged in -->
		<? if($user): ?>
			
			<a href='/users/logout'>Logout</a>
			<a href='/posts/users/'>Change who you're following</a>
			<a href='/posts/'>View posts</a>
			<a href='/posts/add'>Add a new post</a>
		
		<!-- Menu options for users who are not logged in -->	
		<? else: ?>
		
			<a href='/users/signup'>Sign up</a>
			<a href='/users/login'>Log in</a>
		
		<? endif; ?>
	
	</div>
	
	<br>

	<?=$content;?> 

</body>

</html>