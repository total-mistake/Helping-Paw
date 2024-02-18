"use strict";

const $ = document.querySelector.bind(document);

const sidebar = $(".sidebar");
const content = $(".content");
const button = $(".button");
const textInput = $(".textinput");
const output = $(".output");

var draggableObj;

content.addEventListener('dragover', function(event){
    event.preventDefault();
})

content.addEventListener('drop', function (event){
    var nearestLeftBlock = null;
    var nearestRightBlock = null;
    var minDistanceToLeftBlock = Infinity;
    var minDistanceToRightBlock = Infinity;
    for(let i = 0; i < content.children.length; i++){
        var block = content.children[i];
        var rect = block.getBoundingClientRect();
        var distanceToLeftBlock = Math.abs(event.clientX - rect.right);
        var distanceToRightBlock = Math.abs(event.clientX - rect.left);
        if (distanceToLeftBlock >= 0 && distanceToLeftBlock < minDistanceToLeftBlock) {
            minDistanceToLeftBlock = distanceToLeftBlock;
            nearestLeftBlock = block;
        }
        if (distanceToRightBlock >= 0 && distanceToRightBlock < minDistanceToRightBlock) {
            minDistanceToRightBlock = distanceToRightBlock;
            nearestRightBlock = block;
        }
    }

    if(minDistanceToRightBlock < minDistanceToLeftBlock && nearestLeftBlock === nearestRightBlock){
        event.target.insertBefore(draggableObj, event.target.firstChild);
    } else if (minDistanceToRightBlock > minDistanceToLeftBlock && nearestLeftBlock === nearestRightBlock){
        event.target.append(draggableObj);
    } else if (nearestRightBlock == null){
        event.target.append(draggableObj);
    } else {
        event.target.insertBefore(draggableObj, nearestRightBlock);
    }
    fillOutput();
})

button.addEventListener("click", () => {onParseText()})

function createElement(str) {
    let block = document.createElement("div");
    block.setAttribute("class", "block");
    block.innerHTML = str;
    block.draggable = true;
    block.addEventListener('dragstart', function (event){
        draggableObj = event.target;
    })
    sidebar.appendChild(block);
}

function onParseText() {
    let wordsAndNumbers = textInput.value.split(" - ");
    var words = wordsAndNumbers.filter(item => isNaN(item)).sort();
    var numbers = wordsAndNumbers.filter(item => !isNaN(item)).sort((a, b) => a - b);
    words.forEach((word, index) => {
        createElement("a" + (index + 1) + " " + word);
    });
    numbers.forEach((number, index) => {
        createElement("n" + (index + 1) + " " + number);
    });
}

function fillOutput() {
    output.innerHTML = fillOutputText();
}

function fillOutputText() {
    let answer = "";
    for (let i = 0; i < content.children.length; i++) {
        content.children[i].innerHTML.split(" ").slice(1).forEach((s) => {
            answer += s + " ";
        })
    }
    return answer
}