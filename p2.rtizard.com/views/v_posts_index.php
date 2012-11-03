

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