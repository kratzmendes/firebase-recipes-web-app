import { startTransition, useEffect, useState } from 'react';

import FirebaseAuthService from './FirebaseAuthService';

import './App.css';
import LoginForm from './components/LoginForm';


// eslint-disable-next-line no-unused-vars
import { Timestamp, toDate } from 'firebase/firestore'
import { initializeApp } from 'firebase/app';
import { getFirebaseConfig } from './firebase-config';
import AddEditRecipeForm from './components/AddEditRecipeForm';
import FirebaseFirestoreService from './FirebaseFirestoreService';

initializeApp(getFirebaseConfig());

function App() {

  const [user, setUser] = useState(null);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [orderBy, setOrderBy] = useState("publishDateDesc");
  const [recipesPerPage, setRecipesPerPage] = useState(3);
  
  
  useEffect(() => {

    setIsLoading(true);

    fetchRecipes()
      .then((fetchedRecipes) => {
        setRecipes(fetchedRecipes);
      })
      .catch((error) => {
        console.error(error.message);
        throw error;
      })
      .finally(() => {
        setIsLoading(false);
      });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, categoryFilter, orderBy, recipesPerPage])

  FirebaseAuthService.subscribeToAuthChanges(setUser);

  async function fetchRecipes(cursorId = ''){

    const queries = [];

    if(categoryFilter) {
      queries.push(
        {
        field: 'category',
        condition: '==',
        value: categoryFilter
        }
      )
    }

    if(!user){
      queries.push(
        {
        field: 'isPublished',
        condition: '==',
        value: true
        }
      )
    }

    const orderByField = "publishDate";
    let orderByDirection;

    if(orderBy){
      switch(orderBy) {
        case "publishDateAsc":
          orderByDirection = 'asc';
          break;
        case "publishDateDesc":
          orderByDirection = 'desc';
          break;
        default:
          break;
      }
    }

    let fetchedRecipes = [];

    try {
      const response = await FirebaseFirestoreService.readDocuments(
        {
          collectionPath: 'recipes', 
          queries: queries,
          orderByField: orderByField,
          orderByDirection: orderByDirection,
          perPage: recipesPerPage,
          cursorId: cursorId,
        }
      );

      const newRecipes = response.docs
        .map((recipeDoc) => {
          const id = recipeDoc.id;
          const data = recipeDoc.data();

          data.publishDate = new Date(data.publishDate.seconds* 1000);

          return { ...data, id};
        });

      if(cursorId){
        fetchedRecipes = [...recipes, ...newRecipes];
      } else {
        fetchedRecipes = [...newRecipes];
      }

    } catch (error) {
      console.error(error.message);
      throw error;
    }

    return fetchedRecipes;
  }

  function handleRecipesPerPageChange(event){
    const recipesPerPage = event.target.value;

    setRecipes([]);
    setRecipesPerPage(recipesPerPage);
  }

  function handleLoadMoreRecipesClick() {
    const lastRecipe = recipes[recipes.length - 1];
    const cursorId = lastRecipe.id;

    handleFetchRecipes(cursorId);

  }

  async function handleFetchRecipes(cursorId = '') {
    try {
      const fetchedRecipes = await fetchRecipes(cursorId);

      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
    
  }

  async function handleAddRecipe(newRecipe) {
    try {
      const response = await FirebaseFirestoreService.createDocument('recipes', newRecipe);

      handleFetchRecipes();

      alert(`sucessfully created a recipe with an ID = ${response.id}`)
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  async function handleUpdateRecipe(newRecipe, recipeId) {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await FirebaseFirestoreService.updateDocument('recipes', recipeId, newRecipe);

      handleFetchRecipes();

      alert(`sucessfully updated the recipe`);

      startTransition(() => {
        setCurrentRecipe(null);
        window.scrollTo(0, 0);
      });


    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  async function handleDeleteRecipe(recipeId) {
    const deleteConfirmation = window.confirm(
      "Are you sure you want to delete this recipe? OK for Yes. Cancel for No."
    );

    if(deleteConfirmation) {
      try {
        await FirebaseFirestoreService.deleteDocument("recipes", recipeId);

        handleFetchRecipes();

        alert(`sucessfully updated the recipe with ID = ${recipeId}`);

        startTransition(() => {
          setCurrentRecipe(null);
          window.scrollTo(0, 0);
        });

      } catch (error) {
        alert(error.message);
        throw error;
      }
    }

  }

  function handleEditRecipeClick(recipeId) {

    const selectedRecipe = recipes.find((recipe) => {
      return recipe.id === recipeId;
    });

    if (selectedRecipe) {
      
      startTransition(() => {
        setCurrentRecipe(selectedRecipe);
        window.scrollTo(0, document.body.scrollHeight);
      });

    }
  }

  function handleEditRecipeCancel() {
    startTransition(() => {
      setCurrentRecipe(null);
      window.scrollTo(0, 0);
    });
    
  }

  function lookupCategoryLabel(categoryKey) { //could fetch in the cloud the corresponding category name
    const categories = {
      breadsSandwichesAndPizza: "Breads, Sanwiches and Pizza",
      eggsAndBreakfast: "Eggs & Breakfast",
      desertsAndBakedGoods: "Deserts & Baked Goods",
      fishAndSeafood: "Fish & Seafood",
      vegetables: "Vegetables"
    };

    const label = categories[categoryKey];

    return label
  }

  function formatDate(date) {
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    const dateString = `${day}/${month}/${year}`

    return dateString;
  }

  return (
    <div className="App">
      <div className="title-row">
        <h1 className="title"> Firebase Recipes</h1>
        <LoginForm existingUser={user}></LoginForm>
      </div>
      <div className='main'>

        <div
          className='row filters'
        >
          <label className="recipe-label input-label">
            Category:
            <select
              value={categoryFilter}
              onChange={(event) => {
                setCategoryFilter(event.target.value);
              }}
              className="select"
              required
            >
              <option value=""></option>
              <option value="breadsSandwichesAndPizza">
                Breads, Sanwiches and Pizza
              </option>
              <option value="eggsAndBreakfast">Eggs & Breakfast</option>
              <option value="desertsAndBakedGoods">
                Deserts & Baked Goods
              </option>
              <option value="fishAndSeafood">Fish & Seafood</option>
              <option value="vegetables">Vegetables</option>
            </select>
          </label>
          <label
            className='input-label'
          >
            <select
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
              className='select'
            >
              <option
                value={"publishDateDesc"}
              >
                Publish Date (newst - oldest)
              </option>
              <option
                value={"publishDateAsc"}
              >
                Publish Date (oldest - newest)
              </option>

            </select>

          </label>

        </div>
        <div
          className='center'
        >
          <div
            className='recipe-list-box'
          >
            {
              isLoading ? 
                (
                  <div className='fire'>
                    <div className='flames'>
                      <div className='flame'/>
                      <div className='flame'/>
                      <div className='flame'/>
                      <div className='flame'/>
                    </div>
                    <div className='logs'/>
                  </div>
                ):(
                  null
                )
            }

            {
              !isLoading && recipes && recipes.length === 0 ? 
                (
                  <h5 
                    className='no-recipes'
                  >
                    No recipes Found
                  </h5>
                ):(
                  null
                )
            }


            {
              !isLoading && recipes && recipes.length > 0 ? 
              (
                <div
                  className='recipe-list'
                >
                  {
                    recipes.map((recipe) => {   
                      return (                    
                        <div
                          className='recipe-card'
                          key={recipe.id}
                        >
                          {
                            recipe.isPublished === false ? 
                              (
                                <div
                                  className='unpublished'
                                >
                                  UNPUBLISHED
                                </div>
                              ):( 
                                null 
                              )
                          }
                          <div
                            className='recipe-name'
                          >
                            {recipe.name}
                          </div>
                          <div
                            className='recipe-field'
                          >
                            Category: {lookupCategoryLabel(recipe.category)}
                          </div>
                          <div
                            className='recipe-field'
                          >
                            Publish Date: {formatDate(recipe.publishDate)}
                          </div>

                          {
                            user ? 
                              (
                                <button
                                  type='button'
                                  onClick={() => {handleEditRecipeClick(recipe.id)}}
                                  className='primary-button'
                                >
                                  Edit Recipe
                                </button>
                              ):(
                                null
                              )
                          }

                        </div>                  
                      )                  
                    })
                  }
                </div>
                
              ):(
                null
              )
            }

          </div>

        </div>

        {
          isLoading || (recipes && recipes.length > 0) ? 
          (
            <>
              <label
                className='input-label'
              >
                Recipes Per Page:
                <select
                   value={recipesPerPage}
                   onChange={handleRecipesPerPageChange}
                   className='select'
                >
                  <option
                    value={3}
                  >
                    3
                  </option>
                  <option
                    value={6}
                  >
                    6
                  </option>
                  <option
                    value={9}
                  >
                    9
                  </option> 
                </select>
              </label>

              <div
                className='pagination'
              >
                <button
                  type='button'
                  onClick={handleLoadMoreRecipesClick}
                  className="primary-button"
                >
                  LOAD MORE RECIPES
                </button>
              </div>
            </>
          ):(
            null
          )
        }


        {
          user ? (
            <AddEditRecipeForm
              existingRecipe = {currentRecipe}
              handleAddRecipe={handleAddRecipe}
              handleUpdateRecipe={handleUpdateRecipe}
              handleDeleteRecipe={handleDeleteRecipe}
              handleEditRecipeCancel={handleEditRecipeCancel}
            >
            </AddEditRecipeForm>
          ):(
            null
          )
        }
        
      </div>
    </div>
  );
}

export default App;
