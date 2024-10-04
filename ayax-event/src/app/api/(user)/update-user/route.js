export const PUT = async (respone) => {
  try {
    const userId = request.headers.get("x-user-id");
    const { profilePic, location } = await respone.json();
  } catch (error) {
    console.log(error);
  }
};
