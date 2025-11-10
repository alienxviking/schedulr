import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="flex h-screen w-full flex-col bg-gray-900">
      {/* We could add a Navbar here later */}
      <main className="flex-grow">
        <Outlet /> {/* This is where our pages will be rendered */}
      </main>
    </div>
  )
}

export default App