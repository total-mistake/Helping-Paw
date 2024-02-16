"use strict";

const $ = document.querySelector.bind(document);

const quiz = $('.quiz');  //Эквивалентно const quiz = document.querySelector(".quiz")
const warning = $('.warning');
const btnNext = $('.quiz__next');
let count = 0;
let userScore = 0;
console.log(typeof questions);
console.log(questions.length);
//Проверка наличия вопросов в массиве
if (typeof questions !== 'undefined' && questions.length > 0) {
    quiz.classList.remove('hidden');
    showQuetions(count);
} else {
    warning.classList.remove('hidden');
}

function showQuetions(index){
    const list = $(".quiz__list");
    const title = $(".quiz__title");
    const total = $(".quiz__total");
    const progress = $(".quiz__progress-inner");

    title.innerHTML = `${questions[index].question}`;
    list.innerHTML = '';
    questions[index].options.forEach(item => {
        const text = `<li class = "quiz__option Menu">${item}</li>`;
        list.insertAdjacentHTML("beforeend", text);
    })
}