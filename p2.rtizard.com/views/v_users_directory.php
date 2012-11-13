<ul id="masterMenu">
<? foreach($menuArray as $key => $value): ?>
<li> <a href=<?=$value ?>><?=$key ?></a>
<? endforeach; ?>
</ul>

<table>
	<tr>
		<th class="fixedWidth_column">Username</th>
		<th>email</th>
	</tr>
	
<? foreach($posts as $post): ?>
	<tr>
		<td class="fixedWidth_column"><?=$post['first_name']?> <?=$post['last_name']?></td>
		<td><?=$post['created']?></td>
		<td><?=$post['content']?></td>
	</tr>
<? endforeach; ?>
</table>

<br><br> 
<div class="error">
Note the following error on the site. The time stamp, meant to indicate when the post was
created, instead applies to the user. I don't have the time to fix this, else I would do so
and recast the time stamp as date and time, or delta from the present. SORRY!
</div>
<br><br>
<form method='POST' action='/posts/p_add'>
<p class="formTitle">Please enter content for a new post here and Submit.</p>

	<textarea  id='newPostContent' name='content'></textarea>
	<br>
	
   <? if($submitPostErrorMessage !== ""): ?>
		<br>
		<div class='error'>
		<?=$submitPostErrorMessage; ?>
		</div>
	<? endif; ?>
	<br>
   <input type='submit' value="Submit">

</form>


