import style from './Icon-with-Text.module.css';
import {Link} from "react-router-dom";

export const IconWithText = ({ icon: Icon, text, ...props }) => {
  return (

     <div className={`${style.iconWithText}`} {...props}>
      <Link  to={`/${text.toLowerCase().trim()} `} >
        <Icon className={style.icon}/>
        <span className={style.text}>{text}</span>
      </Link>
      </div>

  );
};




