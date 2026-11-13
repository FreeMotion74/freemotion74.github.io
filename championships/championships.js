import { Modal, ModalChamp } from "/components/modal.js";

// Подключение к базе
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
    getDatabase,
    ref,
    child,
    get,
    set,
    push,
    remove,
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCXrIEv80haBNlKRAYZRopwLEyavZwUpo0",
    authDomain: "free-motion---championships.firebaseapp.com",
    databaseURL: "https://free-motion---championships-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "free-motion---championships",
    storageBucket: "free-motion---championships.firebasestorage.app",
    messagingSenderId: "896863561430",
    appId: "1:896863561430:web:572ad6c7909b8ba2724b77"
};

const db = getDatabase(initializeApp(firebaseConfig));

// Создание и отрисовка строки
function fillRow(row, data) {
    row.dataset.id = data.id || "";
    row.dataset.date = data.date || "";
    row.querySelector(".name").textContent = data.name;
    row.querySelector(".city").textContent = data.city;
    row.querySelector(".date").textContent = formatDate(data.date);
    applyDateClass(row.querySelector(".date"), data.date);

    const linkCell = row.querySelector(".link");
    linkCell.replaceChildren();

    if (data.link) {
        const link = document.createElement("a");
        link.href = data.link;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = data.link;
        linkCell.append(link);
    } else {
        linkCell.textContent = "";
    }
}

function formatDate(dateString) {
    if (!dateString) return "";

    const [year, month, day] = dateString.split("-");

    const monthsRu = [
        "января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];

    const monthName = monthsRu[Number(month) - 1];
    return `${day} ${monthName} ${year}`;
}

function applyDateClass(cell, dateString) {
    cell.classList.remove("date-today", "date-before", "date-later");
    if (!dateString) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const champDate = new Date(dateString + "T00:00:00");

    if (champDate < today) {
        cell.classList.add("date-later");
    } else {
        const diffDays = Math.round((champDate - today) / (24 * 60 * 60 * 1000));
        cell.classList.add(diffDays <= 30 ? "date-today" : "date-before");
    }
}

function createItem(data) {
    const addChamp = document.querySelector(".add-champ");

    const tableItem = document.createElement("div");
    tableItem.className = "table-item";

    tableItem.innerHTML = `
        <div class="name"></div>
        <div class="city"></div>
        <div class="date"></div>
        <div class="link"></div>
        <div>
            <button class="button edit-champ">
                <img src="/assets/icons/abonements/edit.png">
            </button>
            <button class="button del-champ">
                <img src="/assets/icons/abonements/del.png">
            </button>
        </div>
    `;

    fillRow(tableItem, data);
    addChamp.before(tableItem);

    return tableItem;
}

// Загрузка при старте
async function loadChampionships() {
    const snapshot = await get(ref(db));

    if (snapshot.exists()) {
        snapshot.forEach((item) => {
            createItem({ id: item.key, ...item.val() });
        });
    }

    // Загрузчик
    const loader = document.getElementById("loader");
    setTimeout(() => {
        loader.style.display = "none";
    }, 2000);
}

loadChampionships();

// Единый обработчик: добавить / отредактировать / удалить
document.addEventListener("click", async (e) => {
    if (e.target.closest("#modal")) return;

    // --- Добавление ---
    if (e.target.closest(".add-champ")) {
        const data = await ModalChamp();
        if (!data) return;

        const newRef = push(ref(db));
        await set(newRef, data);

        createItem({ ...data, id: newRef.key });
        saveTime();
        return;
    }

    // --- Редактирование ---
    const editBtn = e.target.closest(".edit-champ");
    if (editBtn) {
        const row = editBtn.closest(".table-item");
        if (!row) return;

        const data = {
            id: row.dataset.id,
            name: row.querySelector(".name").textContent.trim(),
            city: row.querySelector(".city").textContent.trim(),
            date: row.dataset.date,
            link: row.querySelector(".link").textContent.trim()
        };

        const result = await ModalChamp(data);
        if (!result) return;

        await set(child(ref(db), row.dataset.id), result);
        fillRow(row, { ...result, id: row.dataset.id });
        saveTime();
        return;
    }

    // --- Удаление ---
    const delBtn = e.target.closest(".del-champ");
    if (delBtn) {
        const row = delBtn.closest(".table-item");
        if (!row) return;

        const name = row.querySelector(".name").textContent.trim() || "без названия";

        if (await Modal(
            "Удалить чемпионат?",
            `Вы действительно хотите удалить "<b>${name}</b>"?`,
            "Да",
            "Нет"
        )) {
            await remove(child(ref(db), row.dataset.id));
            row.remove();
            saveTime();
        }
    }
});

// Показ таймера сколько прошло с сохранения
function saveTime() {
    const timeEl = document.querySelector(".time");

    if (!timeEl.timer) {
        timeEl.timer = setInterval(() => {
            const diff = Math.floor((Date.now() - timeEl.lastSave) / 1000);

            if (diff < 60) {
                timeEl.textContent = `Сохранено ${diff} сек назад`;
            } else if (diff < 3600) {
                timeEl.textContent = `Сохранено ${Math.floor(diff / 60)} мин назад`;
            } else {
                timeEl.textContent = `Сохранено ${Math.floor(diff / 3600)} ч назад`;
            }
        }, 1000);
    }

    timeEl.lastSave = Date.now();
}

// Нажатие на дату
document.addEventListener("click", e => {
    const input = e.target.closest('input[type="date"]');
    if (!input) return;
    if (window.matchMedia("(hover: none)").matches) return;
    input.showPicker?.();
});