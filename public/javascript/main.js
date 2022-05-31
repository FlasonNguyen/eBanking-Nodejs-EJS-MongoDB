$(document).ready(function () {
  console.log("main.js loaded");
  $("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });
  $(".changeStatus").click((e) => {
    console.log("clicked");
    let username = e.target.dataset.usn;
    let status = e.target.dataset.status;
    console.log("username: " + username);
    $.ajax({
      url: "/admin/setUserStatus",
      type: "POST",
      data: {
        username,
        status,
      },
    }).then((response) => {
      console.log(response);
    });
  });
  $(".changeTransactionStatus").click((e) => {
    console.log("clicked 2");
    let id = e.target.dataset.id;
    let status = e.target.dataset.status;
    $.ajax({
      url: "/admin/setTransactionStatus",
      type: "POST",
      data: {
        id,
        status,
      },
    }).then((response) => {
      console.log(response);
    });
  });
});
