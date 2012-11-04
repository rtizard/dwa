<?php
class users_controller extends base_controller {

	public function __construct() {
		parent::__construct();
		#Specific css is added to an array which already has one element from the parent constructor method.
		#$this->$client_files[] = "/css/users.css"; # doesn't work so I use the following array_push invocation instead
		array_push($this->client_files, "/css/users.css"); # this works
		$this->template->client_files = Utils::load_client_files($this->client_files);   
	
	} 
		
	public function index() {
	if(!$this->user) {
		Router::redirect('/users/signupOrLogin/');
		} else {
		Router::redirect('/posts/index/');
		}
	}
		
	public function signup() {
		
		# Setup view
			$this->template->content = View::instance('v_users_signup');
			$this->template->title   = "Signup";
			
		# Render template
			echo $this->template;
		
	}
	
	public function p_signup() {
    
   # First error check: forbid signing up with an email address already in the DB
   
   	$q = "SELECT email 
		FROM users 
		WHERE email = '".$_POST['email']."'";
	
	$exists = DB::instance(DB_NAME)->select_field($q);	
	
    if (!$exists) { 
  		# no entry for that email exists, GOOD!
    	# Second error check: forbid signing up if either first or last name is blank

    	if (($_POST['first_name']!="") and ($_POST['last_name']!="")) {
        	# Third error check: forbid signing up if password less than 4 chars long. Eyeing "1234" as minimum!
			
			if (strlen($_POST['password'])>=4) {
			# the three trivial error checks have passed. Go ahead with processing the user's signup
			# Encrypt the password  
				$_POST['password'] = sha1(PASSWORD_SALT.$_POST['password']);
				
				   # More data we want stored with the user    
				$_POST['created']  = Time::now();
				$_POST['modified'] = Time::now();
				$_POST['token']    = sha1(TOKEN_SALT.$_POST['email'].Utils::generate_random_string());
						 
				# Insert this user into the database 
				$user_id = DB::instance(DB_NAME)->insert("users", $_POST);
				
				# A new user is defined to follow self -- add to users_users table
				
				$data = Array("created" => $_POST['created'],
							"user_id" => $user_id,
							"user_id_followed" => $user_id,
							);
				$dummyvariable = DB::instance(DB_NAME)->insert("users_users", $data);
				
				# ACTION REQUIRED: CONTINUE WITH AUTOLOGIN AT SUCCESSFUL signup
				# easier alternative: redirect to login only page with a welcoming message!
				#even easier, but UGLY, right back to this page without further ado.
		
				Router::redirect('/users/signupOrLogin/');


			} else { # password too short
				Router::redirect('/users/signupOrLogin/?error=signupPassword');
			}

    	} else { #bad firstname lastname combo
			Router::redirect('/users/signupOrLogin/?error=signupName');
    	}
				
    } else { # avoid duplicate entry: send back to signup with error.
    	Router::redirect('/users/signupOrLogin/?error=signupDuplicate&email='.$_POST['email']);
	}      
}
	
	public function login() {

	# Setup view
		$this->template->content = View::instance('v_users_login');
		$this->template->title   = "Login";
		
	# Render template
		echo $this->template;
	
	}

		
public function signupOrLogin($error = NULL) {

	# Setup the login portion of the view. Second view for signup follows below.

		$this->template->content = View::instance('v_users_loginAndSignup');
		
	
	# Compose error message from the URL composed by login_redirectNonCore for logins (elsewhere for signups) AUGMENT THIS
	
		if(!empty($_GET)) {
			$_GET = DB::instance(DB_NAME)->sanitize($_GET);
			
			switch ($_GET['error']) { # tampering with URI by the user will result in redirect without useful error message. OK result.
				case "email":
					$this->template->content->loginErrorMessage = "Your email address was not found. Please sign up or try logging in again.";	
					$this->template->content->signupErrorMessage = "" ; # no error
					break;
				case "password":
					$this->template->content->loginErrorMessage = "Your email address was found but your password was incorrect. Try logging in again?";	
					$this->template->content->signupErrorMessage = "" ; # no error
					break;
				case "signupDuplicate":
					$this->template->content->loginErrorMessage = "";	# no error
					$this->template->content->signupErrorMessage = "The supplied email address already exists. Please log in." ; 
					break;
				case "signupPassword":
					$this->template->content->loginErrorMessage = "";	# no error
					$this->template->content->signupErrorMessage = "Signup failed: your password must be at least 4 characters long. Please try again." ; 
					break;
				case "signupName":
					$this->template->content->loginErrorMessage = "";	# no error
					$this->template->content->signupErrorMessage = "Signup failed: your name is incomplete. Please try again." ; 
					break;

			}


		} else {# GET string is empty. Error in Neither login or signup
		$this->template->content->loginErrorMessage = "" ; # no error
		$this->template->content->signupErrorMessage = "" ; # no error
		}

		#Include the signup view on the same page
		#$this->template->content .= View::instance('v_users_signup');
	#TEST:
		#	$this->template->content->signupErrorMessage = "TEST SIGNUP ERROR" ; # no error

	
	# set the title
		$this->template->title   = "Signup, or Login for Returning Blipsters";

	# Render template
		echo $this->template;
	
}
	
