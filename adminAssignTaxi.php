<?php

/*
*   
* File description:
*  This PHP file is to process the input passed from admin.js. 
*  First, this file checked the database connection, database selection, table existence. Return error message if failure occurs.
*  Second, this file get the reference number and checked if in the database. If no, return error message. If yes, change the booking status.
*/

require_once("../../conf/settings.php");

$tableName = "client";

$conn = mysqli_connect($host, $user, $pswd, $dbnm);

//check connections
if (!$conn) {
    echo "Fail to connect";
    echo "<br>";
}

//conncted
else {
    
    
    //check if select db
    $dbselection = mysqli_select_db($conn, $dbnm);
    
    if (!$dbselection) {
        echo "Fail to select DB";
        echo "<br>";
    }
    
    //Database selected
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
        
        $reference = $_GET['reference'];
        
        
        //first check if the booking number exists
        $fetchBookingQuery = "SELECT * FROM $tableName WHERE reference = '$reference'";
        $result            = mysqli_query($conn, $fetchBookingQuery);
        $row               = mysqli_fetch_assoc($result);
        //if the result exists, change the status for the records
        if ($row > 0) {
            
            //If the status is assigned, no change will be made
            if ($row["bookingStatus"] == "assigned") {
                echo "<p style='color:red'>No change has been made.<br>You have already change the status of <strong><i> $reference </strong></i>to 'assigned'.</p>";
            }
            
            //Booking number is valid, and the bookingStatus is unassigned. Means we can change to unassigned.
            else {
                $changeStatusQuery = "UPDATE $tableName SET bookingStatus='assigned' WHERE reference='$reference'";
                mysqli_query($conn, $changeStatusQuery);
                echo "<p>The booking request <strong><i>" . $reference . "</strong></i> has been properly assigned!</p>";
            }
        }
        //if the result does not exist, show error.
        else {
            echo "<p style='color:red'>The reference number is not in the database</p>";
        }
    }
}
                              
?>