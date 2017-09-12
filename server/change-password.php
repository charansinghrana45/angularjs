<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
	

if(!isset($_POST) || !isset($_POST['userUniqueId'])) die();

session_start();

if($_POST['userUniqueId'] != $_SESSION['userUniqueId']) die();

$con = mysqli_connect('localhost', 'root', '', 'myspace');

$response = [];

$query = "update users set password = '".$_POST['newPassword']."' where email = '".$_SESSION['email']."'";

$result = mysqli_query($con, $query);

if($result)
{
	$response['status'] = 'done';
}
else
{
	$response['status'] = 'error';
}


echo json_encode($response);

?>