<?php

class posts_controller extends base_controller {

	public function __construct() {
		parent::__construct();
		
		$client_files = Array(
				"/css/posts.css",
	            );
	
        $this->template->client_files = Utils::load_client_files($client_files);   
	
		# Make sure user is logged in if they want to use anything in this controller
		if(!$this->user) {
			die("Members only. <a href='/users/signupOrLogin'>Return to Signup and Login Page</a>");
		}
		
	}
	
	public function add() {
	
		# Setup view
		$this->template->content = View::instance('v_posts_add');
		$this->template->title   = "Add a new post";
			
		# Render template
		echo $this->template;
	
	}
	
	public function index() { #new version, better function name would be showExistingAndAdd
	
	# Set up view
	$this->template->content = View::instance('v_posts_showAndAdd');
	$this->template->title   = "Posts";
	
	if(!empty($_GET)) {
		$_GET = DB::instance(DB_NAME)->sanitize($_GET);
		# switch statement is easily expanded to add additional cases, obviously.
		switch ($_GET['error']) { # tampering with URI by the user will result in redirect without useful error message. OK result.
			case "blankContent":
				$this->template->content->submitPostErrorMessage = "Your post had no content. Try again?";	
				break;
			case "badWord": # note that this case is actually not trapped for because Harvard is all for free self expression. This year.
				$this->template->content->submitPostErrorMessage = "Your post was too nasty for Harvard Extension School. Try again?";	
				break;				
		}

	} else {    # GET string is empty. Content is OK. 
	$this->template->content->submitPostErrorMessage = "" ; # no error
	}

	# Build a query of the users this user is following - we're only interested in their posts
	$q = "SELECT * 
		FROM users_users
		WHERE user_id = ".$this->user->user_id;
	
	# Execute our query, storing the results in a variable $connections
	$connections = DB::instance(DB_NAME)->select_rows($q);
	
	# In order to query for the posts we need, we're going to need a string of user id's, separated by commas
	# To create this, loop through our connections array
	$connections_string = "";
	foreach($connections as $connection) {
		$connections_string .= $connection['user_id_followed'].",";
	}
	
	# Remove the final comma 
	$connections_string = substr($connections_string, 0, -1);
	
	# Connections string example: 10,7,8 (where the numbers are the user_ids of who this user is following)

	# Now, lets build our query to grab the posts
	$q = "SELECT * 
		FROM posts 
		JOIN users USING (user_id)
		WHERE posts.user_id IN (".$connections_string.")"; # This is where we use that string of user_ids we created
				
	# Run our query, store the results in the variable $posts
	$posts = DB::instance(DB_NAME)->select_rows($q);
	
	# Pass data to the view
	$this->template->content->posts = $posts;

		# Render template
		echo $this->template;
	
	}

	
	public function p_add() {
			
		if ($_POST['content'] !="" ) {
		
		# Associate this post with this user
		$_POST['user_id']  = $this->user->user_id;
		
		# Unix timestamp of when this post was created / modified
		$_POST['created']  = Time::now();
		$_POST['modified'] = Time::now();
		
		# Insert
		# Note we didn't have to sanitize any of the $_POST data because we're using the insert method which does it for us
		DB::instance(DB_NAME)->insert('posts', $_POST);
		# Return to the same calling page to view the recent addition
		Router::redirect('/posts/index');

		} else { #content blank error, no record added to the DB
		Router::redirect('/posts/index/?error=blankContent');
		}
		
	}
	
	public function indexOld() {
	
	# Set up view
	$this->template->content = View::instance('v_posts_index');
	$this->template->title   = "Posts";
	
	# Build a query of the users this user is following - we're only interested in their posts
	$q = "SELECT * 
		FROM users_users
		WHERE user_id = ".$this->user->user_id;
	
	# Execute our query, storing the results in a variable $connections
	$connections = DB::instance(DB_NAME)->select_rows($q);
	
	# In order to query for the posts we need, we're going to need a string of user id's, separated by commas
	# To create this, loop through our connections array
	$connections_string = "";
	foreach($connections as $connection) {
		$connections_string .= $connection['user_id_followed'].",";
	}
	
	# Remove the final comma 
	$connections_string = substr($connections_string, 0, -1);
	
	# Connections string example: 10,7,8 (where the numbers are the user_ids of who this user is following)

	# Now, lets build our query to grab the posts
	$q = "SELECT * 
		FROM posts 
		JOIN users USING (user_id)
		WHERE posts.user_id IN (".$connections_string.")"; # This is where we use that string of user_ids we created
				
	# Run our query, store the results in the variable $posts
	$posts = DB::instance(DB_NAME)->select_rows($q);
	
	# Pass data to the view
	$this->template->content->posts = $posts;
	
	# Render view
	echo $this->template;
	
}	
	public function users() {

	# Set up the view
	$this->template->content = View::instance("v_posts_users");
	$this->template->title   = "Users";
	
	# Build our query to get all the users
	$q = "SELECT *
		FROM users";
		
	# Execute the query to get all the users. Store the result array in the variable $users
	$users = DB::instance(DB_NAME)->select_rows($q);
	
	# Build our query to figure out what connections does this user already have? I.e. who are they following
	$q = "SELECT * 
		FROM users_users
		WHERE user_id = ".$this->user->user_id;
		
	# Execute this query with the select_array method
	# select_array will return our results in an array and use the "users_id_followed" field as the index.
	# This will come in handy when we get to the view
	# Store our results (an array) in the variable $connections
	$connections = DB::instance(DB_NAME)->select_array($q, 'user_id_followed');
			
	# Pass data (users and connections) to the view
	$this->template->content->users       = $users;
	$this->template->content->connections = $connections;

	# Render the view
	echo $this->template;
	}

public function follow($user_id_followed) {
		
	# Prepare our data array to be inserted
	$data = Array(
		"created" => Time::now(),
		"user_id" => $this->user->user_id,
		"user_id_followed" => $user_id_followed
		);
	
	# Do the insert
	DB::instance(DB_NAME)->insert('users_users', $data);

	# Send them back
	Router::redirect("/posts/users");

	}

public function unfollow($user_id_followed) {

	# Delete this connection
	$where_condition = 'WHERE user_id = '.$this->user->user_id.' AND user_id_followed = '.$user_id_followed;
	DB::instance(DB_NAME)->delete('users_users', $where_condition);
	
	# Send them back
	Router::redirect("/posts/users");

	}
	
} # END OF CLASS