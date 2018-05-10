
function removebook(id, el){
	el.className = 'fa fa-spinner btn rmv';
	var email = localStorage.getItem('email');
	$.ajax({
		type : 'POST',
		data : { 'email':email, 'id':id },
		url : '/removebook',
		success : function(json){
			if (json.hasOwnProperty('error')){
				alert('an error occured');
				return;
			}
			if (json.hasOwnProperty('book')){
				var el = document.getElementById(id);
				el.parentNode.removeChild(el);
			}
		}
	});
}

function addbook(id, title, image){
	document.getElementById('addbook').disabled = true;
	document.getElementById('addbtn').disabled = true;
	var email = localStorage.getItem('email');
	$.ajax({
		type : 'POST',
		data : { 'email':email,'id':id,'title':title,'image':image },
		url : '/addbook',
		success : function(json){
			if (json.hasOwnProperty('error')){
				if (json.error=='ase'){
					alert('The book is already added');
					return;
				}
				else {
					alert('an error occured');
					return;
				}
			}
			if (json.hasOwnProperty('book')){
				$('.bookchoice').hide();
				$('#addbook').val('');
				var div = '<div class="books thumbnail" id="'+id+'">';
				var img = '<img class="cover" src="'+image+'">';
				var btn = '<button class="fa fa-trash btn rmv" onclick=\'removebook("'+id+'", this)\'>&nbsp;&nbsp;Remove</button></div>';
				$('#bookholder').append(div+img+btn);
				document.getElementById('addbook').disabled = false;
				document.getElementById('addbtn').disabled = false;
			}
		}
	});
}

function getbook(){
	var book = $('#addbook').val();
	if (book=='')	return;
	$.ajax({
		type : 'POST',
		data : { 'book' : book },
		url : '/getbook',
		success : function(json){
			if (json.hasOwnProperty('error')){
				alert('an error occured');
				return;
			}
			$('.bookmenu').html('');
			for (var i=0; i<json.length; i++){
				if (json[i][3]==null)	var author='Anonymus';
				else var author = json[i][3][0];
				$('.bookmenu').append('<li class="opts" onclick=\'addbook("'+json[i][0]+'","'+json[i][1]+'","'+json[i][2]+'")\'>"'+json[i][1]+'" by '+author+'</li>');
			}
			$('.bookchoice').show();
		}
	});
}

function logout(){
	localStorage.clear();
	window.open('/', '_self');
}

$(document).ready(function(){
	var name = localStorage.getItem('name');
	if (name==null)
		window.open('/', '_self');
	$('.bookchoice').hide();
	$('.loader').show();
	$('.navbar-brand').html(name);
	var email = localStorage.getItem('email');
	$.ajax({
		type : 'POST',
		data : { 'email': email },
		url : '/getmybooks',
		success : function(json){
			$('.loader').hide();
			if (json.hasOwnProperty('error')){
				alert('an error occured');
				return;
			}
			for (var i=0; i<json.length; i++){
				var id = json[i].book_id;
				var div = '<div class="books thumbnail" id="'+id+'">';
				var img = '<img class="cover" src="'+json[i].image+'">';
				var btn = '<button class="fa fa-trash btn rmv" onclick=\'removebook("'+id+'")\'>&nbsp;&nbsp;Remove</button></div>';
				$('#bookholder').append(div+img+btn);
			}
		}
	})
});