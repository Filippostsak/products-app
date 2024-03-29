$(document).ready(function () {
  // Function to fetch product details by ID
  function fetchProductById(productId) {
    $.ajax({
      url: "/api/products/" + productId,
      type: "GET",
      dataType: "json",
      success: function (response) {
        // Populate form fields with product details
        $("#productName").val(response.product);
        $("#cost").val(response.cost);
        $("#description").val(response.description);
        $("#quantity").val(response.quantity);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching product details:", error);
      },
    });
  }

  // Function to display notification
  function showNotification(message, alertType, redirectUrl = null) {
    // Create dynamic Bootstrap alert div
    let alertDiv = $("<div>")
      .addClass("alert " + alertType)
      .attr("role", "alert")
      .text(message);
    // Append alert div to container
    $("#notificationContainer").append(alertDiv);
    // Hide alert after 2 seconds
    setTimeout(function () {
      alertDiv.fadeOut("slow", function () {
        $(this).remove();
        // Redirect to provided URL after timeout
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      });
    }, 2000);
  }

  // Check if the URL contains a product ID parameter
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  // If a product ID is found in the URL, fetch its details
  if (productId) {
    fetchProductById(productId);
  }

  // Submit the update product form
  $("#updateProductForm").submit(function (event) {
    event.preventDefault();

    let formData = {
      product: $("#productName").val(),
      cost: $("#cost").val(),
      description: $("#description").val(),
      quantity: $("#quantity").val(),
    };

    // Send PATCH request to update the product
    $.ajax({
      url: "/api/products/" + productId, // Use the product ID in the URL
      type: "PATCH",
      contentType: "application/json",
      data: JSON.stringify(formData),
      success: function (response) {
        console.log("Product updated:", response);
        showNotification(
          "Product updated successfully!",
          "alert-success",
          "../product/showProducts.html"
        );
      },
      error: function (xhr, status, error) {
        console.error("Error updating product:", error);
        showNotification(
          "Error updating product. Please try again.",
          "alert-danger"
        );
      },
    });
  });
});
