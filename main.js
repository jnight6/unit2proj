import './bootstrap.css';
import './style.css';


let things = JSON.parse(localStorage.getItem('things')) || [];

function addThing(event) {
    event.preventDefault();
    const userName = document.getElementById('user-name').value.trim();
    const name = document.getElementById('name').value.trim();
    const powerLevel = document.getElementById('power-level').value.trim();
    const description = document.getElementById('description').value.trim();
    const uniqueProperty = document.getElementById('unique-property').value.trim();
    const imageInput = document.getElementById('image-input');
    const category = document.getElementById('category').value.trim();

    if (!name || !description || isNaN(powerLevel) || !uniqueProperty || !userName) {
        console.log('Invalid input. Please enter all properties with appropriate validation.');
        return;
    }

    let thing = things.find(thing => thing.uniqueProperty === uniqueProperty);
    if (thing) {

        thing.userName = userName;
        thing.name = name;
        thing.powerLevel = powerLevel;
        thing.description = description;
        thing.category = category;
        if (imageInput.files[0]) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                thing.image = reader.result;
                localStorage.setItem('things', JSON.stringify(things));
                renderThing(thing);
            });
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            localStorage.setItem('things', JSON.stringify(things));
            renderThing(thing);
        }
    } else {

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const image = reader.result;
            thing = {
                id: Date.now().toString(),
                userName,
                name,
                powerLevel,
                description,
                uniqueProperty,
                image,
                category
            };
            things.push(thing);
            localStorage.setItem('things', JSON.stringify(things));
            renderThing(thing);
        });
        reader.readAsDataURL(imageInput.files[0]);
    }

    document.getElementById('add-form').reset();
}

function renderThing(thing) {
    const row = document.getElementById(thing.id);
    if (row) {
        row.cells[0].textContent = thing.userName;
        row.cells[1].textContent = thing.name;
        row.cells[2].textContent = thing.powerLevel;
        row.cells[3].textContent = thing.description;
        row.cells[5].firstChild.src = thing.image;
        row.cells[6].textContent = thing.category;
    } else {
        const thingList = document.getElementById('thing-list');
       const row = thingList.insertRow();
        row.id = thing.id;
        row.classList.add(things.length % 2 === 0 ? 'even' : 'odd');

        const userNameCol = row.insertCell();
        userNameCol.textContent = thing.userName;
        const nameCol = row.insertCell();
        nameCol.textContent = thing.name;
        const powerLevelCol = row.insertCell();
        powerLevelCol.textContent = thing.powerLevel;
        const descriptionCol = row.insertCell();
        descriptionCol.textContent = thing.description;
        const uniquePropertyCol = row.insertCell();
        uniquePropertyCol.textContent = thing.uniqueProperty;
        const imageCol = row.insertCell();
        const image = new Image();
        image.src = thing.image;
        image.width = 200;
        imageCol.appendChild(image);
        const categoryCol = row.insertCell();
        categoryCol.textContent = thing.category;
        const editCol = row.insertCell();
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editThing(thing));
        editCol.appendChild(editButton);

        const deleteCol = row.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteThing(thing));
        deleteCol.appendChild(deleteButton);
    }}

function editThing(thing) {
    document.getElementById('user-name').value = thing.userName;
    document.getElementById('name').value = thing.name;
    document.getElementById('power-level').value = thing.powerLevel;
    document.getElementById('description').value = thing.description;
    document.getElementById('unique-property').value = thing.uniqueProperty;
    document.getElementById('category').value = thing.category;
    document.getElementById('image-input').value = '';
}

function deleteThing(thing) {
    const index = things.indexOf(thing);
    things.splice(index, 1);
    localStorage.setItem('things', JSON.stringify(things));
    const row = document.getElementById(thing.id);
    row.parentNode.removeChild(row);
}

document.getElementById('add-form').addEventListener('submit', addThing);

for (let thing of things) {
    renderThing(thing);
}




