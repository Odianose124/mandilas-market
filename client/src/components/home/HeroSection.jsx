import CategoryMenu from "./CategoryMenu";
import HeroSlider from "./HeroSlider";
import PromoCards from "./PromoCards";

function HeroSection() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 mt-5">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Categories */}

        <div className="lg:col-span-3">
          <CategoryMenu />
        </div>

        {/* Hero Slider */}

        <div className="lg:col-span-6">
          <HeroSlider />
        </div>

        {/* Promo Cards */}

        <div className="lg:col-span-3">
          <PromoCards />
        </div>

      </div>

    </section>
  );
}

export default HeroSection;