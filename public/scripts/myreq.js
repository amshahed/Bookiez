function logout(){
	localStorage.clear();
	window.open('/', '_self');
}

function cancelreq(id, owner, image, el){
	var email = localStorage.getItem('email');
	$.ajax({
		type: 'POST',
		url: '/cancelreq',
		data: { id:id, owner:owner, email:email, img:image },
		success: function(json){
			if (json.hasOwnProperty('error'))
				alert(json.error);
			else if (json.hasOwnProperty('cancelled')){
				var to = JSON.parse(localStorage.getItem('to'));
				for (var i=0; i<to.length; i++)
					to[i] = JSON.stringify(to[i]);
				var idx = to.indexOf(JSON.stringify({id:id, image:image, owner:owner}));
				to.splice(idx, 1);
				for (var i=0; i<to.length; i++)
					to[i] = JSON.parse(to[i]);
				localStorage.setItem('to', JSON.stringify(to));
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
	var email = localStorage.getItem('email');
	var to = JSON.parse(localStorage.getItem('to'));
	for (var i=0; i<to.length; i++){
		var id = to[i].id;
		var div = '<div class="books thumbnail">';
		var img = '<img class="cover" src="'+to[i].image+'">';
		var cancel = '<button class="fa fa-ban btn" onclick=\'cancelreq("'+id+'","'+to[i].owner+'","'+to[i].image+'", this)\'>&nbsp;&nbsp;Cancel Request</button></div>';
		$('#bookholder').append(div+img+cancel);
	}
});