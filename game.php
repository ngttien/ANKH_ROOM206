<?php
// Kết nối cơ sở dữ liệu
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "game";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Lấy tên người chơi từ session
session_start();
$playerName = $_SESSION['fullname'] ?? null;
$highestScore = 0;

if ($playerName) {
    // Lấy thành tích cao nhất của người chơi
    $sql = "SELECT correct_answers FROM player WHERE fullname = '$playerName'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $highestScore = $row['correct_answers'];
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trò chơi trả lời câu hỏi</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="question-tracker">
        <!-- Các ô tròn sẽ được tạo động tại đây -->
    </div>
    <div class="high-score-box" id="high-score">
        Thành tích cao nhất: <span id="highest-score"><?= $highestScore ?> / <span id="total-questions">0</span></span>
    </div>    
    <div class="game-container">
        <header>Trò chơi trả lời câu hỏi</header>
        <div class="question-box" id="question">Câu hỏi sẽ hiển thị ở đây</div>
        <div class="answer-container" id="answers">
            <button class="answer" onclick="checkAnswer(this, 0)">Câu trả lời 1</button>
            <button class="answer" onclick="checkAnswer(this, 1)">Câu trả lời 2</button>
            <button class="answer" onclick="checkAnswer(this, 2)">Câu trả lời 3</button>
            <button class="answer" onclick="checkAnswer(this, 3)">Câu trả lời 4</button>
        </div>
        <div id="score">
            Câu đúng: <span id="correct-count">0</span> / <span id="total-questions">0</span>
        </div>
        <div id="lives">
            Mạng sống: <span id="lives-count">5</span>
        </div>
        <div class="help-container" id="help">
            <button class="help-button" onclick="useHelp50()">50/50</button>
            <button class="help-button" onclick="useHelpCorrect()">Chọn đáp án đúng</button>
        </div>
        <div id="game-over" style="display: none;">Game Over! Bạn đã hết mạng sống!</div>
        <button id="next-btn" onclick="nextQuestion()">Tiếp theo</button>
    </div>
    <script src="script.js"></script>
</body>
</html>
