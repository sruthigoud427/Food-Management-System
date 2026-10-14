const findFoodForm = document.getElementById("findFoodForm");
const foodIdInput = document.getElementById("foodId");
const foodResult = document.getElementById("foodResult");
const resultMessage = document.getElementById("resultMessage");

findFoodForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const foodId = foodIdInput.value.trim();

    foodResult.hidden = true;
    foodResult.innerHTML = "";
    resultMessage.textContent = "Searching...";

    try {
        const response = await fetch(`/api/food/${encodeURIComponent(foodId)}`);

        if (response.status === 404) {
            resultMessage.textContent = "No food item found with that ID.";
            return;
        }

        if (!response.ok) {
            throw new Error("Unable to search for food.");
        }

        const food = await response.json();

        foodResult.innerHTML = `
            <h2>Food Details</h2>
            <p><strong>Food ID:</strong> ${food.food_id}</p>
            <p><strong>Food Name:</strong> ${escapeHTML(food.food_name)}</p>
            <p><strong>Category:</strong> ${escapeHTML(food.category)}</p>
            <p><strong>Price:</strong> ₹${food.price}</p>
            <p><strong>Description:</strong> ${
                escapeHTML(food.description || "No description")
            }</p>
            <p class="result-status">
    <strong>Availability:</strong>
    ${
        food.availability === true ||
        food.availability === 1 ||
        food.availability === "1"
            ? "Available"
            : "Unavailable"
    }
</p>
        `;

        foodResult.hidden = false;
        resultMessage.textContent = "Food item found successfully!";
        alert("Food found successfully!");


    } catch (error) {
        console.error(error);
        resultMessage.textContent =
            "Unable to search. Please check your server and try again.";
    }
});

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
        const replacements = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return replacements[character];
    });
}