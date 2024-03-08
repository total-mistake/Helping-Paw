"use strict";
//Используется сокращенная форма для получения элемента по селектору
const $ = document.querySelector.bind(document);    

const sidebar = $(".sidebar");
const content = $(".content");
const button = $(".button");
const textInput = $(".textinput");
const output = $(".output");

//Переменная для хранения перетаскиваемого объекта
var draggableObj;   

//Разрешение перетаскивать объект в область контента
content.addEventListener('dragover', function(event){
    event.preventDefault();
})

//Обработчик события drop при перетаскивании элементов в область content
content.addEventListener('drop', function (event){
    //Переменные для определения ближайших блоков при сбросе элемента
    var nearestLeftBlock = null;
    var nearestRightBlock = null;
    var minDistanceToLeftBlock = Infinity;
    var minDistanceToRightBlock = Infinity;

    //Цикл по дочерним элементам content для определения ближайших блоков
    for(let i = 0; i < content.children.length; i++){
        var block = content.children[i];
        var rect = block.getBoundingClientRect();
        var distanceToLeftBlock = Math.abs(event.clientX - rect.right);
        var distanceToRightBlock = Math.abs(event.clientX - rect.left);

        //Определение ближайшего блока слева
        if (distanceToLeftBlock >= 0 && distanceToLeftBlock < minDistanceToLeftBlock) {
            minDistanceToLeftBlock = distanceToLeftBlock;
            nearestLeftBlock = block;
        }
        //Определение ближайшего блока справа
        if (distanceToRightBlock >= 0 && distanceToRightBlock < minDistanceToRightBlock) {
            minDistanceToRightBlock = distanceToRightBlock;
            nearestRightBlock = block;
        }
    }

    //Логика вставки сбрасываемого элемента в content в зависимости от ближайших блоков
    if(minDistanceToRightBlock < minDistanceToLeftBlock && nearestLeftBlock === nearestRightBlock){
        event.target.insertBefore(draggableObj, event.target.firstChild);
    } else if (minDistanceToRightBlock > minDistanceToLeftBlock && nearestLeftBlock === nearestRightBlock){
        event.target.append(draggableObj);
    } else if (nearestRightBlock == null){
        event.target.append(draggableObj);
    } else {
        event.target.insertBefore(draggableObj, nearestRightBlock);
    }
    //Обновление содержимого output
    fillOutput();
})

//Обработчик для нажатия на кнопку "Разобрать"
button.addEventListener("click", () => {
    if(textInput.value.trim() !== ""){
        onParseText()
    } else {
        alert("Строка ввода не должна быть пустой!");
    }
})

//Функция для создания блока с частью строки и добавления его в в левый блок
function createBlock(str) {
    let block = document.createElement("div");
    block.setAttribute("class", "block");
    block.innerHTML = str;
    block.draggable = true;
    //Обработчик события dragstart для сохранения перетаскиваемого объекта
    block.addEventListener('dragstart', function (event){
        draggableObj = event.target;
    })

    //Добавление созданного блока в левое меню
    sidebar.appendChild(block);
}

//Функция для разбора введенной строки и сортировки ее частей
function onParseText() {
    let wordsAndNumbers = textInput.value.split("-");
    var words = wordsAndNumbers.filter(item => isNaN(item)).sort();
    var numbers = wordsAndNumbers.filter(item => !isNaN(item)).sort((a, b) => a - b);
    
    //Все элементы строки формируются в блоки и доабвляются в левое меню
    words.forEach((word, index) => {
        createBlock("a" + (index + 1) + " " + word);
    });
    numbers.forEach((number, index) => {
        createBlock("n" + (index + 1) + " " + number);
    });
}

//Функция для обновления содержимого output на основе содержимого content
function fillOutput() {
    output.innerHTML = fillOutputText();
}

//Функция для формирования выходного текста на основе содержимого из сформированных блоков в верхнем блоке
function fillOutputText() {
    let answer = "";
    for (let i = 0; i < content.children.length; i++) {
        content.children[i].innerHTML.split(" ").slice(1).forEach((s) => {
            answer += s + " ";
        })
    }
    return answer
}