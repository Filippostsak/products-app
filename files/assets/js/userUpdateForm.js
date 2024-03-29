$(document).ready(function () {
  const queryParams = new URLSearchParams(window.location.search);
  const username = queryParams.get("username");
  if (username) {
    fetchUserData(decodeURIComponent(username));
  } else {
    console.error("No username provided.");
    window.location.href = "userList.html";
  }
  $("#updateUserForm")
    .off("submit")
    .on("submit", function (event) {
      event.preventDefault();
      submitUpdateForm(decodeURIComponent(username));
    });
});
function fetchUserData(username) {
  const apiUrl = "http://localhost:3000/api/users";
  $.ajax({
    url: `${apiUrl}/${encodeURIComponent(username)}`,
    type: "GET",
    dataType: "json",
    success: function (response) {
      const user = response.data;
      $("#name").val(user.name);
      $("#surname").val(user.surname);
      $("#email").val(user.email);
      if (user.address) {
        $("#area").val(user.address.area);
        $("#road").val(user.address.road);
      }
      if (user.phone && user.phone.length > 0) {
        $("#phoneNumber").val(user.phone[0].number);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching user data:", status, error);
      displayAlert("Error fetching user data: " + error, "danger");
    },
  });
}

function submitUpdateForm(username) {
  const apiUrl = "http://localhost:3000/api/users";
  const updatedUserData = {
    name: $("#name").val(),
    surname: $("#surname").val(),
    email: $("#email").val(),
    address: {
      area: $("#area").val(),
      road: $("#road").val(),
    },
    phone: [
      {
        number: $("#phoneNumber").val(),
      },
    ],
  };

  $.ajax({
    url: `${apiUrl}/${encodeURIComponent(username)}`,
    type: "PATCH",
    contentType: "application/json",
    data: JSON.stringify(updatedUserData),
    success: function (response) {
      displayAlert("User updated successfully!", "success");
      setTimeout(function () {
        window.location.href = "find.html";
      }, 2000);
    },
    error: function (xhr, status, error) {
      displayAlert("Error updating user: " + error, "danger");
    },
  });
}

function displayAlert(message, type) {
  const alertDiv = $("#updateAlert");
  alertDiv.text(message).addClass(`alert-${type}`).show();
  setTimeout(function () {
    alertDiv.hide().removeClass(`alert-${type}`);
  }, 5000);
}
