const apiUrl = "http://localhost:3000/api/users";
$(document).ready(function () {
  fetchAndDisplayUsers();
});
function fetchAndDisplayUsers() {
  $.ajax({
    url: apiUrl,
    type: "GET",
    dataType: "json",
    success: function (response) {
      const users = response.data;
      $("#userTable tbody").empty();
      users.forEach((user) => {
        const userAddress = user.address
          ? `${user.address.area} ${user.address.road}`
          : "";
        const userPhone =
          user.phone && user.phone.length > 0 ? user.phone[0].number : "";
        const encodedUsername = encodeURIComponent(user.username);
        const userRow = `
          <tr id="row-${encodedUsername}">
            <td>${user.username}</td>
            <td>${user.name || ""}</td>
            <td>${user.surname || ""}</td>
            <td>${user.email}</td>
            <td>${userAddress}</td>
            <td>${userPhone}</td>
            <td>
              <button class="btn btn-primary btn-sm" onclick="updateUser('${encodedUsername}')">Update</button>
              <button class="btn btn-danger btn-sm" onclick="deleteUser('${encodedUsername}')">Delete</button>
            </td>
          </tr>
        `;
        $("#userTable tbody").append(userRow);
      });
    },
    error: function (xhr, status, error) {
      console.error("Error fetching users:", status, error);
    },
  });
}
function updateUser(encodedUsername) {
  window.location.href = `updateForm.html?username=${encodedUsername}`;
}
function deleteUser(encodedUsername) {
  const username = decodeURIComponent(encodedUsername);
  console.log("Delete user with username:", username);

  if (!confirm(`Are you sure you want to delete the user ${username}?`)) {
    return;
  }
  $.ajax({
    url: `${apiUrl}/${encodedUsername}`,
    type: "DELETE",
    success: function (response) {
      $(`#row-${encodedUsername}`).remove();
      console.log("User deleted successfully:", username);
    },
    error: function (xhr, status, error) {
      console.error("Error deleting user:", status, error);
    },
  });
}
