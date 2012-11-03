

<table>
	<tr>
		<th class="fixedWidth_column">Poster</th>
		<th>Post</th>
	</tr>
	
<? foreach($posts as $post): ?>
	<tr>
		<td class="fixedWidth_column"><?=$post['first_name']?> <?=$post['last_name']?></td>
		<td><?=$post['content']?></td>
	</tr>
		
<? endforeach; ?>
</table>

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

