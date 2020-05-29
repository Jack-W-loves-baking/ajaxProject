<?php

/* 
*   
* File description:
* This PHP file is to process the input passed from admin.js. 
* First, this file checked the database connection, database selection, table existence. Return error message if the failure occurs.
* Second, this file will print out all the bookings with the 'unassigned' status and 'within 2 hours from now' in a table. 
*     if no details were found, appropriate messages would be returned.
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
        
        
        
        //fetch the bookings from table
        $fetchUniqueIDQuery = "SELECT * FROM $tableName WHERE pickupTime > NOW() AND pickupTime <=NOW() + INTERVAL 2 HOUR AND bookingStatus = 'unassigned'";
        
        $result = mysqli_query($conn, $fetchUniqueIDQuery);
        $rowTotal= mysqli_num_rows($result);
        
        //if there are bookings match up requirements in the database
        if ($rowTotal > 0) {
            //return table head
            echo "<table class='table table-striped'>";
            echo "<tr>";
            echo "<th>Reference</th>";
            echo "<th>Client Name</th>";
            echo "<th>Phone</th>";
            echo "<th>Pickup location</th>";
            echo "<th>Destination</th>";
            echo "<th>Pickup time</th>";
            echo "</tr>";
            
            //for each record, return in table row
            while ($row = mysqli_fetch_assoc($result)) {
                echo "<tr>";
                echo "<td>" . $row["reference"] . "</td>";
                echo "<td>" . $row["clientName"] . "</td>";
                echo "<td>" . $row["phone"] . "</td>";
                echo "<td>" . $row["pickupAddress"] . "</td>";
                echo "<td>" . $row["destination"] . "</td>";
                echo "<td>" . $row["pickupTime"] . "</td>";
                echo "</tr>";
            }
            
            //end of table
            echo "</table>";
            
        }
        
        //if no bookings meet requirements in the database
        else {
            echo "<p style='color:red'>Currently no bookings match up requirements.</p>";
        }
    }
}
                              
?>