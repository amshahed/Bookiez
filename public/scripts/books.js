
function requestbook(id, owner,img, el){
	el.className = 'fa fa-spinner btn';
	el.innerHTML = '';
	var email = localStorage.getItem('email');
	$.ajax({
		type : 'POST',
		data : { 'email':email, 'id':id, 'owner':owner, 'img':img },
		url : '/requestbook',
		success : function(json){
			if (json.hasOwnProperty('error')){
				alert('an error occured');
				return;
			}
			if (json.hasOwnProperty('book')){
				el.className = 'fa fa-check btn dsbld';
				el.disabled = true;
				el.innerHTML = '&nbsp;&nbsp;&nbsp;Requested';
				var to = JSON.parse(localStorage.getItem('to'));
				to.push({id:id, owner:owner, image:img});
				localStorage.setItem('to', JSON.stringify(to));
			}
		}
	});
}

function logout(){
	localStorage.clear();
	window.open('/','_self');
}

$(document).ready(function(){
	var name = localStorage.getItem('name');
	if (name==null)
		window.open('/', '_self');
	$('.loader').show();
	var to = JSON.parse(localStorage.getItem('to'));
	for (var i=0; i<to.length; i++)
		to[i] = JSON.stringify(to[i]);
	$('.navbar-brand').html(name);
	$.ajax({
		type : 'POST',
		url : '/getbooks',
		success : function(json){
			$('.loader').hide();
			if (json.hasOwnProperty('error')){
				alert('an error occured');
				return;
			}
			var email = localStorage.getItem('email');
			for (var i=0; i<json.length; i++){
				var id = json[i].book_id;
				var owner = json[i].owner;
				var div = '<div class="books thumbnail">';
				var img = '<img class="cover" src="'+json[i].image+'">';
				var accepted = json[i].accepted;
				if (to.includes(JSON.stringify({ id:id, owner:owner, image:json[i].image }))){
					var btn = '<button class="fa fa-check btn dsbld" disabled>&nbsp;&nbsp;Requested</button></div>';
				}
				else if (owner==email)
					var btn = '<button class="fa fa-user btn dsbld" disabled>&nbsp;&nbsp;Yours</button></div>';
				else if (accepted!='none')
					var btn = '<button class="fa fa-ban btn dsbld" disabled>&nbsp;&nbsp;Unavailable</button></div>';
				else
					var btn = '<button class="fa fa-plus btn" onclick=\'requestbook("'+id+'","'+owner+'","'+json[i].image+'", this)\'>&nbsp;&nbsp;Request</button></div>';
				$('#bookholder').append(div+img+btn);
			}
		}
	})
});