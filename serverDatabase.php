<?php

/* 
*   
* File description:
* This PHP file is to process the input passed from booking.js. 
* First, this file checked the database connection, database selection, table existence. Return error message if the failure occurs.
* Second, this file will insert the details in the table, and return messages to booking.js once done.
*/

require_once("../../conf/settings.php");

$tableName = "client";

$conn = mysqli_connect($host, $user, $pswd, $dbnm);

//check connections
if (!$conn) {
    echo "Fail to connect";
    echo "<br>";
}

//connected
else {
    
    //check if select db
    $dbselection = mysqli_select_db($conn, $dbnm);
    
    if (!$dbselection) {
        echo "Fail to select DB";
        echo "<br>";
    }
    
    //selected
    else {
        
        //check if customer table exist
        $checktable = mysqli_num_rows(mysqli_query($conn, "SHOW TABLES LIKE '$tableName'"));
        
        
        //table not exist, need to create
        if (!($checktable > 0)) {
            
            
            $createTbleQuery = "CREATE TABLE $tableName (
                reference INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                clientName VARCHAR(40),
                phone VARCHAR(40),
                pickupAddress VARCHAR(255),
                destination VARCHAR(255),
                pickupTime DATETIME,
                bookingTime DATETIME,
                bookingStatus VARCHAR(255) DEFAULT 'unassigned'
                )AUTO_INCREMENT = 10000";
            
            mysqli_query($conn, $createTbleQuery);
            
        }
        
        //Get the value from function getData in serverDatabase.php, method is Get.
        $name        = $_GET["name"];
        $phone       = $_GET["phone"];
        $address     = $_GET["address"];
        $destination = $_GET["destination"];
        $pickupTime  = $_GET["pickupTime"];
        $currentTime = $_GET["currentTime"];
        
        
        //insert data into the database
        $InsertQuery = "INSERT INTO $tableName (clientName,phone,pickupAddress,destination,pickupTime,bookingTime,bookingStatus) VALUES ('$name','$phone','$address','$destination','$pickupTime','$currentTime',DEFAULT)";
        mysqli_query($conn, $InsertQuery);
        
        //fetch the unique ID from table
        $fetchUniqueIDQuery = "SELECT * FROM $tableName WHERE bookingTime='$currentTime'";
        $result             = mysqli_query($conn, $fetchUniqueIDQuery);
        
        while ($row = mysqli_fetch_assoc($result)) {
            $reference = $row["reference"];
        }
        
        $test = substr($pickupTime, 11, 5);
        
        //return confirmation message
        echo "<br>";
        echo "Thank you! <br><br>Your booking reference number is <strong><i>" . $reference . "</strong></i> <br><br>You will be picked up in front of your provided address at <strong><i>" . substr($pickupTime, 11, 5) . " </strong></i>on <strong><i>" . substr($pickupTime, 0, 10)."</strong></i>";  
        echo "<br>";
        echo "<br>";  
        echo "<br>"; 
    }
}
?>