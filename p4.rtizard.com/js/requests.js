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
        } // END Switch
        
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
        }
      }

      return returnArray;
    },
    
//     REFRESH TABLE is the big function here which populates the upper, request list, table based on filter and sort conditions user selected
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
        if (inputId != ""){
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
       $.ajax({ 
          url: '/users/p_provideCredentialsAjax/',
          type: 'POST', //no data sent at all.
          async: false,
          success: function(response) {
            responseObject = jQuery.parseJSON(response);
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
          }
      }); //END .AJAX call    
    } 
  } // END of object userDataStore
  
// *********************************************************************************************
// OBJECT *REQUEST DETAIL MANAGER* STARTS HERE. IT MANAGES THE DETAILS OF THE REQUEST AND 
//     SAMPLES SUBMITTED.
// *********************************************************************************************

  var requestDetailManager ={
    // requestDetailManager handles the acquisition and display of detailed information about the request
    // this includes display of fields not included in the list view managed by requestListManager
    // as well as the related samples submitted for the project (samples table)
    // Handles whether the data is read only or can be edited. Privileged members and record owners can edit, others cannot.
    // Privileged members are defined as having 'sponsor' initials in their user record and are the staff which fulfills the requests.
    // RT and SB are both privileged. Others are not.
    // Note that the return data is stored in requestDetailObject.
    
    // Clears the detail object. Also called when page is first ready to set up an 'empty' object 
        clearRequestDetailObject: function(){
            requestDetailObject=new Object();
            requestDetailObject.request=new Object();
            requestDetailObject.samples=new Object(); // other than this the object sampleDataManager should handle requestDetailObject.samples
        }, // END clearRequestDetailObject

    createNewRequest: function(){
       requestListManager.setHighlightRow("");//unhighlight any existing highlighted line--it isn't current, this new one is.
        requestDetailManager.clearRequestDetailObject();
        requestDetailObject.request['user_id']=userDataStore.get_user_id();
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
            requestDetailObject.request[k]=existingObject.request[k];
        }
        requestDetailObject.request['dbAction']= 'none'; // dbAction dictates what the mysql db will need to do
        // new code to call sampleDataManager to load the sample data into the object
        sampleDataManager.loadSampleData(existingObject);


    }, //END of function setRequestDetailObject
    
    
    // Create the detail area with request and sample data from data in requestDetailObject
    // If requestDetailObject is empty, provide a read-write area for a new request
    // If object is not empty, area has input areas for editing the data for superusers or record owners
    //  Non-superuser non-record owners will see non-editable text.
    
    drawDetailAreaOnPage: function(){
      var displayCase;

      if (requestDetailObject.request.dbAction == 'create'){ //new
        displayCase = "RWNew"; // READ WRITE NEW RECORD
       } else if(requestDetailManager.userIsRequestOwner || requestDetailManager.userIsPrivileged){ // PRODUCTION NOW, i hope

        displayCase = "RWExisting"; // EDITING AN EXISTING RECORD
      } else {
        displayCase = "RO"; // READ ONLY FOR UNPRIVILEGED NON-RECORD OWNERS
      }// end if
      html = '';
      
      switch(displayCase){
          case("RWNew"):
            $('#detailAreaLabel').html('<h4>Please provide the details for a new request:</h4>');
            html +='<p class="fieldLabel">Construct name</p><input type="text" id="input_constructName" value ="" />';
            break;
          case("RWExisting"):
            $('#detailAreaLabel').html('<h4>Details for the selected request:</h4>');
            html +='<p class="fieldLabel">Construct name</p><input type="text" id="input_constructName" value ="'+requestDetailObject.request.constructName+'" />';
            break;
          case("RO"):
            $('#detailAreaLabel').html('<h4>Details for the selected request (read only):</h4>');
            html +='<p class="fieldLabel">Construct name</p><input type="text" id="input_constructName" readonly="true" value ="'+requestDetailObject.request.constructName+'" />';
        }//end Switch
        
        html +='<div class="error" id="requestError"></div>';

        $('#requestDetailUpper1').html(html);//write out the leftmost pane
        html = '';
      

        switch(displayCase){
          case("RWNew"):
            html +='<p class="fieldLabel">Client (last first)</p><input type="text" id="input_last_name" class="shortInput" value ="'+requestDetailObject.request.last_name+'" />';            
            html +='<input type="text" id="input_first_name" class="shortInput" value ="'+requestDetailObject.request.first_name+'" />';            
            html +='<p class="fieldLabel">Request Date</p><input type="text" id="input_date" value ="'+requestDetailObject.request.date+'" />';
           break;
          case("RWExisting"):
            ownerName = requestDetailObject.request.last_name + ', '+ requestDetailObject.request.first_name;
            html +='<p class="fieldLabel">Client (last first)</p><input type="text" class="shortInput" id="input_last_name" value ="'+requestDetailObject.request.last_name+'" />';            
            html +='<input type="text" id="input_first_name" class="shortInput" value ="'+requestDetailObject.request.first_name+'" />';            
            html +='<p class="fieldLabel">Request Date</p><input type="text" id="input_date" value ="'+requestDetailObject.request.date+'" />';
            break;
          case("RO"):
            ownerName = requestDetailObject.request.last_name + ', '+ requestDetailObject.request.first_name;
            html +='<p class="fieldLabel">Client (last first)</p><input type="text" class="shortInput" id="input_last_name" readonly="true" value ="'+requestDetailObject.request.last_name+'" />';            
            html +='<input type="text" id="input_first_name" class="shortInput" readonly="true" value ="'+requestDetailObject.request.first_name+'" />';            
            html +='<p class="fieldLabel">Request Date</p><input type="text" id="input_date" readonly="true" value ="'+requestDetailObject.request.date+'" />';
            
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
        }//end Switch

        $('#requestDetailUpper3').html(html);//write out the rightmost pane
        
        html = '';
        switch(displayCase){
          case("RWNew"):
            html +='<p class="fieldLabel">Program name</p><input type="text" id="input_program" value ="" />';
            html +='<p class="fieldLabel">Sponsor</p><input type="text" id="input_projectSponsor" value ="" />';
            break;
          case("RWExisting"):
            html +='<p class="fieldLabel">Program name</p><input type="text" id="input_program" value ="'+requestDetailObject.request.program+'" />';
            html +='<p class="fieldLabel">Sponsor</p><input type="text" id="input_projectSponsor" value ="'+requestDetailObject.request.projectSponsor+'" />';

            break;
          case("RO"):
            html +='<p class="fieldLabel">Program name</p><input type="text" id="input_program" readonly="true" value ="'+requestDetailObject.request.program+'" />';
            html +='<p class="fieldLabel">Sponsor</p><input type="text" id="input_projectSponsor" readonly="true" value ="'+requestDetailObject.request.projectSponsor+'" />';
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
        }//end Switch

        $('#requestDetailLower').html(html); // write out the large field data without the table of related samples
        html = '';

        sampleDataManager.drawSampleDetails(displayCase);
              $('#sampleAreaLabel').html("<h4>Samples for the project:</h4>");
    $('#sampleBuilder').hide();
       $('#btnNewSamples').show();

    },  //END drawDetailAreaOnPage
    
    currentRequestID: 0,
    
    userIsPrivileged: false, // this will be true or false for all requests, it is independent of the request
    
    userIsRequestOwner: false, // this will be true for some requests, false for others.
    
    setUserPrivilege: function (){ 
    
      this.userIsPrivileged = (userDataStore.get_privilegedInits() != "");
    }, //  END setUserPrivilege

    setUserIsRequestOwner: function (query_id){
      this.userIsRequestOwner=(userDataStore.get_user_id()==query_id);
    },
    
