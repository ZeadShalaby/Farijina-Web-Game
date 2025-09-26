import Image from "next/image";
import classes from "./Clue.module.css";

function Clue({ type, children }) {
  const isDirection = type === "direction";

  return (
    <div className={classes.main}>
      {isDirection && (
        <span className={classes.arrow}>
          <Image
            src="/vectors/solar_arrow-up-outline2.png"
            alt="arrow left"
            width={20}
            height={20}
          />
        </span>
      )}

      <span className={classes.clue}>
        {typeof children === "string"
          ? children.slice(0, 16)
          : String(children).slice(0, 16)}
      </span>

      {isDirection && (
        <span className={classes.arrow}>
          <Image
            src="/vectors/solar_arrow-up-outline.png"
            alt="arrow right"
            width={20}
            height={20}
          />
        </span>
      )}
    </div>
  );
}

export default Clue;
