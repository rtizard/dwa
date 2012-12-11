$(document).ready(function() {
// *********************************************************************************************
// OBJECT *REQUEST LIST MANAGER* STARTS HERE AND MANAGES THE TABLE AT THE TOP OF INDEX PAGE 
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
            rowText='<tr class="active" id="'+responseObject[i].constructName+'">';
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
            userDataStore.privilegedInits = responseObject.privilegedInits;
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
    // Note that the actual return data is handled by another object (name TBD).
    
    requestDetailObject: {}, //requestDetailObject is the object consisting of the request details and related submission details
    
    currentRequestID: 0,
    
    userIsPrivileged: false, // this will be true or false for all requests, it is independent of the request
    
    userIsRequestOwner: false, // this will be true for some requests, false for others.
    
    setUserPrivilege: function (){ 
      this.userIsPrivileged = (userDataStore.get_privilegedInits()!="");
    }, //  END setUserPrivilege

      setUserIsRequestOwner: function (query_id){
      this.userIsRequestOwner=(userDataStore.get_user_id()==query_id);
    },
    
//     INSERT CODE THAT MAKES AJAX CALL AND LOADS DIV HERE

    getDetailData: function (callingObject){    
      var submissionArray;

      $.ajax({
        beforeSend: function() {
          $('td').removeClass('backgroundHighlight');
          $('#'+callingObject.attr('id')+'>td').addClass('backgroundHighlight');
          // Display a loading message while waiting for the Ajax call to complete
          $('.ajax-loader').show();
  //         $('#results').html("Loading...");
        },
        url: "/requests/p_getDetailNew/"+callingObject.attr('id')+"/",
        type: 'POST',
        success: function(response) {
          responseObject = jQuery.parseJSON(response);
          submissionDetailManager.setUserIsRequestOwner(responseObject.request.user_id);
        
          var i=0;
          while(responseObject.submissions[i] !== undefined){
            i++;
          }

  //         DISPLAY THE DETAILS.
  //            FIRST IN THE CASE THAT IT IS READ-ONLY: THEN IN THE CASE THAT IT IS READ-WRITE (OWNER OR PRIVILEGED IS USER)

          html = '';
          ownerName = responseObject.request.last_name + ', '+ responseObject.request.first_name;
  //         u.first_name,u.last_name
          if(submissionDetailManager.userIsRequestOwner ){ // for quick test. next line is the production version
  //         if(submissionDetailManager.userIsRequestOwner || submissionDetailManager.submissionDetailManager){
            $('#detailAreaLabel').html('<h4>Details for the selected request:</h4>');
            html +='<p class="fieldLabel">Construct name</p><input type="text" value ="'+responseObject.request.constructName+'" />';
            html +='<p class="fieldLabel">Client</p><input type="text" value ="'+ownerName+'" />';
          } else {        
            $('#detailAreaLabel').html('<h4>Details for the selected request (read only):</h4>');
            html +='<p class="fieldLabel">Construct name</p><p class="field">'+responseObject.request.constructName+'</p>';
            html +='<p class="fieldLabel">Client</p><p class="field">'+ownerName+'</p>';
          }        

          $('#requestDetailUpper1').html(html);
          html = '';
        
          if(submissionDetailManager.userIsRequestOwner ){ // for quick test. next line is the production version
            html +='<p class="fieldLabel">Program name</p><input type="text" value ="'+responseObject.request.program+'" />';
            html +='<p class="fieldLabel">Request Date</p><input type="text" value ="'+responseObject.request.date+'" />';

          } else { 
            html +='<p class="fieldLabel">Program name</p><p class="field">'+responseObject.request.program+'</p>';
            html +='<p class="fieldLabel">Request Date</p><p class="field">'+responseObject.request.date+'</p>';
          }

          $('#requestDetailUpper2').html(html);
          html = '';
        
          if(submissionDetailManager.userIsRequestOwner ){ // for quick test. next line is the production version
            html +='<p class="fieldLabel">Coverage required</p><input type="text" value ="'+responseObject.request.coverageRequired+'" />';
            html +='<p class="fieldLabel">Project Completed</p><input type="text" value ="'+responseObject.request.projectCompleted+'" />';
          } else { 
            html +='<p class="fieldLabel">Coverage required</p><p class="field">'+responseObject.request.coverageRequired+'</p>';
            html +='<p class="fieldLabel">Project completed</p><p class="field">'+responseObject.request.projectCompleted+'</p>';
          }
        
          $('#requestDetailUpper3').html(html);
          html = '';

          if(submissionDetailManager.userIsRequestOwner ){ // for quick test. next line is the production version
            html +='<p class="fieldLabel">Construct description</p><input type="textarea" value ="'+responseObject.request.constructDescription+'" />';
            html +='<p class="fieldLabel">Hypothetical Sequence</p><input type="textarea" value ="'+responseObject.request.hypotheticalSequence+'" />';
            html +='<p class="fieldLabel">Peptide1 Sequence</p><input type="textarea" value ="'+responseObject.request.predictedPeptide1+'" />';
          } else {
            html +='<p class="fieldLabel">Construct description</p><p class="bigField">'+responseObject.request.constructDescription+'</p>';
            html +='<p class="fieldLabel">Hypothetical sequence</p><p class="bigField">'+responseObject.request.hypotheticalSequence+'</p>';
            html +='<p class="fieldLabel">Peptide1</p><p class="bigField">'+responseObject.request.predictedPeptide1+'</p>';
          }
 
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
          while(responseObject.submissions[i] !== undefined){
            rowText='<tr>';
            rowText+='<td class="fixedWidth_column">'+responseObject.submissions[i].submission_id+'</td>';
            rowText+='<td class="fixedWidth_column">'+responseObject.submissions[i].sampleName+'</td>';
            rowText+='<td class="fixedWidth_column">'+responseObject.submissions[i].date+'</td>';
            rowText+='<td class="fixedWidth_column">'+responseObject.submissions[i].volume+'</td>';
            rowText+='<td class="fixedWidth_column">'+responseObject.submissions[i].concentration+'</td>';
            rowText+='<td class="fixedWidth_column">'+responseObject.submissions[i].prepType+'</td>';            
            rowText+='</tr>';
            tableText +=rowText;
            i++;
          }
          tableText +='</table>';
          html+=tableText;
          submissionDetailManager.requestDetailObject = responseObject; // by reference, store the request details pertaining
                // to the displayed request. Will need this to check for edits before push back to mysql.
          $('#requestDetailLower').html(html);
          $('.ajax-loader').hide(); // turn off the progress indicator, we're done
  //         $('#results').html(' ');
        } //END on success
      }); //END .AJAX method    
    } // END getDetailData
    
  } // END of object literal submissionDetailManager
 
 
// RUNS ON DOC READY
  requestListManager.setCurrentWhere('all');
  requestListManager.refreshTable();
  $('.ajax-loader').hide();
  userDataStore.setUserValues();
  submissionDetailManager.setUserPrivilege();
  
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
	

	  $('.active').live("click",function() {
//    Call the NEW SINGLE AJAX CALL METHOD TO RETURN A JSON STRING REPRESENTING BOTH REQUEST AND RELATED SUBMISSIONS
      submissionDetailManager.getDetailData($(this));
    }); // END  $('.active').live("click",function() 
  
  
    $('.headerSort').live("click",function() {
      sortField = $(this).attr('id');
      requestListManager.setSortValue(sortField);
      requestListManager.refreshTable();

    });
    
    
    $('#tempSort').click(function() {
      $('tr:has(#pRT001)>td').addClass('backgroundHighlight');
    });

}); //end doc ready

