<?php
// Kết nối tới cơ sở dữ liệu
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "game";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

session_start();
$playerName = $_SESSION['fullname'] ?? null;
$data = json_decode(file_get_contents('php://input'), true);
$correctAnswers = $data['correctAnswers'];
$wrongAnswers = $data['wrongAnswers'];

$response = ["success" => false];

if ($playerName) {
    // Lấy thông tin người chơi từ cơ sở dữ liệu
    $sql = "SELECT correct_answers FROM player WHERE fullname = '$playerName'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $currentCorrectAnswers = $row['correct_answers'];

        // Kiểm tra nếu số câu đúng hiện tại cao hơn số câu đúng cũ
        if ($correctAnswers > $currentCorrectAnswers) {
            // Cập nhật thành tích cao nhất
            $updateSql = "UPDATE player SET correct_answers = $correctAnswers, incorrect_answers = $wrongAnswers WHERE fullname = '$playerName'";
            if ($conn->query($updateSql) === TRUE) {
                $response["success"] = true;
            }
        }
    } else {
        // Nếu chưa có người chơi, tạo mới
        $insertSql = "INSERT INTO player (fullname, correct_answers, incorrect_answers) VALUES ('$playerName', $correctAnswers, $wrongAnswers)";
        if ($conn->query($insertSql) === TRUE) {
            $response["success"] = true;
        }
    }
}

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>