//    getServerDetailData goes to the database and gets all information for a request and its accompanying samples 
//    The data is stored in a property of requestDetailManager and then used to populate the page.
    getServerDetailData: function (callingFormObject){    
      var sampleArray;
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
        callingField = callingId.replace('input_', '');
        if(callingField=='constructName'){
            if(requestDetailObject.request.dbAction == 'create'){
                
                $('#requestError').html('');//clear existing error message, if there.
                $.ajax({
                        beforeSend: function() {
                            $('.ajax-loader').show();
                        },
                    data: {constructName: callingObject.val()},
                    url: "/requests/p_validateConstructName/",
                    type: 'POST',
                    success: function(response) {
//                     $('#results').html(response); // UNCOMMENT FOR DEBUGGING, NEED TO ADD DIV WITH ID=RESULTS BACK TO THE VIEW HOWEVER
                        if(response != 0){// equals the number of rows matching, so 0 is a good answer
                            $('#requestError').html('Invalid entry: '+callingObject.val()+' already exists.');
                            $(callingObject).focus();
//                             NEED TO HIDE THE SAVE CHANGES BUTTON, ELSE WE GET A BLANK CONSTRUCT NAME IN THE MYSQL RECORD
                            $('.showUnsavedChanges').hide(); // hide the save changes button until a change has been made
                        } else {
                            requestDetailManager.userEditsToDetailObject('requests',0, callingField,callingObject.val());
                        }
                    $('.ajax-loader').hide(); // turn off the progress indicator, we're done
                    } //END on success
        
                }); //END .AJAX method    
            } 
        
        } else {         // END check on construct name
//         No further error checks, make the change in the storage object
            $('.showUnsavedChanges').show(); // show the save changes button -- one or more changes have been made
            requestDetailManager.userEditsToDetailObject('requests',0, callingField,callingObject.val());
        }

 }, // END function checkAndRecordInput
 
 userEditsToDetailObject: function(table,index,field,value){
    if(table=='requests'){
    
        if(value != requestDetailObject.request[field]){
            requestDetailObject.request[field]=value;
            $('.showUnsavedChanges').show(); // hide the save changes button until a change has been made
//           Change dbAction none to update. If already update, or if create, leave it alone
            if(requestDetailObject.request['dbAction'] == 'none'){
                requestDetailObject.request['dbAction']= 'update'; // dbAction dictates what the mysql db will need to do
            }
        }
    }
 }, //END of userEditsToDetailObject
 
    sendRequestInfoToServer: function (){  
      var myJSONText = JSON.stringify(requestDetailObject); //note that replacer is available to handle replacing certain values, not used here
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
            requestDetailObject.request.dbAction = 'none'; // note that it will be additional work to return values
            //  from both request processor and samples processor: a json string reviewing all that occurred. The if (response!=0) just won't cut it.
            requestListManager.refreshTable(requestDetailObject.request.constructName);// load the list of existing requests
          $('.ajax-loader').hide(); // turn off the progress indicator, we're done
        } //END on success
      }); //END .AJAX method    
    }, // END sendRequestInfoToServer
    
    getConstructNameForRequest: function(){
    return(requestDetailObject.request.constructName);
    }
  } // END of object literal requestDetailManager
 
