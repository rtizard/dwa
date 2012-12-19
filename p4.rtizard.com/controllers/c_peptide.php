<?php
class peptide_controller extends base_controller {

	public function __construct() {
		parent::__construct();
		
		  # Make sure user is logged in if they want to use anything in this controller
  		if(!($this->user)) {
			# Send them to login or signup
			Router::redirect("/users/signupOrLogin/");
			} 
		#Specific css is added to an array which already has one element from the parent constructor method.
		#$this->$client_files[] = "/css/users.css"; # doesn't work so I use the following array_push invocation instead
		array_push($this->client_files, "/css/peptide.css"); # this works
    array_push($this->client_files, "//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js");
    array_push($this->client_files, "//ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js");
    array_push($this->client_files, "http://code.jquery.com/ui/1.9.1/themes/base/jquery-ui.css");
    array_push($this->client_files, "/js/peptide.js");
		$this->template->client_files = Utils::load_client_files($this->client_files);   
	
	} // END __construct()
		

	public function index() {
      $this->template->content = View::instance('v_peptide_index');
        $this->template->title   = "Peptide Analysis and Gratuitous Quiz";
        $this->menuArray = Array("Jump to my proposal" => "/index/proposal/", "Logout" => "/users/logout/", "Request submissions" => "/requests/index/");
        $this->template->content->menuArray = $this->menuArray;

// 			$this->template->title   = "Signup"; // may be pushing out a posted sequence here
			# Render template
			echo $this->template;
		
	} //  END public function index()
	
//   public function p_sequenceInput() {
//   
//   
//     }

} // end of the class
