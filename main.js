import './bootstrap.css';
import './style.css';


let things = JSON.parse(localStorage.getItem('things')) || [];

let editingThing = null;


function addThing(event) {
    event.preventDefault();
    const userName = document.getElementById('user-name').value.trim();
    const name = document.getElementById('name').value.trim();
    const powerLevel = document.getElementById('power-level').value.trim();
    const description = document.getElementById('description').value.trim();
    const uniqueProperty = document
        .getElementById('unique-property')
        .value.trim();
    const imageInput = document.getElementById('image-input');
    const category = document.getElementById('category').value.trim();

    if (
        !name ||
        !description ||
        isNaN(powerLevel) ||
        !uniqueProperty ||
        !userName
    ) {
        console.log(
            'Invalid input. Please enter all properties with appropriate validation.',
        );
        return;
    }

    let thing;
    if (editingThing) {
        thing = editingThing;
    } else {
        thing = {
            id: Date.now().toString(),
            userName,
            name,
            powerLevel,
            description,
            uniqueProperty,
            image: '',
            category,
        };
        things.push(thing);
    }

    thing.userName = userName;
    thing.name = name;
    thing.powerLevel = powerLevel;
    thing.description = description;
    thing.uniqueProperty = uniqueProperty;
    thing.category = category;
    if (imageInput.files[0]) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            thing.image = reader.result;
            localStorage.setItem('things', JSON.stringify(things));
            if (editingThing) {
                location.reload();
            } else {
                renderThing(thing);
            }
        });
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        localStorage.setItem('things', JSON.stringify(things));
        if (editingThing) {
            location.reload();
        } else {
            renderThing(thing);
        }
    }

    editingThing = null;
    document.getElementById('add-form').reset();
}



function renderThing(thing) {
    const thingList = document.getElementById('thing-list');
    const card = document.createElement('div');
    card.classList.add('card');

    const image = new Image();
    image.classList.add('card-img-top');
    image.src = thing.image;

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const userName = document.createElement('h3');
    userName.classList.add('card-text');
    userName.textContent = `User Name: ${thing.userName}`;

    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = thing.name;

    const subtitle = document.createElement('h6');
    subtitle.classList.add('card-subtitle', 'mb-2', 'text-muted');
    subtitle.textContent = `Power Level: ${thing.powerLevel}`;

    const description = document.createElement('p');
    description.classList.add('card-text');
    description.textContent = thing.description;

    const uniqueProperty = document.createElement('p');
    uniqueProperty.classList.add('card-text');
    uniqueProperty.textContent = `Unique Property: ${thing.uniqueProperty}`;

    const category = document.createElement('p');
    category.classList.add('card-text');
    category.textContent = `Category: ${thing.category}`;

    const editButton = document.createElement('button');
    editButton.classList.add('btn', 'btn-primary', 'me-2');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editThing(thing));

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteThing(thing));

    cardBody.appendChild(image);
    cardBody.appendChild(userName);
    cardBody.appendChild(title);
    cardBody.appendChild(subtitle);
    cardBody.appendChild(description);
    cardBody.appendChild(uniqueProperty);
    cardBody.appendChild(category);
    cardBody.appendChild(editButton);
    cardBody.appendChild(deleteButton);

    card.appendChild(cardBody);

    if (editingThing && editingThing.id === thing.id) {
        const oldCard = document.getElementById(`card-${editingThing.id}`);
        thingList.replaceChild(card, oldCard);
    } else {
        card.setAttribute('id', `card-${thing.id}`);
        thingList.appendChild(card);
    }
}


function editThing(thing) {
    editingThing = thing;
    document.getElementById('user-name').value = thing.userName;
    document.getElementById('name').value = thing.name;
    document.getElementById('power-level').value = thing.powerLevel;
    document.getElementById('description').value = thing.description;
    document.getElementById('unique-property').value = thing.uniqueProperty;
    document.getElementById('category').value = thing.category;
    document.getElementById('image-input').value = '';

    const cardBody = document.querySelector(`#card-${thing.id} .card-body`);

    const saveButton = document.createElement('button');
    saveButton.classList.add('btn', 'btn-success', 'me-2');
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', () => {
        const userName = document.getElementById('user-name').value.trim();
        const name = document.getElementById('name').value.trim();
        const powerLevel = document.getElementById('power-level').value.trim();
        const description = document.getElementById('description').value.trim();
        const uniqueProperty = document
            .getElementById('unique-property')
            .value.trim();
        const category = document.getElementById('category').value.trim();

        if (
            !name ||
            !description ||
            isNaN(powerLevel) ||
            !uniqueProperty ||
            !userName
        ) {
            console.log(
                'Invalid input. Please enter all properties with appropriate validation.',
            );
            return;
        }

        thing.userName = userName;
        thing.name = name;
        thing.powerLevel = powerLevel;
        thing.description = description;
        thing.uniqueProperty = uniqueProperty;
        thing.category = category;

        const imageInput = document.getElementById('image-input');
        if (imageInput.files[0]) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                thing.image = reader.result;
                localStorage.setItem('things', JSON.stringify(things));
                location.reload();
            });
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            localStorage.setItem('things', JSON.stringify(things));
            location.reload();
        }
    });

    const cancelButton = document.createElement('button');
    cancelButton.classList.add('btn', 'btn-secondary');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
        editingThing = null;
        location.reload();
    });

    cardBody.appendChild(saveButton);
    cardBody.appendChild(cancelButton);
}




function deleteThing(thing) {
    const index = things.indexOf(thing);
    things.splice(index, 1);
    localStorage.setItem('things', JSON.stringify(things));

    const thingList = document.getElementById('thing-list');
    thingList.innerHTML = '';
    for (let thing of things) {
        renderThing(thing);
    }
}

document.getElementById('add-form').addEventListener('submit', addThing);

for (let thing of things) {
    renderThing(thing);
}




