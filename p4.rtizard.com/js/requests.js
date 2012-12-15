$(document).ready(function() {
// *********************************************************************************************
// OBJECT *REQUEST LIST MANAGER* STARTS HERE AND MANAGES THE TABLE AT THE TOP OF INDEX PAGE, LISTING ALL REQUESTS
//    This include making ajax calls to fetch the existing request data, managing the column header sorting, filtering (rudimentary, only
//    allowing all records or my records only at present.
// *********************************************************************************************
  var requestListManager = {  // a literal object. Need not be instantiated. Only one 'instance' required. Syntax is different. Like "memory" game.

    currentWhereQuery: '', 
    
    setCurrentWhere: function(option){ 
      this.currentWhereQuery = option;
    },
    
    sortObj : {request_id : 1, last_name: 0, constructName:0, date:0, program:0, projectSponsor: 0},
    
    setSortValue: function(option){
//       For the column chosen to sort, if unsorted (0) or reverse sorted (2) currently then change to (1). If sorted ascending (1), then change to 2.
        switch(this.sortObj[option]){
          case(0):
            newValue = 1;
            this.zeroAllSortValues();
            this.sortObj[option] = newValue;
            break;
          case(1):
            newValue = 2;
            this.zeroAllSortValues();
            this.sortObj[option] = newValue;
            break;
          case(2):
            newValue = 1;
            this.zeroAllSortValues();
            this.sortObj[option] = newValue;
            break;
        }//end Switch
        
      }, //END OF setSortValue FUNCTION
    
    zeroAllSortValues: function(){
//     no matter which column was previously the sort column, by zeroing them all we'll zero it. Then new column is the only non zero column.
      for (i in this.sortObj){
        this.sortObj[i] = 0;
      }
    },
    
    returnSortCondition: function(){
//    find the field and direction selected, return in an array
      var returnArray =[];
        
      for (i in this.sortObj){
        if(this.sortObj[i]!=0){
          returnArray['field']=i;
          returnArray['directionCode']=this.sortObj[i];        
        }//end if
      }

      return returnArray;
    },
    
//     refreshTable is the big function here which populates the upper, request list, table based on filter and sort conditions user selected
//     An Ajax call is made into the requests controller p_fill_request_table2 and a JSON-encoded message returned with details on the sequence
//     request and any related sample records.
    refreshTable: function(){
      baseURL = '/requests/p_fill_request_table2/';
      
//       For now the only filter options are 1) no filter, 2) show mine only
      if (this.currentWhereQuery=='mine') {
        queryWhere = 'mine';
      } else {
        queryWhere = 'all';
      }
    
      sortIndicator = this.returnSortCondition();
            
    	$.ajax({ 
        url: baseURL,
        type: 'POST',
        data: {queryWhere: queryWhere, sortField: sortIndicator['field'], sortDirection: sortIndicator['directionCode']},
        success: function(response) {
          responseObject = jQuery.parseJSON(response); 

  //           BUILD THE TABLE IN HTML:

          var tableText = '<table>';
          tableText +='<tr>';
          tableText +='<th class="headerSort" id="request_id" class="fixedWidth_column">request_id</th>';
          tableText +='<th class="headerSort" id="last_name" class="fixedWidth_column">Client</th>';
          tableText +='<th class="headerSort" id="constructName" class="fixedWidth_column">Construct Name</th>';
          tableText +='<th class="headerSort" id="date" class="fixedWidth_column">Request Date</th>';
          tableText +='<th class="headerSort" id="program" class="fixedWidth_column">Program Name</th>';
          tableText +='<th class="headerSort" id="projectSponsor" class="fixedWidth_column">Sponsor</th>';
          tableText +='</tr>';

          var i=0;
          var rowText = '';
          while(responseObject[i] !== undefined){
            rowText='<tr class="requestRow" id="'+responseObject[i].constructName+'">';
            rowText+='<td class="fixedWidth_column">'+responseObject[i].request_id+'</td>';
            rowText+='<td class="fixedWidth_column">'+responseObject[i].last_name+', '+responseObject[i].first_name+'</td>';
            rowText+='<td class="fixedWidth_column">'+ responseObject[i].constructName+'</td>';
            rowText+='<td  class="fixedWidth_column">'+responseObject[i].date+'</td>';
            rowText+='<td class="fixedWidth_column">'+responseObject[i].program+'</td>';
            rowText+='<td class="fixedWidth_column">'+responseObject[i].projectSponsor+'</td>';
            rowText+='</tr>';
            tableText +=rowText;
            i++;
          }
          tableText +='</table>';

  //          SEND THE TABLE INTO THE DIV

          $('#requestList').html(tableText);
//            ADJUST THE CSS FOR THE CALLING HEADER TO SHOW TRIANGLE REFLECTING SORT CONDITION
          if (sortIndicator['directionCode']==1){
            $('#'+sortIndicator['field']).addClass('ascending');
          } else {
            $('#'+sortIndicator['field']).addClass('descending');
          }
    
        } // end SUCCESS: 
      });	// END $.ajax function
    }, //end FUNCTION refreshTable

  } // END OF OBJECT *REQUEST LIST MANAGER*
  
// *********************************************************************************************
// OBJECT *USER DATA STORE* STARTS HERE. IT FINDS AND MANAGES THE USER ID AND USER PRIVILEGE INITS
// *********************************************************************************************

  var userDataStore = {
    user_id: 0,
    privilegedInits: '',
    
    get_user_id: function(){
      return(this.user_id);
    },
    
    get_privilegedInits: function(){
      return(this.privilegedInits);
    },
    
    setUserValues : function() {
       $.ajax({ 
          url: '/users/p_provideCredentialsAjax/',
          type: 'POST', //no data sent at all.
          async: false,
          success: function(response) {
            responseObject = jQuery.parseJSON(response); 
            userDataStore.user_id = responseObject.user_id;
            userDataStore.privilegedInits = responseObject.privilegedInits;// if privilegedInits is blank, user is NOT a superuser 
          }
      });//END .AJAX call    
    } 
  } // END of object userDataStore
  
// *********************************************************************************************
// OBJECT *SUBMISSION DETAIL MANAGER* STARTS HERE. IT MANAGES THE DETAILS OF THE REQUEST AND 
//     SAMPLES SUBMITTED.
// *********************************************************************************************

  var submissionDetailManager ={
    // submissionDetailManager handles the acquisition and display of detailed information about the submission
    // this includes display of fields not included in the list view managed by requestListManager
    // as well as the related samples submitted for the project (submissions table)
    // Handles whether the data is read only or can be edited. Privileged members and record owners can edit, others cannot.
    // Privileged members are defined as having 'sponsor' initials in their user record and are the staff which fulfills the requests.
    // RT and SB are both privileged. Others are not.
    // Note that the return data is stored in requestDetailObject.
    
    // Clears the detail object. Also called when page is first ready to set up an 'empty' object 
    clearRequestDetailObject: function(){
      requestDetailObject=new Object();
      requestDetailObject.request = [];
      requestDetailObject.submissions=[];
    }, // END submissionDetailManager
    
    createNewRequest: function(){
      submissionDetailManager.clearRequestDetailObject();
      submissionDetailManager.drawDetailAreaOnPage();//use the data loaded into the requestDetailObject property and paint the page
      requestDetailObject.request['request_id']= -1; // -1 will be the temporary request_id
    
    }, //END createNewRequest
    
    
      // copy the existingObject fetched from the database with detailed info into this object    
    setRequestDetailObject: function(existingObject){
      this.clearRequestDetailObject();

      for (k in existingObject.request){
//       console.log ('k is '+k);
        requestDetailObject.request[k]=existingObject.request[k];
      }
      requestDetailObject.submissions=[];
      var i=0;
      var rowText = '';
      while(existingObject.submissions[i] !== undefined){
        requestDetailObject.submissions[i]=[];
        for (k in existingObject.submissions[i]){
          requestDetailObject.submissions[i][k]=existingObject.submissions[i][k];
        }
        i++;
      }

    }, //END setRequestDetailObject
    
    
    // Create the detail area with request and submission data from data in requestDetailObject
    // If requestDetailObject is empty, provide a read-write area for a new request
    // If object is not empty, area has input areas for editing the data for superusers or record owners
    //  Non-superuser non-record owners will see non-editable text.
    drawDetailAreaOnPage: function(){
      var displayCase;
      if (requestDetailObject.request.request_id == undefined){ //new
        displayCase = "RWNew"; // READ WRITE NEW RECORD
      } else if (submissionDetailManager.userIsRequestOwner){
      //  else if(submissionDetailManager.userIsRequestOwner || submissionDetailManager.submissionDetailManager){ // PRODUCTION SOON

        displayCase = "RWExisting"; // EDITING AN EXISTING RECORD
      } else {
        displayCase = "RO"; // READ ONLY FOR UNPRIVILEGED NON-RECORD OWNERS
      }// end if
      html = '';
      
      switch(displayCase){
          case("RWNew"):
            $('#detailAreaLabel').html('<h4>Please provide the details for a new request:</h4>');
            html +='<p class="fieldLabel">Construct name</p><input type="text" value ="" />';
//           html +='<p class="fieldLabel">Client</p><input type="text" value ="" />';     //BETTER: construct for current user!!    
//           html +='<p class="fieldLabel">Client (last, first)</p><input type="text" value ="" />';            
//           html +='<p class="fieldLabel">Client (first)</p><input type="text" value ="" />';            
            html +='<p class="fieldLabel">Client (last first)</p><input type="text" class="shortInput" value ="" />';            
            html +='<input type="text" class="shortInput" value ="" />';            
            break;
          case("RWExisting"):
            $('#detailAreaLabel').html('<h4>Details for the selected request:</h4>');
            html +='<p class="fieldLabel">Construct name</p><input type="text" value ="'+requestDetailObject.request.constructName+'" />';
            ownerName = requestDetailObject.request.last_name + ', '+ requestDetailObject.request.first_name;
            html +='<p class="fieldLabel">Client (last first)</p><input type="text" class="shortInput" value ="'+requestDetailObject.request.last_name+'" />';            
            html +='<input type="text" class="shortInput" value ="'+requestDetailObject.request.first_name+'" />';            
            break;
          case("RO"):
            $('#detailAreaLabel').html('<h4>Details for the selected request (read only):</h4>');
            html +='<p class="fieldLabel">Construct name</p><p class="field">'+requestDetailObject.request.constructName+'</p>';
            ownerName = requestDetailObject.request.last_name + ', '+ requestDetailObject.request.first_name;
            html +='<p class="fieldLabel">Client</p><p class="field">'+ownerName+'</p>';
        }//end Switch
        
        $('#requestDetailUpper1').html(html);//write out the leftmost pane
        html = '';
      

        switch(displayCase){
          case("RWNew"):
            html +='<p class="fieldLabel">Program name</p><input type="text" value ="" />';
            html +='<p class="fieldLabel">Request Date</p><input type="text" value ="" />';
           break;
          case("RWExisting"):
            html +='<p class="fieldLabel">Program name</p><input type="text" value ="'+requestDetailObject.request.program+'" />';
            html +='<p class="fieldLabel">Request Date</p><input type="text" value ="'+requestDetailObject.request.date+'" />';
            break;
          case("RO"):
            html +='<p class="fieldLabel">Program name</p><p class="field">'+requestDetailObject.request.program+'</p>';
            html +='<p class="fieldLabel">Request Date</p><p class="field">'+requestDetailObject.request.date+'</p>';
        }//end Switch

        $('#requestDetailUpper2').html(html);//write out the middle pane
        html = '';

        switch(displayCase){
          case("RWNew"):
            html +='<p class="fieldLabel">Coverage required</p><input type="text" value ="" />';
            html +='<p class="fieldLabel">Project Completed</p><input type="text" value ="" />';
           break;
          case("RWExisting"):
            html +='<p class="fieldLabel">Coverage required</p><input type="text" value ="'+requestDetailObject.request.coverageRequired+'" />';
            html +='<p class="fieldLabel">Project Completed</p><input type="text" value ="'+requestDetailObject.request.projectCompleted+'" />';

            break;
          case("RO"):
            html +='<p class="fieldLabel">Coverage required</p><p class="field">'+requestDetailObject.request.coverageRequired+'</p>';
            html +='<p class="fieldLabel">Project completed</p><p class="field">'+requestDetailObject.request.projectCompleted+'</p>';
        }//end Switch

        $('#requestDetailUpper3').html(html);//write out the rightmost pane
        html = '';

        switch(displayCase){
          case("RWNew"):
            html +='<p class="fieldLabel">Construct description</p><textarea></textarea>';
            html +='<p class="fieldLabel">Hypothetical Sequence</p><textarea></textarea>';
            html +='<p class="fieldLabel">Peptide1 Sequence</p><textarea></textarea>';
           break;
          case("RWExisting"):
            html +='<p class="fieldLabel">Construct description</p><textarea>'+requestDetailObject.request.constructDescription+'</textarea>';
            html +='<p class="fieldLabel">Hypothetical Sequence</p><textarea>'+requestDetailObject.request.hypotheticalSequence+'</textarea>';
            html +='<p class="fieldLabel">Peptide1 Sequence</p><textarea>'+requestDetailObject.request.predictedPeptide1+'</textarea>';
            break;
          case("RO"):
            html +='<p class="fieldLabel">Construct description</p><p class="bigField">'+requestDetailObject.request.constructDescription+'</p>';
            html +='<p class="fieldLabel sequenceContent">Hypothetical sequence</p><p class="bigField">'+requestDetailObject.request.hypotheticalSequence+'</p>';
            html +='<p class="fieldLabel sequenceContent">Peptide1</p><p class="bigField">'+requestDetailObject.request.predictedPeptide1+'</p>';
        }//end Switch


        var tableText = '<table>';
        tableText +='<tr>';
        tableText +='<th  id="submission_id" class="fixedWidth_column">submission_id</th>';
        tableText +='<th  id="sampleName" class="fixedWidth_column">Sample Name</th>';
        tableText +='<th  id="date" class="fixedWidth_column">Date</th>';
        tableText +='<th  id="volume" class="fixedWidth_column">Volume</th>';
        tableText +='<th  id="concentration" class="fixedWidth_column">Concentration</th>';
        tableText +='<th  id="prepType" class="fixedWidth_column">Prep Type</th>';
        tableText +='</tr>';

        var i=0;
        var rowText = '';
        while(requestDetailObject.submissions[i] !== undefined){
          rowText='<tr class="sampleRow">';
          rowText+='<td class="fixedWidth_column">'+requestDetailObject.submissions[i].submission_id+'</td>';
          rowText+='<td class="fixedWidth_column">'+requestDetailObject.submissions[i].sampleName+'</td>';
          rowText+='<td class="fixedWidth_column">'+requestDetailObject.submissions[i].date+'</td>';
          rowText+='<td class="fixedWidth_column">'+requestDetailObject.submissions[i].volume+'</td>';
          rowText+='<td class="fixedWidth_column">'+requestDetailObject.submissions[i].concentration+'</td>';
          rowText+='<td class="fixedWidth_column">'+requestDetailObject.submissions[i].prepType+'</td>';            
          rowText+='</tr>';
          tableText +=rowText;
          i++;
        }
        tableText +='</table>';
        html+=tableText;

        $('#requestDetailLower').html(html); // write out the large field data plus the table of related submissions

    
    },  //END drawDetailAreaOnPage
    
    currentRequestID: 0,
    
    userIsPrivileged: false, // this will be true or false for all requests, it is independent of the request
    
    userIsRequestOwner: false, // this will be true for some requests, false for others.
    
    setUserPrivilege: function (){ 
      this.userIsPrivileged = (userDataStore.get_privilegedInits()!="");
    }, //  END setUserPrivilege

      setUserIsRequestOwner: function (query_id){
      this.userIsRequestOwner=(userDataStore.get_user_id()==query_id);
    },
    
//    getServerDetailData goes to the database and gets all information for a request and its accompanying sample submissions 
//    The data is stored in a property of submissionDetailManager and then used to populate the page.
    getServerDetailData: function (callingFormObject){    
      var submissionArray;
      var responseObject;//test at 6:22pm on Tues
      $.ajax({
        beforeSend: function() {
          $('td').removeClass('backgroundHighlight');
          $('#'+callingFormObject.attr('id')+'>td').addClass('backgroundHighlight');
          // Display a loading message while waiting for the Ajax call to complete
          $('.ajax-loader').show();
        },
        url: "/requests/p_getDetailNew/"+callingFormObject.attr('id')+"/",
        type: 'POST',
        success: function(response) {
          responseObject = jQuery.parseJSON(response);
          requestDetailObject = jQuery.parseJSON(response);
          submissionDetailManager.setUserIsRequestOwner(responseObject.request.user_id);
          submissionDetailManager.setRequestDetailObject(responseObject); // store a copy of this object as a property of submissionDetailManager          
          submissionDetailManager.drawDetailAreaOnPage();//use the data just loaded into the requestDetailObject property and paint the page
          $('.ajax-loader').hide(); // turn off the progress indicator, we're done
        } //END on success
      }); //END .AJAX method    
    } // END getServerDetailData
    
  } // END of object literal submissionDetailManager
 
 
// RUNS ON DOC READY
  submissionDetailManager.clearRequestDetailObject();// creates a blank object

  requestListManager.setCurrentWhere('all');
  requestListManager.refreshTable();// load the list of existing requests
  userDataStore.setUserValues();
  submissionDetailManager.setUserPrivilege();// is the logged in user a 'super-user' who can edit all information, else only his/her own.
  $('.ajax-loader').hide(); // hide the spinning animation

// LISTENERS:

  $('#myRecords').click(function() {

	$.ajax({
			url: "/requests/p_fill_request_table/mine/",
			type: 'POST',
			success: function(response) {
      requestListManager.setCurrentWhere('mine');
      requestListManager.refreshTable();
			}
		});	
	});
	
  $('#allRecords').click(function() {

		$.ajax({
			url: "/requests/p_fill_request_table/all/",
			type: 'POST',
			success: function(response) {
      requestListManager.setCurrentWhere('all');
      requestListManager.refreshTable();
			}
		});	
	});
	

	  $('.requestRow').live("click",function() {
//    Call the NEW SINGLE AJAX CALL METHOD TO RETURN A JSON STRING REPRESENTING BOTH REQUEST AND RELATED SUBMISSIONS
      submissionDetailManager.getServerDetailData($(this));
    }); // END  $('.active').live("click",function() 
  
  
    $('.headerSort').live("click",function() {
      sortField = $(this).attr('id');
      requestListManager.setSortValue(sortField);
      requestListManager.refreshTable();

    });
    
    
    $('#tempSort').click(function() {
      $('tr:has(#pRT001)>td').addClass('backgroundHighlight');
    });

    $('#btnNewRequest').click(function() {
//     console.log (requestDetailObject.request.constructName);
      submissionDetailManager.createNewRequest();
    });

}); //end doc ready

