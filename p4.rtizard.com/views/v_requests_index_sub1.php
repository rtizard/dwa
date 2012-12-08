  <table>
    <tr>
      <th class="fixedWidth_column">request_id</th>
      <th class="fixedWidth_column">Client</th>
      <th class="fixedWidth_column">Construct Name</th>
      <th class="fixedWidth_column">Request Date</th>
      <th class="fixedWidth_column">Program Name</th>
      <th class="fixedWidth_column">Sponsor</th>
    </tr>
  
  <? foreach($requests as $request): ?>
    <tr>
      <td><?=$request['request_id']?></td>
      <td class="fixedWidth_column"><?=$request['last_name']?>, <?=$request['first_name']?></td>
      <td class='active' id=<?="'".$request['constructName']."'"?>><?=$request['constructName']?></td>
      <td><?=$request['date']?></td>
      <td><?=$request['program']?></td>
      <td><?=$request['projectSponsor']?></td>    
    </tr>
  <? endforeach; ?>
  </table>
