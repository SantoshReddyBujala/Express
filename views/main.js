const submit = async () => {
  const uname = document.getElementById("username").value;
  const pwd = document.getElementById("password").value;
  console.log(`${uname}  ${pwd}`);
  try {
    const response = await fetch("http://localhost:3500/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ uname, pwd }),
    });
    if (!response.ok) {
      if (response.status === 401) {
        return await sendRefreshToken();
      }
      throw new Error(`${response.status}  ${response.statusText}`);
    }
  } catch (err) {
    console.log(err.stack);
   // displayErr();
  }
};
