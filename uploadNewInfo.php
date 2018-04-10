<?php
 require("../include/utility.php");
   $dbconn = connectToDB();
   //connecting to the database and cleaning all of the input that the user enters in
   $fname = cleanInput($_POST["fname"]);
   $lname = cleanInput($_POST["lname"]);
   $email = cleanInput($_POST["email"]);
   $password = cleanInput($_POST["password"]);
   
   //Encrypting the password here 
   $salt1 = "qm&h*";
   $salt2 = "pg!@";  
   $encPass = hash('ripemd320', "$salt1$password$salt2");
   //inserting the info the user entered into the Phpmyadmin database  
   $sql = "INSERT INTO loginInfo(fname,lname,email,password) values('$fname','$lname','$email','$encPass');";  
 
   logMsg($sql);
   $result = $dbconn->query($sql);
   logMsg($result);
   if(!$result) {
      //if the result does not come back OK, then we know that the email already exists
      echo json_encode(array("code"=>2, "msg"=>"Email already exists"));
   }
   else {
      echo json_encode(array("code"=>1, "fname"=>$fname, "lname"=>$lname));
   }
   disconnectDB($dbconn);
?>
