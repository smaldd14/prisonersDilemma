/* Name: Devin Smaldore
 * Date: 04-08-16
 * class: csc2210
 * location: public_html/csc2210/exams/prisonersDilemma/validate.js
 * comments: Functions that validate the field names and do other various things
 */


/* validatefname - verifies fname is not empty
 *  *  * precondition: fname - a text based input
 *   *   * postcondition: true/false  
 *    *    */
function validatefname(fname)
{
   if(fname.value == "") {
      $('#caMsg').html("You must enter a valid first name!<br>");
      fname.focus();
      return false;
   }
   return true;
}


/* validatelname - verifies lname is not empty
 *  *  * precondition: lname - a text based input
 *   *   * postcondition: true/false  
 *    *    */
function validatelname(lname)
{
   if(lname.value == "") {
      $('#caMsg').html("You must enter a valid last name!<br>");
      lname.focus();
      return false;
   }
   return true;
}

/* validateemail - verifies email is not empty
 *  *  * precondition: email - a text based input
 *   *   * postcondition: true/false  
 *    *    */
function validateemail(email)
{
   var re = new RegExp(/^\w{0,20}@\w{0,20}\.\w{0,4}$/);
   if(!re.test(email.value)) {
      $('#caMsg').html("You must enter a valid email!<br>");
      $('#lpMsg').html("Please enter a valid email.<br>");
      email.value="";
      email.focus();
      return false;
   }
   return true;
}

/* validateSIgnUpPassword - verifies password is not empty and has a regular expression for it to be 6 characters long,
 * 				one upper case letter, one lower case, one number, and one non-alphanumeric
 *  *  * precondition: password1, password2 - a password based input, must not be empty and they must be equal
 *   *   * postcondition: true/false  
 *    *    */
function validateSignupPassword(password1, password2)
{
   var re = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^0-9a-zA-Z].*).{6,}$/);
   if(password1.value == "" || password2.value == "") {
      $('#caMsg').html("You must enter a password.<br> (atleast 6 characters containing one uppercase AND lowercase letter, number, and non-alphanumeric)<br>");
      password1.value="";
      password2.value="";
      password1.focus();
      return false;
   }
   if(password1.value != "" && password1.value == password2.value) {
         if(!re.test(password1.value)) {
           $('#caMsg').html("You must enter a valid password!<br> (atleast 6 characters containing one uppercase AND lowercase letter, number, and non-alphanumeric)<br>");
           password1.value="";
           password2.value="";
           password1.focus();
           return false;
         }
       } else {
         $('#caMsg').html("Error: Please check that you've entered and confirmed your password!<br>");
         password1.value="";
         password2.value="";
         password1.focus();
         return false;
       }
   return true;
}

/* validatepassword - verifies password is not empty and has a regular expression for it to be 6 characters long,
 * 				one upper case letter, one lower case, one number, and one non-alphanumeric
 *  *  * precondition: password1, password2 - a password based input, not empty and it must pass the RegExp test
 *   *   * postcondition: true/false  
 *    *    */
function validatepassword(password1)
{
   var re = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^0-9a-zA-Z].*).{6,}$/);
   if(password1.value == "") {
      $('#lpMsg').html("Please enter your password.<br>");
      password1.value="";
      password1.focus();
      return false;
   }
   else if(!re.test(password1.value)) {
      $('#lpMsg').html("Your password is incorrect.<br>(atleast 6 characters containing one uppercase AND lowercase letter, number, and non-alphanumeric)<br>");
      password1.value="";
      password1.focus();
      return false;
   }
   return true;
}

/* validateSignUp - verifies all items in form are valid
 *  *  * precondition: the form to process from the current document 
 *   *   * postcondition: true/false  
 *    *    */
function validateSignUp(form)
{
   if(!validatefname(form.fname)) return false;
   if(!validatelname(form.lname)) return false;
   if(!validateemail(form.email)) return false;
   if(!validateSignupPassword(form.password1, form.password2)) return false;

   $.post(
      'uploadNewInfo.php',
      {"fname":form.fname.value,"lname":form.lname.value,"email":form.email.value,"password":form.password1.value},
      function(jsonResData) {
         var resData = $.parseJSON(jsonResData);
         if(resData.code == "1") {
            $('#caMsg').html("Account created! Welcome "+resData.fname+" "+resData.lname+".<br>");
            return true;
         }
         else if(resData.code == "2") {
            $('#caMsg').html("This email address already exists.<br>");
            return false;
         }
      }
   )
   return true;
}

/* validatelogin - verifies email and password are valid and then we match it with what we have in the database
 *  *  * precondition: the form to process from the current document 
 *   *   * postcondition: true/false  
 *    *    */
function validatelogin(form)
{
   if(!validateemail(form.email)) return false;
   if(!validatepassword(form.password1)) return false;

   $.post(
      'checklogin.php',
      {"email":form.email.value,"password":form.password1.value},
      function(jsonResData) {
         var resData = $.parseJSON(jsonResData);
	 if(resData.code == "1") {
   	    email.value = "";
	    password.value = "";
   	    /*window.location.href = "#gameTime";*/
	    $(":mobile-pagecontainer").pagecontainer("change", "#gameTime");
	    $('#gameMsg').html("Welcome back, "+resData.fname+" "+resData.lname+".<br>");
	    return true;
	 }
	 else if(resData.code == "3") {
            $('#lpMsg').html("Unknown email address.<br>");
	    return false;
	 }
	 else if(resData.code == "4") {
            $('#lpMsg').html("Incorrect password.<br>");
	    return false;
	 }
      }
   )
   return true;
}

/* areTheyLogged - Basically just calls the validatelogin function and sees if it is true or not.
 * 		This function is essential because if the user is not logged in, we do not want to allow them to 
 * 		go straight to the game page. We must make them login in first.
 */
function areTheyLogged(form)
{
   if(!validatelogin(form)) return false;

   return true;
}

