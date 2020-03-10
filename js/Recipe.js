const recommendedDailyNutrients = {
    fat: 65,
    saturatedFat: 20,
    cholesterol: 300,
    carbs: 300,
    fiber: 25,
    sodium: 2400
}

var username;
var recipeJSON;

window.onload = (event) => {
    CheckLoggedIn();
    GetRecipeJSON();

    document.getElementById('addRecipeToCookbook').addEventListener("click", AddRecipeToCookbook);
};

function AddRecipeToCookbook() {
    fetch('http://localhost:3000/recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipeJSON)
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);
        window.location = `/Recipe.html?id=${data}`
    });
}

function CheckLoggedIn() {
    fetch(`http://localhost:3000/users/loggedin`).then(response => {
        if (response.status == 200) {
            response.json().then(data => {
                username = data.username;
                WelcomeLoggedInUser();
            });
        } else {
            document.getElementById('addRecipeToCookbook').style.display = "none"
        }
    });
}

function WelcomeLoggedInUser() {
    document.getElementById("login").innerHTML = `Logged in as: <em>${username}</em> &nbsp;&nbsp; <a onclick="LogOut()">log out</a> &nbsp;&nbsp; <a onclick="ViewCookbook()">View Cookbook</a>`;
}

function LogOut() {
    fetch(`http://localhost:3000/users/logout`);
    document.getElementById("login").innerHTML = `<a href="Login.html">Login/Register</a>`;
}

function ViewCookbook() {
    window.location = `/Cookbook.html`;
}

function GetRecipeJSON() {
    fetch(`http://localhost:3000/recipes/id/${GetRecipeID()}`).then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status
        })).then(res => {
            if (res.data[0] == undefined)
                document.getElementById("recipeName").innerText = "Could not load recipe";
            else
                CreateRecipeHTML(res.data[0].recipe);


            console.log(res.data[0].creator)
            console.log(username)
            if (res.data[0].creator == username)
                document.getElementById('addRecipeToCookbook').style.display = "none"
            else
                recipeJSON = res.data[0].recipe
        }));
}

function CreateRecipeHTML(data) {
    if (data === undefined) {
        document.getElementById("recipeName").innerText = "Could not load recipe";
        return;
    }

    document.getElementById("recipeName").innerText = data.name;
    document.getElementById("recipeInstructions").innerText = data.instructions;
    UpdateHTML(TotalNutrients(data.nutrition));
    CreateIngredientList(data.ingredients);
}

function TotalNutrients(nutritionObjs) {
    var nutritionObj = {
        calories: 0,
        fat: 0,
        saturatedFat: 0,
        transFat: 0,
        cholesterol: 0,
        sodium: 0,
        carbs: 0,
        fiber: 0,
        sugar: 0,
        protein: 0
    }

    nutritionObjs.forEach(obj => {
        nutritionObj.calories += obj.calories;
        nutritionObj.fat += obj.fat;
        nutritionObj.saturatedFat += obj.saturatedFat;
        nutritionObj.transFat += obj.transFat;
        nutritionObj.cholesterol += obj.cholesterol;
        nutritionObj.sodium += obj.sodium;
        nutritionObj.carbs += obj.carbs;
        nutritionObj.fiber += obj.fiber;
        nutritionObj.sugar += obj.sugar;
        nutritionObj.protein += obj.protein;
    });

    return nutritionObj;
}

function UpdateHTML(nutrition) {
    UpdateNutritionHTML(nutrition);
    UpdateNutritionPercentHTML(nutrition);
}

function UpdateNutritionHTML(nutrition) {
    document.getElementById('calories').innerHTML = Math.floor(nutrition.calories);
    document.getElementById('fat').innerHTML = Math.floor(nutrition.fat);
    document.getElementById('saturatedFat').innerHTML = Math.floor(nutrition.saturatedFat);
    document.getElementById('transFat').innerHTML = Math.floor(nutrition.transFat);
    document.getElementById('cholesterol').innerHTML = Math.floor(nutrition.cholesterol);
    document.getElementById('sodium').innerHTML = Math.floor(nutrition.sodium);
    document.getElementById('carbs').innerHTML = Math.floor(nutrition.carbs);
    document.getElementById('fiber').innerHTML = Math.floor(nutrition.fiber);
    document.getElementById('sugar').innerHTML = Math.floor(nutrition.sugar);
    document.getElementById('protein').innerHTML = Math.floor(nutrition.protein);
}

function UpdateNutritionPercentHTML(nutrition) {
    document.getElementById('fatPercent').innerHTML = Math.floor((nutrition.fat / recommendedDailyNutrients.fat) * 100);
    document.getElementById('saturatedFatPercent').innerHTML = Math.floor((nutrition.saturatedFat / recommendedDailyNutrients.saturatedFat) * 100);
    document.getElementById('cholesterolPercent').innerHTML = Math.floor((nutrition.cholesterol / recommendedDailyNutrients.cholesterol) * 100);
    document.getElementById('carbsPercent').innerHTML = Math.floor((nutrition.carbs / recommendedDailyNutrients.carbs) * 100);
    document.getElementById('fiberPercent').innerHTML = Math.floor((nutrition.fiber / recommendedDailyNutrients.fiber) * 100);
    document.getElementById('sodiumPercent').innerHTML = Math.floor((nutrition.sodium / recommendedDailyNutrients.sodium) * 100);
}

function CreateIngredientList(ingredients) {
    let ul = document.getElementById("ingredientList");
    ingredients.forEach(ingredient => {
        let li = document.createElement('li');
        li.innerHTML = ingredient.name;
        ul.appendChild(li);
    });
}

//this is way overkill considering the url format is always the same
function GetRecipeID() {
    // get query string from url (optional) or window
    var queryString = window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // set parameter name and value (use 'true' if empty)
            var paramName = a[0];
            var paramValue = typeof(a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

            // if the paramName ends with square brackets, e.g. colors[] or colors[2]
            if (paramName.match(/\[(\d+)?\]$/)) {

                // create key if it doesn't exist
                var key = paramName.replace(/\[(\d+)?\]/, '');
                if (!obj[key]) obj[key] = [];

                // if it's an indexed array e.g. colors[2]
                if (paramName.match(/\[\d+\]$/)) {
                    // get the index value and add the entry at the appropriate position
                    var index = /\[(\d+)\]/.exec(paramName)[1];
                    obj[key][index] = paramValue;
                } else {
                    // otherwise add the value to the end of the array
                    obj[key].push(paramValue);
                }
            } else {
                // we're dealing with a string
                if (!obj[paramName]) {
                    // if it doesn't exist, create property
                    obj[paramName] = paramValue;
                } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                    // if property does exist and it's a string, convert it to an array
                    obj[paramName] = [obj[paramName]];
                    obj[paramName].push(paramValue);
                } else {
                    // otherwise add the property
                    obj[paramName].push(paramValue);
                }
            }
        }
    }

    return obj.id;
}

function RedirectToBareRecipe() {
    window.location = `BareRecipe.html?id=${GetRecipeID()}`;
}