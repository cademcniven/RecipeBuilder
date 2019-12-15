//authentication for API
const applicationID = '2b00e4f3';
const applicationKey = '1c03d18e74f85d034dd5b0cb91fb2473';

const getUrl = (query) => `https://api.edamam.com/api/food-database/parser?ingr=${query}&app_id=${applicationID}&app_key=${applicationKey}`;
const isAlphabet = (str) => /^[a-zA-Z ]+$/.test(str)

window.onload = (event) => {
    const ingredientSearch = document.getElementById('ingredientSearch');
    const ingredientSearchButton = document.getElementById('ingredientSearchButton');
    ingredientSearchButton.addEventListener("click", SearchIngredient);
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
            DisplayIngredientMenu(ingredients);
        });
}

function DisplayIngredientMenu(ingredients) {

}