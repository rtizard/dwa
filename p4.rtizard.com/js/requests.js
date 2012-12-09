$(document).ready(function() {

  // OBJECT *REQUEST LIST MANAGER* STARTS HERE AND MANAGES THE TABLE AT THE TOP OF INDEX PAGE 
  var requestListManager = {  // a literal object. Need not be instantiated. Only one 'instance' required. Syntax is different. Like "memory" game.

    currentWhereQuery: '', 
    
    setCurrentWhere: function(option){ // not implemented
      this.currentWhereQuery = option;
      console.log ('in setCurrentWhere value for option is '+option);
    },
    
    sortObj : {request_id : 1, clientLastName: 0, constructName:0, requestDate:0, programName:0, sponsor: 0},
    
    setSortValue: function(option){
      console.log ('in setSortValue value for option is '+option);
      
      if(option=='request_id'){
        switch(this.sortObj.request_id){
          case(0):
            console.log('this.sortObj.request_id is 0');
            this.sortObj.request_id = 1;
            break;
          case(1):
            console.log('this.sortObj.request_id is 1');
            this.sortObj.request_id = 2;
            break;
          case(2):
            console.log('this.sortObj.request_id is 2');
            this.sortObj.request_id = 1;
            break;
        }
      }
    },
    
    returnSortCondition: function(){
        var returnArray =[];

      if(this.sortObj.request_id!=0){
        returnArray['field']='request_id';
        returnArray['directionCode']=this.sortObj.request_id;
      } else { // we'll sort on request_id ascending by default!
        returnArray['field']='request_id';
        returnArray['directionCode']=1;//hard coded value by default (if none have sort order set)
      }
      console.log(returnArray);
      return returnArray;
    },
    
    refreshTable: function(){
      baseURL = '/requests/p_fill_request_table2/';
      
      if (this.currentWhereQuery=='mine') {
       // queryUrl =baseURL+'mine/';
        queryWhere = 'mine';
      } else {
       // queryUrl =baseURL+'all/';
        queryWhere = 'all';
      }
    
      sortIndicator = this.returnSortCondition();
      
      
    	$.ajax({ 
        url: baseURL,
        type: 'POST',
        data: {queryWhere: queryWhere, sortField: sortIndicator['field'], sortDirection: sortIndicator['directionCode']},
        success: function(response) {
//                  console.log(response);
//                  return; //temporary to examine the response value directly
                 
          responseObject = jQuery.parseJSON(response); //temporarily disabled
//           console.log(response);
//           return;
//           console.log('first request_id part of object is '+responseObject[0].request_id);
//           console.log('first projectSponsor part of object is '+responseObject[0].projectSponsor);

//           BUILD THE TABLE IN HTML:

          var tableText = '<table>';
          tableText +='<tr>';
          tableText +='<th class="fixedWidth_column">request_id</th>';
          tableText +='<th class="fixedWidth_column">Client</th>';
          tableText +='<th class="fixedWidth_column">Construct Name</th>';
          tableText +='<th class="fixedWidth_column">Request Date</th>';
          tableText +='<th class="fixedWidth_column">Program Name</th>';
          tableText +='<th class="fixedWidth_column">Sponsor</th>';
          tableText +='</tr>';

          var i=0;
          var rowText = '';
          while(responseObject[i] !== undefined){
            rowText='<tr>';
            rowText+='<td>'+responseObject[i].request_id+'</td>';
            rowText+='<td>'+responseObject[i].last_name+', '+responseObject[i].first_name+'</td>';
            rowText+='<td class="active" id="'+responseObject[i].constructName+'">'+ responseObject[i].constructName+'</td>';
            rowText+='<td>'+responseObject[i].date+'</td>';
            rowText+='<td>'+responseObject[i].program+'</td>';
            rowText+='<td>'+responseObject[i].projectSponsor+'</td>';
            rowText+='</tr>';
            tableText +=rowText;
            i++;
          }
          tableText +='</table>';

//          SEND THE TABLE INTO THE DIV

          $('#requestList').html(tableText);
        } // end SUCCESS: 
      });	// END $.ajax function
    }, //end FUNCTION refreshTable

  } // END OF OBJECT *REQUEST LIST MANAGER*


// RUNS ON DOC READY
  console.log ('about to call requestListManager first time');
  requestListManager.setCurrentWhere('all');
  requestListManager.refreshTable();
  $('.ajax-loader').hide();

  
// LISTENERS:


  $('#myRecords').click(function() {
  console.log ('about to make ajax call in myRecords');
		$.ajax({
			url: "/requests/p_fill_request_table/mine/",
			type: 'POST',
			success: function(response) {
// 				$('#requestList').html(response);	
      requestListManager.setCurrentWhere('mine');
      requestListManager.refreshTable();

			}
		});	
	});
	
  $('#allRecords').click(function() {
    console.log ('about to make ajax call in allRecords');

		$.ajax({
			url: "/requests/p_fill_request_table/all/",
			type: 'POST',
			success: function(response) {
// 				$('#requestList').html(response);	
      requestListManager.setCurrentWhere('all');
      requestListManager.refreshTable();

			}
		});	
	});
	

//    NEW SINGLE AJAX CALL METHOD TO RETURN A JSON STRING REPRESENTING BOTH REQUEST AND RELATED SUBMISSIONS
	  $('.active').live("click",function() {
    var submissionArray;
    $('#results').html("Loading...");

    $.ajax({
      beforeSend: function() {
        // Display a loading message while waiting for the Ajax call to complete
        $('.ajax-loader').show();
        $('#results').html("Loading...");
        console.log ( 'in before Send');
      },
      url: "/requests/p_getDetailNew/"+$(this).attr('id')+"/",
      type: 'POST',
     // async: false, // without this, the requestArray isn't filled in time for next ajax call
      success: function(response) {
        responseObject = jQuery.parseJSON(response);
        console.log(response);
        console.log('request_id part of object is '+responseObject.request.request_id);

        var i=0;
        while(responseObject.submissions[i] !== undefined){
          console.log('Loop with i = '+i+' has submission_id of '+responseObject.submissions[i].submission_id);
          i++;
        }

        $('.ajax-loader').hide();
        $('#results').html(' ');
      }
    });
    
	}); // END  $('.active').live("click",function() 
  
  
    $('#tempSort').click(function() {
    requestListManager.setSortValue('request_id');
requestListManager.refreshTable();
    });
  
  
}); //end doc ready

