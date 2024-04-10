import { User, UserCredential } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import { initializeFirebase, loginWithGoogleLoginCredential } from '../firebase';
import { getAuth } from 'firebase/auth/web-extension';

const AuthContext = createContext<{
  loginUser: User | null;
  logout: () => void;
}>({
  loginUser: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logout: () => {},
});
initializeFirebase();

export const AuthContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [loginUser, setLoginUser] = useState<User | null>(null);
  const loggedIn = loginUser !== null;
  const auth = getAuth();
  useEffect(() => {
    // auth 初期化時にログインユーザ設定
    auth.onAuthStateChanged((user) => {
      setLoginUser(user);
      setLoading(false);
    });
  }, []);

  const login = async () => {
    await chrome.runtime.sendMessage(
      { type: 'login' },
      async ({ user }: { type: string; user: UserCredential | undefined }) => {
        if (user) {
          await loginWithGoogleLoginCredential(user);
        }
      }
    );
  };

  const logout = async () => {
    await auth.signOut();
    await chrome.runtime.sendMessage({ type: 'logout' });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!loggedIn) {
    return (
      <div className="flex justify-center m-4">
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-80"
          onClick={login}
        >
          ログインしてください
        </button>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        loginUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node,
};

export const useAuth = () => {
  return useContext(AuthContext);
};
