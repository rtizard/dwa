//<script type='text/javascript'>
$(document).ready(function() {
  var requestArray;
  $('.ajax-loader').hide();


	
  $('#myRecords').click(function() {
//          $('.ajax-loader').show();

		$.ajax({
			url: "/requests/p_fill_request_table/mine/",
			type: 'POST',
			success: function(response) {
				$('#requestList').html(response);	
			}
		});	
	});
	
  $('#allRecords').click(function() {
//            $('.ajax-loader').hide();

		$.ajax({
			url: "/requests/p_fill_request_table/all/",
			type: 'POST',
			success: function(response) {
				$('#requestList').html(response);	
			}
		});	
	});
	
// 	  $('.active').live("click",function() {
//     var submissionArray;
//     $('#results').html("Loading...");
// 
//     $.ajax({
//       beforeSend: function() {
//         // Display a loading message while waiting for the Ajax call to complete
//         $('.ajax-loader').show();
//         $('#results').html("Loading...");
//         console.log ( 'in before Send');
//       },
//       url: "/requests/p_getDetail/"+$(this).attr('id')+"/",
//       type: 'POST',
//       async: false, // without this, the requestArray isn't filled in time for next ajax call
//       success: function(response) {
//         requestArray = jQuery.parseJSON(response);
//         console.log(response);
//         console.log('response request_id inside first function is '+requestArray['request_id']);
//       }
//     });
// 
//     //now make a second ajax call requesting submissions that accompanied this request			
//     $.ajax({
//       beforeSend: function() {
//         // Display a loading message while waiting for the Ajax call to complete
//                 console.log ( 'in before Send for 2nd ajax call');
//       },
//       url: "/requests/p_getSubmissions/"+requestArray['request_id']+"/",
//       type: 'POST',
//       success: function(response) {
//         submissionArray = jQuery.parseJSON(response);
//         console.log(response);
//          $('.ajax-loader').hide();
//         $('#results').html(' ');
//       }
// 
//     });  //END second .ajax call
//            
// 	}); // END  $('.active').live("click",function() 
// 
//
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
       //  console.log('1st submission_id part of object is '+responseObject.submissions[0].submission_id);
//         console.log('2nd submission_id part of object is '+responseObject.submissions[1].submission_id);
//         console.log('3rd submission_id part of object is '+responseObject.submissions[2].submission_id);
//         console.log('4th submission_id part of object is '+responseObject.submissions[3].submission_id);
        var i=0;
        while(responseObject.submissions[i] !== undefined){
          console.log('Loop with i = '+i+' has submission_id of '+responseObject.submissions[i].submission_id);
          i++;
        }

        $('.ajax-loader').hide();
        $('#results').html(' ');
      }
    });

   //  //now make a second ajax call requesting submissions that accompanied this request			
//     $.ajax({
//       beforeSend: function() {
//         // Display a loading message while waiting for the Ajax call to complete
//                 console.log ( 'in before Send for 2nd ajax call');
//       },
//       url: "/requests/p_getSubmissions/"+requestArray['request_id']+"/",
//       type: 'POST',
//       success: function(response) {
//         submissionArray = jQuery.parseJSON(response);
//         console.log(response);
//          $('.ajax-loader').hide();
//         $('#results').html(' ');
//       }
// 
//     });  //END second .ajax call
//            
	}); // END  $('.active').live("click",function() 



 //  $('.active').click(function() {
//     var submissionArray;
//     $.ajax({
//       url: "/requests/p_getDetail/"+$(this).attr('id')+"/",
//       type: 'POST',
//       async: false, // without this, the requestArray isn't filled in time for next ajax call
//       success: function(response) {
//         requestArray = jQuery.parseJSON(response);
//         console.log(response);
//         console.log('response request_id inside first function is '+requestArray['request_id']);
//       }
//     });
// 
//     //now make a second ajax call requesting submissions that accompanied this request			
//     $.ajax({
//       url: "/requests/p_getSubmissions/"+requestArray['request_id']+"/",
//       type: 'POST',
//       success: function(response) {
//         submissionArray = jQuery.parseJSON(response);
//         console.log(response);
//       }
//     });
//   });
  
}); //end doc ready
//</script>

