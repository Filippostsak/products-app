$(document).ready(function () {
  function fetchProducts() {
    $.ajax({
      url: "/api/products",
      type: "GET",
      dataType: "json",
      success: function (response) {
        $("#productRows").empty();

        response.data.forEach(function (product) {
          let row = $("<tr>").appendTo("#productRows");
          $("<td>").text(product.product).appendTo(row);
          $("<td>")
            .text(product.cost + "€")
            .appendTo(row);
          $("<td>").text(product.description).appendTo(row);
          $("<td>").text(product.quantity).appendTo(row);
          $("<td>")
            .html(
              `<div class="d-flex justify-content-around">
                <button class="btn btn-primary btn-sm update-product" data-id="${product._id}">Update</button>
                <button class="btn btn-danger btn-sm delete-product" data-id="${product._id}">Delete</button>
              </div>`
            )
            .appendTo(row);
        });

        $(".update-product").click(function () {
          let productId = $(this).data("id");
          console.log("Update product with ID:", productId);
          window.location.href = "./updateProduct.html?id=" + productId; // Pass product ID as query parameter
        });

        $(".delete-product").click(function () {
          let productId = $(this).data("id");
          console.log("Delete product with ID:", productId);
          let deleteButton = $(this);
          if (confirm("Are you sure you want to delete this product?")) {
            $.ajax({
              url: "/api/products/" + productId,
              type: "DELETE",
              success: function (response) {
                deleteButton.closest("tr").remove();
                console.log("Product deleted successfully:", response);
                fetchProducts();
              },
              error: function (xhr, status, error) {
                console.error("Error deleting product:", error);
              },
            });
          }
        });
      },
      error: function (xhr, status, error) {
        console.error("Error fetching products:", error);
      },
    });
  }
  fetchProducts();

  $("#createProductForm").submit(function (event) {
    event.preventDefault();

    let formData = {
      product: $("#productName").val(),
      cost: $("#cost").val(),
      description: $("#description").val(),
      quantity: $("#quantity").val(),
    };

    $.ajax({
      url: "/api/products",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(formData),
      success: function (response) {
        console.log("Product created:", response);
        showMessage("Product created successfully!", "alert-success");
        $("#createProductForm")[0].reset();
        fetchProducts(); // Fetch products again after creation
      },
      error: function (xhr, status, error) {
        console.error("Error creating product:", error);
        showMessage(
          "Error creating product. Please try again.",
          "alert-danger"
        );
      },
    });
  });

  function showMessage(message, alertType) {
    $(".alert").remove();
    let alert = $("<div>")
      .addClass("alert " + alertType)
      .attr("role", "alert")
      .text(message);
    $("#messageContainer").append(alert);
    setTimeout(function () {
      alert.fadeOut("slow", function () {
        $(this).remove();
      });
    }, 5000);
  }
});
