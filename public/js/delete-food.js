const findFoodForm = document.getElementById("findFoodForm");
const foodIdInput = document.getElementById("foodId");
const foodDetails = document.getElementById("foodDetails");
const message = document.getElementById("message");

let selectedFoodId = null;

// Find a food item by ID
findFoodForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const foodId = foodIdInput.value.trim();

    selectedFoodId = null;
    foodDetails.hidden = true;
    foodDetails.innerHTML = "";
    message.textContent = "Searching...";

    try {
        const response = await fetch(
            `/api/food/${encodeURIComponent(foodId)}`
        );

        if (response.status === 404) {
            message.textContent = "Food item not found. Please check the ID.";
            return;
        }

        if (!response.ok) {
            throw new Error("Unable to find the food item.");
        }

        const food = await response.json();

        selectedFoodId = food.food_id;

        const heading = document.createElement("h2");
        heading.textContent = "Food Details";

        const details = [
            ["Food ID", food.food_id],
            ["Food Name", food.food_name],
            ["Category", food.category],
            ["Price", `₹${food.price}`],
            ["Description", food.description || "No description"],
            ["Availability", Number(food.availability) ? "Available" : "Unavailable"]
        ];

        foodDetails.innerHTML = "";
        foodDetails.appendChild(heading);

        details.forEach(([label, value]) => {
            const paragraph = document.createElement("p");
            const strong = document.createElement("strong");

            strong.textContent = `${label}: `;
            paragraph.appendChild(strong);
            paragraph.appendChild(document.createTextNode(String(value)));

            foodDetails.appendChild(paragraph);
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "action-button delete-button";
        deleteButton.textContent = "Delete This Food";

        deleteButton.addEventListener("click", deleteFood);

        foodDetails.appendChild(deleteButton);
        foodDetails.hidden = false;

        message.textContent = "Food found. Check the details before deleting.";

    } catch (error) {
        console.error(error);
        message.textContent =
            "Unable to find food. Check that your server is running.";
    }
});

// Delete the selected food item
async function deleteFood() {
    if (selectedFoodId === null) {
        message.textContent = "Please find a food item first.";
        return;
    }

    const confirmed = confirm(
        "Are you sure you want to permanently delete this food item?"
    );

    if (!confirmed) {
        return;
    }

    message.textContent = "Deleting food...";

    try {
        const response = await fetch(`/api/food/${selectedFoodId}`, {
            method: "DELETE"
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(
                result.message || result.error || "Unable to delete food."
            );
        }

        foodDetails.hidden = true;
        foodDetails.innerHTML = "";
        selectedFoodId = null;

        findFoodForm.reset();

        message.textContent = "Food deleted successfully!";
        message.style.color = "green";

    } catch (error) {
        console.error(error);
        message.textContent =
            error.message || "Something went wrong while deleting.";
        message.style.color = "red";
    }
}