<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
	
session_start();

$con = mysqli_connect('localhost', 'root', '', 'myspace');

$response = [];

if(isset($_POST) && isset($_POST['email'])) 
{
	$query = "select * from users where email = '".$_POST['email']."' and password = '".$_POST['password']."'";

	$result = mysqli_query($con, $query);

	if(mysqli_num_rows($result) > 0)
	{
		$response['status'] = 'loggedIn';
		$response['user'] = 'admin';
		$userUniqueId = md5(uniqid());

		$_SESSION['email'] = 'admin@gmail.com';
		$_SESSION['userUniqueId'] = $userUniqueId;
		$response['userUniqueId'] = $userUniqueId;
	}
	else
	{
		$response['status'] = 'error';
	}
}



echo json_encode($response);

?>