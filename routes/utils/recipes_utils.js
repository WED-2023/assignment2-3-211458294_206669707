const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}



async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}

// the search&filter is made according to the parameters and API search
async function searchRecipe(recipeName, cuisine, diet, intolerance, number, username) {
    const response = await axios.get(`${api_domain}/complexSearch`, {
        params: {
            query: recipeName,
            cuisine: cuisine,
            diet: diet,
            intolerances: intolerance,
            number: number,
            apiKey: process.env.spooncular_apiKey
        }
    });

    return getRecipesPreview(response.data.results.map((element) => element.id), username);
}

// get random recipes from spooncular, need to check where we define diet parameter (string). 
async function getRandomRecipes(number, diet) {
    const response = await axios.get(`${api_domain}/random`, 
        {
            params: {
                number: number,
                diet: diet,
                apiKey: process.env.spooncular_apiKey

            }
        }
    )

}   

async function getFamilyRecipes() {
    const recipesArray = Object.values(family_recipes);
    console.log("recipesArray: ", recipesArray);
    return { data: { recipes: recipesArray } };
  }

exports.getRecipeDetails = getRecipeDetails;
exports.getRecipeInformation = getRecipeInformation;
exports.searchRecipe = searchRecipe;
exports.getFamilyRecipes = getFamilyRecipes;
exports.getRandomRecipes = getRandomRecipes



