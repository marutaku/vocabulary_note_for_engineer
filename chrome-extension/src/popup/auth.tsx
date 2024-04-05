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
      <div>
        <button onClick={login}>ログインしてください</button>
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
