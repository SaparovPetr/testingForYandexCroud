// темплейт формы с кнопкой
const paymentTeplate = document.querySelector("#payment-template").content;
const paymentButton = paymentTeplate.querySelector(".payment").cloneNode(true);

// для тача
let clone = null;
let itemForClone = null;

// присваивавание идентификаторов элементам списков (оберткам)
document
    .querySelectorAll(".shelves__item-wrapper")
    .forEach((item) => (item.id = item.firstElementChild.id + "-wrapper"));

// выбор элементов
const items = {
    vine: document.querySelector("#vine"),
    milk: document.querySelector("#milk"),
    jem: document.querySelector("#jem"),
    cheese: document.querySelector("#cheese"),
    meet: document.querySelector("#meet"),
    chiken: document.querySelector("#chiken"),
    package: document.querySelector("#pack"),
    pineapple: document.querySelector("#pineapple"),
    banana: document.querySelector("#banana"),
    apple: document.querySelector("#apple"),
    lattice: document.querySelector("#lattice"),
};

// тележка
const cart = document.querySelector(".cart");

// ф. проверки количества товаров в тележке
const checkQuantityItemsInCart = () => {
    // если три и более - показать кнопку
    if (cart.children.length >= 3) {
        cart.after(paymentButton);
    } else {
        paymentButton.remove();
    }
};

// ф. получения элемента по нажатию на сенсор
const getElementFromTouch = (x, y) => {
    clone.style.display = "none";
    const element = document.elementFromPoint(x, y);
    clone.style.display = "block";
    return element;
};

// ф. создания клона для перемещения на сенсорном
const makeClone = (element) => {
    const clone = element.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.zIndex = "10";
    clone.style.opacity = "0.5";
    document.body.appendChild(clone);
    return clone;
};

// ф. добавления при сбросе
const addToNewPlace = (targetEllement, movingElement) => {
    if (targetEllement === cart && movingElement) {
        cart.append(movingElement);
    }
};

/////////////////////////////   Хендлеры мыши   /////////////////////////////

// Обработчик зажатия мыши
const handleDragStart = (event) => {
    event.dataTransfer.setData("id", event.target.id);
};

// обработчик наведения мыши над областью дропа
const handleDragOver = (event) => {
    event.preventDefault();
};

// обработчик сброса мышью
const handleDrop = (event) => {
    event.preventDefault();
    const imgID = event.dataTransfer.getData("id");
    const itemForClone = document.getElementById(imgID);

    // перемещение элемента
    addToNewPlace(event.target, itemForClone);

    // Проверка количества в корзине
    checkQuantityItemsInCart();
};

/////////////////////////////   Хендлеры сенсора   /////////////////////////

// Обработчик прикосновения к сенсору
const handleTouchStart = (event) => {
    const touch = event.touches[0];
    itemForClone = event.target;

    // создание экземпляра клона для перетаскивания
    clone = makeClone(itemForClone);

    // координаты прикосновения
    startX = touch.clientX;
    startY = touch.clientY;

    const rect = itemForClone.getBoundingClientRect();
    initialX = rect.left;
    initialY = rect.top;

    // позицирование клона с его изначальной точки на экране
    clone.style.left = initialX + "px";
    clone.style.top = initialY + "px";
};

// Обработчик перемещения по сенсору
const handleTouchMove = (event) => {
    // если зажат не клон, то выйти
    if (!clone) return;

    event.preventDefault();
    const touch = event.touches[0];

    // рендеринг положения клона при перемещени
    clone.style.left = initialX + (touch.clientX - startX) + "px";
    clone.style.top = initialY + (touch.clientY - startY) + "px";
};

// Обработчик отпускания сенсора
const handleTouchEnd = (event) => {
    // елси нечего перемещать или не создан клон, выйти
    if (!itemForClone || !clone) return;

    const touch = event.changedTouches[0];
    const dropTarget = getElementFromTouch(touch.clientX, touch.clientY);

    // удаление клона
    clone.remove();
    clone = null;

    // Перемещение оригинала
    addToNewPlace(dropTarget, itemForClone);

    // Проверка количества в корзине
    checkQuantityItemsInCart();
};

/////////////////////////////   навешивание обработчиков   /////////////////

// элементам прилавка
Object.values(items).forEach((item) => {
    // на тач-события
    item.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    // на десктоп-события - атрибут и обработчик
    item.draggable = true;
    item.addEventListener("dragstart", handleDragStart);
});

// корзине
cart.addEventListener("dragover", handleDragOver);
cart.addEventListener("drop", handleDrop);
