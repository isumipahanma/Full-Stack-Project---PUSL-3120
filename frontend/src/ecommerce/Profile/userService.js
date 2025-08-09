import Axios from "axios";

export const fetchpurchaseData = async () => {
  try {
    const response = await Axios.get("http://localhost:3001/api/purchase");
    // console.log("Fetched purchase data:", response.data); // Log entire response for debugging
    return response.data; // Adjust return to match the correct structure
  } catch (error) {
    console.error("Error fetching purchase data:", error);
    return [];
  }
};
