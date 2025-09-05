import {Button} from './components/Button/Button'
import { IconWithText } from './components/IconWithText/IconWithText';
import { FaHome } from "react-icons/fa";
import {Navbar} from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { BrowserRouter } from 'react-router';
import VideoCard from './components/VideoCard/VideoCard';

function App() {

  return (
    <BrowserRouter router='router'>
      <Navbar />
      <Sidebar />
    </BrowserRouter>
    
  )
}

export default App
