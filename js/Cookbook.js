window.onload = (event) => {
    CheckLoggedIn();
    GetRecipes();
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
    document.getElementById("login").innerHTML = `Logged in as: <em>${username}</em> &nbsp;&nbsp; <a onclick="LogOut()">log out</a>  &nbsp;&nbsp; <a onclick="ViewCookbook()">View Cookbook</a>`;
}

function LogOut() {
    fetch(`http://localhost:3000/users/logout`);
    document.getElementById("login").innerHTML = `<a href="Login.html">Login/Register</a>`;
}

function ViewCookbook() {
    window.location = `/Cookbook.html`;
}

async function GetRecipes() {
    fetch(`http://localhost:3000/recipes/cookbook`).then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status
        })).then(res => {
            DisplayRecipes(res.data);
        }));
}

function DisplayRecipes(recipes) {
    recipes.forEach(recipe => {
        CreateResultHTML(recipe);
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