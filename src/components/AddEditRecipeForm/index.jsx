import { useEffect, useState } from "react";
import ImageUploadPreview from "../ImageUploadPreview";

function AddEditRecipeForm({
  existingRecipe,
  handleAddRecipe,
  handleUpdateRecipe,
  handleDeleteRecipe,
  handleEditRecipeCancel,
}) {
  useEffect(() => {
    if (existingRecipe) {
      setName(existingRecipe.name);
      setCategory(existingRecipe.category);
      setDirections(existingRecipe.directions);
      setPublishDate(existingRecipe.publishDate.toISOString().split("T")[0]);
      setIngredients(existingRecipe.ingredients);
      setImageUrl(existingRecipe.imageUrl);
    } else {
      resetForm();
    }
  }, [existingRecipe]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [publishDate, setPublishDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [directions, setDirections] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [ingredientName, setIngredientName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  function handleRecipeFormSubmit(event) {
    event.preventDefault();

    if (ingredients.length === 0) {
      alert("Ingredients cannot be empty. Please add at least 1 ingredient");
      return;
    }

    if(!imageUrl) {
        alert("Missing recipe image. Please add a recipe image.");
        return;
    }

    console.log(new Date(publishDate));
    console.log(new Date());

    const isPublished = new Date(publishDate) <= new Date() ? true : false;

    const newRecipe = {
      name,
      category,
      directions,
      publishDate: new Date(publishDate),
      isPublished,
      ingredients,
      imageUrl,
    };

    if (existingRecipe) {
      handleUpdateRecipe(newRecipe, existingRecipe.id);
    } else {
      handleAddRecipe(newRecipe);
    }

    resetForm();
  }

  function handleAddIngredient(event) {
    if (event.key && event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    if (!ingredientName) {
      alert("Missing ingredient field. Please Double check");
      return;
    }

    setIngredients([...ingredients, ingredientName]);
    setIngredientName("");
  }

  // eslint-disable-next-line no-unused-vars
  function handleDeleteIngredient(ingredientName) {
    const remainingIngredients = ingredients.filter((ingredient) => {
      return ingredient !== ingredientName;
    });

    setIngredients(remainingIngredients);
  }

  function resetForm() {
    setName("");
    setCategory("");
    setDirections("");
    setPublishDate("");
    setIngredients([]);
    setImageUrl("");
  }

 

  //
  return (
    <form
        className="add-edit-recipe-form-container"
        onSubmit={handleRecipeFormSubmit}
    >
    {
        existingRecipe ? (
            
            <h2>Update the Recipe</h2>
            
            ) : (
            
            <h2>Add a New Recipe</h2>
            )
    }
        <div 
            className="top-form-section"
        >
        
            <div
                className="image-input-box"
            >
                Recipe Image
                <ImageUploadPreview
                    basePath = "recipes"
                    existingImageUrl = {imageUrl}
                    handleUploadFinish = {(downloadUrl) => {setImageUrl(downloadUrl)}}
                    handleUploadCancel = {() => setImageUrl("")}
                >
                    
                </ImageUploadPreview>
            </div>

            <div className="fields">
            <label className="recipe-label input-label">
                Recipe Name:
                <input
                type="text"
                required
                value={name}
                onChange={(event) => {
                    setName(event.target.value);
                }}
                className="input-text"
                />
            </label>
            <label className="recipe-label input-label">
                Category:
                <select
                value={category}
                onChange={(event) => {
                    setCategory(event.target.value);
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
            <label className="recipe-label input-label">
                Directions:
                <textarea
                required
                value={directions}
                onChange={(event) => {
                    setDirections(event.target.value);
                }}
                className="input-text directions"
                />
            </label>
            <label className="recipe-label input-label">
                Publish Date:
                <input
                type="date"
                required
                value={publishDate}
                onChange={(event) => {
                    setPublishDate(event.target.value);
                }}
                className="input-text"
                />
            </label>
            </div>
        </div>
      <div className="ingredients-list">
        <h3 className="text-center">Ingredients</h3>
        <table className="ingredients-table">
          <thead>
            <tr>
              <th className="table-header">Ingredient</th>
              <th className="table-header">Delete</th>
            </tr>
          </thead>
          <tbody>
            {ingredients && ingredients.length > 0
              ? ingredients.map((ingredient) => {
                  return (
                    <tr key={ingredient}>
                      <td className="table-data text-center">{ingredient}</td>
                      <td className="ingredient-delete-box">
                        <button
                          type="button"
                          className="secondary-button ingredient-delete-button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
        {ingredients && ingredients.length === 0 ? (
          <h3 className="text-center no-ingredients">
            No Ingrediedients Added Yet
          </h3>
        ) : null}
        <div className="ingredient-form">
          <label className="ingredient-label">
            Ingredient:
            <input
              type="text"
              value={ingredientName}
              onChange={(event) => {
                setIngredientName(event.target.value);
              }}
              onKeyUp={handleAddIngredient}
              className="input-text"
              placeholder="ex. 1 cup of sugar"
            ></input>
          </label>
          <button
            type="button"
            className="primary-button add-ingedient-button"
            onClick={handleAddIngredient}
          >
            Add Ingredient
          </button>
        </div>
      </div>
      <div className="action-buttons">
        <button type="submit" className="primary-button action-button">
          {existingRecipe ? "Update Recipe" : "Create Recipe"}
        </button>
        {existingRecipe ? 
            (
                <>
                    <button
                    type="button"
                    onClick={handleEditRecipeCancel}
                    className="primary-button action-button"
                    >
                    Cancel
                    </button>
                    
                    <button
                    type="button"
                    onClick={() => {handleDeleteRecipe(existingRecipe.id)}}
                    className="primary-button action-button"
                    >
                    Delete
                    </button>
                    
                </>
            ) : (
                null
            )
        }
      </div>
    </form>
  );
}

export default AddEditRecipeForm;
