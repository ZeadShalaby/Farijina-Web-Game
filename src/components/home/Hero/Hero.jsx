import classes from "./Hero.module.css";
import Image from "next/image";
import Link from "next/link";

function Hero() {
  return (
    <section className={classes.main}>
      <Image
        className={classes.logo}
        src="/icons/logo-white.svg"
        alt="logo"
        width="200"
        height="157"
      />
      <h1 className={classes.title}>ادخل فريجك.. وعيش المتعة..</h1>
      <Link
        href="/start-game#start-game-ferjan-section"
        className={classes.playBtn}
      >
        ابدأ اللعب
      </Link>

      {/* ABSOLUTELY POSITIONED */}
      <Image
        className={classes.decorationVector}
        src="/vectors/decoration.svg"
        alt="decoration"
        width="1600"
        height="51"
      />
      <Image
        className={classes.treesVector1}
        src="/vectors/palm-trees-2.svg"
        alt="trees"
        width="425"
        height="590"
      />
      <Image
        className={classes.treesVector2}
        src="/vectors/palm-trees-1.svg"
        alt="trees"
        width="363"
        height="481"
      />
    </section>
  );
}

export default Hero;
