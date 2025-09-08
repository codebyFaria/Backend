import styles from "./Home.module.css";
import {Navbar,Sidebar} from "../../components/index.js"
import { useState,useEffect } from "react";

      
const Home = () => {

const [videos, setVideos] = useState([]);

useEffect(() => {
  const fetchVideos = async () => {
    try {
     const response = await fetch("http://localhost:8000/api/videos/getAllvideos");
      const data = await response.json();
      console.log(data);
      setVideos(data);
    } catch (error) {
      console.log("Error fetching videos:", error);
    }
  };

  fetchVideos();
}, []);


  return (
    <div>
      <Navbar />
      <div className={styles.homePage}>
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        <div className={styles.content}>
         
        </div>
      </div>
    </div>
  );
};

export default Home;