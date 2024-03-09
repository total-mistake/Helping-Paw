"use strict"

function levelSelection() {
    menu.classList.add('hidden');
        levels_menu.classList.remove('hidden');
        document.querySelector("body").insertAdjacentHTML('afterbegin',
        `<header class="header">
            <a href="menu.html"><img class="icon_home" src="../elements/icons/home_icon.png"></a>
        </header>`)
}

Array.from(levels.children).forEach(function(level) {
    level.addEventListener('click', ()=>{
        var levelNumber = level.id.split('-')[1];
        window.location.href = `game.html?level=${levelNumber}`;
    })
})

start.addEventListener('click', ()=>{
    window.location.href = 'game.html?level=0';
})

// Добавляем обработчик события для клавиши Enter
document.body.addEventListener('keydown', function(event) {
    // Проверяем, что нажата клавиша Enter
    if (event.code == "Enter") {
        // Вызываем клик на кнопке "Начать"
        start.click();
    }
});


    