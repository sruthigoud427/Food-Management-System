const addFoodForm = document.getElementById("addFoodForm");
const message = document.getElementById("formMessage");

addFoodForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const food_name = document.getElementById("foodName").value.trim();
    const category = document.getElementById("category").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const availability = document.getElementById("availability").value === "1";

    if (!food_name || !category || price === "") {
        message.textContent = "Please fill in all required fields.";
        message.style.color = "red";
        return;
    }

    try {
        message.textContent = "Adding food...";
        message.style.color = "#173d35";

        const response = await fetch("/api/food", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                food_name: food_name,
                category: category,
                price: Number(price),
                description: description,
                availability: availability
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Unable to add food.");
        }

        message.textContent = "Food item added successfully!";
        alert("Food added successfully!");

        message.style.color = "green";

        addFoodForm.reset();

        console.log("Food added successfully:", result);

    } catch (error) {
        console.error("Add food error:", error);
        message.textContent = error.message;
        message.style.color = "red";
    }
});