import { useAuth } from './auth';

export const Popup = () => {
  const { logout, loginUser } = useAuth();
  return (
    <div>
      <h1>Popup</h1>
      <h3>{loginUser ? `ログイン中: ${loginUser.displayName}` : '未ログイン'}</h3>
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-80"
        onClick={logout}
      >
        ログアウト
      </button>
    </div>
  );
};

export default Popup;
