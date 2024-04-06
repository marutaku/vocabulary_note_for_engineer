import { GoogleAuthProvider, getAuth, User, signInWithPopup, signOut } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import { initializeFirebase } from '../firebase';

const AuthContext = createContext<{
  loginUser: User | null;
  logout: () => void;
} | null>(null);

initializeFirebase();

const provider = new GoogleAuthProvider();
const auth = getAuth();
auth.languageCode = 'ja';

export const AuthContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [loginUser, setLoginUser] = useState<User | null>(null);
  useEffect(() => {
    // auth 初期化時にログインユーザ設定
    auth.onAuthStateChanged((user) => setLoginUser(user));
  }, []);

  const login = async () => {
    console.log('onclick');
    const result = await signInWithPopup(auth, provider);
    setLoginUser(result.user);
  };

  const logout = async () => {
    await signOut(auth);
    setLoginUser(null);
  };

  if (loginUser === null) {
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

export const AuthContextConsumer = () => {
  return useContext(AuthContext);
};
