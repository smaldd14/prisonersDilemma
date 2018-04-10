<?php
 require("../include/utility.php");
   $dbconn = connectToDB();
   //connecting to the database and cleaning all of the input that the user enters in
   $email = cleanInput($_REQUEST["email"]);
   $password = cleanInput($_REQUEST["password"]);
   //Encrypting the password here 
   $salt1 = "qm&h*";
   $salt2 = "pg!@";
   $encPass = hash('ripemd320', "$salt1$password$salt2");
   logMsg("$encPass");
   //Finding the unique id that matches the email in the database
   $sql = "SELECT * from loginInfo WHERE email='$email';";
   logMsg($sql);
   $result = $dbconn->query($sql);
   if ($myrow = $result->fetch_row())
   {
        $fname = $myrow[1];
        $lname = $myrow[2];
  	if($encPass == $myrow[4]) {
	   //the unique Id was found and so we send back the first and last name
	   echo json_encode(array("code"=>1, "fname"=>$fname, "lname"=>$lname));
	}
	else {
	   //The user entered the wrong password
	   echo json_encode(array("code"=>4, "msg"=>"Incorrect password."));
	}
   } else {
	   //the email is not in the database
	   echo json_encode(array("code"=>3, "msg"=>"Unknown email address."));
   }
   disconnectDB($dbconn);
?>
