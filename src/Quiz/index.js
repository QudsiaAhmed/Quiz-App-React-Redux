import React, { useState,useEffect } from 'react';
import './style.css';
import { useSelector, useDispatch } from 'react-redux';
import {
    startTimer,
    tickTimer,
    answerQuestion,
    confirmAnswer,
    nextQuestion,
    endQuiz,
    playAgain,
    setUserName,
} from '../store/reducers/quiz';



const Quiz = () => {
    const dispatch = useDispatch();
    const quizState = useSelector((state) => state.quiz);
    const [tempUserAnswers, setTempUserAnswers] = useState({}); // Define tempUserAnswers state
    const [isInputEmpty, setInputEmpty] = useState(true); // Track input field's value


    const handleStart = () => {
        if (quizState.userName.trim() !== '') {
            dispatch(startTimer());
            dispatch(nextQuestion());
        }
    };

    const handleInputChange = (e) => {
        dispatch(setUserName(e.target.value));
        setInputEmpty(e.target.value.trim() === ''); // Check if input is empty
    };


    const handleAnswer = (answer) => {
        if (!quizState.isAnswerConfirmed) {
            setTempUserAnswers((prevTempUserAnswers) => ({
                ...prevTempUserAnswers,
                [quizState.currentQuestionIndex]: answer,
            }));
        }
    };
    const handleConfirm = () => {
        if (!tempUserAnswers[quizState.currentQuestionIndex]) {
          alert("Please select an option before confirming.");
        } else {
          dispatch(answerQuestion(tempUserAnswers[quizState.currentQuestionIndex])); // Dispatch the selected answer
          dispatch(confirmAnswer());
        }
      };
    
    const handleNext = () => {
        if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
            dispatch(nextQuestion());
        } else {
            dispatch(endQuiz());
        }
    };

    const handlePlayAgain = () => {
        dispatch(playAgain());
    };

    useEffect(() => {
        if (quizState.timerActive && quizState.timeRemaining > 0) {
            const interval = setInterval(() => {
                dispatch(tickTimer());
            }, 1000);

            return () => clearInterval(interval);
        } else if (quizState.timeRemaining === 0) {
            dispatch(endQuiz());
        }
    }, [dispatch, quizState.timerActive, quizState.timeRemaining]);
    const calculateIncorrectQuestionsCount = () => {
        let incorrectCount = 0;
    
        for (const questionIndex in tempUserAnswers) {
            const selectedAnswer = tempUserAnswers[questionIndex];
            const correctAnswer = quizState.questions[questionIndex].correctAnswer;
    
            if (selectedAnswer !== correctAnswer) {
                incorrectCount++;
            }
        }
    
        return incorrectCount;
    };
    
    if (quizState.quizEnded) {
        return (
            <div className="container">
                <p>Quiz ended!</p>
                {/* <p>Total Questions: {quizState.totalQuestionsCount}</p> */}
                <p>Total Questions: 10</p>
                <p>Correct Answers: {quizState.correctAnswersCount}</p>
                <p>Incorrect Questions: {calculateIncorrectQuestionsCount()}</p>
                <button className="PlayAgain" onClick={handlePlayAgain}>Play Again</button>
            </div>
        );
    }
    if (quizState.currentQuestionIndex === 0) {
        return (
            <div className="container">
            <input
                className="user-name-input"
                type="text"
                placeholder="Enter your name"
                value={quizState.userName}
                onChange={handleInputChange}
            />
            <button
                className={`StartQuiz ${isInputEmpty ? '' : 'active'}`} // Apply active class when input is not empty
                onClick={handleStart}
                disabled={isInputEmpty}
            >
                Start Quiz
            </button>
        </div>
        
        );
    }
    function getOptionButtonClassName(option) {
        let className = 'optionButton';
    
        if (tempUserAnswers[quizState.currentQuestionIndex] === option) {
            className += ' selected';
        }
    
        if (quizState.isAnswerConfirmed) {
            const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
            if (option === currentQuestion.correctAnswer) {
                className += ' correct';
            } else if (option === tempUserAnswers[quizState.currentQuestionIndex]) {
                className += ' incorrect';
            }
        }
    
        return className;
    }
    
    
    
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    return (
        <div className="container">
            <h1>Quiz App</h1>
            <p>Time Remaining: {quizState.timeRemaining} seconds</p>
            <p className="question">{currentQuestion.text}</p>
            <ul className="optionsList">
                {currentQuestion.options.map((option, index) => (
                    <li key={index}>
                        <button
                            className={getOptionButtonClassName(option)}
                            onClick={() => handleAnswer(option)}
                            disabled={quizState.isAnswerConfirmed}
                        >
                            {option}
                        </button>
                    </li>
                ))}
            </ul>
            {!quizState.isAnswerConfirmed && (
                <button className="nextButton" onClick={handleConfirm}>Confirm</button>
            )}
            {quizState.isAnswerConfirmed && (
    <>
        {tempUserAnswers[quizState.currentQuestionIndex] === currentQuestion.correctAnswer ? (
            <p>Correct Answer</p>
        ) : (
            <p>Wrong Answer</p>
        )}
        <button className="nextButton" onClick={handleNext}>
            {quizState.currentQuestionIndex ===
                quizState.questions.length - 1
                ? 'Finish'
                : 'Next'}
        </button>
    </>
)}
        </div>
    );
};

export default Quiz;
