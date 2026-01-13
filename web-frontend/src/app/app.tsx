import { NavLink, Outlet } from 'react-router-dom';


export function App() {


  return (
    <div className="m-4">
      <Outlet />
      {/*<div>*/}
      {/*  <button onClick={() => i18n.changeLanguage('en')}>EN</button>*/}
      {/*  <button onClick={() => i18n.changeLanguage('ro')}>RO</button>*/}
      {/*</div>*/}

      <div className="fixed bottom-2 left-0 w-full px-2">
        <div className="flex justify-evenly items-center h-[60px] bg-gray-800 rounded-full">
          <NavLink to="/dashboard">
            {({ isActive }) => (
              <span
                className={`material-icons text-5xl ${
                  isActive ? 'bg-amber-600 text-white rounded-full p-2' : 'text-white'
                }`}
              >
        send
      </span>
            )}
          </NavLink>

          <NavLink to="/check-in">
            {({ isActive }) => (
              <span
                className={`material-icons text-5xl ${
                  isActive ? 'bg-amber-600 text-white rounded-full p-2' : 'text-white'
                }`}
              >
        add
      </span>
            )}
          </NavLink>

          <NavLink to="/profile">
            {({ isActive }) => (
              <span
                className={`material-icons text-5xl ${
                  isActive ? 'bg-amber-600 text-white rounded-full p-2' : 'text-white'
                }`}
              >
        manage_accounts
      </span>
            )}
          </NavLink>
        </div>
      </div>

    </div>
  );
}

export default App;
