<?php

class index_controller extends base_controller {

	public function __construct() {
		parent::__construct();
	} 
	
	/*-------------------------------------------------------------------------------------------------
	Access via http://yourapp.com/index/index/
	-------------------------------------------------------------------------------------------------*/
	public function index() {
		if(!($this->user)) {
			# Send them to login or signup
			Router::redirect("/users/signupOrLogin/");
			
			} else {
					
			# Send them onward, success
				Router::redirect("/requests/index/");
			}
	}
	
  public function proposal() {
//     array_push($this->client_files, "/css/styleProposal.css"); 
    $this->client_files[0] = "/css/styleProposal.css"; // replace sitewide.css, don't add an element to the array
    $this->template->client_files = Utils::load_client_files($this->client_files);
    $this->template->content = View::instance('v_index_proposal');
    echo $this->template;
  }		
} // end of class
