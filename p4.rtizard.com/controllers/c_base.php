<?php

class base_controller {
	
	public $user;
	public $userObj;
	public $template;
	public $email_template;
	public $client_files;
	public $menuArray;
	public $number_posted;

	/*-------------------------------------------------------------------------------------------------
	
	-------------------------------------------------------------------------------------------------*/
	public function __construct() {
	
		# Instantiate User class
			$this->userObj = new User();
			
		# Authenticate / load user
			$this->user = $this->userObj->authenticate();			
							
		# Set up templates
			$this->template 	  = View::instance('_v_template');
			$this->email_template = View::instance('_v_email');			
								
		# So we can use $user in views			
			$this->template->set_global('user', $this->user);
			
		# Site wide css file becomes first element of array accessible in other controllers. The other controllers must augment
		# and load the client files.
		$this->client_files = Array(
				"/css/sitewide.css",
	            );
		#menuArray assignment left here as a breadcrumb: it is changed before page load to respond to the needs of each page.
// 		$this->menuArray = Array("Change who you're following" => "/posts/users/", "Logout" => "/users/logout/", "View your profile" => "/users/profile/");

	}
	
} # eoc
