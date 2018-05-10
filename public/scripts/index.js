
$(document).ready(function(){
	if (localStorage.getItem('email'))
		window.open('/books', '_self');
});