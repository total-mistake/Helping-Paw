"use strict"

var $ = document.getElementById.bind(document);
let userStats = {};


//Из URL получаем данные о выбранном уровне
var searchParams = new URLSearchParams(window.location.search);
var level = searchParams.get('level');
var factLevel = level; //Фактический уровень
var timeRemaining; //Начальное значение таймера
var timerInterval;
var updateInterval;

showStyle();
loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if(user_name.value) {
        userStats.name = user_name.value;
        loginForm.classList.add('hidden');
        $('level').classList.remove('hidden');
        startGame();
    } else {
        user_name.classList.add('shaking');
        setTimeout(()=>
        user_name.classList.remove('shaking')
        , 1000);
    }
});

// Добавляем обработчик события для клавиши Enter
document.body.addEventListener('keydown', function(event) {
    // Проверяем, что нажата клавиша Enter
    if (event.code == "Enter") {
        // Вызываем клик на кнопке "Начать"
        $('continue').click();
    }
});

function startGame() {
    //Алгоритм в зависимости от выбранного уровня
    switch (factLevel) {
        //Уровень 1
        case '1':
            firstLevel();
            break;
        //Уровень 2
        case '2':
            secondLevel();
            break;
        //Уровень 3
        case '3':
            thirdLevel();
            break;
    }
}

function firstLevel() {
    anew.classList.add('hidden');
    level_num.textContent = `Уровень 1`;
    timeRemaining = 60;
    startTimer();
    let levelIndex = 0;
    let maxAnimationTime = [8, 5, 2];
    let taskTypes = shuffleArray([0, 1, 2]);

    function generateNextLevel() {
        if (levelIndex < 3) {
            timer.classList.add('hidden');
            level_field.classList.add('hidden');
            let taskType = taskTypes[levelIndex];
            let arrayOfElements = [];
            let taskSubtype; //Подтип вопроса
            let numOfCorrectItems = 0;  //Количество правильных элементов на поле
            switch (taskType) {
                case 0:
                    taskSubtype = animalTypes[random(0, animalTypes.length - 1)];
                    assignment.textContent = `Найди всех ${taskSubtype}.`;
                    break;
                case 1:
                    taskSubtype = animalTypes2[random(0, animalTypes2.length - 1)];
                    assignment.textContent = `Найди всех животных, у которых ${taskSubtype} лапы/ноги.`;
                    break;
                case 2:
                    taskSubtype = backgroundColors[random(0, backgroundColors.length - 1)].name;
                    assignment.textContent = `Найди все изображения, у которых цвет фона ${taskSubtype}.`;
                    break;
            }

            //Если нет ни одного элемента запускаем заново
            while(numOfCorrectItems == 0) {
                arrayOfElements = creatingArrayOfElementslvl1(24);
                
                // Узнаем сколько элементов на поле соответствует условию
                arrayOfElements.forEach(element => {
                    switch (taskType) {
                        case 0:
                            if (element.type == taskSubtype) {
                                numOfCorrectItems++;
                                element.correct = true;
                            } else { element.correct = false }
                            break;
                    
                        case 1:
                            if (element.legs == taskSubtype) {
                                numOfCorrectItems++;
                                element.correct = true;
                            } else { element.correct = false }
                            break;
                        case 2:
                            if (element.colorName == taskSubtype) {
                                numOfCorrectItems++;
                                element.correct = true;
                            } else { element.correct = false }
                            break;
                    }
                });
            }

            //Добавление анимации мерцания элементов
            arrayOfElements.forEach(element => {
                element.classList.add('flicker');
                element.style.animationDuration = `${randomFloat(1, maxAnimationTime[levelIndex])}s`;
            });

            //Обработка щелчков на элементы
            arrayOfElements.forEach(element => {
                element.addEventListener('click', () => {
                    if (element.correct) {
                        element.classList.remove('flicker');
                        numOfCorrectItems--;
                        element.disabled = true;
                        element.classList.add('disabled');
                        // element.style.opacity = 0.1;
                    } else { makeMistake()}
                    if (numOfCorrectItems == 0) {
                        clearField();
                        levelIndex++;
                        generateNextLevel();
                    }
                });
            });

            delayCorrection(3);
            //Задаем задержку перед выводом содержания уровня
            setTimeout(() => {
                timer.classList.remove('hidden');
                level_field.classList.remove('hidden');
                generationField(arrayOfElements);
            }, 3000);
        } else {
            stopTimer();
            let points = timeRemaining;

            if(level == 0) {
                factLevel = '2';
                assignment.textContent = "Хочешь перейти ко второму уровню?";
            } else {
                assignment.textContent = "Хочешь попробовать заново?";
            }
            endOfGame(points, 0, 0)
    }}
    generateNextLevel();
}

