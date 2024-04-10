export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col w-96 max-h-96">
      <header className="bg-blue-700 text-white text-center py-2">
        <h1 className="text-lg font-bold">Vocabulary Note for Engineers</h1>
      </header>
      <main className="flex-1 overflow-y-auto px-4 py-2">{children}</main>
    </div>
  );
};
