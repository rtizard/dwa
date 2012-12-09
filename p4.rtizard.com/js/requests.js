$(document).ready(function() {

  // OBJECT *REQUEST LIST MANAGER* STARTS HERE AND MANAGES THE TABLE AT THE TOP OF INDEX PAGE 
  var requestListManager = {  // a literal object. Need not be instantiated. Only one 'instance' required. Syntax is different. Like "memory" game.

    currentWhereQuery: '', 
    
    setCurrentWhere: function(option){ // not implemented
      this.currentWhereQuery = option;
      console.log ('in setCurrentWhere value for option is '+option);
    },
    
    sortObj : {request_id : 1, last_name: 0, constructName:0, date:0, program:0, projectSponsor: 0},
    
    setSortValue: function(option){
      console.log ('in setSortValue value for option is '+option);
      
        switch(this.sortObj[option]){
          case(0):
            console.log(this.sortObj[option]+' is 0');
            newValue = 1;
            this.zeroAllSortValues();
            this.sortObj[option] = newValue;
            break;
          case(1):
            console.log(this.sortObj[option]+' is 1');
            newValue = 2;
            this.zeroAllSortValues();
            this.sortObj[option] = newValue;
            break;
          case(2):
            console.log(this.sortObj[option]+' is 2');

            newValue = 1;
            this.zeroAllSortValues();
            this.sortObj[option] = newValue;
            break;
        }//end Switch
        
      }, //END OF setSortValue FUNCTION
    
    zeroAllSortValues: function(){
      for (i in this.sortObj){
        console.log(i+' is '+this.sortObj[i]);
        this.sortObj[i] = 0;
      }
    },
    
    returnSortCondition: function(){
      var returnArray =[];
        
      for (i in this.sortObj){
        if(this.sortObj[i]!=0){
          returnArray['field']=i;
          returnArray['directionCode']=this.sortObj[i];        
        }//end if

       //  console.log(i+' is '+this.sortObj[i]);
//         this.sortObj[i] = 0;
      }

      console.log('next line is the returnArray from return Sort condition')
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
//                            var tableText = '<table>';
//           tableText +='<tr>';
//           tableText +='<th class="headerSort" id="request_id" class="fixedWidth_column">request_id</th>';
//           tableText +='<th class="headerSort" id="last_name" class="fixedWidth_column">Client</th>';
//           tableText +='<th class="headerSort" id="constructName" class="fixedWidth_column">Construct Name</th>';
//           tableText +='<th class="headerSort" id="date" class="fixedWidth_column">Request Date</th>';
//           tableText +='<th class="headerSort" id="program" class="fixedWidth_column">Program Name</th>';
//           tableText +='<th class="headerSort" id="projectSponsor" class="fixedWidth_column">Sponsor</th>';
//           tableText +='</tr>';
//           tableText +='</table>';
// 
// //          SEND THE TABLE INTO THE DIV
// 
//           $('#requestList').html(tableText);
// 
//                  return; //temporary to examine the response value directly
                 
          responseObject = jQuery.parseJSON(response); //temporarily disabled
//           console.log(response);
//           return;
//           console.log('first request_id part of object is '+responseObject[0].request_id);
//           console.log('first projectSponsor part of object is '+responseObject[0].projectSponsor);

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
   console.log ('calling zeroAllSortValues from the button');
   requestListManager.zeroAllSortValues(); 
   
//     requestListManager.setSortValue('request_id');
// requestListManager.refreshTable();
    });
  
    $('.headerSort').live("click",function() {
      sortField = $(this).attr('id');
      requestListManager.setSortValue(sortField);
      requestListManager.refreshTable();

    });

}); //end doc ready

