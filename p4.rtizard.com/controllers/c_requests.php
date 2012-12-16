<?php

class requests_controller extends base_controller {
  public $requests;
  public $singleton;
  public $submissions;
  public $requestObject;
  public function __construct() {
  parent::__construct();

  # Make sure user is logged in if they want to use anything in this controller
  if(!$this->user) {
    die("Members only. <a href='/users/login'>Login</a>");
  }
  array_push($this->client_files, "/js/requests.js"); 
    array_push($this->client_files, "ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js"); 
// <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js"></script>

	$this->template->client_files = Utils::load_client_files($this->client_files);   
  }

  public function index() {
  // query for all requests (simple example at the moment)
  // $q = 'SELECT request_id,constructName, program, date, projectSponsor, u.first_name,u.last_name
//   FROM requests r
//   INNER JOIN users u
//   on u.user_id = r.client_id;';
//  // where r.client_id ='. $this->user->user_id.';';
// 
//   # Run our query, store the results in the array $requests
//   $requests = DB::instance(DB_NAME)->select_rows($q);
  //    echo Debug::dump($requests,"Contents of requests array");
  //       # Setup view
  $this->template->content = View::instance('v_requests_index_stripped');
  $this->template->title   = "Requests";

  //      //  # Pass data to the view
//   $this->template->content->requests = $requests;

  //      # Render template
  echo $this->template;
  } // end of function index()

  public function p_fill_request_table2() {// AJAX reply. For now gives all or mine only requests back via JSON for display in the upper table
    //     echo 'my response button click';
    //     echo 'Option is '.$option;
  //   echo $option;
//     return;
   $baseQuery = 'SELECT request_id,constructName, program, date, projectSponsor, u.first_name,u.last_name
      FROM requests r
      INNER JOIN users u
      ON u.user_id = r.client_id';
    if($_POST['queryWhere']=='all'){ // still very basic set of query options: all or mine only
    $q = $baseQuery;
    } else { // only one other alternative at this point to 'all' for $option switch
      $q = $baseQuery.' where r.client_id ='. $this->user->user_id;
    }
    
    $q.= ' ORDER BY '.$_POST['sortField'];
    
    if($_POST['sortDirection']==2){
      $q.= ' DESC';
    }
    
    $q.= ';';//close the command, we're done!
    $toJavascriptConsole = '$q is '.$q;
//   echo $toJavascriptConsole;
//   return;
//     $debugResponse = '$q is '.
     // Javascript:   data: {queryWhere: queryWhere, sortField: sortIndicator['field'], sortDirection: sortIndicator['directionCode']},

    $requests = DB::instance(DB_NAME)->select_rows($q);
    //    echo Debug::dump($requests,"Contents of requests array");
    $requestObject = json_encode($requests);
    echo $requestObject;
  } // end of function p_fill_request_table2()

   public function p_fill_request_table($option) {//old style that injects directly into the page
//     echo 'my response button click';
//     echo 'Option is '.$option;
 # Set up view...
	# You're not using the master template, which is good. 
	# This is b/c you don't need the doctype, head, full page, etc...
	# You just need the "stub" of HTML which will get injected into the page
		$template = View::instance('v_requests_index_sub1');

  if($option=='all'){
  $q = 'SELECT request_id,constructName, program, date, projectSponsor, u.first_name,u.last_name
  FROM requests r
  INNER JOIN users u
  ON u.user_id = r.client_id;';
  } else { // only one other alternative at this point to 'all' for $option switch
   $q = 'SELECT request_id,constructName, program, date, projectSponsor, u.first_name,u.last_name
  FROM requests r
  INNER JOIN users u
  ON u.user_id = r.client_id
  where r.client_id ='. $this->user->user_id.';';
  }

	 # Run our query, store the results in the array $requests
  $requests = DB::instance(DB_NAME)->select_rows($q);

	# Pass data to the View
		$template->requests = $requests;

	# Render view...Whatever HTML we render is what JS will receive as a result of it's Ajax call
		echo $template;

  }
  
  public function p_getDetail($constructName) {
//      sleep(2);
     $q='SELECT request_id,constructName, program, date, constructDescription, coverageRequired, comment, hypotheticalSequence, predictedPeptide1,
    peptide1Description, predictedPeptide2, peptide2Description, projectCreated, projectCompleted, vhMoved, projectSponsor, u.first_name,u.last_name
    FROM requests r
    INNER JOIN users u
    ON u.user_id = r.client_id
    WHERE r.constructName ="'.$constructName.'";';
    $singleton = DB::instance(DB_NAME)->select_row($q);
   //echo $singleton;
   $requestObject = json_encode($singleton);
    echo $requestObject;

  }
  
  public function p_getSubmissions($request_id) {
//   sleep(2);
       $q='SELECT *
    FROM submissions
    WHERE request_id ="'. $request_id.'";';
    $submissions = DB::instance(DB_NAME)->select_rows($q);
     $requestObject = json_encode($submissions);
    echo $requestObject;
  }
  
  //MAKES A SINGLE JSON RESPONSE WITH DATA FROM BOTH TABLES:
    public function p_getDetailNew($constructName) {
     $q='SELECT request_id,constructName, program, date, constructDescription, coverageRequired, comment, hypotheticalSequence, predictedPeptide1,
    peptide1Description, predictedPeptide2, peptide2Description, projectCreated, projectCompleted, vhMoved, projectSponsor, u.first_name,u.last_name,u.user_id
    FROM requests r
    INNER JOIN users u
    ON u.user_id = r.client_id
    WHERE r.constructName ="'.$constructName.'";';
    $singleton = DB::instance(DB_NAME)->select_row($q);
   //echo $singleton;
     $request_id = $singleton['request_id'];
    $resultArray['request'] = ($singleton);
   // echo $requestObject;
//2nd db call    
      $q='SELECT *
    FROM submissions
    WHERE request_id ="'. $request_id.'";';
    $submissions = DB::instance(DB_NAME)->select_rows($q);
//      $requestObject = json_encode($submissions,$singleton);
       $resultArray['submissions'] =($submissions);
       $responseString = json_encode($resultArray);
       sleep(1);
 echo ($responseString);
//   echo ('request_id is '.$request_id.'  '.$responseString);
 }
    
} //end of class requests_controller

