import TopBanner from "../../components/home/TopBanner";
import Header from "../../components/home/Header";
import HeroSection from "../../components/home/HeroSection";
import FlashSales from "../../components/home/FlashSales";
import FeaturedCategories from "../../components/home/FeaturedCategories";
import TrendingProducts from "../../components/home/TrendingProducts";
import NewArrivals from "../../components/home/NewArrivals";

function Home() {
  return (
    <>
      <TopBanner />
      <Header />
      <HeroSection />
      <FlashSales />
      <FeaturedCategories />
      <TrendingProducts />
      <NewArrivals />
    </>
  );
}

export default Home;