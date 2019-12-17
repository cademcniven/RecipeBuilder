//authentication for API
const applicationID = '2b00e4f3';
const applicationKey = '1c03d18e74f85d034dd5b0cb91fb2473';

const getUrl = (query) => `https://api.edamam.com/api/food-database/parser?ingr=${query}&app_id=${applicationID}&app_key=${applicationKey}`;
const nutritionUrl = "https://api.edamam.com/api/food-database/nutrients";
const isAlphabet = (str) => /^[a-zA-Z ]+$/.test(str)

var ingredientSearch;

window.onload = (event) => {
    ingredientSearch = document.getElementById('ingredientSearch');
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

    var ingredientNames = new Set();
    ingredients.hints.forEach(ingredient => {
        if (ingredientNames.has(ingredient.food.label.toLowerCase()))
            return;

        ingredientNames.add(ingredient.food.label.toLowerCase());
        CreateModalHTML(ingredient.food.label.toLowerCase(), ingredient.food.foodId, JSON.stringify(ingredient.measures));
    });
}

function ShowModal() {
    document.getElementById("ingredientSelect").style.display = "block";
}

function CloseModal() {
    document.getElementById('ingredientSelect').style.display = "none";
    document.querySelectorAll("#ingredientOptions div").forEach(e => e.parentNode.removeChild(e));
}

function CreateModalHTML(label, foodId, units) {
    var parent = document.getElementById("ingredientOptions");
    var newDiv = document.createElement('div');
    var domString = `<button type="button" onclick="addIngredientToRecipe(this)" data-label="${label}" data-id="${foodId}" 
                        data-units=${units} class="ingredientListButton">x</button> ${label}`;
    newDiv.innerHTML = domString;
    parent.appendChild(newDiv);
}

function addIngredientToRecipe(buttonClicked) {
    CreateIngredientHTML(buttonClicked.dataset.label, buttonClicked.dataset.units);
    CloseModal();

}

function CreateIngredientHTML(label, units) {
    var parent = document.getElementById("ingredientList");
    var li = document.createElement('li');
    var unitOptions = CreateUnitHTML(units);
    var domString = `<li>
                    Qty
                    <input type="text" class="qty" name="qty" value="0">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Unit
                    ${unitOptions}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    ${label} 
                    </li>`;
    li.innerHTML = domString;
    parent.appendChild(li);
}

function CreateUnitHTML(units) {
    var unitObj = JSON.parse(units);
    var select = `<select>`

    unitObj.forEach(unit => {
        select += `<option value="${unit.uri}">${unit.label}</option>`;
    });

    select += `</select>`

    return select;
}