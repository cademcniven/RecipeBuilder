//authentication for API
const applicationID = '2b00e4f3';
const applicationKey = '1c03d18e74f85d034dd5b0cb91fb2473';

const getUrl = (query) => `https://api.edamam.com/api/food-database/parser?ingr=${query}&app_id=${applicationID}&app_key=${applicationKey}`;
const isAlphabet = (str) => /^[a-zA-Z ]+$/.test(str)

window.onload = (event) => {
    const ingredientSearch = document.getElementById('ingredientSearch');
    const ingredientSearchButton = document.getElementById('ingredientSearchButton');

    ingredientSearchButton.addEventListener("click", SearchIngredient);
    document.getElementsByClassName("close")[0].addEventListener("click", CloseModal);

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = (event) => {
        if (event.target == document.getElementById("ingredientSelect")) {
            CloseModal();
        }
    }
};


function SearchIngredient(event) {
    var ingredient = ingredientSearch.value;

    //to try to avoid xss if possible
    if (!isAlphabet(ingredient))
        return;

    fetch(getUrl(ingredient.replace(" ", "%20")))
        .then(response => {
            if (!response.ok) {
                alert("Search Failed");
                return null;
            }

            return response.json()
        })
        .then(response => {
            DisplayIngredientMenu(response);
        });
}

function DisplayIngredientMenu(ingredients) {
    ShowModal();

    console.log(ingredients);

    var ingredientNames = new Set();
    ingredients.hints.forEach(ingredient => {
        if (ingredientNames.has(ingredient.food.label.toLowerCase()))
            return;

        ingredientNames.add(ingredient.food.label.toLowerCase());

        var ul = document.getElementById("ingredientOptions");
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(ingredient.food.label.toLowerCase()));
        ul.appendChild(li);
        ul.lastChild.setAttribute('data-id', ingredient.food.foodId);
    });
}

function ShowModal() {
    document.getElementById("ingredientSelect").style.display = "block";
}

function CloseModal() {
    document.getElementById('ingredientSelect').style.display = "none";
    document.querySelectorAll("#ingredientSelect li").forEach(e => e.parentNode.removeChild(e));
}