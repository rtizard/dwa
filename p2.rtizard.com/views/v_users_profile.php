<ul id="masterMenu">
<? foreach($menuArray as $key => $value): ?>
<li> <a href=<?=$value ?>><?=$key ?></a>
<? endforeach; ?>
</ul>

<h1>Profile for <?=$user->first_name?> <?=$user->last_name?></h1>
<body>
Time stamp for user creation: <?=$user->created?>.<br>
Member since: <?=strftime('%c', $user->created)?>.<br>
Number of logins: <?=$user->numLogins?>.<br>
<p class = 'error'>This data intended to be readily extracted from the sql db defied me</p>
Number of posts: <?=$number_posted?><br>
Number of people followed:<br>
Number of followers:<br>
<p class = 'error'>Didn't budget enough time to solicit and store any personal data, nor to display profiles of non-self.</p>
Interests:<br>
Current hometown:<br>
</body>