<ul id="masterMenu">
<? foreach($menuArray as $key => $value): ?>
<li> <a href=<?=$value ?>><?=$key ?></a>
<? endforeach; ?>
</ul>


<ul id="randomMenu">
<? foreach($tableArray as $tableName): ?>
<li> <a href='/data/table/?table=<?=$tableName ?>'><?=$tableName ?></a>
<? endforeach; ?>
</ul>
