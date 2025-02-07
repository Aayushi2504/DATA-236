"use strict";

// Closure to track the submission count
const submissionCounter = (() => {
    let count = 0;
    return () => ++count;
})();

// Function to validate the form before submission
const validateForm = () => {
    const content = document.getElementById("content").value.trim();
    const termsChecked = document.getElementById("terms").checked;

    if (content.length <= 25) {
        alert("Blog content should be more than 25 characters.");
        return false;
    }
    if (!termsChecked) {
        alert("You must agree to the terms and conditions.");
        return false;
    }
    return true;
};

// Simulated async saving process
const saveBlogToServer = (blogData) => {
    return new Promise((resolve, reject) => {
        console.log("Saving blog to server...");
        setTimeout(() => {
            const success = Math.random() > 0.2;  // 80% success rate
            if (success) {
                resolve(`Blog "${blogData.title}" saved successfully!`);
            } else {
                reject("Failed to save the blog. Please try again.");
            }
        }, 2000);
    });
};

// Function to handle form submission
document.getElementById("blogForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    if (!validateForm()) return; // Stop if validation fails

    // Collect form data
    const blogData = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        email: document.getElementById("email").value,
        content: document.getElementById("content").value,
        category: document.getElementById("category").value,
    };

    // Convert to JSON string
    const jsonData = JSON.stringify(blogData);
    console.log("Blog Data (JSON):", jsonData);

});
