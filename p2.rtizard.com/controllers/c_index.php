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
				Router::redirect("/posts/index/");
								
			}

	}
			
} // end of class
