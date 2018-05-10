function logout(){
	localStorage.clear();
	window.open('/', '_self');
}

function returnBook(id, owner, image, el){
	var email = localStorage.getItem('email');
	$('.rtrn').className = 'btn fa fa-spinner';
	$.ajax({
		type: 'POST',
		data: { id: id, img: image, owner:owner, email:email },
		url: '/returnbook',
		success: function(json){
			if (json.hasOwnProperty('error')){
				alert('an error occured');
				return;
			}
			else if (json.hasOwnProperty('returned')){
				var borrowed = JSON.parse(localStorage.getItem('borrowed'));
				for (var i=0; i<borrowed.length; i++)
					borrowed[i] = JSON.stringify(borrowed[i]);
				var idx = borrowed.indexOf(JSON.stringify({id:id, img:image, owner:owner}));
				borrowed.splice(idx,1);
				for (var i=0; i<borrowed.length; i++)
					borrowed[i] = JSON.parse(borrowed[i]);
				localStorage.setItem('borrowed', JSON.stringify(borrowed));
				alert('Book successfully returned');
				el.parentNode.parentNode.removeChild(el.parentNode);
			}
		}
	});
}

$(document).ready(function(){
	var name = localStorage.getItem('name');
	if (name==null)
		window.open('/', '_self');
	$('.navbar-brand').html(name);
	var lent = JSON.parse(localStorage.getItem('lent'));
	for (var i=0; i<lent.length; i++){
		var id = lent[i].id;
		var email = lent[i].email;
		var div = '<div class="books thumbnail">';
		var img = '<img class="cover" src="'+lent[i].img+'"></div>';
		$('#lbookholder').append(div+img);
	}
	var borrowed = JSON.parse(localStorage.getItem('borrowed'));
	for (var i=0; i<borrowed.length; i++){
		var id = borrowed[i].id;
		var owner = borrowed[i].owner;
		var div = '<div class="books thumbnail" style="height:340px">';
		var img = '<img class="cover" src="'+borrowed[i].img+'">';
		var rtrn = '<button class="btn fa fa-ban rtrn" onclick=\'returnBook("'+id+'","'+owner+'","'+borrowed[i].img+'", this)\'>Return Book</button>';
		$('#bbookholder').append(div+img+rtrn);
	}
});