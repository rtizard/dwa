$(document).ready(function() {
// *********************************************************************************************
// OBJECT *REQUEST LIST MANAGER* STARTS HERE AND MANAGES THE TABLE AT THE TOP OF INDEX PAGE, LISTING ALL REQUESTS
//    This include making ajax calls to fetch the existing request data, managing the column header sorting, filtering (rudimentary, only
//    allowing all records or my records only at present.
// *********************************************************************************************
  var requestListManager = {  // a literal object.  

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
    refreshTable: function(highlightID){
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
    
        if (highlightID != ""){// passthru the row in the table that should be highlighted, if one was sent as parameter
            requestListManager.setHighlightRow(highlightID);
        }
        } // end SUCCESS: 
      });	// END $.ajax function
    }, //end FUNCTION refreshTable

    setHighlightRow: function(inputId){
    $('td').removeClass('backgroundHighlight');// unhighlight the line, if any, highlighted in the request list at the top of the page.
    console.log('in setHighlightRow with Id input of '+inputId);
        if (inputId != ""){
        console.log('passed into the if inputID !="" block. Selector = '+'#'+inputId+'>td'); 
            $('#'+inputId+'>td').addClass('backgroundHighlight');   
        }
    }

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

    get_lastName: function(){
      return(this.last_name);
    },
    
    get_firstName: function(){
      return(this.first_name);
    },
    
    get_date: function(){
      return(this.currentDate);
    },
    
    setUserValues : function() {
//     console.log ('in setUserValues');
       $.ajax({ 
          url: '/users/p_provideCredentialsAjax/',
          type: 'POST', //no data sent at all.
          async: false,
          success: function(response) {
            responseObject = jQuery.parseJSON(response);
            console.log(responseObject);
            userDataStore.user_id = responseObject.user_id;
            userDataStore.privilegedInits = responseObject.privilegedInits;// if privilegedInits is blank, user is NOT a superuser 

            if(!userDataStore.privilegedInits){
              userDataStore.privilegedInits= ''; //convert null to empty string.
            }
            userDataStore.privilegedInits = responseObject.privilegedInits;// if privilegedInits is blank, user is NOT a superuser 
            userDataStore.last_name = responseObject.last_name;
            userDataStore.first_name = responseObject.first_name;
            dateToday = new Date();
            userDataStore.currentDate = $.datepicker.formatDate('yy-mm-dd',dateToday);
            console.log ('userDataStore.currentDate is '+userDataStore.currentDate);
//             console.log ('formattedDate is '+formattedDate);
 
//             console.log ('userDataStore.last_name is '+userDataStore.last_name);
          }
      });//END .AJAX call    
    } 
  } // END of object userDataStore
  
