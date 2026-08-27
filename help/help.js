const block = document.querySelectorAll(".help-title");

function help() {
    block.forEach(item => {
        item.classList.remove('active');
        item.nextElementSibling.classList.remove('active');
    });

    this.classList.add('active');
    this.nextElementSibling.classList.add('active');
}

block.forEach(item => item.addEventListener('click', help));


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