function secondLevel() {
    clearField();
    clearInterval(updateInterval);
    anew.classList.add('hidden');
    showStyle();
    level_num.textContent = `Уровень 2`;
    assignment.textContent = "Трижды найди и кликни на этот цветок:";
    timeRemaining = 60;
    startTimer();
    let levelIndex = 0;
    let updateTime = [2000, 1000, 800];
    let taskItems = shuffleArray([...Array(plants.length).keys()]);
    let numCorrectEl = [1, 2, 3];

    function nextLevelGeneration() {
        if(levelIndex < 3) {
            timer.classList.add('hidden');
            level_field.classList.add('hidden');
            let correctImg = plants[taskItems[levelIndex]];
            let wrongElements = plants.slice(0, taskItems[levelIndex]).concat(plants.slice(taskItems[levelIndex] + 1));;   //Массив, который не содержит верный элемент
            exampleImg.src = correctImg;
            exampleImg.classList.remove('hidden');
            let arrayOfElements = creatingArrayOfElementslvl2(wrongElements, numCorrectEl[levelIndex], correctImg);
            let numOfClicks = 0;

            arrayOfElements.forEach(element => {
                element.addEventListener('click', () => {
                    if (element.classList.contains('correct')) {
                        numOfClicks++;
                    } else { makeMistake()}
                    if (numOfClicks == 3) {
                        timer.classList.add('hidden');
                        delayCorrection(3);
                        clearInterval(updateInterval);
                        // Выделение верного элемента зеленым фоном
                        arrayOfElements.forEach(element => {
                            if (element.classList.contains('correct')) {
                                element.style.backgroundColor = 'rgba(60, 208, 110, 0.314)';
                            }
                        });
                        setTimeout(() => {
                            // Очистка поля и переход к следующему уровню
                            clearField();
                            levelIndex++;
                            nextLevelGeneration();
                        }, 3000); // Задержка в 3 секунды
                    }
                });
            });

            delayCorrection(3);
            //Задаем задержку перед выводом содержания уровня
            setTimeout(() => {
                timer.classList.remove('hidden');
                level_field.classList.remove('hidden');
                generationField(arrayOfElements);
            }, 3000);

            // Функция для обновления расположения элементов каждые, например, 3 секунды
            const updateElements = () => {
                arrayOfElements = shuffleArray(arrayOfElements);
                generationField(arrayOfElements);
            };

            // Обновляем расположение элементов каждые 3 секунды
            updateInterval = setInterval(updateElements, updateTime[levelIndex]);

        } else {
            stopTimer();
            exampleImg.classList.add('hidden');
            let points = timeRemaining;
            if(level == 0) {
                factLevel = '3';
                assignment.textContent = "Хочешь перейти к третьему уровню?";
            } else {
                assignment.textContent = "Хочешь попробовать заново?";
            }
            endOfGame(0, points, 0);
        }
    }
    nextLevelGeneration();
}


