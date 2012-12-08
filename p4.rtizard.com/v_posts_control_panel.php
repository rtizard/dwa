Number of posts <div id='post_count'></div> 
Number of users <div id='users_count'></div> 
Date of the last created post <div id='last_created_post'></div> 

<button id='refresh'>Refresh</button>

<script type='text/javascript'>

	$('#refresh').click(function() {

		$.ajax({
			url: "/posts/p_control_panel",
			type: 'POST',
			success: function(response) {

				var data = $.parseJSON(response);

				$('#post_count').html(data['post_count']);
				$('#users_count').html(data['users_count']);
				$('#last_created_post').html(data['last_created_post']);

			},
		});	


	});

</script>

