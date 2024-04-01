$(document).ready(function () {
  function fetchProductById(productId) {
    $.ajax({
      url: "/api/products/" + productId,
      type: "GET",
      dataType: "json",
      success: function (response) {
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

  function showNotification(message, alertType, redirectUrl = null) {
    let alertDiv = $("<div>")
      .addClass("alert " + alertType)
      .attr("role", "alert")
      .text(message);
    $("#notificationContainer").append(alertDiv);
    setTimeout(function () {
      alertDiv.fadeOut("slow", function () {
        $(this).remove();
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      });
    }, 2000);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (productId) {
    fetchProductById(productId);
  }

  $("#updateProductForm").submit(function (event) {
    event.preventDefault();

    let formData = {
      product: $("#productName").val(),
      cost: $("#cost").val(),
      description: $("#description").val(),
      quantity: $("#quantity").val(),
    };

    $.ajax({
      url: "/api/products/" + productId,
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
