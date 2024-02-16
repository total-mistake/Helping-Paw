"use strict";

const $ = document.querySelector.bind(document);

const quiz = $('.quiz');  //Эквивалентно const quiz = document.querySelector(".quiz")
const warning = $('.warning');
const btnNext = $('.quiz__next-btn');
let count = 0;
let userScore = 0;
const answersBar = $('.result__icons');
answersBar.innerHTML = '';

// import questions from './questions.js';

//Проверка наличия вопросов в массиве
if (typeof questions !== 'undefined' && questions.length > 0) {
    quiz.classList.remove('hidden');
    shuffleArray(questions);
    showQuestions(count);
} else {
    warning.classList.remove('hidden');
}

btnNext.addEventListener('click', nextQuestion);

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}

function showQuestions(index){
    const list = $(".quiz__list");
    const title = $(".quiz__question");
    const total = $(".quiz__total");
    const progress = $(".quiz__progress-inner");
    shuffleArray(questions[index].options);

    title.innerHTML = `${questions[index].question}`;
    list.innerHTML = '';
    questions[index].options.forEach(item => {
        const text = `<li class = "quiz__option Menu">${item}</li>`;
        list.insertAdjacentHTML("beforeend", text);
    })

    const options = list.querySelectorAll(".quiz__option");     //Записываем все варианты ответа
    options.forEach(function(item) {
        item.onclick = function() {
            // console.log("Clicked:", item.textContent);
            optionSelected(item);
        };
    });

    total.innerHTML = `${index + 1} из ${questions.length}`;
    progress.style.width = `${Math.round(((index + 1) / questions.length) * 100)}%`;
}

function optionSelected(answer){
    const userAnswer = answer.textContent;
    const correctAnswer = questions[count].answer;
    const options = document.querySelectorAll(".quiz__option");
    const iconCorrect = "<span'>&#10004;</span>";
    const iconIncorrect = "<span'>&#10006;</span>";

    if (userAnswer == correctAnswer) {
        //ЕСЛИ ОТВЕТ ВЕРНЫЙ
        userScore += 1;
        answer.classList.add("correct");
        
        options.forEach(item => {
            if (item.textContent != correctAnswer) {
                item.classList.add("incorrect");
            }
        })

        answer.innerHTML = `${userAnswer} \n${questions[count].clarification}`;
        answersBar.insertAdjacentHTML("beforeend", `<div>${iconCorrect}</div>`);
    } else{
        //ЕСЛИ ОТВЕТ НЕВЕРНЫЙ
        answer.classList.add("incorrect");
        
        options.forEach(item => {
            item.classList.add("incorrect");
        })
        answersBar.insertAdjacentHTML("beforeend", `<div>${iconIncorrect}</div>`);
    }

    options.forEach(item => item.classList.add("disabled"));
}

function nextQuestion() {
    const option = $(".quiz__option");
    const result = $(".result");
    const resultText = $(".result__text");
    const resultQuestions = $(".result__questions");

    if ((count + 1) == questions.length && option.classList.contains('disabled')) {
        result.classList.remove('hidden');
        quiz.classList.add('hidden');

        resultQuestions.innerHTML = '';
        questions.forEach(item => {
            const question = `<li class = "quiz__option Menu">${item.question}</li>`;
            resultQuestions.insertAdjacentHTML("beforeend", question);
        })

        resultText.innerHTML = `Количество правильных ответов: ${userScore} из ${questions.length}.`

        const listQuestions = resultQuestions.querySelectorAll(".quiz__option");
        listQuestions.forEach(function(item) {
            item.onclick = function() {
                console.log("Clicked:", item.textContent);
                showAnswer(item);
            };
        });

        function showAnswer(selectedQuestion) {
            questions.forEach(function (item) {
                console.log(item.question);
                if (item.question == selectedQuestion.textContent) {
                    $(".correct__answer").textContent = item.answer;
                }
            });
        }

        return;
    };

    if (option.classList.contains('disabled')) {    //Проверка был ли выбран вопрос
        count++;
        showQuestions(count);
    } else {
        alert("Чтобы перейти к следующему вопросу, нужно ответить на текущий!")
    }
}
