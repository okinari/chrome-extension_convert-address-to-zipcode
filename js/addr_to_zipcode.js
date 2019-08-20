function getUrl(params) {
	let paramString = '';
	for (var key in params) {
		paramString += key + '=' + params[key] + '&';
	}
	return encodeURI('https://sample-one.cloudgarage.okinari.net/oki/ConvertAddressToZipcode.php?' + paramString);
}

function retry(str) {
	let inputAddress = $('#input-address').val() + str;
	$('#input-address').val(inputAddress);
	let result = convertAddrToZipcode(inputAddress);
	$('#result').html(result);
}

function convertAddrToZipcode(address) {

	let state = null;
	let city = null;
	let street = null;
	let result = null;

	function contains(data) {
		for (let key in data) {
			if (address.indexOf(data[key]['name']) === 0) {
				address = address.replace(data[key]['name'], '');
				return {
					isError: false
					, info: data[key]['name']
				};
			}
		}

		let retAddr = '';
		if (state !== null) {
			retAddr += state;
		}
		if (city !== null) {
			retAddr += city;
		}
		if (street !== null) {
			retAddr += street;
		}

		let errorInfo = {isError: true};
		if (retAddr === '') {
			errorInfo['info'] = 'Zip code unknown. "' + address + '" does not exist.';
		}
		else {
			errorInfo['info'] = 'Zip code unknown. "' + retAddr + '" lists <br />';
			for (let key in data) {
				errorInfo['info'] += '<a href="#" class="retry">' + data[key]['name'] + '</a><br />';
			}
		}
		return errorInfo;
	}

	$.ajax({
		type: 'get'
		, url: getUrl({type: 'state'})
		, dataType: 'jsonp'
		, jsonp : false
		, jsonpCallback: 'StateIndex'
		, scriptCharset: 'utf-8'
	})
	.done(function(res) {
		result = contains(res);
		if (result.isError) {
			$('#result').html(result.info);
			$('.retry').click(function(event) {
				retry(event.target.textContent);
			});
			return;
		}
		state = result.info;
		$.ajax({
			type: 'get'
			, url: getUrl({type: 'city', 'state': state})
			, dataType: 'jsonp'
			, jsonp : false
			, jsonpCallback: 'CityIndex'
			, scriptCharset: 'utf-8'
			, async: false
		})
		.done(function(res) {
			result = contains(res);
			if (result.isError) {
				$('#result').html(result.info);
				$('.retry').click(function(event) {
					retry(event.target.textContent);
				});
				return;
			}
			city = result.info;
			$.ajax({
				type: 'get'
				, url: getUrl({type: 'street', 'state': state, 'city': city})
				, dataType: 'jsonp'
				, jsonp : false
				, jsonpCallback: 'StreetIndex'
				, scriptCharset: 'utf-8'
				, async: false
			})
			.done(function(res) {
				result = contains(res);
				if (result.isError) {
					$('#result').html(result.info);
					$('.retry').click(function(event) {
						retry(event.target.textContent);
					});
					return;
				}
				street = result.info;
				$.ajax({
					type: 'get'
					, url: getUrl({type: 'zipcode', 'state': state, 'city': city, 'street': street})
					, dataType: 'jsonp'
					, jsonp : false
					, jsonpCallback: 'KenSearchValue'
					, scriptCharset: 'utf-8'
				})
				.done(function(res) {
					$('#result').html(res['zipcode']);
				})
				.fail(function(jqXHR, textStatus, errorThrown) {
					console.log('jqXHR:');
					console.log(jqXHR);
					console.log('textStatus:');
					console.log(textStatus);
					console.log('errorThrown:');
					console.log(errorThrown);
				});
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.log('jqXHR:');
				console.log(jqXHR);
				console.log('textStatus:');
				console.log(textStatus);
				console.log('errorThrown:');
				console.log(errorThrown);
			});
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.log('jqXHR:');
			console.log(jqXHR);
			console.log('textStatus:');
			console.log(textStatus);
			console.log('errorThrown:');
			console.log(errorThrown);
		});
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.log('jqXHR:');
		console.log(jqXHR);
		console.log('textStatus:');
		console.log(textStatus);
		console.log('errorThrown:');
		console.log(errorThrown);
	});
}

$(function() {
	$('#input-address').keypress(function() {
		let inputAddress = $('#input-address').val();
		convertAddrToZipcode(inputAddress);
	});
});