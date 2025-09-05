import {Link} from "react-router-dom";
import style from './VideoCard.module.css';

const VideoCard = ({$id, title, thumbnail}) => {
  return (
    <Link to={`/video/${$id}`}>
      <div className={style.videoCard}>
        <img src={thumbnail} alt={title} />
        <h3>{title}</h3>
      </div>
    </Link>
  );
};

export default VideoCard;