const foodTableBody = document.getElementById("foodTableBody");
const tableMessage = document.getElementById("tableMessage");

async function loadFoodItems() {
    try {
        const response = await fetch("/api/food");

        if (!response.ok) {
            throw new Error("Unable to fetch food items.");
        }

        const foodItems = await response.json();

        foodTableBody.innerHTML = "";

        if (foodItems.length === 0) {
            foodTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="table-message">
                        No food items found.
                    </td>
                </tr>
            `;
            return;
        }

        foodItems.forEach(food => {
            const row = document.createElement("tr");

            const values = [
                food.food_id,
                food.food_name,
                food.category,
                `₹${food.price}`,
                food.description || "No description"
            ];

            values.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            const statusCell = document.createElement("td");
            const status = document.createElement("span");

            const isAvailable =
    food.availability === true ||
    food.availability === 1 ||
    food.availability === "1";

status.className = isAvailable
    ? "food-status available"
    : "food-status unavailable";

status.textContent = isAvailable
    ? "Available"
    : "Unavailable";

            statusCell.appendChild(status);
            row.appendChild(statusCell);

            foodTableBody.appendChild(row);
        });

        tableMessage.textContent =
            `Total food items: ${foodItems.length}`;
           
    } catch (error) {
        console.error(error);

        foodTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="table-message">
                    Could not load food items. Check whether the server is running.
                </td>
            </tr>
        `;
    }
}

loadFoodItems();