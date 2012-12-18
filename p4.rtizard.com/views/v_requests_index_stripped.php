<div id='requestList'>
</div>
<button id='allRecords'>All requests</button>
<button id='myRecords'>My requests</button>
<button id='tempSort'>Temp Sort</button>
<div class="ajax-loader"></div>
<div id="results"></div>
<div id="detailAreaLabel">
  <p>Please select a request from the list above</p>
</div>
<div id="secondButtonBar">
  <button id='btnNewRequest'>Create a new request</button>
  <button id='btnSaveReqChanges' class='ColorMe'>Save the request changes</button>
  <button id='btnNewSamples'>Add new samples</button>
</div>
<div id='requestDetailUpper1'></div>
<div id='requestDetailUpper2'></div>
<div id='requestDetailUpper3'></div>
<div id='requestDetailUpper4'></div>
<div id='requestDetailLower'></div>
<div id='sampleDetails'></div>
<div id='sampleBuilder'>
<p><strong>Add Samples</strong></p>
  <p class="fieldLabel">Sample Numbers</p><input type="text" id="sampleNumberString" title='Enter sample numbers separated by commas (1,2,3)' value ="" />
  <p class="fieldLabel">Volume</p><input type="text" id="volumeString" title='Change this default if necessary' value ="20" />
  <p class="fieldLabel">Concentration</p><input type="text" id="concString" title='Change this default if necessary' value ="0.04" />
  <p class="fieldLabel">Prep Type</p><input type="text" id="volumeString" title='Change this default if necessary' value ="Qiagen mini" />
  <br><br>
  <button id='btnCommitSamples'>Submit</button>
</div>

<a href='/index/proposal/'>Jump to my proposal</a>
