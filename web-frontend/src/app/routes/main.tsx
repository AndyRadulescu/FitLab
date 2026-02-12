import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/navbar';

export function Main(){
  return (
    <div className="m-4 pb-[90px]">
      <Outlet />
      <Navbar />
    </div>
  )
}
