// src/pages/GuessNumberGame.tsx

import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  InputNumber,
  Space,
} from 'antd';

const { Title, Text } = Typography;

const GuessNumberGame: React.FC = () => {
  // randomNumber: số ngẫu nhiên (1–100)
  const [randomNumber, setRandomNumber] = useState<number>(0);
  // attemptsLeft: số lượt dự đoán còn lại (bắt đầu từ 10)
  const [attemptsLeft, setAttemptsLeft] = useState<number>(10);
  // guess: số người chơi nhập
  const [guess, setGuess] = useState<number | null>(null);
  // feedback: phản hồi sau mỗi lượt đoán
  const [feedback, setFeedback] = useState<string>('');
  // gameOver: trạng thái kết thúc trò chơi (đoán đúng hoặc hết lượt)
  const [gameOver, setGameOver] = useState<boolean>(false);

  // Khởi tạo trò chơi khi component mount
  useEffect(() => {
    resetGame();
  }, []);

  /**
   * resetGame: Khởi tạo (hoặc reset) trò chơi.
   * - Sinh số ngẫu nhiên
   * - Đặt lại lượt đoán
   * - Xóa feedback
   * - gameOver = false
   */
  const resetGame = () => {
    const newRandom = Math.floor(Math.random() * 100) + 1;
    setRandomNumber(newRandom);
    setAttemptsLeft(10);
    setGuess(null);
    setFeedback('');
    setGameOver(false);
  };

  /**
   * handleGuess: Xử lý khi nhấn "Đoán"
   */
  const handleGuess = () => {
    if (gameOver) return;
    if (guess === null) {
      setFeedback('Vui lòng nhập số dự đoán!');
      return;
    }

    const newAttempts = attemptsLeft - 1;
    setAttemptsLeft(newAttempts);

    if (guess < randomNumber) {
      setFeedback('Bạn đoán quá thấp!');
    } else if (guess > randomNumber) {
      setFeedback('Bạn đoán quá cao!');
    } else {
      setFeedback('Chúc mừng! Bạn đã đoán đúng!');
      setGameOver(true);
      return;
    }

    if (newAttempts <= 0) {
      setFeedback(`Bạn đã hết lượt! Số đúng là ${randomNumber}.`);
      setGameOver(true);
    }
  };

  return (
    <Row justify="center" style={{ marginTop: 60 }}>
      <Col xs={22} sm={16} md={12} lg={8}>
        <Card
          bordered
          style={{ borderRadius: 8 }}
          bodyStyle={{ textAlign: 'center' }}
        >
          {/* Tiêu đề */}
          <Title level={3} style={{ marginBottom: 0 }}>
            Trò Chơi Đoán Số
          </Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            Hãy đoán một số từ 1 đến 100!
          </Text>

          {/* Ô nhập số và nút Đoán */}
          <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
            <InputNumber
              min={1}
              max={100}
              value={guess ?? undefined}
              onChange={(value) => setGuess(value)}
              disabled={gameOver}
              style={{ width: '100%' }}
            />
            <Button
              type="primary"
              onClick={handleGuess}
              disabled={gameOver}
              style={{
                backgroundColor: '#d10000',
                borderColor: '#d10000',
              }}
              block
            >
              Đoán
            </Button>
          </Space>

          {/* Hiển thị phản hồi */}
          {feedback && (
            <Text
              strong
              style={{ color: '#d10000', display: 'block', marginBottom: 8 }}
            >
              {feedback}
            </Text>
          )}

          {/* Hiển thị lượt còn lại */}
          <Text style={{ display: 'block', marginBottom: 16 }}>
            Lượt còn lại: <strong>{attemptsLeft}</strong>
          </Text>

          {/* Nút Chơi Lại */}
          <Button onClick={resetGame} disabled={!gameOver && attemptsLeft < 10}>
            Chơi lại
          </Button>
        </Card>
      </Col>
    </Row>
  );
};

export default GuessNumberGame;