function thirdLevel() {
    showStyle();
    level_field.innerHTML = `
    <div class="hidden" id="flowers-container">
        <img id="vase" src="../elements/level-3/vase.png">
    </div>`;
    anew.classList.add('hidden');
    $('level').style.maxWidth = 'none';
    timeRemaining = 80;
    startTimer();
    level_num.textContent = `Уровень 3`;
    assignment.textContent = "Собери все цветы в вазу.";
    let levelIndex = 0;
    let numFlowers = [10, 12, 13];
    let animationMaxSpeed = [4, 3, 1];
    let animationMixSpeed = [2, 1.5, 0.8];
    let remaining_flowers;
    
    function nextLevelGeneration() {
        if(levelIndex < 3) {
            timer.classList.add('hidden');
            level_field.classList.add('hidden');
            remaining_flowers = numFlowers[levelIndex];
            let flowers_container = $('flowers-container');

            delayCorrection(3);
            setTimeout(() => {
                timer.classList.remove('hidden');
                level_field.classList.remove('hidden');
                flowers_container.classList.remove('hidden');
                // Вызываем функцию добавления ключевых кадров
                let flowers = generateFlowers(numFlowers[levelIndex], animationMixSpeed[levelIndex], animationMaxSpeed[levelIndex]);
            }, 3000);

            vase.addEventListener('drop', handleDrop);
            vase.addEventListener('dragover', (event) => {
                event.preventDefault();
            });

            function handleDrop(event) {
                event.preventDefault();
            
                // Получаем данные, переданные при начале перетаскивания (id элемента)
                const flowerId = event.dataTransfer.getData('text/plain');
            
                // Получаем элемент по его id
                const flower = $(flowerId);
                if(flower) {
                    // Уменьшаем счетчик оставшихся цветов
                    remaining_flowers--;
                    // Удаляем цветок
                    flowers_container.removeChild(flower);
                }

                // Если все цветы собраны, генерируем новый уровень
                if (remaining_flowers == 0) {
                    levelIndex++;
                    nextLevelGeneration();
                }
            }
        
        } else {
            stopTimer();
            clearField();
            let points = timeRemaining;
            assignment.textContent = "Хочешь попробовать заново?";
            factLevel = level;
            endOfGame(0, 0, points)
        }
    }
    nextLevelGeneration();
}

function generateFlowers(numFlowers, animationMinSpeed, animationMaxSpeed) {
    const flowersContainer = $('flowers-container');
    const flowers = [];

    for (let i = 0; i < numFlowers; i++) {
        // Создаем элемент цветка
        const flower = document.createElement('img');
        flower.classList.add('flower');
        flower.id = `flower-${i}`;
        flower.src = flowersIMG[random(0, flowersIMG.length - 1)]; // Функция для получения случайного пути к изображению цветка


        // Устанавливаем случайное положение цветка внутри контейнера
        const flowerSize = 110; // Размер цветка
        const containerWidth = flowersContainer.offsetWidth;
        const containerHeight = flowersContainer.offsetHeight;

        const randomX = Math.random() * (containerWidth - flowerSize);
        const randomY = Math.random() * (containerHeight - flowerSize);

        flower.style.left = `${randomX}px`;
        flower.style.top = `${randomY}px`;
        
        flower.draggable = true;
        flower.addEventListener('dragstart', startDragging);

        animateFlower(flower, animationMinSpeed, animationMaxSpeed)
        flowers.push(flower);
        flowersContainer.appendChild(flower);
    }
    flowersContainer.addEventListener('drop', dropFlower);
    flowersContainer.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    return flowers;
}

function startDragging(event) {
    event.target.style.border = "2px solid var(--text-color)";
    event.target.style.borderRadius = "45%";
    // Устанавливаем данные, которые будут переданы при начале перетаскивания
    event.dataTransfer.setData('text/plain', event.target.id);
    event.dataTransfer.setDragImage(event.target, 0, 0); // Это предотвратит создание копии элемента
}

function dropFlower(event) {
    event.preventDefault();

    // Получаем данные, переданные при начале перетаскивания
    const flowerId = event.dataTransfer.getData('text/plain');
    const flower = $(flowerId);

    // Если цветок найден, перемещаем его в место бросания
    if (flower) {
        flower.style.border = "none";

        const flowersContainer = $('flowers-container');
        const offsetX = event.clientX - flowersContainer.getBoundingClientRect().left;
        const offsetY = event.clientY - flowersContainer.getBoundingClientRect().top;

        flower.style.position = 'absolute';
        flower.style.left = `${offsetX - flower.clientWidth / 2}px`;
        flower.style.top = `${offsetY - flower.clientHeight / 2}px`;

        flowersContainer.appendChild(flower);

        const animationName = `animateFlower${flowerId.split('-')[1]}`;
        removeAnimationStyle(animationName);
        animateFlower(flower, 3);
    }
}

