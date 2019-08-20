<?php
if (empty($_GET['type'])) {
	exit;
}

if ($_GET['type'] === 'state') {
	echo file_get_contents('http://api.thni.net/jzip/X0401/JSONP/J/state_index.js');
}
else if ($_GET['type'] === 'city') {
	echo file_get_contents('http://api.thni.net/jzip/X0401/JSONP/J/' . $_GET['state'] . '/city_index.js');
}
else if ($_GET['type'] === 'street') {
	echo file_get_contents('http://api.thni.net/jzip/X0401/JSONP/J/' . $_GET['state'] . '/' . $_GET['city'] . '/street_index.js');
}
else if ($_GET['type'] === 'zipcode') {
	echo file_get_contents('http://api.thni.net/jzip/X0401/JSONP/J/' . $_GET['state'] . '/' . $_GET['city'] . '/' . $_GET['street'] . '.js');
}
?>