// *********************************************************************************************
// OBJECT *REQUEST DETAIL MANAGER* STARTS HERE. IT MANAGES THE DETAILS OF THE REQUEST AND 
//     SAMPLES SUBMITTED.
// *********************************************************************************************

  var requestDetailManager ={
    // requestDetailManager handles the acquisition and display of detailed information about the submission
    // this includes display of fields not included in the list view managed by requestListManager
    // as well as the related samples submitted for the project (submissions table)
    // Handles whether the data is read only or can be edited. Privileged members and record owners can edit, others cannot.
    // Privileged members are defined as having 'sponsor' initials in their user record and are the staff which fulfills the requests.
    // RT and SB are both privileged. Others are not.
    // Note that the return data is stored in requestDetailObject.
    
    // Clears the detail object. Also called when page is first ready to set up an 'empty' object 
    clearRequestDetailObject: function(){
      requestDetailObject=new Object();

      requestDetailObject.request=new Object();
            requestDetailObject.submissions=new Object();

      
   //    requestDetailObject.request = [];
//       requestDetailObject.submissions=[];
    }, // END clearRequestDetailObject

    createNewRequest: function(){
       requestListManager.setHighlightRow("");//unhighlight any existing highlighted line--it isn't current, this new one is.

     //  $('td').removeClass('backgroundHighlight');// unhighlight the line, if any, highlighted in the request list at the top of the page.
        requestDetailManager.clearRequestDetailObject();
        requestDetailObject.request['user_id']=userDataStore.get_user_id();
//         console.log('in createNewRequest userDataStore.get_user_id() returns '+userDataStore.get_user_id());
        requestDetailObject.request['request_id']= -1; // -1 will be the temporary request_id
        requestDetailObject.request['dbAction']= 'create'; // dbAction dictates what the mysql db will need to do
        requestDetailObject.request['last_name']=userDataStore.get_lastName();
        requestDetailObject.request['first_name']=userDataStore.get_firstName();
        requestDetailObject.request['date']=userDataStore.get_date();
        requestDetailObject.request['constructName']='';
        requestDetailObject.request['program']='';
        requestDetailObject.request['constructDescription']='';
        requestDetailObject.request['coverageRequired']='';
        requestDetailObject.request['comment']='';
        requestDetailObject.request['hypotheticalSequence']='';
        requestDetailObject.request['predictedPeptide1']='';
        requestDetailObject.request['peptide1Description']='';
        requestDetailObject.request['predictedPeptide2']='';
        requestDetailObject.request['peptide2Description']='';
        requestDetailObject.request['projectCreated']='';
        requestDetailObject.request['projectCompleted']='';
        requestDetailObject.request['vhMoved']='';
        requestDetailObject.request['projectSponsor']='';
        requestDetailManager.drawDetailAreaOnPage();//use the mostly-empty data loaded into the requestDetailObject property and paint the page (NO samples)
    }, //END createNewRequest
    
    
      // copy the existingObject fetched from the database with detailed info into this object    
    setRequestDetailObject: function(existingObject){
      this.clearRequestDetailObject();

      for (k in existingObject.request){
//       console.log ('k is '+k);
        requestDetailObject.request[k]=existingObject.request[k];
      }
      requestDetailObject.request['dbAction']= 'none'; // dbAction dictates what the mysql db will need to do
//       requestDetailObject.submissions=[]; // should be superfluous since this is already done by clear object method
      var i=0;
      var rowText = '';
      while(existingObject.submissions[i] !== undefined){
        requestDetailObject.submissions[i]=new Object();
        for (k in existingObject.submissions[i]){
//       console.log ('k is '+k);
          requestDetailObject.submissions[i][k]=existingObject.submissions[i][k];
        }
        requestDetailObject.submissions[i]['dbAction']= 'none'; // dbAction dictates what the mysql db will need to do
        i++;
      }

    }, //END setRequestDetailObject
    
    
    // Create the detail area with request and submission data from data in requestDetailObject
    // If requestDetailObject is empty, provide a read-write area for a new request
    // If object is not empty, area has input areas for editing the data for superusers or record owners
    //  Non-superuser non-record owners will see non-editable text.
    drawDetailAreaOnPage: function(){
      var displayCase;
      if (requestDetailObject.request.dbAction == 'create'){ //new
        displayCase = "RWNew"; // READ WRITE NEW RECORD
      } else if (requestDetailManager.userIsRequestOwner){
      //  else if(requestDetailManager.userIsRequestOwner || requestDetailManager.requestDetailManager){ // PRODUCTION SOON

        displayCase = "RWExisting"; // EDITING AN EXISTING RECORD
      } else {
        displayCase = "RO"; // READ ONLY FOR UNPRIVILEGED NON-RECORD OWNERS
      }// end if
      html = '';
      
      switch(displayCase){
          case("RWNew"):
            $('#detailAreaLabel').html('<h4>Please provide the details for a new request:</h4>');
            html +='<p class="fieldLabel">Construct name</p><input type="text" id="input_constructName" value ="" />';
//           html +='<p class="fieldLabel">Client</p><input type="text" value ="" />';     //BETTER: construct for current user!!    
//           html +='<p class="fieldLabel">Client (last, first)</p><input type="text" value ="" />';            
//           html +='<p class="fieldLabel">Client (first)</p><input type="text" value ="" />';            
            html +='<p class="fieldLabel">Client (last first)</p><input type="text" id="input_last_name" class="shortInput" value ="'+requestDetailObject.request.last_name+'" />';            
            html +='<input type="text" id="input_first_name" class="shortInput" value ="'+requestDetailObject.request.first_name+'" />';            
            break;
          case("RWExisting"):
            $('#detailAreaLabel').html('<h4>Details for the selected request:</h4>');
            html +='<p class="fieldLabel">Construct name</p><input type="text" id="input_constructName" value ="'+requestDetailObject.request.constructName+'" />';
            ownerName = requestDetailObject.request.last_name + ', '+ requestDetailObject.request.first_name;
            html +='<p class="fieldLabel">Client (last first)</p><input type="text" class="shortInput" id="input_last_name" value ="'+requestDetailObject.request.last_name+'" />';            
            html +='<input type="text" id="input_first_name" class="shortInput" value ="'+requestDetailObject.request.first_name+'" />';            
            break;
          case("RO"):
            $('#detailAreaLabel').html('<h4>Details for the selected request (read only):</h4>');
            html +='<p class="fieldLabel">Construct name</p><input type="text" id="input_constructName" readonly="true" value ="'+requestDetailObject.request.constructName+'" />';
            ownerName = requestDetailObject.request.last_name + ', '+ requestDetailObject.request.first_name;
            html +='<p class="fieldLabel">Client (last first)</p><input type="text" class="shortInput" id="input_last_name" readonly="true" value ="'+requestDetailObject.request.last_name+'" />';            
            html +='<input type="text" id="input_first_name" class="shortInput" readonly="true" value ="'+requestDetailObject.request.first_name+'" />';            
//             html +='<p class="fieldLabel">Construct name</p><p class="field">'+requestDetailObject.request.constructName+'</p>';
//             ownerName = requestDetailObject.request.last_name + ', '+ requestDetailObject.request.first_name;
//             html +='<p class="fieldLabel">Client</p><p class="field">'+ownerName+'</p>';
        }//end Switch
        
        $('#requestDetailUpper1').html(html);//write out the leftmost pane
        html = '';
      

        switch(displayCase){
          case("RWNew"):
            html +='<p class="fieldLabel">Program name</p><input type="text" id="input_program" value ="" />';
            html +='<p class="fieldLabel">Request Date</p><input type="text" id="input_date" value ="'+requestDetailObject.request.date+'" />';
           break;
          case("RWExisting"):
            html +='<p class="fieldLabel">Program name</p><input type="text" id="input_program" value ="'+requestDetailObject.request.program+'" />';
            html +='<p class="fieldLabel">Request Date</p><input type="text" id="input_date" value ="'+requestDetailObject.request.date+'" />';
            break;
          case("RO"):
            html +='<p class="fieldLabel">Program name</p><input type="text" id="input_program" readonly="true" value ="'+requestDetailObject.request.program+'" />';
            html +='<p class="fieldLabel">Request Date</p><input type="text" id="input_date" readonly="true" value ="'+requestDetailObject.request.date+'" />';

           //  html +='<p class="fieldLabel">Program name</p><input type="text" id="input_program" readonly="true" value ="'+requestDetailObject.request.program+'" />';
//             html +='<p class="fieldLabel">Request Date</p><input type="text" id="input_date" readonly="true" value ="'+requestDetailObject.request.date+'" />';
          
        }//end Switch

        $('#requestDetailUpper2').html(html);//write out the middle pane
        html = '';

        switch(displayCase){
          case("RWNew"):
            html +='<p class="fieldLabel">Coverage required</p><input type="text" id="input_coverageRequired" value ="" />';
            html +='<p class="fieldLabel">Project Completed</p><input type="text" id="input_projectCompleted" value ="" />';
           break;
          case("RWExisting"):
            html +='<p class="fieldLabel">Coverage required</p><input type="text" id="input_coverageRequired" value ="'+requestDetailObject.request.coverageRequired+'" />';
            html +='<p class="fieldLabel">Project Completed</p><input type="text" id="input_projectCompleted" value ="'+requestDetailObject.request.projectCompleted+'" />';

            break;
          case("RO"):
            html +='<p class="fieldLabel">Coverage required</p><input type="text" id="input_coverageRequired" readonly="true" value ="'+requestDetailObject.request.coverageRequired+'" />';
            html +='<p class="fieldLabel">Project Completed</p><input type="text" id="input_projectCompleted" readonly="true" value ="'+requestDetailObject.request.projectCompleted+'" />';

//             html +='<p class="fieldLabel">Coverage required</p><p class="field">'+requestDetailObject.request.coverageRequired+'</p>';
//             html +='<p class="fieldLabel">Project completed</p><p class="field">'+requestDetailObject.request.projectCompleted+'</p>';
        }//end Switch

        $('#requestDetailUpper3').html(html);//write out the rightmost pane
        
        html = '';
        switch(displayCase){
          case("RWNew"):
            html +='<p class="fieldLabel">Sponsor</p><input type="text" id="input_projectSponsor" value ="" />';
//             html +='<p class="fieldLabel">Project Completed</p><input type="text" value ="" />';
           break;
          case("RWExisting"):
            html +='<p class="fieldLabel">Sponsor</p><input type="text" id="input_projectSponsor" value ="'+requestDetailObject.request.projectSponsor+'" />';
//             html +='<p class="fieldLabel">Project Completed</p><input type="text" value ="'+requestDetailObject.request.projectCompleted+'" />';

            break;
          case("RO"):
            html +='<p class="fieldLabel">Sponsor</p><input type="text" id="input_projectSponsor" readonly="true" value ="'+requestDetailObject.request.projectSponsor+'" />';
//          html +='<p class="fieldLabel">Sponsor</p><p class="field">'+requestDetailObject.request.projectSponsor+'</p>';
//             html +='<p class="fieldLabel">Project completed</p><p class="field">'+requestDetailObject.request.projectCompleted+'</p>';
        }//end Switch

        $('#requestDetailUpper4').html(html);//write out the rightmost pane
        html = '';

        switch(displayCase){
          case("RWNew"):
            html +='<p class="fieldLabel">Construct description</p><textarea id="input_constructDescription"></textarea>';
            html +='<p class="fieldLabel">Hypothetical Sequence</p><textarea id="input_hypotheticalSequence"></textarea>';
            html +='<p class="fieldLabel">Peptide1 Sequence</p><textarea id="input_predictedPeptide1"></textarea>';
           break;
          case("RWExisting"):
            html +='<p class="fieldLabel">Construct description</p><textarea id="input_constructDescription">'+requestDetailObject.request.constructDescription+'</textarea>';
            html +='<p class="fieldLabel">Hypothetical Sequence</p><textarea id="input_hypotheticalSequence">'+requestDetailObject.request.hypotheticalSequence+'</textarea>';
            html +='<p class="fieldLabel">Peptide1 Sequence</p><textarea id="input_predictedPeptide1">'+requestDetailObject.request.predictedPeptide1+'</textarea>';
            break;
          case("RO"):
            html +='<p class="fieldLabel">Construct description</p><textarea id="input_constructDescription" readonly="true">'+requestDetailObject.request.constructDescription+'</textarea>';
            html +='<p class="fieldLabel">Hypothetical Sequence</p><textarea id="input_hypotheticalSequence" readonly="true">'+requestDetailObject.request.hypotheticalSequence+'</textarea>';
            html +='<p class="fieldLabel">Peptide1 Sequence</p><textarea id="input_predictedPeptide1" readonly="true">'+requestDetailObject.request.predictedPeptide1+'</textarea>';
//             html +='<p class="fieldLabel">Construct description</p><p class="bigField">'+requestDetailObject.request.constructDescription+'</p>';
//             html +='<p class="fieldLabel sequenceContent">Hypothetical sequence</p><p class="bigField">'+requestDetailObject.request.hypotheticalSequence+'</p>';
//             html +='<p class="fieldLabel sequenceContent">Peptide1</p><p class="bigField">'+requestDetailObject.request.predictedPeptide1+'</p>';
        }//end Switch

        $('#requestDetailLower').html(html); // write out the large field data without the table of related submissions
        html = '';


        var tableText = '<table>';
        tableText +='<tr>';
        tableText +='<th  id="submission_id">Sample_id</th>';
        tableText +='<th  id="sampleName" class="fixedWidth_column">Sample Name</th>';
        tableText +='<th  id="date" class="fixedWidth_column">Date</th>';
        tableText +='<th  id="volume">Vol.</th>';
        tableText +='<th  id="concentration">Conc.</th>';
        tableText +='<th  id="prepType" class="fixedWidth_column">Prep Type</th>';
        tableText +='</tr>';

        var i=0;
        var rowText = '';
        while(requestDetailObject.submissions[i] !== undefined){
            if(displayCase=="RO"){
                      rowText='<tr class="sampleRow" id="'+requestDetailObject.submissions[i].submission_id+'">';
          rowText+='<td><input type="text" class="shortInput" readonly="true" value ="'+requestDetailObject.submissions[i].submission_id+'" /></td>';
           rowText+='<td class="fixedWidth_column"><input type="text" class="shortInput" readonly="true" value ="'+requestDetailObject.submissions[i].sampleName+'" /></td>';
           
           rowText+='<td class="fixedWidth_column"><input type="text" class="shortInput" readonly="true" value ="'+requestDetailObject.submissions[i].date+'" /></td>';
           rowText+='<td><input type="text" class="shortInput" readonly="true" value ="'+requestDetailObject.submissions[i].volume+'" /></td>';
           rowText+='<td><input type="text" class="shortInput" readonly="true" value ="'+requestDetailObject.submissions[i].concentration+'" /></td>';
           rowText+='<td class="fixedWidth_column"><input type="text" class="shortInput" readonly="true" value ="'+requestDetailObject.submissions[i].prepType+'" /></td>';
          rowText+='</tr>';

            } else {
                      rowText='<tr class="sampleRow" id="'+requestDetailObject.submissions[i].submission_id+'">';
          rowText+='<td><input type="text" class="shortInput" value ="'+requestDetailObject.submissions[i].submission_id+'" /></td>';
           rowText+='<td class="fixedWidth_column"><input type="text" class="shortInput" value ="'+requestDetailObject.submissions[i].sampleName+'" /></td>';           
           rowText+='<td class="fixedWidth_column"><input type="text" class="shortInput" value ="'+requestDetailObject.submissions[i].date+'" /></td>';
           rowText+='<td><input type="text" class="shortInput" value ="'+requestDetailObject.submissions[i].volume+'" /></td>';
           rowText+='<td><input type="text" class="shortInput" value ="'+requestDetailObject.submissions[i].concentration+'" /></td>';
           rowText+='<td class="fixedWidth_column"><input type="text" class="shortInput" value ="'+requestDetailObject.submissions[i].prepType+'" /></td>';
          rowText+='</tr>';
            } // END IF
          tableText +=rowText;
          i++;
        } // end While
        tableText +='</table>';
        html=tableText;

        $('#sampleDetails').html(html); // write out the table of related submissions
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
//    The data is stored in a property of requestDetailManager and then used to populate the page.
    getServerDetailData: function (callingFormObject){    
      var submissionArray;
      var responseObject;
      $.ajax({
        beforeSend: function() {
            requestListManager.setHighlightRow(callingFormObject.attr('id'));

          // Display a loading message while waiting for the Ajax call to complete
          $('.ajax-loader').show();
        },
        url: "/requests/p_getDetailNew/"+callingFormObject.attr('id')+"/",
        type: 'POST',
        success: function(response) {
          responseObject = jQuery.parseJSON(response);
          requestDetailObject = jQuery.parseJSON(response);
          requestDetailManager.setUserIsRequestOwner(responseObject.request.user_id);
          requestDetailManager.setRequestDetailObject(responseObject); // store a copy of this object as a property of requestDetailManager          
          requestDetailManager.drawDetailAreaOnPage();//use the data just loaded into the requestDetailObject property and paint the page
          $('.ajax-loader').hide(); // turn off the progress indicator, we're done
        } //END on success
      }); //END .AJAX method    
    }, // END getServerDetailData
    
    checkAndRecordInput: function (callingObject){ 
//      ERROR CHECKING GOES HERE BEFORE CALL TO USER EDITS (userEditsToDetailObject) BELOW 
        var errorMessage="";
        callingId= callingObject.attr('id');
        console.log('calling object id is '+callingId);
        callingField = callingId.replace('input_', '');
console.log('requestDetailObject.request.dbAction is '+requestDetailObject.request.dbAction);
        if((callingField=='constructName')&&(requestDetailObject.request.dbAction == 'create')){
        console.log('constructname and create: check for uniqueness will be required.');
// console.log ('callingObject.val() is '+callingObject.val());

            $.ajax({
                    beforeSend: function() {
                        $('.ajax-loader').show();
                    },
                data: {constructName: callingObject.val()},
                url: "/requests/p_validateConstructName/",
                type: 'POST',
                success: function(response) {
                $('#results').html(response);
                    console.log('response from uniqueness check is '+response);
                    if(response != 0){//number of rows matching, so 0 is a good answer
                    console.log ('in error assignment');
//                         checkAndRecordInput.errorMessage = 'Invalid entry: '+callingObject.val()+' already exists.';
                    }
                $('.ajax-loader').hide(); // turn off the progress indicator, we're done
                } //END on success
        
            }); //END .AJAX method    
        } // END check on construct name
        
        console.log('calling field is '+callingField);
        console.log (' field value is now '+ callingObject.val());
        if(errorMessage == ""){
            requestDetailManager.userEditsToDetailObject('requests',0, callingField,callingObject.val());
        } else {
            console.log('Error with field data: '+callingObject.val());
        }
//         this.userEditsToDetailObject('requests',0, callingField,callingObject.val());
 }, // END function checkAndRecordInput
 
 userEditsToDetailObject: function(table,index,field,value){
    console.log ('table,index,field,value are '+table,index,field,value);
    if(table=='requests'){
    
        if(value != requestDetailObject.request[field]){
            requestDetailObject.request[field]=value;
            $('#btnSaveReqChanges').show(); // hide the save changes button until a change has been made
//           Change dbAction none to update. If already update, or if create, leave it alone
        console.log (" top of userEditsToDetailObject requestDetailObject.request['dbAction'] is  "+ requestDetailObject.request['dbAction']);

            if(requestDetailObject.request['dbAction'] == 'none'){
                requestDetailObject.request['dbAction']= 'update'; // dbAction dictates what the mysql db will need to do
            }
            console.log('Change was made before blur detected')
        } else {
            console.log('NO change made in field before blur detected')
        }
        console.log (" bottom of userEditsToDetailObject requestDetailObject.request['dbAction'] is  "+ requestDetailObject.request['dbAction']);

    }
 },
 
    sendRequestInfoToServer: function (){  
      var myJSONText = JSON.stringify(requestDetailObject); //note that replacer is available to handle replacing certain values, not used here
        console.log('myJSONText is '+myJSONText);
      $.ajax({
        beforeSend: function() {
          
          // Display a loading message while waiting for the Ajax call to complete
          $('.ajax-loader').show();
        },
        url: "/requests/p_processRequestUpdate/",
        type: 'POST',
        data: {jsonString: myJSONText},

        success: function(response) {
            $('#results').html(response);
            console.log('results back from server: '+response);
            if(response==1){
                //really want the if statement to indicate server was OK with the request, I think this does it! 1==1
                //THE DATA HAS BEEN SENT AND RECORD CREATED, NO LONGER IN CREATE MODE.
            requestDetailObject.request.dbAction = 'update';
            }
            console.log ( 'in sendRequest... requestDetailObject.request.dbAction, requestDetailObject.request.constructName '+requestDetailObject.request.dbAction+', '+requestDetailObject.request.constructName);
            requestListManager.refreshTable(requestDetailObject.request.constructName);// load the list of existing requests
            console.log('requestDetailObject.request.constructName should be becoming highlighted: '+requestDetailObject.request.constructName);
//             requestListManager.setHighlightRow(requestDetailObject.request.constructName);
          $('.ajax-loader').hide(); // turn off the progress indicator, we're done
        } //END on success
      }); //END .AJAX method    
    }, // END sendRequestInfoToServer
    
    
//    getSampleDetailData goes to the master object and gets all information for a clicked upon sample 
//    It reveals it in an area for editing, since the list itself is read only. 
//    Should only work for record owner and privileged. No one else needs RW access to samples. Make row unclickable for nonowner nonpriv.
    getSampleDetailData: function (callingFormObject){    
      requestListManager.setHighlightRow(callingFormObject.attr('id'));
     //  $('td').removeClass('sampleHighlight');
//       $('#'+callingFormObject.attr('id')+'>td').addClass('sampleHighlight');
//       console.log("callingFormObject.attr('id') is " + callingFormObject.attr('id'));
//       var i=0;
//       var rowText = '';
//       while(requestDetailObject.submissions[i] !== undefined){
//         if(requestDetailObject.submissions[i]['submission_id']==callingFormObject.attr('id')){
//           console.log ("requestDetailObject.submissions[i]['submission_id'] matches when i is " +i);
//       
//         }
//        
//       }

       
    } // END getSampleDetailData
    
  } // END of object literal requestDetailManager
 
 
// RUNS ON DOC READY
  requestDetailManager.clearRequestDetailObject();// creates a blank object

  requestListManager.setCurrentWhere('all');
  requestListManager.refreshTable();// load the list of existing requests
  userDataStore.setUserValues();
  requestDetailManager.setUserPrivilege();// is the logged in user a 'super-user' who can edit all information, else only his/her own.
  $('.ajax-loader').hide(); // hide the spinning animation
  $('#btnSaveReqChanges').hide(); // hide the save changes button until a change has been made


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
      requestDetailManager.getServerDetailData($(this));
    }); // END  $('.active').live("click",function() 
  
    $('.sampleRow').live("click",function() {
//     look to the existing object to retrieve the sample data to make read-write alongside table
//       requestDetailManager.getSampleDetailData($(this));
      console.log("$(this).attr('id') is "+$(this).attr('id'));
    }); // END  $('.active').live("click",function() 
  
    $('.headerSort').live("click",function() {
      sortField = $(this).attr('id');
      requestListManager.setSortValue(sortField);
      requestListManager.refreshTable();
    });
    
    $('textarea').live("blur",function() {
    console.log('blur in textarea detected');
    if($(this).attr('readonly')){
        console.log ('this is readonly and can be ignored.');
    } else {
        requestDetailManager.checkAndRecordInput($(this));
    }
// console.log('id changed '+ $(this).attr('id'));
//       sortField = $(this).attr('id');
    });
    
    $('[id^=requestDetailUpper]>input').live("blur",function() {
    // selector activates request inputs but not sample inputs
        console.log('blur in input detected');
    if($(this).attr('readonly')){
        console.log ('this is readonly and can be ignored.');
    } else {
        requestDetailManager.checkAndRecordInput($(this));
    }

// console.log('id changed '+ $(this).attr('id'));
//     console.log('changeData in input detected');//note that changeData works in Chrome, but is just like blur in Safari (firing even if nothing changed)
//         requestDetailManager.checkAndRecordInput($(this));

// console.log('id changed '+ $(this).attr('id'));
    });
    
    
    $('#tempSort').click(function() {
    console.log('tempSort clicked');
//       $('tr:has(#pRT001)>td').addClass('backgroundHighlight');
    });

    $('#btnNewRequest').click(function() {
//     console.log (requestDetailObject.request.constructName);
    $('#btnSaveReqChanges').hide(); // hide the save changes button until a change has been made

      requestDetailManager.createNewRequest();
    console.log (" btnNewRequest clicked, after createNewRequest call:  requestDetailObject.request['dbAction'] is  "+ requestDetailObject.request['dbAction']);

    });

    $('#btnSaveReqChanges').click(function() {
//     console.log (requestDetailObject.request.constructName);
        console.log (" btnSaveReqChanges clicked:  requestDetailObject.request['dbAction'] is  "+ requestDetailObject.request['dbAction']);

      requestDetailManager.sendRequestInfoToServer();
    $('#btnSaveReqChanges').hide(); // hide the save changes button: they've just been saved.

    });

}); //end doc ready

