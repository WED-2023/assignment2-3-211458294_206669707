var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

// router.get("/", (req, res) => res.send("im here"));

/**
 * This path is for searching a recipe
 */
router.get("/search", async (req, res, next) => { //V
  console.log('api domain: ${api_domain}')
  try {
    const recipeName = req.query.recipeName;
    const cuisine = req.query.cuisine;
    const diet = req.query.diet;
    const intolerance = req.query.intolerance;
    const number = req.query.number || 5;
    const results = await recipes_utils.searchRecipe(recipeName, cuisine, diet, intolerance, number);
    res.send(results);
  } catch (error) {
    next(error);
  }
});

  router.get('/', function(req, res) {
    res.send('List of recipes');  
});

  // need to add to the API and check with POSTMAN
  router.get('/familyRecipes', async (req, res, next) => {//V
    try {
      const recipe = await recipes_utils.getFamilyRecipes();
      res.send(recipe);
    } catch (error) {
      next(error);
    }
  });

  // need to add to the API and check with POSTMAN
router.get('/random', async (req, res, next) => { //V
  try {
    const number = req.query.number ? parseInt(req.query.number) : 1;
    const random_recipes = await recipes_utils.getRandomRecipes(number);
    res.send(random_recipes);
  } catch (error) {
    next(error);
  }
});

  /**
   * This path returns a full details of a recipe by its id
   */
  router.get("/:recipeId", async (req, res, next) => { //V
    try {
      const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
      res.send(recipe);
    } catch (error) {
      next(error);
    }
  });

  router.get("/information/:recipeId", async (req, res, next) => { //V
    try {
      const recipe = await recipes_utils.getRecipeInformation(req.params.recipeId);
      res.send(recipe.data);
    } catch (error) {
      next(error);
    }
  });

router.get("/", (req, res) => res.send("im here"));
  module.exports = router;



