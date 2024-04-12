import { Auth } from "firebase/auth";
import { getAuth } from "firebase/auth/web-extension";
import axios from "axios";
import { initializeFirebase } from "../firebase";

initializeFirebase();

export class APIClient {
  private auth: Auth;
  private baseURL: string;
  constructor() {
    this.auth = getAuth();
    this.baseURL = import.meta.env.VITE_API_BASE_URL;
  }

  async searchWord(word: string) {
    const path = "/words/search"
    const url = `${this.baseURL}${path}`;
    return this.sendGetRequest(url, { word });
  }

  async sendGetRequest<R>(url: string, params: { [key in string]: string }): Promise<R> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error("User is not logged in");
    }
    const idToken = await user.getIdToken();
    const response = await fetch(`${url}?${new URLSearchParams(params)}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`);
    }
    return response.json();
  }
}