function animateFlower(flower, minSpeed, maxSpeed) {
    const container = $('flowers-container');
    const containerRect = container.getBoundingClientRect();
    const animationSpeed = randomFloat(minSpeed, maxSpeed);

    // Рассчитываем доступное пространство контейнера
    const availableWidth = container.clientWidth - 110; //890
    const availableHeight = container.clientHeight - 110; //390

    // // Генерируем случайные координаты в пределах доступного пространства
    const targetX = Math.random() * availableWidth;
    const targetY = Math.random() * availableHeight;

    // Получаем начальные координаты цветка относительно контейнера
    const startX = parseFloat(flower.style.left);
    const startY = parseFloat(flower.style.top);

    // Рассчитываем смещение
    const deltaX = targetX - startX;
    const deltaY = targetY - startY;

    // // Создаем уникальное имя анимации для каждого цветка
    const animationName = `animateFlower${flower.id.split('-')[1]}`;
    
    defineAnimation(animationName, deltaX, deltaY);
    // Применяем анимацию к текущему цветку
    flower.style.animation = `${animationName} ${animationSpeed}s linear infinite alternate`;
}

// Функция для добавления @keyframes стилей в <style>
function defineAnimation(animationName, deltaX, deltaY) {
    const style = document.createElement('style');
    style.id = animationName; // Присваиваем уникальный id стилю
    style.innerHTML = `
      @keyframes ${animationName} {
        0% {
          transform: translate(0, 0);
        }
        100% {
          transform: translate(${deltaX}px, ${deltaY}px);
        }
      }`;
    document.head.appendChild(style);
}

// Функция для удаления @keyframes стилей из <style>
function removeAnimationStyle(animationName) {
    const style = $(animationName);

    if (style) {
        style.parentNode.removeChild(style);
    }
}

function endOfGame(pointslvl1, pointslvl2, pointslvl3) {
    level_num.textContent = `Поздравляю! Количество набранных очков: ${pointslvl1 + pointslvl2 + pointslvl3}`;
    timer.classList.add('hidden');
    level_field.classList.add('hidden');
    anew.classList.remove('hidden');
    $('animation_styles').innerHTML = '';
    userStats.points = [pointslvl1, pointslvl2, pointslvl3];
    addPlayerStats(userStats);
}

$('no').addEventListener('click', ()=>{
    window.location.href = 'menu.html';
});

//Оформление страницы
function showStyle() {
    if(factLevel == 0) { factLevel = '1'; }
    document.body.style.backgroundImage = `url('../backgroundImages/level${factLevel}.jpg')`;
    document.querySelector('.icon_home').src = `../elements/icons/home_icon_l${factLevel}.png`;
}

//Создание массива элменетов для уровня 1
function creatingArrayOfElementslvl1(numOfElement) {
    //Массив элементов
    let arrayOfElements = [];
    for (let i = 0; i < numOfElement; i++) {
        //Создание нового элемента
        const newElement = document.createElement('div');
        newElement.classList.add('element');
        let elementColor = backgroundColors[random(0, backgroundColors.length - 1)];
        newElement.style.backgroundColor = elementColor.color;
        const newImg = document.createElement('img');
        let pic = animals[random(0, animals.length - 1)];
        newImg.src = pic.path;
        newImg.classList.add('element');
        newElement.appendChild(newImg);
        //Добавим property для дальнейшего сравнения
        newElement.colorName = elementColor.name;
        newElement.type = pic.type;
        newElement.legs = pic.legs;

        arrayOfElements.push(newElement);
    }

    return arrayOfElements;
}

function creatingArrayOfElementslvl2(wrongElements, numOfCorrectElement, correctElement) {
    let arrayOfElements = [];
    for (let i = 0; i < 18 - numOfCorrectElement; i++) {
        //Создание нового элемента
        const newElement = document.createElement('div');
        newElement.classList.add('element');
        newElement.style.backgroundColor = '#F5E0CF';
        const newImg = document.createElement('img');
        let pathImg = wrongElements[random(0, wrongElements.length - 1)];
        newImg.src = pathImg;
        newImg.classList.add('element');
        newElement.appendChild(newImg);
        newElement.path = pathImg;

        arrayOfElements.push(newElement);
    }
    for(let i = 0; i < numOfCorrectElement; i++) {
        const newElement = document.createElement('div');
        newElement.classList.add('element');
        newElement.classList.add('correct');
        newElement.style.backgroundColor = '#F5E0CF';
        const newImg = document.createElement('img');
        let pathImg = correctElement;
        newImg.src = pathImg;
        newImg.classList.add('element');
        newElement.appendChild(newImg);
        newElement.path = pathImg;

        arrayOfElements.push(newElement);
    }

    return shuffleArray(arrayOfElements);
}

