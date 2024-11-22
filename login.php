<?php
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "game";
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullname = $_POST['fullname']; // tạo session để lưu tên người chơi khi chơi
    session_start();
    $_SESSION['fullname'] = $fullname;

    // Kiểm tra xem người chơi đã tồn tại hay chưa
    $checkQuery = "SELECT * FROM player WHERE fullname = '$fullname'";
    $result = $conn->query($checkQuery);

    if ($result->num_rows > 0) {
        // Người chơi đã tồn tại, chuyển ngay sang game.html
        header("Location: game.php");
        exit();
    } else {
        // Người chơi chưa tồn tại, thêm vào cơ sở dữ liệu
        $insertQuery = "INSERT INTO player (fullname) VALUES ('$fullname')";
        if ($conn->query($insertQuery) === TRUE) {
            // Sau khi lưu thành công, chuyển đến trang game.html
            header("Location: game.php");
            exit();
        } else {
            echo "Lỗi khi lưu tên người chơi: " . $conn->error;
        }
    }
}

$conn->close();
?>
