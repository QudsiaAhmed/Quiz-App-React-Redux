
const initialState = {
    userName: '',
    questions: [
        {
            text: 'Which of the following is not a primitive data type in JavaScript"?',
            options: ['Number', 'String', 'Boolean', 'Object'],
            correctAnswer: 'Object',
        },
        {
            text: 'Which of the following is not a primitive data type in JavaScript"?',
            options: ['Number', 'String', 'Boolean', 'Object'],
            correctAnswer: 'Object',
        },
        {
            text: 'What does the "typeof" operator do in JavaScript"?',
            options: ['Returns the data type of a variable', 'Checks if a variable is defined', 'Assigns a value to a variable', 'Concatenates two strings'],
            correctAnswer: 'Returns the data type of a variable',
        },
        {
            text: 'What is the output of the following code: console.log(2 + "2")";',
            options: ['"4"', '"22"', '4', '22'],
            correctAnswer: '"22"',
        },
        {
            text: 'Which of the following is not a comparison operator in JavaScript"?',
            options: ['==', '===', '!=', '=<'],
            correctAnswer: '=<',
        },
        {
            text: 'What is the output of the following code:var x = 5; console.log(x++)";',
            options: ['4', '5', '6', 'Error'],
            correctAnswer: '6',
        },
        {
            text: 'What does the "NaN" value represent in JavaScript"?',
            options: ['Not a number', 'Null value', 'Undefined value', 'Boolean value'],
            correctAnswer: 'Not a number',
        },
        {
            text: 'What is the correct way to declare a variable in JavaScript"?',
            options: ['var x = 5;', 'variable x = 5;', 'x = 5;', 'let x = 5;'],
            correctAnswer: 'let x = 5;',
        },
        {
            text: 'What does the "this" keyword refer to in JavaScript"?',
            options: ['The current function', 'The global object', 'The object that the function belongs to', 'The parent object of the current object'],
            correctAnswer: 'The object that the function belongs to',
        },

        {
            text: 'What does the "forEach" method do in JavaScript"?',
            options: ['Adds a new element to the end of an array', 'Removes an element from the beginning of an array', 'Executes a function once for each element in an array', 'Reverses the order of the elements in an array'],
            correctAnswer: 'Executes a function once for each element in an array',
        },
        {
            text: 'What is the difference between "=="  and "===" operators in JavaScript"?',
            options: ['They are interchangeable', '"==" performs a strict comparison, while "===" performs a loose comparison', '"===" performs a strict comparison, while "==" performs a loose comparison', 'They both perform the same type of comparison9'],
            correctAnswer: '"===" performs a strict comparison, while "==" performs a loose comparison',
        },

    ], //  questions array
    currentQuestionIndex: 0,
    userAnswers: [],
    isAnswerConfirmed: false,
    quizEnded: false,
    correctAnswersCount: 0,
    incorrectAnswersCount: 0,
    timeRemaining: 90,
    timerActive: false, // Add the timerActive property
    totalQuestionsCount: 0,
    
};

export const startTimer = () => ({
    type: 'START_QUIZ',
});

export const nextQuestion = () => ({
    type: 'NEXT_QUESTION',
});

export const answerQuestion = (selectedAnswer) => ({
    type: 'ANSWER_QUESTION',
    payload: selectedAnswer,
});

export const confirmAnswer = () => ({
    type: 'CONFIRM_ANSWER',
});

export const endQuiz = () => ({
    type: 'END_QUIZ',
});

export const playAgain = () => ({
    type: 'PLAY_AGAIN',
});

export const setUserName = (name) => ({
    type: 'SET_USER_NAME',
    payload: name,
});

export const tickTimer = () => ({
    type: 'TICK_TIMER',
});

const handlers = {
    SET_USER_NAME: (state, action) => ({ ...state, userName: action.payload }),
    START_QUIZ: (state) => ({
        ...state,
        currentQuestionIndex: 0,
        quizEnded: false,
        correctAnswersCount: 0,
        incorrectAnswersCount: 0,
        totalQuestionsCount: state.questions.length,
        timerActive: true, // Start the timer when the quiz starts
    }),
    
    ANSWER_QUESTION: (state, action) => {
        const currentQuestion = state.questions[state.currentQuestionIndex];
        const correctAnswer = currentQuestion.correctAnswer;
    
        // Check if the selected answer is correct or not
        const isAnswerCorrect = action.payload === correctAnswer;
    
        // Check if user selected an answer or not
        const isAnswerSelected = action.payload !== '';
    
        // Update counts based on correctness and selection
        const updatedCorrectAnswersCount = isAnswerCorrect
            ? state.correctAnswersCount + 1
            : state.correctAnswersCount;
    
        const updatedIncorrectAnswersCount = isAnswerCorrect
            ? state.incorrectAnswersCount
            : isAnswerSelected && !isAnswerCorrect
            ? state.incorrectAnswersCount + 1
            : state.incorrectAnswersCount;
    
            return {
                ...state,
                userAnswers: [...state.userAnswers, action.payload],
                isAnswerConfirmed: false,
                correctAnswersCount: updatedCorrectAnswersCount,
                incorrectAnswersCount: updatedIncorrectAnswersCount,
            };
        
    },

    
    CONFIRM_ANSWER: (state) => {
        const currentQuestion = state.questions[state.currentQuestionIndex];
        const correctAnswer = currentQuestion.correctAnswer;
    
        // Check if the selected answer is correct or not
        const isAnswerCorrect = state.userAnswers[state.currentQuestionIndex] === correctAnswer;
    
        // Check if user selected an answer or not
        const isAnswerSelected = state.userAnswers[state.currentQuestionIndex] !== '';
    
        // Update counts based on correctness and selection
        const updatedCorrectAnswersCount = isAnswerCorrect
          ? state.correctAnswersCount + 1
          : state.correctAnswersCount;
    
        const updatedIncorrectAnswersCount = !isAnswerCorrect && isAnswerSelected
          ? state.incorrectAnswersCount + 1
          : state.incorrectAnswersCount;
    
          return {
            ...state,
            isAnswerConfirmed: true,
            correctAnswersCount: updatedCorrectAnswersCount,
            incorrectAnswersCount: updatedIncorrectAnswersCount,
        };
      },
        NEXT_QUESTION: (state) => ({
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        isAnswerConfirmed: false,
    }),
    END_QUIZ: (state) => ({
        ...state,
        quizEnded: true,
        timerActive: false,
    }),
    PLAY_AGAIN: () => initialState,
    TICK_TIMER: (state) => {
        if (state.timeRemaining > 0) {
            return {
                ...state,
                timeRemaining: state.timeRemaining - 1,
            };
        } else {
            return {
                ...state,
                timerActive: false,
            };
        }
    },
};

const quizReducer = (state = initialState, action) => {
    const handler = handlers[action.type];
    return handler ? handler(state, action) : state;
};

export default quizReducer;