	public function p_login() {
	
	# Sanitize the user entered data to prevent any funny-business (re: SQL Injection Attacks)
	$_POST = DB::instance(DB_NAME)->sanitize($_POST);
	
	# Hash submitted password so we can compare it against one in the db
	$_POST['password'] = sha1(PASSWORD_SALT.$_POST['password']);
	
	# Search the db for this email and password
	# Retrieve the token if it's available
	$q = "SELECT token 
		FROM users 
		WHERE email = '".$_POST['email']."' 
		AND password = '".$_POST['password']."'";
	
	$token = DB::instance(DB_NAME)->select_field($q);	
						
		if(!$token) {
			#login failed--go directly to local version of redirect method for troubleshooting and error reporting
			$this->login_redirectNonCore($token, $_POST['email'], "/posts/index/");

		
			} else {
			# Store this token in a cookie
			setcookie("token", $token, strtotime('+1 year'), '/');
		
			# manage NumLogins field in the database table users
		
			$q = "SELECT numLogins 
			FROM users 
			WHERE token = '".$token."'";
	
			$numLogins = DB::instance(DB_NAME)->select_field($q);	
			$numLogins = $numLogins + 1;
			 # Do the update on numLogins for the user
			$data = Array("numLogins" => $numLogins);
			DB::instance(DB_NAME)->update("users", $data, "WHERE token = '".$token."'");
   			#now use the local version of redirect method, somewhat unnecessarily!
			$this->login_redirectNonCore($token, $_POST['email'], "/posts/index/");
			}
					
} # end of p_login()
	
		
	/*-------------------------------------------------------------------------------------------------
	Where do we go after logging in / attempting to login? Slightly modified by RT from core version.
	-------------------------------------------------------------------------------------------------*/
	public function login_redirectNonCore($token, $email, $destination) {
		
		# Success - send them to their destination
		if($token) {
			Router::redirect($destination);
		}
		# Fail - try and figure out why
		else {
			# Do we even have a user with that email?
			$found_email = DB::instance(DB_NAME)->select_field("SELECT email FROM users WHERE email = '".$email."'");
						
			# If we found the email, then the problem must be the password
			$error = ($found_email) ? "password" : "email";
			
			# Send them back to the login page with a description of the error: email missing or bad password
			Router::redirect('/users/signupOrLogin/?error='.$error.'&email='.$email.'&ref='.$destination);
			#Router::redirect('/users/signupOrLogin/error='.$error.'&email='.$email);
			#simpler version for testing:
			#Router::redirect('/users/signupOrLogin/error'); # this works as is, but fails to reach page if preceeded by ?
		}
	
	}
	
	

	
	public function logout() {
    
    # Generate and save a new token for next login
    $new_token = sha1(TOKEN_SALT.$this->user->email.Utils::generate_random_string());
    
    # Create the data array we'll use with the update method
    # In this case, we're only updating one field, so our array only has one entry
    $data = Array("token" => $new_token);
    
    # Do the update
    DB::instance(DB_NAME)->update("users", $data, "WHERE token = '".$this->user->token."'");
    
    # Delete their token cookie - effectively logging them out
    setcookie("token", "", strtotime('-1 year'), '/');
    
  #  echo "You have been logged out.";
 # Send them back to the main landing page
	Router::redirect("/");
}

public function profile() {
 
    # If user is blank, they're not logged in, show message and don't do anything else
    if(!$this->user) {
    	Router::redirect('/users/signupOrLogin/');
    }
	
    # Setup view
    $this->template->content = View::instance('v_users_profile');
    $this->template->title   = "Profile of ".$this->user->first_name;
    
    $this->menuArray = Array
			("Change who you're following" => "/posts/users/", 
			"View and Add Posts" => "/posts/", 
			"Logout" => "/users/logout/",);
	$this->template->content->menuArray = $this->menuArray;
	
	# now the SQL-requiring values. First # of posts by the user. NOTE: COULDN'T GET COUNT SYNTAX RIGHT.
	#$q = "SELECT user_id
	#FROM posts
	#where user_id=$this->user->user_id";
	#$this->number_posted = DB::instance(DB_NAME)->select_field($q);
	#$this->template->content->number_posted = $this->number_posted;

    # Render template
    echo $this->template;
}
 	
} # end of the class
