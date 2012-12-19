<?php
class data_controller extends base_controller {

	public function __construct() {
		parent::__construct();
		#Specific css is added to an array which already has one element from the parent constructor method.
		#$this->$client_files[] = "/css/users.css"; # doesn't work so I use the following array_push invocation instead
		#array_push($this->client_files, "/css/users.css"); # this works
		#$this->template->client_files = Utils::load_client_files($this->client_files);   
	
	} 

	public function index() {
		#$this->template->content = View::instance('v_users_signup');
		$q = "SHOW TABLES";
		#$tableDump = DB::instance(DB_NAME)->select_rows($q);

		#array(3) { 
		# [0]=> array(1) { ["Tables_in_rtizardc_p2_rtizard_com"]=> string(5) "posts" } 
		# [1]=> array(1) { ["Tables_in_rtizardc_p2_rtizard_com"]=> string(5) "users" } 
		# [2]=> array(1) { ["Tables_in_rtizardc_p2_rtizard_com"]=> string(11) "users_users" } }
		
		$tableDump = DB::instance(DB_NAME)->select_rows($q,"array");
		#array(3) 
		#{ [0]=> array(2) { [0]=> string(5) "posts" ["Tables_in_rtizardc_p2_rtizard_com"]=> string(5) "posts" }
		#[1]=> array(2) { [0]=> string(5) "users" ["Tables_in_rtizardc_p2_rtizard_com"]=> string(5) "users" } 
		#[2]=> array(2) { [0]=> string(11) "users_users" ["Tables_in_rtizardc_p2_rtizard_com"]=> string(11) "users_users" } }

		#$this->template->content = var_dump($tableDump);
		$i=0;
		$tableArray = array();
		
		foreach ($tableDump as $row){
		#echo $row[0].", ";
		$tableArray[$i] = $row[0];
		$i++;
		}
		$this->template->content = View::instance('v_data_index');
		$this->template->content->tableArray = $tableArray;
		#$this->template->content = var_dump($tableArray);
		$this->template->title   = "Data";
			
		# Render template
			echo $this->template;

	}
	


} # end of Class 