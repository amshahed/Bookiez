function logout(){
	localStorage.clear();
	window.open('/', '_self');
}

function acceptreq(id, email, img, el){
	el.className = 'fa fa-spinner btn';
	var owner = localStorage.getItem('email');
	$.ajax({
		type : 'POST',
		data : { 'id':id, 'owner':owner, 'img':img, 'email':email },
		url : '/acceptreq',
		success : function(json){
			if (json.hasOwnProperty('error')){
				alert('an error occured');
				return;
			}
			else if (json.hasOwnProperty('updated')){
				var from = JSON.parse(localStorage.getItem('from'));
				for (var i=0; i<from.length; i++)
					from[i] = JSON.stringify(from[i]);
				var idx = from.indexOf(JSON.stringify({id:id, chaise:email, image:img}));
				from.splice(idx,1);
				for (var i=0; i<from.length; i++)
					from[i] = JSON.parse(from[i]);
				localStorage.setItem('from', JSON.stringify(from));

				var lent = JSON.parse(localStorage.getItem('lent'));
				lent.push({id, img, email});
				localStorage.setItem('lent', JSON.stringify(lent));
				el.parentNode.parentNode.removeChild(el.parentNode);
				alert('Book successfully lent');
			}
		}
	});
}

function rejectreq(id, email, img, el){
	el.className = 'fa fa-spinner btn';
	var owner = localStorage.getItem('email');
	$.ajax({
		type : 'POST',
		data : { 'id':id, 'owner':owner, 'img':img, 'email':email },
		url : '/rejectreq',
		success : function(json){
			if (json.hasOwnProperty('error')){
				alert('an error occured');
				return;
			}
			else if (json.hasOwnProperty('request')){
				var from = JSON.parse(localStorage.getItem('from'));
				for (var i=0; i<from.length; i++)
					from[i] = JSON.stringify(from[i]);
				var idx = from.indexOf(JSON.stringify({id:id, chaise:email, image:img}));
				from.splice(idx,1);
				for (var i=0; i<from.length; i++)
					from[i] = JSON.parse(from[i]);
				localStorage.setItem('from', JSON.stringify(from));
				el.parentNode.parentNode.removeChild(el.parentNode);
				alert('Request rejected');
			}
		}
	});
}

$(document).ready(function(){
	var name = localStorage.getItem('name');
	if (name==null)
		window.open('/', '_self');
	$('.navbar-brand').html(name);
	var from = JSON.parse(localStorage.getItem('from'));
	for (var i=0; i<from.length; i++){
		var id = from[i].id;
		var email = from[i].chaise;
		var div = '<div class="books thumbnail">';
		var img = '<img class="cover" src="'+from[i].image+'">';
		var rjct = '<button class="fa fa-close btn" onclick=\'rejectreq("'+id+'","'+email+'","'+from[i].image+'", this)\'></button>';
		var accpt = '<button class="fa fa-check btn" onclick=\'acceptreq("'+id+'","'+email+'","'+from[i].image+'", this)\'></button></div>';
		$('#bookholder').append(div+img+rjct+accpt);
	}
});