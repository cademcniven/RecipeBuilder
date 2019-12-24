//authentication for API
const applicationID = 'af989ce9';
const applicationKey = '5d10a89a3820ac005bb38a2d64c8eb42';

const getUrl = (query) => `https://api.edamam.com/api/nutrition-data?app_id=${applicationID}&app_key=${applicationKey}&ingr=${query}`;
const isAlphanumeric = (str) => /^[a-zA-Z0-9 .]+$/.test(str)

const recommendedDailyNutrients = {
    fat: 65,
    saturatedFat: 20,
    cholesterol: 300,
    carbs: 300,
    fiber: 25,
    sodium: 2400
}

var ingredientID = 0;
var nutritionObjs = [];

window.onload = (event) => {
    const ingredientSearch = document.getElementById('ingredientSearch');
    const ingredientSearchButton = document.getElementById('ingredientSearchButton');

    ingredientSearchButton.addEventListener("click", SearchIngredient);
};

function SearchIngredient(event) {
    var ingredient = ingredientSearch.value;

    //to try to avoid xss if possible
    if (!isAlphanumeric(ingredient))
        return;

    fetch(getUrl(ingredient.replace(" ", "%20")))
        .then(response => {
            if (response.status != 200) {
                alert("Ingredient not found");
                return null;
            }

            return response.json()
        })
        .then(response => {
            if (response.calories == 0) {
                alert("Ingredient not found (or has 0 calories)");
                return null;
            }

            addIngredientToRecipe(response);
        });
}

function addIngredientToRecipe(nutrition) {
    CreateIngredientHTML();
    nutritionObjs.push(CreateNutritionObject(nutrition));
    UpdateHTML(TotalNutrients());
    ingredientID++;
}

function CreateIngredientHTML() {
    var parent = document.getElementById("ingredientList");
    var li = document.createElement('li');
    var domString = `<li data-ingredient="${ingredientID}">
                    ${ingredientSearch.value} <button type="buton" onclick="DeleteIngredient(this)">X</button>
                    </li>`;
    li.innerHTML = domString;
    parent.appendChild(li);
}

function DeleteIngredient(buttonClicked) {
    for (let i = 0; i < nutritionObjs.length; ++i) {
        if (nutritionObjs[i].id == buttonClicked.closest('li').dataset.ingredient) {
            nutritionObjs.splice(i, 1);
            break;
        }
    }

    buttonClicked.closest('li').remove();

    UpdateHTML(TotalNutrients());
}

/*
Rather than returning 0, the api simply won't return nutrients
that don't exist in the ingredient. Therefore, rather than doing a quick
assignment, we have to check if each field is defined first
*/
function CreateNutritionObject(nutrition) {
    var nutritionObj = {
        id: ingredientID,
        calories: nutrition.calories,
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

    if (typeof nutrition.totalNutrients.FAT !== "undefined")
        nutritionObj.fat = nutrition.totalNutrients.FAT.quantity;
    if (typeof nutrition.totalNutrients.FASAT !== "undefined")
        nutritionObj.saturatedFat = nutrition.totalNutrients.FASAT.quantity;
    if (typeof nutrition.totalNutrients.FATRN !== "undefined")
        nutritionObj.transFat = nutrition.totalNutrients.FATRN.quantity;
    if (typeof nutrition.totalNutrients.CHOLE !== "undefined")
        nutritionObj.cholesterol = nutrition.totalNutrients.CHOLE.quantity;
    if (typeof nutrition.totalNutrients.NA !== "undefined")
        nutritionObj.sodium = nutrition.totalNutrients.NA.quantity;
    if (typeof nutrition.totalNutrients.CHOCDF !== "undefined")
        nutritionObj.carbs = nutrition.totalNutrients.CHOCDF.quantity;
    if (typeof nutrition.totalNutrients.FIBTG !== "undefined")
        nutritionObj.fiber = nutrition.totalNutrients.FIBTG.quantity;
    if (typeof nutrition.totalNutrients.SUGAR !== "undefined")
        nutritionObj.sugar = nutrition.totalNutrients.SUGAR.quantity;
    if (typeof nutrition.totalNutrients.PROCNT !== "undefined")
        nutritionObj.protein = nutrition.totalNutrients.PROCNT.quantity;

    return nutritionObj;
}

function TotalNutrients() {
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