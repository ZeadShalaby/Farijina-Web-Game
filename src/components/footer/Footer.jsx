import classes from "./Footer.module.css";
import Image from "next/image";

function Footer() {
  return (
    <footer className={classes.main}>
      <Image src="/icons/logo.svg" alt="logo" width="79" height="60" />

      <div className={classes.socials}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://play.google.com/store/apps/details?id=com.freejna.app"
          className={classes.socialLink}
        >
          <Image
            src="/icons/android.svg"
            alt="android"
            width="40"
            height="40"
          />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://apps.apple.com/kw/app/freejna-%D9%81%D8%B1%D9%8A%D8%AC%D9%86%D8%A7/id6741396213"
          className={classes.socialLink}
        >
          <Image src="/icons/apple.svg" alt="apple" width="40" height="40" />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.instagram.com/freejnakw?igsh=dGU5dzgzcnowdTd5"
          className={classes.socialLink}
        >
          <Image
            src="/icons/instagram.svg"
            alt="instagram"
            width="40"
            height="40"
          />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.tiktok.com/@freejnakw_?_t=ZS-8xYPBCLViLg&_r=1"
          className={classes.socialLink}
        >
          <Image src="/icons/tiktok.svg" alt="tiktok" width="40" height="40" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