// *********************************************************************************************
// OBJECT *SAMPLE DATA MANAGER* STARTS HERE. IT MANAGES THE DETAILS OF THE 
//     SAMPLES SUBMITTED, WITHIN THE OBJECT SHARED WITH requestDetailManager called 
//     requestDetailManager.requestDetailObject.
// *********************************************************************************************

    var sampleDataManager = {
    
    // LOAD SAMPLE DATA
        loadSampleData: function(existingObject){
            var i=0;
            var rowText = '';
            while(existingObject.samples[i] !== undefined){
                requestDetailObject.samples[i]=new Object();
                for (k in existingObject.samples[i]){
                    requestDetailObject.samples[i][k]=existingObject.samples[i][k];
                }
                requestDetailObject.samples[i]['dbAction']= 'none'; // dbAction dictates what the mysql db will need to do
                i++;
            }
        }, // END of function loadSampleData

//       DRAW SAMPLE DETAILS
        drawSampleDetails: function(displayCase){
            var html = '';
            var tableText = '<table>';
            tableText +='<tr>';
            tableText +='<th  id="sample_id">Sample_id</th>';
            tableText +='<th  id="sampleName" class="fixedWidth_column">Sample Name</th>';
            tableText +='<th  id="date" class="fixedWidth_column">Date</th>';
            tableText +='<th  id="volume">Vol.</th>';
            tableText +='<th  id="concentration">Conc.</th>';
            tableText +='<th  id="prepType" class="fixedWidth_column">Prep Type</th>';
            tableText +='</tr>';

            var i=0;
            var rowText = '';
            while(requestDetailObject.samples[i] !== undefined){
                if(displayCase=="RO"){
                    rowText='<tr class="sampleRow" id="'+requestDetailObject.samples[i].sample_id+'">';
                    rowText+='<td><input type="text" class="shortInput" readonly="true" value ="'+requestDetailObject.samples[i].sample_id+'" /></td>';
                    rowText+='<td class="fixedWidth_column"><input type="text" class="shortInput" readonly="true" value ="'+requestDetailObject.samples[i].sampleName+'" /></td>';

                    rowText+='<td class="fixedWidth_column"><input type="text" class="shortInput" readonly="true" value ="'+requestDetailObject.samples[i].date+'" /></td>';
                    rowText+='<td><input type="text" class="shortInput" readonly="true" value ="'+requestDetailObject.samples[i].volume+'" /></td>';
                    rowText+='<td><input type="text" class="shortInput" readonly="true" value ="'+requestDetailObject.samples[i].concentration+'" /></td>';
                    rowText+='<td class="fixedWidth_column"><input type="text" class="shortInput" readonly="true" value ="'+requestDetailObject.samples[i].prepType+'" /></td>';
                    rowText+='</tr>';

                } else {
                    rowText='<tr class="sampleRow" id="'+requestDetailObject.samples[i].sample_id+'">';
                    rowText+='<td><input type="text" class="shortInput" value ="'+requestDetailObject.samples[i].sample_id+'" /></td>';
                    rowText+='<td class="fixedWidth_column"><input type="text" class="shortInput column_sampleName" value ="'+requestDetailObject.samples[i].sampleName+'" /></td>';           
                    rowText+='<td class="fixedWidth_column"><input type="text" class="shortInput column_date" value ="'+requestDetailObject.samples[i].date+'" /></td>';
                    rowText+='<td><input type="text" class="shortInput column_volume" value ="'+requestDetailObject.samples[i].volume+'" /></td>';
                    rowText+='<td><input type="text" class="shortInput column_concentration" value ="'+requestDetailObject.samples[i].concentration+'" /></td>';
                    rowText+='<td class="fixedWidth_column"><input type="text" class="shortInput column_prepType" value ="'+requestDetailObject.samples[i].prepType+'" /></td>';
                    rowText+='</tr>';
                } // END IF
              tableText +=rowText;
              i++;
            } // end While
            tableText +='</table>';
            html = tableText;
             $('#sampleDetails').html(html); // write out the table of related samples        

            if(displayCase == "RO"){
                $('#btnNewSamples').hide();
                $('#sampleBuilder').hide();
            
            } else {
                $('#btnNewSamples').show();
                $('#sampleBuilder').show();

            }
      
        },   // END of function drawSampleDetails
        processAddedSamples: function(){
        
            if(requestDetailManager.getConstructNameForRequest() == ""){ // stop with error
                $('#sampleDialogHeader').html('Error: construct name blank');
                $('#sampleDialogHeader').addClass('ColorMe');
            } else {  // GO AHEAD
                        var sampleNumberString = $('#sampleNumberString').val();
            var volumeString = $('#volumeString').val();
            var concString = $('#concString').val();
            var prepTypeString = $('#prepTypeString').val(); // doesn't need recasting.
            var volume = parseFloat(volumeString);
            var conc = parseFloat(concString);
            var isolateArray = sampleNumberString.split(',');
            var pad = "00";
            var str = "";
            var nextIsolateNumber = 0;
            var paddedString='';
            var constructName = requestDetailObject.request['constructName'];
            
            existingSamples = [];
            var i=0;
            while(requestDetailObject.samples[i] !== undefined){
                existingSamples[i]=requestDetailObject.samples[i].sampleName;
                    i++;
            }
            var countExisting = i;
            var stringExisting = existingSamples.sort().reverse().join(); //yields e.g. "pRT009-04^A,pRT009-03^A,pRT009-02^A,pRT009-01^A"
            var position = 0;
            var newAdditions = 0;
            for (i in isolateArray){
                nextIsolateNumber = parseInt(isolateArray[i]);
                if( ! (isNaN(nextIsolateNumber))){ // go ahead with valid numbers
                newAdditions++;
                    str = "" + nextIsolateNumber;
                    paddedString = pad.substring(0, pad.length - str.length) + str;
                    isolateBase = constructName+'-'+paddedString;
                    position = stringExisting.search(isolateBase);
                    baseLength = isolateBase.length;
                    // FIRST sample gets ^A: e.g. pRT001-01^A. Next -01 gets pRT001-01^B then C etc.
                    if(position>-1){
                        alphaIndex = stringExisting.substring(position+baseLength+1,position+baseLength+2);
                        charcode=alphaIndex.charCodeAt(0);
                        nextIndex=String.fromCharCode(charcode+1)
                    } else {
                        nextIndex="A";
                    }
                    var thisElementNum = parseInt(i)+countExisting;
                    requestDetailObject.samples[thisElementNum]=new Object();
                    requestDetailObject.samples[thisElementNum]['sampleName']=isolateBase+'^'+nextIndex;
                    requestDetailObject.samples[thisElementNum]['volume']=volume;
                    requestDetailObject.samples[thisElementNum]['concentration']=conc;
                    requestDetailObject.samples[thisElementNum]['prepType']=prepTypeString;
                    requestDetailObject.samples[thisElementNum]['date']=userDataStore.get_date();
                    requestDetailObject.samples[thisElementNum]['dbAction']='create';
                    requestDetailObject.samples[thisElementNum]['request_id']=requestDetailObject.request['request_id'];
                    requestDetailObject.samples[thisElementNum]['sample_id']=-1; // we'll use -1 conventionally to reflect to PHP that assignment will be made by mysql

                } // end if not NaN

            } // END FOR i in isolateArray
            
            if(newAdditions == 0){
                $('#sampleDialogHeader').html('Error: Samples invalid.'); // changed to show errors at times, reset
                $('#sampleDialogHeader').addClass('ColorMe'); // changed to show errors at times, reset

            } else {
                var displayCase;
                if (requestDetailObject.request.dbAction == 'create'){ //new
                    displayCase = "RWNew"; // READ WRITE NEW RECORD
                } else if(requestDetailManager.userIsRequestOwner || requestDetailManager.userIsPrivileged){ // PRODUCTION NOW, i hope
                    displayCase = "RWExisting"; // EDITING AN EXISTING RECORD
                } else {
                    displayCase = "RO"; // READ ONLY FOR UNPRIVILEGED NON-RECORD OWNERS
                } // end if else chain on dbaction
                
                sampleDataManager.drawSampleDetails(displayCase);

                $('.showUnsavedChanges').show(); // we have unsaved changes
                $('#sampleBuilder').hide(); // hide the builder 'dialog'
                $('#sampleNumberString').val(); // clear out the isolate numbers, so it will be clean when unhidden
            } 

            }

        }, // END of function processAddedSamples
        
//         CHECK SAMPLE UPDATE INPUT
        checkSampleUpdateInput: function(callingObject){
             var callingId = callingObject.parents('tr').attr('id');
             var callingClass = callingObject.attr('class');
                var classArray=callingClass.split(" ");
            for (var i = 0; i < classArray.length; i++) {
                if(classArray[i].search("column")==0){
                    var activeField=classArray[i].substring(7); // removing column_
                }
            }
            
            // NEED TO FIGURE OUT THE INDEX OF THE ID IN THE OBJECT.
            var i=0;
            while(requestDetailObject.samples[i] !== undefined){
                if(requestDetailObject.samples[i].sample_id==callingId){
                    var targetIndex = i;
                }
            i++;
            }
            if(requestDetailObject.samples[targetIndex][activeField] != callingObject.val()){
//              DATA CHANGED, WRITE THE NEW DATA TO THE OBJECT AND LIGHT UP THE SAVE BUTTON
                requestDetailObject.samples[targetIndex][activeField]=callingObject.val();
                requestDetailObject.samples[targetIndex]['dbAction']='update';

                $('.showUnsavedChanges').show(); // one button saves request changes and sample changes
            }
            return;
        }// END OF function checkSampleUpdateInput
      
    } // END of OBJECT sampleDataManager

