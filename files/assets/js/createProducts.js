$(document).ready(function () {
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
        setTimeout(function () {
          location.reload();
        }, 3000);
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
    let alert = $("<div>")
      .addClass("alert " + alertType)
      .attr("role", "alert")
      .text(message);
    $("#messageContainer").empty().append(alert);
    setTimeout(function () {
      alert.fadeOut("slow", function () {
        $(this).remove();
      });
    }, 5000);
  }
});
