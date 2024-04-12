import { Auth } from "firebase/auth";
import { getAuth } from "firebase/auth/web-extension";
import axios from "axios";

class APIClient {
  private auth: Auth;
  private baseURL: string;
  constructor() {
    this.auth = getAuth();
    this.baseURL = import.meta.env.VITE_API_BASE_URL;
  }

  async searchWord(word: string) {
    const path = "/search"
    const url = `${this.baseURL}${path}?word=${word}`;
    return this.sendGetRequest(url, { word });
  }

  async sendGetRequest<R>(url: string, params: { [key in string]: string }): Promise<R> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error("User is not logged in");
    }
    const response = await axios.get(url, {
      params,
      headers: {
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
    });
    if (response.status !== 200) {
      throw new Error(`Request failed with status code ${response.status}`);
    }
    return JSON.parse(response.data);
  }
}