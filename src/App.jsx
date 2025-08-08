import { AppRoute } from "./routes/AppRoute";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <AppRoute />
      </main>
    </div>
  );
}

export default App;
