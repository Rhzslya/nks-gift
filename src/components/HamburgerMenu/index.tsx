interface HamburgerMenuProps {
  handleBurgerClick: () => void;
  isBurgerOpen: boolean;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  handleBurgerClick,
  isBurgerOpen,
}) => {
  return (
    <div className="lg:hidden hamburger-button ml-2">
      <button
        className="flex flex-col gap-1 justify-center items-center"
        onClick={handleBurgerClick}
      >
        <div
          className={`bg-white rounded-sm transition-transform ${
            isBurgerOpen
              ? "rotate-45 translate-y-[6px] w-[24px] h-[2px]"
              : "w-[28px] h-[3px]"
          }`}
        ></div>
        <div
          className={`w-[30px] h-[2px] bg-white rounded-sm ${
            isBurgerOpen ? "opacity-0" : ""
          }`}
        ></div>
        <div
          className={`bg-white rounded-sm transition-transform ${
            isBurgerOpen
              ? "-rotate-45 translate-y-[-6px] w-[24px] h-[2px]"
              : "w-[28px] h-[3px]"
          }`}
        ></div>
      </button>
    </div>
  );
};

export default HamburgerMenu;
