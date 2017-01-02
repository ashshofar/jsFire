var favMovies = new Firebase('https://moviefire-a0cf4.firebaseio.com/movies');

function saveToList(event){
	if(event.which == 13 || event.keyCode == 13){
		var movieName = document.getElementById('movieName').value.trim();
		if(movieName.length > 0){
			saveToFB(movieName);
		}
		document.getElementById('movieName').value = '';
		return false;
	} 
};

function saveToFB(movieName){
	favMovies.push({
		name: movieName
	});
};

function refreshUI(list){
	var lis = '';
	for (var i=0; i<list.length; i++){
		lis += '<li data-key="' + list[i].key + '">' + list[i].name + ' [' + genLinks(list[i].key, list[i].name) + ']</li>';

	};
	document.getElementById('favMovies').innerHTML = lis;
};

function genLinks(key, mvName){
	var links = '';
	links += '<a href="javascript:edit(\'' + key + '\',\'' + mvName + '\')">Edit</a> | ';
	links += '<a href="javascript:del(\'' + key + '\',\'' + mvName + '\')">Delete</a>';
	return links;
};

function edit(key, mvName){
	var movieName = prompt("Update the movie name", mvName);
	if (movieName && movieName.length > 0){
		var updateMovieRef = buildEndPoint(key);
		updateMovieRef.update({
			name: movieName
		});
	}
}

function del(key, mvName){
	var response = confirm("Are certain about removing \"" + mvName + "\" from the list?");
	if (response == true){
		var deleteMovieRef = buildEndPoint(key);
		deleteMovieRef.remove();
	}
}

function buildEndPoint(key){
	return new Firebase('https://moviefire-a0cf4.firebaseio.com/movies/' + key);
}

favMovies.on("value", function(snapshot){
	var data = snapshot.val();
	var list = [];
	for (var key in data){
		if (data.hasOwnProperty(key)){
			name = data[key].name ? data[key].name : '';
			if (name.trim().length > 0){
				list.push({
					name: name,
					key: key
				})
			}
		}
	}
	refreshUI(list);
});