// *********************************************************************************************
// FOLLOWING CODE RUNS ON DOC READY WITHOUT WAITING FOR THE USER TO PROVIDE INPUT
// *********************************************************************************************

  requestDetailManager.clearRequestDetailObject();// creates a blank object
  requestListManager.setCurrentWhere('all');
  requestListManager.refreshTable();// load the list of existing requests
  userDataStore.setUserValues();
  requestDetailManager.setUserPrivilege();// is the logged in user a 'super-user' who can edit all information, else only his/her own.
  
// SET UP THE STARTING VISIBILITY OF SEVERAL INTERFACE ELEMENTS
    $('.ajax-loader').hide(); // hide the spinning animation
    $('.showUnsavedChanges').hide(); // hide the save changes button until a change has been made
    $('#sampleBuilder').hide();
    $('#btnNewSamples').hide();
    $('#btnSaveSampleChanges').hide();
    $('#sampleDialogHeader').html('Add Samples:');
    $('#sampleDialogHeader').removeClass('ColorMe');
    $('.hideEmpty').hide();

// *********************************************************************************************
// FINALLY, ALL THE LISTENERS
// *********************************************************************************************

//      CLICKING ON THIS BUTTON FILLS THE UPPER LIST WITH MY REQUESTS ONLY
  $('#myRecords').click(function() {

	$.ajax({
			url: "/requests/p_fill_request_table2/mine/",
// 			url: "/requests/p_fill_request_table/mine/",
			type: 'POST',
			success: function(response) {
                requestListManager.setCurrentWhere('mine');
                requestListManager.refreshTable();
			}
		});	
	});
	
