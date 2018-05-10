
function sendForm(){
	var regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	var first = $('#first').val();
	var last = $('#last').val();
	var email = $('#email').val();
	var pass = $('#pass').val();
	var cpass = $('#cpass').val();
	if (first=='' || last=='' || email==''){
		alert('Please fill up all the fields with valid info');
		return;
	}
	if (!email.match(regexp)){
		alert('Please enter a valid email address');
		return;
	}
	if (pass.length<4){
		alert('Password length needs to be at least 4');
		return;
	}
	if (pass!==cpass){
		alert('Passwords don\'t match');
		return;
	}
	$.ajax({
		type : 'POST',
		data : { 'first':first, 'last':last, 'email':email, 'pass':pass },
		url : '/su',
		success : function(json){
			if (json.hasOwnProperty('error')){
				if (json.error=='ase'){
					alert('user already exists');
					return;
				}
				else {
					alert(json.error);
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