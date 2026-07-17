const testAPI = async () => {
  try {
    const invalidRes = await fetch('http://127.0.0.1:5000/api/v1/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    console.log("Invalid Response Status:", invalidRes.status);
    console.log("Invalid Response Body:", await invalidRes.json());

    const validRes = await fetch('http://127.0.0.1:5000/api/v1/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: "John Doe",
        email: "john@example.com",
        subject: "Hello there",
        message: "This is a valid message that is longer than 10 characters."
      })
    });
    console.log("Valid Response Status:", validRes.status);
    console.log("Valid Response Body:", await validRes.json());

  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    process.exit(0);
  }
};
testAPI();
