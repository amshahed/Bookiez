
function sendForm(){
	var regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	var email = $('#email').val();
	var pass = $('#pass').val();
	if (email=='' || pass==''){
		alert('Please fill up all the fields with valid info');
		return;
	}
	if (!email.match(regexp)){
		alert('Please enter a valid email address');
		return;
	}
	$.ajax({
		type : 'POST',
		data : { 'email':email, 'pass':pass },
		url : '/li',
		success : function(json){
			if (json.hasOwnProperty('error')){
				if (json.error=='nouser'){
					alert('No user exists with this email');
					return;
				}
				else if (json.error=='wrongpass'){
					alert('The password you provided was incorrect');
					return;
				}
				else {
					alert('an error occured');
					return;
				}
			}
			else if (json.hasOwnProperty('name')){
				localStorage.setItem('email', email);
				localStorage.setItem('name', json.name);
				localStorage.setItem('to', JSON.stringify(json.to));
				localStorage.setItem('from', JSON.stringify(json.from));
				localStorage.setItem('lent', JSON.stringify(json.lent));
				localStorage.setItem('borrowed', JSON.stringify(json.borrowed));
				window.open('/books', '_self');
			}
		}
	});
}