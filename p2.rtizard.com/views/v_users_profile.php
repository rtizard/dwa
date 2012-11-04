<ul id="masterMenu">
<? foreach($menuArray as $key => $value): ?>
<li> <a href=<?=$value ?>><?=$key ?></a>
<? endforeach; ?>
</ul>

<h1>Profile for <?=$user->first_name?> <?=$user->last_name?></h1>
<body>
Time stamp for user creation: <?=$user->created?>.<br>
Member since: <?=$user->created?>.<br>
Number of logins: <?=$user->numLogins?>.<br>
Number of posts:<br>
Number of people followed:<br>
Number of followers:<br>
Interests:<br>
Current hometown:<br>
</body>