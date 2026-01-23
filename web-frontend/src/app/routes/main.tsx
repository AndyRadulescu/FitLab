import { Outlet } from 'react-router-dom';
import { Navbar } from '../design/navbar';

export function Main(){
  return (
    <div className="m-4 pb-[90px]">
      <Outlet />
      <Navbar />
    </div>
  )
}
