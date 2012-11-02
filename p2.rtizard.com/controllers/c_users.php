<?php
class users_controller extends base_controller {

	public function __construct() {
		parent::__construct();
		$client_files = Array(
				"/css/users.css",
	            );
	
        $this->template->client_files = Utils::load_client_files($client_files);   
	
		#echo "users_controller __construct() was called<br><br>";
	} 
		
	public function index() {
		echo "Welcome to the users's department";
	}
		
	public function signup() {
		
		# Setup view
			$this->template->content = View::instance('v_users_signup');
			$this->template->title   = "Signup";
			
		# Render template
			echo $this->template;
		
	}
	
	public function p_signup() {
    
    # Dump out the results of POST to see what the form submitted
   # print_r($_POST);
    
    # Encrypt the password  
    $_POST['password'] = sha1(PASSWORD_SALT.$_POST['password']);
    
       # More data we want stored with the user    
    $_POST['created']  = Time::now();
    $_POST['modified'] = Time::now();
    $_POST['token']    = sha1(TOKEN_SALT.$_POST['email'].Utils::generate_random_string());
             
    # Insert this user into the database 
    $user_id = DB::instance(DB_NAME)->insert("users", $_POST);
    
}
	
	public function login() {

	# Setup view
		$this->template->content = View::instance('v_users_login');
		$this->template->title   = "Login";
		
	# Render template
		echo $this->template;
	
}

		
public function signupOrLogin($error = NULL) {

	# Setup view
	
	
		$this->template->content = View::instance('v_users_login');
		$this->template->content .= View::instance('v_users_signup');#commenting out this line doesn't help reveal error message.
		# Pass parameter data to the view
		$this->template->content->error = $error; # ERROR IS NOT APPEARING OUCH.
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
	Where do we go after logging in / attempting to login?
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
			
			# Send them back to the login page
			#Router::redirect('/users/signupOrLogin/?error='.$error.'&email='.$email.'&ref='.$destination);
			#simpler version for testing:
			Router::redirect('/users/signupOrLogin/error');
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
        echo "Members only. <a href='/users/login'>Login</a>";
        
        # Return will force this method to exit here so the rest of 
        # the code won't be executed and the profile view won't be displayed.
        return false;
    }
    
    # Setup view
    $this->template->content = View::instance('v_users_profile');
    $this->template->title   = "Profile of ".$this->user->first_name;
        
    # Render template
    echo $this->template;
}
 	
} # end of the class
