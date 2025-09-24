import { useRouter } from "next/navigation";
import Image from "next/image"; // ✅ لازم
import classes from "./Clue.module.css";

function Clue({ children }) {
  const router = useRouter();

  return (
    <div className={classes.main}>
      <span className={classes.arrow}>
        <Image
          src="/vectors/solar_arrow-up-outline2.png"
          alt="arrow left"
          width={20}
          height={20}
          
        />
      </span>

      <span className={classes.clue}>{children}</span>

      <span className={classes.arrow}>
        <Image
          src="/vectors/solar_arrow-up-outline.png"
          alt="arrow right"
          width={20}
          height={20}
        />
      </span>
    </div>
  );
}

export default Clue;
