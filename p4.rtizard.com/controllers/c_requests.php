<?php

class requests_controller extends base_controller {
  public $requests;
  public $singleton;
  public $samples;
  public $requestObject;
  public $ajaxStatusReturn;
  
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
        $this->template->content = View::instance('v_requests_index');
        $this->template->title   = "Requests";
        $this->menuArray = Array("Jump to my proposal" => "/index/proposal/", "Logout" => "/users/logout/");
        $this->template->content->menuArray = $this->menuArray;

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
  
  public function p_getsamples($request_id) {
//   sleep(2);
       $q='SELECT *
    FROM samples
    WHERE request_id ="'. $request_id.'";';
    $samples = DB::instance(DB_NAME)->select_rows($q);
     $requestObject = json_encode($samples);
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

        $request_id = $singleton['request_id'];
        $resultArray['request'] = ($singleton);

        //2nd db call    
        $q='SELECT *
            FROM samples
            WHERE request_id ="'. $request_id.'";';
        $samples = DB::instance(DB_NAME)->select_rows($q);
        $resultArray['samples'] =($samples);
        $responseString = json_encode($resultArray);
        sleep(.5);// just to give some elapsed time for the ajax spinner to entertain
//         sleep(1);// just to give some elapsed time for the ajax spinner to entertain
        echo ($responseString);
    } // end of function p_getDetailNew
    
    
      //ACCEPTS a JSON STRING WITH DATA FROM BOTH TABLES TO INJECT INTO MYSQL:
  public function p_processRequestUpdate() {
//   print_r($_POST);
// print_r ($_POST[jsonString]);
//return;
        $ajaxStatusReturn = "";
       $requestObject = json_decode(($_POST['jsonString']));//$ requestObject scope is controller wide
       
        if ($requestObject->request->dbAction!='none'){
//                      echo $requestObject->request->dbAction;
            $inputArray['constructName'] = $requestObject->request->constructName;
            $inputArray['program'] = $requestObject->request->program;
            $inputArray['date'] = $requestObject->request->date;
            $inputArray['constructDescription'] = $requestObject->request->constructDescription;
            $inputArray['coverageRequired'] = $requestObject->request->coverageRequired;
            $inputArray['hypotheticalSequence'] = $requestObject->request->hypotheticalSequence;
            $inputArray['predictedPeptide1'] = $requestObject->request->predictedPeptide1;
            $inputArray['projectSponsor'] = $requestObject->request->projectSponsor;
            $inputArray['client_id'] = $requestObject->request->user_id;

            if ($requestObject->request->dbAction=='create'){
                $dbResult = DB::instance(DB_NAME)->insert('requests', $inputArray);
                //    		print_r($inputArray); 
//                 NOTE THAT ECHOING THE RESULT WORKED GREAT WHEN IGNORING THE SAMPLE INFO. NEED SOMETHING HEAVIER DUTY 
//                  FOR BOTH AS SUCCESS/FAILURE INDICATOR
            echo $dbResult. ' should be the request_id autoincremented'; 
            $newRequestId = $dbResult;
            } elseif ($requestObject->request->dbAction=='update') {
                $dbResult = DB::instance(DB_NAME)->update("requests", $inputArray, "WHERE request_id =".$requestObject->request->request_id); 
//             echo $dbResult; 
            }

    }// end if dbaction is not none

        // NOW PROCESS THE SAMPLES, IF ANY REQUIRE IT.

//    print_r ($_POST[jsonString]);
    $i = 0;
    $returnValue = '';
//     echo $requestObject->samples->$i->sampleName; // SUCCESS YAY
//         while($requestObject->samples->$i !== undefined){
        while(isset($requestObject->samples->$i)){ // this works
            unset($inputArray); // we'll start fresh

//             $returnValue .= $requestObject->samples->$i->dbAction.' '; 
            if($requestObject->samples->$i->dbAction != 'none'){
                if($requestObject->samples->$i->request_id != -1){
                    $inputArray['request_id'] = $requestObject->samples->$i->request_id; // use the valid value
                } else {
                    $inputArray['request_id'] = $newRequestId; // use the newly created mysql-supplied ai value
                }
                $inputArray['sampleName'] = $requestObject->samples->$i->sampleName;
                $inputArray['date'] = $requestObject->samples->$i->date;
                $inputArray['volume'] = $requestObject->samples->$i->volume;
                $inputArray['concentration'] = $requestObject->samples->$i->concentration;
                $inputArray['prepType'] = $requestObject->samples->$i->prepType;
                
                if($requestObject->samples->$i->sample_id != -1){ // -1 by convention represents that it needs assignment
                    $inputArray['sample_id'] = $requestObject->samples->$i->sample_id;// supply the valid sample_id
                }  else { // id == -1
                    $requestObject->samples->$i->dbAction = 'create';// sloppy workaround for a subtle (?) bug where last in 
                }                                         // series sometimes set to update rather than create, but -1 id is cue to create
                  // value returned from the mysql insert

                if($requestObject->samples->$i->dbAction == 'create'){
                    $dbResult = DB::instance(DB_NAME)->insert('samples', $inputArray);
                } elseif ($requestObject->samples->$i->dbAction == 'update') {
                    $dbResult = DB::instance(DB_NAME)->update("samples", $inputArray, "WHERE sample_id =".$requestObject->samples->$i->sample_id); 
                }
            }        
            $i++;
        }
echo $returnValue;


 } // END of   public function p_processRequestUpdate
 

 // AJAX--Uniqueness check for suggested construct name: returns 0 if not a duplicate so ZERO IS SUCCESS
     public function p_validateConstructName() {
        $_POST = DB::instance(DB_NAME)->sanitize($_POST);
        $constructName = ($_POST['constructName']);
        $q = 'SELECT request_id 
            FROM requests
            WHERE constructName = "'.$constructName.'";';

        $dbResult = DB::instance(DB_NAME)->select_rows($q, $type = 'array');
        echo sizeof($dbResult); // number of rows, I'm hoping
    }
   
} //end of class requests_controller