//      CLICKING ON THIS BUTTON FILLS THE UPPER LIST WITH ALL REQUESTS
  $('#allRecords').click(function() {

		$.ajax({
			url: "/requests/p_fill_request_table2/all/",
// 			url: "/requests/p_fill_request_table/all/",
			type: 'POST',
			success: function(response) {
      requestListManager.setCurrentWhere('all');
      requestListManager.refreshTable();
			}
		});	
	});
	
//    Call the NEW SINGLE AJAX CALL METHOD TO RETURN A JSON STRING REPRESENTING BOTH REQUEST AND RELATED SAMPLES
	  $('.requestRow').live("click",function() {
      $('.hideEmpty').show();
      requestDetailManager.getServerDetailData($(this));
    }); // END  $('.active').live("click",function() 
    
//    MANAGE HEADER SORT IN THE REQUEST LIST TABLE
    $('.headerSort').live("click",function() {
      sortField = $(this).attr('id');
      requestListManager.setSortValue(sortField);
      requestListManager.refreshTable();
    });
    
//     CATCH CHANGED DATA IN TEXTAREAS AND TRANSFER THE CHANGE TO THE COMPREHENSIVE DATA OBJECT
    $('textarea').live("blur",function() {
        if($(this).attr('readonly')){
        } else {
            requestDetailManager.checkAndRecordInput($(this));
        }
    });
    
