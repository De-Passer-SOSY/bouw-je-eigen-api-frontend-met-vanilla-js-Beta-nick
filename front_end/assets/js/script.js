"use strict";

document.addEventListener('DOMContentLoaded', init);

function init() {
    fetchDishes();

    const form = document.getElementById('dish-form');
    const formWrapper = document.getElementById('form-layout');


    form.addEventListener('submit', handleFormSubmit);
}

function fetchDishes() {
    fetch('http://localhost:3333/dishes')
        .then(res => res.json())
        .then(data => {
            const sorted = data.sort((a, b) => new Date(b.datum) - new Date(a.datum));
            renderDishes(sorted);
        });
}

// Vul de tabel en koppel knoppen
function renderDishes(dishes) {
    const list = document.getElementById('dish-list');
    list.innerHTML = '';

    dishes.forEach(dish => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${dish.name}</td>
      <td>${dish.dish_type}</td>
      <td>${dish.cuisine}</td>
      <td>${dish.is_vegetarian}</td>
      <td>
        <button class="edit-btn" data-id="${dish.id}">Wijzig</button>
        <button class="delete-btn" data-id="${dish.id}">Verwijder</button>
      </td>
    `;

        // Voeg event listeners toe aan knoppen
        row.querySelector('.edit-btn').addEventListener('click', () => editDish(dish.id));
        row.querySelector('.delete-btn').addEventListener('click', () => deleteDish(dish.id));

        list.appendChild(row);
    });
}

// Formulier verzenden → toevoegen of bijwerken
function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('dish-id').value;
    const dish = {
        name: document.getElementById('name').value,
        dish_type: document.getElementById('dish_type').value,
        cuisine: document.getElementById('cuisine').value,
        is_vegetarian: document.getElementById('is_vegetarian').checked ? 1 : 0

    };

    console.log("Verstuur gerecht:", dish);



    const method = id ? 'PUT' : 'POST';
    const url = id
        ? `http://localhost:3333/updateDish/${id}`
        : 'http://localhost:3333/newDish';

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dish)
    })
        .then(res => {
            if (!res.ok) {
                // Server geeft 400, 404, 500 enz.
                throw new Error("Server gaf een fout terug");
            }
            return res.json();
        })
        .then(data => {
            showAlert(id ? 'Gerecht is bewerkt' : 'Gerecht toegevoegd', 'success');
            resetForm();
            fetchDishes();
        })
        .catch(err => {
            console.error("Er ging iets mis:", err);
            showAlert('Er ging iets mis.', 'error');
        });
}

// Vult het formulier met de bestaande gegevens van een afwezigheid
function editDish(id) {
    fetch(`http://localhost:3333/dish/${id}`)
        .then(res => res.json())
        .then(dish => {
            document.getElementById('dish-id').value = dish.id;
            document.getElementById('name').value = dish.name;
            document.getElementById('dish_type').value = dish.dish_type;
            document.getElementById('cuisine').value = dish.cuisine;
            document.getElementById('is_vegetarian').value = dish.is_vegetarian;
            document.getElementById('dish-form').scrollIntoView({ behavior: 'smooth' });
        });
}

// Verwijder een afwezigheid
function deleteDish(id) {
    fetch(`http://localhost:3333/deleteDish/${id}`, { method: 'DELETE' })
        .then(() => {
            showAlert('Gerecht verwijderd.', 'success');
            location.reload();
            fetchDishes();
        })
        .catch(() => showAlert('Verwijderen mislukt.', 'error'));
}

// Reset het formulier en ID-veld
function resetForm() {
    document.getElementById('dish-id').value = '';
    document.getElementById('dish-form').reset();
}

// Toon melding bovenaan
function showAlert(message, type = 'success') {
    const alertBox = document.getElementById("alert");
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
    alertBox.classList.remove('hidden');
    setTimeout(() => alertBox.classList.add('hidden'), 3000);
}

