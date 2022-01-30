<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phoneNumber = $inData["phoneNumber"];
	
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		//$result = mysql_query("SELECT FirstName FROM Contacts");
		//while ($row = mysql_fetch_row($result)) {
			//if($firstName = $row["FirstName"]) {
				$stmt = $conn->prepare("UPDATE Contacts SET Email=?, PhoneNumber=?");
				$stmt->bind_param("ss", $email, $phoneNumber);
				$stmt->execute();
				$stmt->close();
				$conn->close();
				returnWithError("");
			//} 
		//}
		//returnWithError("Incorrect Name");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
