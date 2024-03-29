$(document).ready(function () {
  $(".btnReset").click(function () {
    $("#frmUser")[0].reset();
    $(".alert").hide();
  });
  $(".btnSubmit").click(function (event) {
    event.preventDefault();
    createUser();
  });
});
function createUser() {
  const apiUrl = "http://localhost:3000/api/users";
  const userData = {
    username: $("#username").val().trim().toLowerCase(),
    password: $("#password").val(),
    name: $("#name").val(),
    surname: $("#surname").val(),
    email: $("#email").val(),
    address: {
      area: $("#area").val(),
      road: $("#road").val(),
    },
    phone: [
      {
        type: "Mobile",
        number: $("#mobilePhone").val(),
      },
    ],
  };
  $.ajax({
    url: apiUrl,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(userData),
    success: function (response) {
      displayAlert("User created successfully!", "success");
      $("#frmUser")[0].reset();
    },
    error: function (xhr, status, error) {
      let errorMsg =
        xhr.responseJSON && xhr.responseJSON.error
          ? xhr.responseJSON.error
          : "Failed to create user";
      displayAlert(errorMsg, "danger");
    },
  });
}
function displayAlert(message, type) {
  const alertDiv = $(".alert");
  alertDiv
    .html(message)
    .removeClass("alert-success alert-danger")
    .addClass(`alert-${type}`)
    .show();
  setTimeout(() => {
    alertDiv.hide();
  }, 5000);
}
