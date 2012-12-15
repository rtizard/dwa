<!-- <p>Uptime returned: <?=passthru("uptime");?> ls returned: <?=passthru('ls -ltr /Users/tizardr/Sites');?></p> -->
<div id='requestList'>
</div>
<!-- 
ID of current user is <?=$user->user_id;?>.<br>
 -->
<button id='allRecords'>All requests</button>
<button id='myRecords'>My requests</button>
<button id='tempSort'>Temp Sort</button>
<div class="ajax-loader"></div>
<!-- <div id="results"></div> -->
<div id="detailAreaLabel">
  <p>Please select a request from the list above</p>
</div>
<div id="secondButtonBar">
  <button id='btnNewRequest'>Create a new request</button>
  <button id='btnSaveReqChanges'>Save the request changes</button>
</div>
<div id='requestDetailUpper1'></div>
<div id='requestDetailUpper2'></div>
<div id='requestDetailUpper3'></div>
<div id='requestDetailLower'></div>
<a href='/index/proposal/'>Jump to my proposal</a>
