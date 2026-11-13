export function Modal(title, subtitle, yes, no) {
    const body = document.body;

    const modal = document.createElement("div");
    modal.id = "modal";

    const modalCard = document.createElement("div");
    modalCard.id = "modal-card";

    const modalTitles = document.createElement("div");
    modalTitles.id = "modal-titles";

    const modalTitle = document.createElement("div");
    modalTitle.id = "modal-title";

    const modalSubtitle = document.createElement("div");
    modalSubtitle.id = "modal-subtitle";

    const modalButton = document.createElement("div");
    modalButton.id = "modal-button";

    const modalYes = document.createElement("button");
    modalYes.id = "modal-yes";

    const modalNo = document.createElement("button");
    modalNo.id = "modal-no";

    document.body.append(modal);

    modal.append(modalCard);
    modalCard.append(modalTitles, modalButton);
    modalTitles.append(modalTitle, modalSubtitle);
    modalButton.append(modalYes, modalNo);

    return new Promise((resolve) => {

        modalTitle.innerHTML = title;
        modalSubtitle.innerHTML = subtitle;
        modalYes.textContent = yes;

        if (no) {
            modalNo.textContent = no;
        } else {
            modalNo.style.display = "none";
        }

        modal.style.display = "flex";

        function close(result) {
            body.style.overflow = "";
            modal.style.display = "none";

            modal.onclick = null;
            modalYes.onclick = null;
            modalNo.onclick = null;

            modal.remove();

            resolve(result);
        }

        modalYes.onclick = () => close(true);
        modalNo.onclick = () => close(false);

        modal.onclick = (e) => {
            if (e.target === modal) close(false);
        };
    });
}

export function ModalChamp(data = {}) {
    const body = document.body;

    const modal = document.createElement("div");
    modal.id = "modal";

    const modalCard = document.createElement("div");
    modalCard.id = "modal-card";

    const modalTitle = document.createElement("div");
    modalTitle.id = "modal-title";
    modalTitle.textContent = data.id ? "Редактировать чемпионат" : "Новый чемпионат";

    const form = document.createElement("form");
    form.id = "modal-form";

    const fields = [
        { cls: "name", type: "text",  placeholder: "Название" },
        { cls: "city", type: "text",  placeholder: "Город" },
        { cls: "date", type: "date",  placeholder: "" },
        { cls: "link", type: "text",  placeholder: "Ссылка" }
    ];

    const inputs = {};

    fields.forEach(({ cls, type, placeholder }) => {
        const input = document.createElement("input");
        input.type = type;
        input.className = cls;
        input.placeholder = placeholder;
        input.required = cls === "name";
        if (data[cls]) input.value = data[cls];
        form.append(input);
        inputs[cls] = input;
    });

    const modalButton = document.createElement("div");
    modalButton.id = "modal-button";

const modalYes = document.createElement("button");
modalYes.id = "modal-yes";
modalYes.type = "submit";
modalYes.setAttribute("form", "modal-form");
modalYes.textContent = "Сохранить";


    const modalNo = document.createElement("button");
    modalNo.id = "modal-no";
    modalNo.type = "button";
    modalNo.textContent = "Отмена";

    document.body.append(modal);
    modal.append(modalCard);
    modalCard.append(modalTitle, form, modalButton);
    modalButton.append(modalYes, modalNo);

    return new Promise((resolve) => {

        function close(result) {
            body.style.overflow = "";
            modal.remove();
            resolve(result);
        }

                modal.addEventListener("submit", (e) => {
            e.preventDefault();

            close({
                name: inputs.name.value.trim(),
                city: inputs.city.value.trim(),
                date: inputs.date.value,
                link: inputs.link.value.trim()
            });
        });

        modalNo.onclick = () => close(null);

        modal.onclick = (e) => {
            if (e.target === modal) close(null);
        };

        body.style.overflow = "hidden";
        modal.style.display = "flex";
        inputs.name.focus();
    });
}