window.onload = (event) => {
    const searchButton = document.getElementById("searchButton");
    const search = document.getElementById("search");

    searchButton.addEventListener("click", onSearchButtonClick);
};

function onSearchButtonClick() {
    GetRecipes();
}

async function GetRecipes() {
    fetch(`http://localhost:3000/recipes/${search.value}`).then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status
        })).then(res => {
            DisplaySearchResults(res.data);
        }));
}

function DisplaySearchResults(results) {
    results.forEach(result => {
        console.log(result);
        CreateResultHTML(result);
    });
}

function CreateResultHTML(result) {
    var parent = document.getElementById("searchResults");
    var li = document.createElement('li');
    li.setAttribute('data-id', result.id);
    li.setAttribute('onclick', 'DisplayRecipe(this);');
    li.innerHTML = `${result.name} <br> Created by: ${result.creator}`;
    parent.appendChild(li);
}

function DisplayRecipe(buttonClicked) {
    const recipeID = buttonClicked.dataset.id;

    if (recipeID) {
        window.location = `/Recipe.html?id=${recipeID}`;
    }
}