//Вывод элементов из массива на поле
function generationField(array) {
    clearField();
    array.forEach(element => {
        level_field.appendChild(element);
    });
}

//Очистка поля
function clearField() {
    while ($('level_field').firstChild) {
        $('level_field').removeChild($('level_field').firstChild);
    }
}

//Добавление статистики игрока
function addPlayerStats(userStats) {
    // Получение текущего массива данных из localStorage
    const storedAllUsersStats = localStorage.getItem('UsersStats');
    let allUsersStats = JSON.parse(storedAllUsersStats) || [];

    // Поиск игрока по имени в массиве
    const existingPlayerIndex = allUsersStats.findIndex(user => user.name === userStats.name);
    // Если игрок существует, обновляем его данные, иначе добавляем нового игрока
    if (existingPlayerIndex !== -1) {
        const existingPlayer = allUsersStats[existingPlayerIndex];
        // Обновление существующего игрока
        for (let i = 0; i < userStats.points.length; i++) {
            if (userStats.points[i] > existingPlayer.points[i]) {
                existingPlayer.points[i] = userStats.points[i];
            }
        }
    } else {
        // Добавление нового игрока
        allUsersStats.push(userStats);
    }
    
    // Сохранение обновленного массива в localStorage
    localStorage.setItem('UsersStats', JSON.stringify(arraySorting(allUsersStats)));
}

//ФУНКЦИИ ТАЙМЕРА
// Функция для обновления отображения таймера
function updateTimer() {
    timer.textContent = timeRemaining;
    if (timeRemaining <= 10) {
        timer.classList.add('flash');
        setTimeout(() => {
        timer.classList.remove('flash');
        }, 500);
    }
}

// Функция для старта таймера
function startTimer() {
    // Обновляем отображение таймера при старте
    updateTimer();
    
    // Запускаем интервал, уменьшающий оставшееся время каждую секунду
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimer();

        if (timeRemaining <= 0) {
          stopTimer(); // Останавливаем таймер при завершении времени
          gameOver();
        }
        }, 1000);
}

// Функция, вызываемая при ошибке
function makeMistake() {
    timeRemaining = Math.max(0, timeRemaining - 1);
    updateTimer();
    timer.classList.add('flash');
    setTimeout(() => {
    timer.classList.remove('flash');
    }, 500);
}

//Корректирует задержку при показе текста задания, чтобы это время не учитывалось
function delayCorrection(sec) {
    timeRemaining = timeRemaining + sec;
    updateTimer();
}

function stopTimer() {
    clearInterval(timerInterval); // Останавливаем таймер
}

// Функция, вызываемая при завершении времени
function gameOver() {
    timer.classList.add('hidden');
    if(factLevel == 2) {
        clearInterval(updateInterval);
        level_field.querySelectorAll('*').forEach(element => {
            if (element.classList.contains('correct')) {
                element.style.backgroundColor = 'rgba(60, 208, 110, 0.314)';
            }
        });
        setTimeout(() => {
            level_num.textContent = "Ты проиграл"
            assignment.textContent = "Хочешь попробовать заново?";
            stopTimer();
            clearField();
            $('animation_styles').innerHTML = '';
            exampleImg.classList.add('hidden');
            level_field.classList.add('hidden');
            anew.classList.remove('hidden');
        }, 3000)
    } else {
    level_num.textContent = "Ты проиграл"
    assignment.textContent = "Хочешь попробовать заново?";
    stopTimer();
    clearField();
    $('animation_styles').innerHTML = '';
    exampleImg.classList.add('hidden');
    level_field.classList.add('hidden');
    anew.classList.remove('hidden');
    }
}

//Функция сортировки массива по убыванию суммы очков
function arraySorting(array) {
    const sortedStats = [...array];

    // Сортировка по убыванию суммы очков
    sortedStats.sort((a, b) => {
        const sumA = a.points.reduce((acc, value) => acc + value, 0);
        const sumB = b.points.reduce((acc, value) => acc + value, 0);

        return sumB - sumA;
    });

    return sortedStats;
}

//Рандомное число от min до max
function random(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

function randomFloat(min, max) {
    let randomNumber = Math.random() * (max - min) + min;

    // Округляем до 1 знака после запятой
    let roundedNumber = Math.round(randomNumber * 10) / 10;

    return roundedNumber;
}

//Перемешивание массива
function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}