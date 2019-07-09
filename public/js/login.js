$("#login").on("click", e => {
  e.preventDefault();
  const username = $("#username").val();
  const password = $("#password").val();

  $.post(`${window.location.origin}/user/getToken`, { username, password })
    .done(data => {
      localStorage.setItem("token", `Bearer ${data.access_token}`);
      localStorage.setItem("refreshToken", data.refresh_token);
      $("#loginForm").submit();
    })
    .fail(() => {
      alert("Mauvaise combinaison identifiant/password");
    });
});