//     CATCH CHANGED DATA IN THE REQUEST-RELEVANT INPUTS (NOT SAMPLES). ADD DATA TO THE DATA OBJECT.
    $('[id^=requestDetailUpper]>input').live("blur",function() {
    // selector activates request inputs but not sample inputs
        if ( ! ($(this).attr('readonly'))){
            requestDetailManager.checkAndRecordInput($(this));
        }
    });

//    USER WANTS TO INITIATE A FRESH REQUEST
    $('#btnNewRequest').click(function() {
        $('.showUnsavedChanges').hide(); // hide the save changes button until a change has been made
        requestDetailManager.createNewRequest();
        $('.hideEmpty').show(); // 2 sizable boxes won't be empty until page reload
    });

//    USER WANTS TO MOVE HIS NEWLY INPUT DATA TO MYSQL
    $('#btnSaveReqChanges').click(function() {
        if(requestDetailManager.getConstructNameForRequest()!=""){
            requestDetailManager.sendRequestInfoToServer();
        } else {
            $('#requestError').html('Invalid save: Construct Name is blank.');
            $('#input_constructName').focus();

        }
        $('.showUnsavedChanges').hide(); // hide the save changes button until another change has been made
    });
    
//     USER WANTS TO SEE THE ADD SAMPLE DIALOG
    $('#btnNewSamples').click(function() {
            $('#sampleDialogHeader').html('Add Samples:'); // changed to show errors at times, reset
            $('#sampleDialogHeader').removeClass('ColorMe');// changed to highlight errors at times, reset
            $('#sampleBuilder').show(); 
            $('#btnNewSamples').hide(); 
    });

//     USER HAS CLOSED THE ADD SAMPLE DIALOG WITH A COMMIT
    $('#btnCommitSamples').click(function() {
        sampleDataManager.processAddedSamples();
    });
    
//     USER HAS CANCELED OUT OF THE ADD SAMPLE DIALOG
    $('#btnCancelSampleDialog').click(function() {
        $('#sampleBuilder').hide(); 
        $('#btnNewSamples').show(); 
   });
    
//     CATCH CHANGED DATA IN THE SAMPLES-RELEVANT INPUTS (NOT THE PARENT REQUEST). ADD DATA TO THE DATA OBJECT.

    $('[id=sampleDetails] input').live("blur",function() {// selector activates sample inputs but not request inputs
        if( ! $(this).attr('readonly')){
            sampleDataManager.checkSampleUpdateInput($(this));
        }
    });
    
}); //end doc ready
// FIN
