"use client";

import { useContext, useState, useRef, useEffect } from "react";
import classes from "./YamaatGame.module.css";

// 🟢 Components
import Title from "../../general/SecTitle";
import Search from "./Search";
import CategoriesSet from "./CategoriesSet";
import CatCard from "./CatCard";
import TeamsInfo from "../general/TeamsInfo/TeamsInfo";
import LoadingSpinner from "../../general/LoadingSpinner";

// 🟢 Contexts
import StartGameContext from "@/store/start-game-ctx";
import GeneralContext from "@/store/general-ctx";

function YamaatGame({ show }) {
  const { yamaatCategories, loadingYamaatCategories, startGame } =
    useContext(StartGameContext);
  const { confirmingAuth, showNotification } = useContext(GeneralContext);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [leftBarCategories, setLeftBarCategories] = useState([]);
  const [rightBarCategories, setRightBarCategories] = useState([]);
  const [searchResults, setSearchResults] = useState({
    categoriesNormal: [],
    categoriesPremium: [],
  });
  const [searchingCategories, setSearchingCategories] = useState(false);

  const categoriesSectionRef = useRef(null);
  const teamsInfoRef = useRef(null);

  // حالة ظهور الشريطين حسب التمرير
  const [showSideBars, setShowSideBars] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!categoriesSectionRef.current) return;

      const rect = categoriesSectionRef.current.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;

      // إذا قسم الفئات ظاهر في الشاشة
      if (rect.top < windowHeight && rect.bottom > 0) {
        setShowSideBars(true);
      } else {
        setShowSideBars(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleToggleCategory = (categoryID, categoryData) => {
    let newSelectedCategories = [...selectedCategories];

    if (newSelectedCategories.includes(categoryID)) {
      // إزالة العنصر
      newSelectedCategories = newSelectedCategories.filter(
        (id) => id !== categoryID
      );
      setLeftBarCategories(
        leftBarCategories.filter((cat) => cat.id !== categoryID)
      );
      setRightBarCategories(
        rightBarCategories.filter((cat) => cat.id !== categoryID)
      );
    } else {
      if (newSelectedCategories.length === 6) return;

      newSelectedCategories.push(categoryID);

      // ✅ أول عنصر يروح يمين، وبعدين توزع بالتوازن
      if (rightBarCategories.length <= leftBarCategories.length) {
        setRightBarCategories([...rightBarCategories, categoryData]);
      } else {
        setLeftBarCategories([...leftBarCategories, categoryData]);
      }
    }

    setSelectedCategories(newSelectedCategories);
  };

  const handleSearchCategories = (searchQuery) => {
    let normalCategoriesResults = [],
      premiumCategoriesResults = [];

    if (searchQuery.length) {
      setSearchingCategories(true);

      normalCategoriesResults = yamaatCategories.categoriesNormal.filter(
        (cat) => cat.title.includes(searchQuery)
      );
      premiumCategoriesResults = yamaatCategories.categoriesPremium.filter(
        (cat) => cat.title.includes(searchQuery)
      );
    } else {
      setSearchingCategories(false);
    }

    setSearchResults({
      categoriesNormal: normalCategoriesResults,
      categoriesPremium: premiumCategoriesResults,
    });
  };

  const handleStartGame = (teamsData) => {
    if (selectedCategories.length < 6) {
      showNotification("يجب اختيار 6 فئات لتبدأ اللعب", "error");
      return;
    }

    const allData = {
      selectedCategories,
      teamsData,
    };

    startGame(allData, teamsData.gameType);
  };

  const scrollToTeamsInfo = () => {
    if (teamsInfoRef.current) {
      teamsInfoRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (loadingYamaatCategories || confirmingAuth) {
    return <LoadingSpinner fullscreen />;
  }

  // ✅ شرط ظهور الشريطين: يظهروا فقط لو داخل قسم الفئات **وأيضًا** فيه عناصر مختارة على الأقل
  const shouldShowSideBars =
    showSideBars &&
    (leftBarCategories.length > 0 || rightBarCategories.length > 0);

  // ✅ السهم يظهر فقط لما يكمل 6 اختيارات
  const shouldShowArrow = selectedCategories.length === 6;

  return (
    <section className={`${classes.main} ${show ? classes.show : ""}`}>
      <Title>حدد الفئات</Title>
      <p className={classes.description}>
        فريج اليمعات عبارة عن إن كل فريق يختار ٣ فئات، ليصبح المجموع ٦ فئات فيها
        ٣٦ سؤال متنوع...
      </p>

      <Search onSearch={handleSearchCategories} />

      <div ref={categoriesSectionRef}>
        <CategoriesSet
          title="الفئات الحصرية"
          titleBackColor="var(--color-back-orange)"
        >
          {(searchingCategories
            ? searchResults.categoriesPremium
            : yamaatCategories.categoriesPremium
          ).map((cat) => (
            <CatCard
              key={cat.id}
              image={cat.image}
              title={cat.title}
              description={cat.description}
              gamesNumber={cat.number_games}
              onClick={
                cat.is_draft
                  ? undefined
                  : () => handleToggleCategory(cat.id, cat)
              }
              isActive={selectedCategories.includes(cat.id)}
              isDisabled={
                !selectedCategories.includes(cat.id) &&
                selectedCategories.length === 6
              }
              ranOut={cat.number_games === 0}
              endAt={cat.end_at}
              isDraft={cat.is_draft}
            />
          ))}
        </CategoriesSet>

        <CategoriesSet
          title="فئات فريجنا"
          titleBackColor="var(--color-back-yellow)"
          isCardsSmall
        >
          {(searchingCategories
            ? searchResults.categoriesNormal
            : yamaatCategories.categoriesNormal
          ).map((cat) => (
            <CatCard
              key={cat.id}
              isSmall
              image={cat.image}
              title={cat.title}
              description={cat.description}
              gamesNumber={cat.number_games}
              onClick={() => handleToggleCategory(cat.id, cat)}
              isActive={selectedCategories.includes(cat.id)}
              isDisabled={
                !selectedCategories.includes(cat.id) &&
                selectedCategories.length === 6
              }
              ranOut={cat.number_games === 0}
            />
          ))}
        </CategoriesSet>
      </div>

      {/* sideBarsContainer يظهر/يختفي مع transition */}
      <div
        className={`${classes.sideBarsContainer} ${
          shouldShowSideBars ? classes.visible : classes.hidden
        }`}
      >
        {/* الشريط اليمين */}
        <div className={classes.sideBar}>
          <div className={classes.barContent} id="rightBar">
            {rightBarCategories.map((cat) => (
              <div key={cat.id} className={classes.barItem}>
                <button
                  className={classes.removeBtn}
                  onClick={() => handleToggleCategory(cat.id, cat)}
                >
                  ×
                </button>
                <img src={cat.image} alt={cat.title} />
                <span className={classes.barItemText}>{cat.title}</span>
              </div>
            ))}
          </div>
          {shouldShowArrow && rightBarCategories.length > 0 && (
            <div className={classes.scrollButton} onClick={scrollToTeamsInfo}>
              ↓
            </div>
          )}
        </div>

        {/* الشريط الشمال يظهر بس لو فيه عناصر */}
        {leftBarCategories.length > 0 && (
          <div className={classes.sideBar}>
            <div className={classes.barContent} id="leftBar">
              {leftBarCategories.map((cat) => (
                <div key={cat.id} className={classes.barItem}>
                  <button
                    className={classes.removeBtn}
                    onClick={() => handleToggleCategory(cat.id, cat)}
                  >
                    ×
                  </button>
                  <img src={cat.image} alt={cat.title} />
                  <span className={classes.barItemText}>{cat.title}</span>
                </div>
              ))}
            </div>
            {shouldShowArrow && (
              <div className={classes.scrollButton} onClick={scrollToTeamsInfo}>
                ↓
              </div>
            )}
          </div>
        )}
      </div>

      <div ref={teamsInfoRef}>
        <TeamsInfo
          gameMode="yamaat"
          playgroundUrl="/yamaat-playground"
          onSubmit={handleStartGame}
        />
      </div>
    </section>
  );
}

export default YamaatGame;
