import {IconWithText} from '../../components/IconWithText/IconWithText';
import { FaHome } from "react-icons/fa";
import { MdOutlineSubscriptions } from "react-icons/md";
import { RiPlayList2Fill } from "react-icons/ri";
import { MdOutlineHistory } from "react-icons/md";
import { GrLike } from "react-icons/gr";
import style1 from './Sidebar.module.css';


const Sidebar = () => {
  return (
    <div className={style1.Sidebar}>

      <IconWithText icon={FaHome} text="Home" />
      <IconWithText icon={MdOutlineSubscriptions} text="Subscriptions" />
      <IconWithText icon={RiPlayList2Fill} text="Playlist" />
      <IconWithText icon={MdOutlineHistory} text="History" />
      <IconWithText icon={GrLike} text="Liked Videos" />

    </div>
  );
};

export default Sidebar;
