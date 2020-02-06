window.onload = (event) => {
    const searchButton = document.getElementById("searchButton");
    const search = document.getElementById("search");
    const tags = document.getElementById("tags");

    searchButton.addEventListener("click", onSearchButtonClick);
    CheckLoggedIn();
};

function CheckLoggedIn() {
    fetch(`http://localhost:3000/users/loggedin`).then(response => {
        if (response.status == 200) {
            response.json().then(data => {
                WelcomeLoggedInUser(data.username);
            });
        }
    });
}

function WelcomeLoggedInUser(username) {
    document.getElementById("login").innerHTML = `Logged in as: <em>${username}</em> &nbsp;&nbsp; <a onclick="LogOut()">log out</a>`;
}

function LogOut() {
    fetch(`http://localhost:3000/users/logout`);
    document.getElementById("login").innerHTML = `<a href="Login.html">Login/Register</a>`;
}

function onSearchButtonClick() {
    GetRecipes();
}

function onEnterPress(event) {
    //check if the event is the enter key or another key
    if (event.which != 13 && event.keyCode != 13)
        return;

    GetRecipes();
}

async function GetRecipes() {
    EmptyResultsList();

    //if search fields are empty then the request won't go to the right route
    //the route can check for 00's and change behaviour appropriately
    let searchString = (search.value) ? search.value : "00";
    let tagsString = (tags.value) ? tags.value : "00";

    fetch(`http://localhost:3000/recipes/${searchString}/${tagsString}`).then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status
        })).then(res => {
            DisplaySearchResults(res.data);
        }));
}

function EmptyResultsList() {
    document.getElementById("searchResults").innerHTML = "";
}

function DisplaySearchResults(results) {
    results.forEach(result => {
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