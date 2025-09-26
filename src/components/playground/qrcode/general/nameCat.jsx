"use client";

import classes from "./NameCat.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";


function NameCat({ children, href, className, isAnswered, categoryID, onClick }) {
  const router = useRouter();

  return (
    <span
      className={`${classes.main} ${
        isAnswered ? classes.answered : ""
      } ${className}`}
      style={{ cursor: href ? "pointer" : "initial" }}
      onClick={onClick}
    >
      {/* <span className={classes.name} >{children}</span> */}
        <img src={children?.image} className={classes.barItemImage} alt={children?.title || ""} />
         <span className={classes.barItemText}>{children?.title}</span> 
    </span>
  );
}

export default NameCat;
