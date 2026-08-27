const teachers = await(await fetch('/data/directions.json')).json();

const head = document.querySelector('.head');
const directions = document.createElement('div');
directions.className = 'directions';
head.after(directions);


const infoContainer = document.createElement('div');
infoContainer.className = 'info-container';
directions.after(infoContainer);




let activeCardIndex = -1;

function createTeacherCard(item, index) {
    const card = document.createElement('div');
    card.className = 'teacher-card';
    card.style.cursor = 'pointer';

    if (index === activeCardIndex) {
        card.classList.add('active');
    }

    const teacher = document.createElement('div');
    teacher.className = 'teacher';

    const img = document.createElement('div');
    img.className = 'img';
    if (item['Фото1']) {
        const img1 = document.createElement('img');
        img1.src = item['Фото1'];
        img.appendChild(img1);
    }
    if (item['Фото2']) {
        const img2 = document.createElement('img');
        img2.src = item['Фото2'];
        img.appendChild(img2);
    }
    teacher.appendChild(img);

    const text = document.createElement('div');
    text.className = 'p';

    if (item['Направление']) {
        const direction = document.createElement('p');
        direction.textContent = item['Направление'];
        text.appendChild(direction);
    }
    if (item['Имя1']) {
        const name1 = document.createElement('p');
        name1.textContent = item['Имя1'];
        text.appendChild(name1);
    }
    teacher.appendChild(text);
    card.appendChild(teacher);

    // Обработчик клика
    card.addEventListener('click', () => {
        // 1. Снимаем active со всех карточек
        const allCards = directions.querySelectorAll('.teacher-card');
        allCards.forEach(c => c.classList.remove('active'));

        // 2. Ставим active текущей
        card.classList.add('active');

        // 3. Обновляем индекс активной
        activeCardIndex = index;

        // 4. Рендерим инфо для этого педагога
        renderInfoFor(index);

        // 5. Плавная прокрутка к блоку с инфо (где стоит «Фото 3»)
        infoContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    return card;
}

// Рендер карточек-превью
teachers.forEach((item, index) => {
    const card = createTeacherCard(item, index);
    directions.appendChild(card);
});

function info(item) {
    const container = document.createElement('div');
    container.className = 'info';

    // 1. Верхняя картинка (Фото3)
    const topImg = document.createElement('img');
    topImg.src = item['Фото3'];
    container.appendChild(topImg);

    // 2. Блок с именем, ролью и ссылкой на ВК
    const headerDiv = document.createElement('div');

    const nameLink = document.createElement('a');
    nameLink.href = item['Ссылка1'];
    nameLink.target = '_blank';
    const nameP = document.createElement('p');
    nameP.className = 'info-name';
    nameP.textContent = item['Имя2'];
    nameLink.appendChild(nameP);
    headerDiv.appendChild(nameLink);

    const roleP = document.createElement('p');
    roleP.className = 'info-role';
    roleP.textContent = 'руководитель направления';
    headerDiv.appendChild(roleP);

    const vkLink = document.createElement('a');
    vkLink.href = item['Ссылка1'];
    vkLink.target = '_blank';
    const vkText = document.createElement('p');
    vkText.className = 'info-link';
    vkText.textContent = 'личная страница в ВКонтакте';
    vkLink.appendChild(vkText);
    headerDiv.appendChild(vkLink);

    container.appendChild(headerDiv);

    // 3. Текстовые блоки (Текст1, Текст2, Текст3)
    ['Текст1', 'Текст2', 'Текст3'].forEach(key => {
        if (item[key] && item[key].trim()) {
            const p = document.createElement('p');
            p.className = 'info-text';
            p.textContent = item[key];
            container.appendChild(p);
        }
    });

    // 4. Видео (poster из JSON, src из поля "Видео")
    if (item['Постер'] && item['Видео']) {
        const video = document.createElement('video');
        video.controls = true;
        video.poster = item['Постер'];

        const source = document.createElement('source');
        source.src = item['Видео'];
        video.appendChild(source);

        container.appendChild(video);
    }

    // 5. Призыв к действию
    const callToAction = document.createElement('p');
    callToAction.className = 'info-text';
    callToAction.innerHTML = 'Пиши мне в личные сообщения слово <b>«ТАНЦЫ»</b> и я расскажу тебе, как прийти ко мне на бесплатное занятие: <a href="' + (item['Ссылка1'] || '#') + '" target="_blank" rel="noopener noreferrer"><b>написать сейчас</b></a>';
    container.appendChild(callToAction);

    // 6. Ссылка «Так же ты можешь посмотреть все танцевальные видео…»
    const moreVideos = document.createElement('p');
    moreVideos.className = 'info-text';
    moreVideos.innerHTML = 'Также ты можешь посмотреть все танцевальные видео с педагогом: <a href="' + (item['Ссылка2'] || '#') + '" target="_blank" rel="noopener noreferrer"><b>глянуть статью</b></a>';
    container.appendChild(moreVideos);

    // 7. Статичный слайдер
    const slider = document.createElement('div');
    slider.className = 'slider';

    const staticSlides = [
        '/assets/images/directions/slider/1.webp',
        '/assets/images/directions/slider/2.webp',
        '/assets/images/directions/slider/3.webp',
        '/assets/images/directions/slider/4.webp',
        '/assets/images/directions/slider/5.webp'
    ];

    staticSlides.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        slider.appendChild(img);
    });

    container.appendChild(slider);

    // 8. Финальные абзацы
    const finalText1 = document.createElement('p');
    finalText1.className = 'info-text';
    finalText1.textContent = 'После завершения IV этапа вас ждёт финальный экзамен и диплом профессионального исполнителя танца. Окончив V этап, вы сможете преподавать в нашей школе.';
    container.appendChild(finalText1);

    const finalText2 = document.createElement('p');
    finalText2.className = 'info-text';
    finalText2.innerHTML = 'Также собрали информацию по <a href="/help/" target="_blank" rel="noopener noreferrer"><b>часто задаваемым вопросам</b></a>.';
    container.appendChild(finalText2);

    return container;
}

function renderInfoFor(index) {
    if (!teachers[index]) return;

    const newInfoBlock = info(teachers[index]);
    infoContainer.innerHTML = '';
    infoContainer.appendChild(newInfoBlock);
}

// Показываем первого педагога по умолчанию
if (teachers.length > 0) {
    activeCardIndex = 0;
    renderInfoFor(0);
    const firstCard = directions.querySelector('.teacher-card');
    if (firstCard) firstCard.classList.add('active');
}












// переключение актив на мобильной шапке
document.querySelectorAll('.mobile-brand .mobile-navigate a').forEach(link => {
    const img = link.querySelector('img');
    const activeSrc = img.dataset.active;
    const defaultSrc = img.getAttribute('src');

    if (link.classList.contains('active') && activeSrc) {
      img.setAttribute('src', activeSrc);
    } else {
      img.setAttribute('src', defaultSrc);
    }
});