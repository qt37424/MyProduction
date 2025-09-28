export const authService = {
    async login(credentials) {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) {
        throw new Error("Login failed");
  
    }
    return await response.json();
  },
};
// => vẫn đang ko xài