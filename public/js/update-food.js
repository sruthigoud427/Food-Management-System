const findFoodForm = document.getElementById("findFoodForm");
const updateFoodForm = document.getElementById("updateFoodForm");
const message = document.getElementById("message");

let selectedFoodId = null;

// Find the existing food item
findFoodForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const foodId = document.getElementById("foodId").value.trim();

    message.textContent = "Searching for food...";
    updateFoodForm.hidden = true;
    selectedFoodId = null;

    try {
        const response = await fetch(
            `/api/food/${encodeURIComponent(foodId)}`
        );

        if (response.status === 404) {
            message.textContent = "Food item not found. Check the Food ID.";
            return;
        }

        if (!response.ok) {
            throw new Error("Unable to find the food item.");
        }

        const food = await response.json();

        selectedFoodId = food.food_id;

        document.getElementById("foodName").value = food.food_name;
        document.getElementById("category").value = food.category;
        document.getElementById("price").value = food.price;
        document.getElementById("description").value =
            food.description || "";
        document.getElementById("availability").value =
            String(food.availability);

        updateFoodForm.hidden = false;
        message.textContent = "Food found! Edit the details below.";

    } catch (error) {
        console.error(error);
        message.textContent =
            "Unable to find food. Check that your server is running.";
    }
});

// Save the updated details
updateFoodForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (selectedFoodId === null) {
        message.textContent = "Please find a food item first.";
        return;
    }

    const foodData = {
        food_name: document.getElementById("foodName").value.trim(),
        category: document.getElementById("category").value,
        price: Number(document.getElementById("price").value),
        description: document.getElementById("description").value.trim(),
        availability:
    document.getElementById("availability").value === "1"
        
    };

    if (!foodData.food_name || foodData.price <= 0) {
        message.textContent = "Please enter valid food details.";
        return;
    }

    message.textContent = "Updating food...";

    try {
        const response = await fetch(`/api/food/${selectedFoodId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(foodData)
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
    throw new Error(
        result.message || result.error || "Unable to update food."
    );
}

message.textContent = "Food updated successfully!";
alert("Food updated successfully!");
message.style.color = "green";
message.style.display = "block";
message.scrollIntoView({
    behavior: "smooth",
    block: "center"
});

    } catch (error) {
        console.error(error);
        message.textContent =
            error.message || "Something went wrong while updating.";
    }
});