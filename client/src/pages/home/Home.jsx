import Featured from "../../components/featured/Featured";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import Footer from "../../components/footer/Footer";
import HeroHeader from "../../components/heroHeader/HeroHeader";
import MailList from "../../components/mailList/MailList";
import Navbar from "../../components/navbar/Navbar";
import PropertyList from "../../components/propertyList/PropertyList";
import "./home.css";

const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroHeader />
      <div className="homeContainer">
        <Featured />
        <h1 className="homeTitle">Featured Properties</h1>
        <FeaturedProperties />
        <h1 className="homeTitle">Browse by property type</h1>
        <PropertyList />
        <MailList />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
