import useFetch from "../../hooks/useFetch";
import "./featured.css";
import { useNavigate } from "react-router-dom";

const Featured = () => {
  const { data, loading, error } = useFetch(
    "api/hotels/countByCity?cities=dubai,paris,london,marrakech,miami,madrid"
  );

  const navigate = useNavigate();

  const handleFeaturedItemClick = (city) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    navigate("/hotels", {
      state: {
        destination: city,
        dates: [
          {
            startDate: tomorrow,
            endDate: dayAfterTomorrow,
            key: "selection",
          },
        ],
        options: { adult: 2, children: 0, room: 1 },
      },
    });
  };

  return (
    <>
      <h1 className="featuredt">Popular Destinations</h1>

      <div className="featured">
        {loading ? (
          "Loading please wait"
        ) : (
          <>
            <div
              className="featuredItem"
              onClick={() => handleFeaturedItemClick("Dubai")}
            >
              <img
                src="https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcS8zMUYj-IqHmrbo--DRcNHjy6p-NCEB4HNuNjpdAKkMToANcMK9G9zwKJYT7dUBI4Aj416Pk2V0sc23UYgyqfr9w4TAwdhOwvhVvavfw"
                alt="Dubai"
                className="featuredImg"
              />
              <div className="featuredTitles">
                <h1>Dubai</h1>
                <h2>{data[0]} properties</h2>
              </div>
            </div>

            <div
              className="featuredItem"
              onClick={() => handleFeaturedItemClick("Paris")}
            >
              <img
                src="https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcTBQ7bOgcrWRFNiYfmj_yl3GVgqJlhT2MbAgk6C9SCWJpYcNbtl0pfuqw4gDfpbvzwgW6seTY5AHOJnp6z9OgxGtCecBeWb6vkEyak4RA"
                alt=""
                className="featuredImg"
              />
              <div className="featuredTitles">
                <h1>Paris</h1>
                <h2>{data[1]} properties</h2>
              </div>
            </div>

            <div
              className="featuredItem"
              onClick={() => handleFeaturedItemClick("London")}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcR2Y5PDdRfsZp_EJFMnNisN47kHPcBuS1-1ly0VVsFORATVq6BdyrUBjuRvLXz4cEXLbO8MWNbcCy2BFUV_HejLN2LRptUM2Z0XmxuIHg"
                alt=""
                className="featuredImg"
              />
              <div className="featuredTitles">
                <h1>London</h1>
                <h2>{data[2]} properties</h2>
              </div>
            </div>
            <div
              className="featuredItem"
              onClick={() => handleFeaturedItemClick("Marrakech")}
            >
              <img
                src="https://lh5.googleusercontent.com/p/AF1QipOCQq4LURsoDir3Zg_eitXLu-xCgHBLvxVBrLP1=w729-h421-n-k-no"
                alt=""
                className="featuredImg"
              />
              <div className="featuredTitles">
                <h1>Marrakech</h1>
                <h2>{data[3]} properties</h2>
              </div>
            </div>
            <div
              className="featuredItem"
              onClick={() => handleFeaturedItemClick("Miami")}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRvi83uE4SZ3QaZ38rAVCCpbShjgLrlQD_auq2FaZ_aTE-2K1Sz8sqYP-Xlxp1QriAqGs1r80NaeXIA1igpREyXFHNg2ydiM59TS4TUYg"
                alt=""
                className="featuredImg"
              />
              <div className="featuredTitles">
                <h1>Miami</h1>
                <h2>{data[4]} properties</h2>
              </div>
            </div>
            <div
              className="featuredItem"
              onClick={() => handleFeaturedItemClick("Madrid")}
            >
              <img
                src="https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcRs2RgDwnhUUpLrtPeK9l0Dw44qo8kTphf4o7TRq7CCRa_TAZ3i8OfeYYdgDi9tcAA24DpU746mKwuA_B2c0nz7aEjIsHJ8oc2pAZt_WQ"
                alt=""
                className="featuredImg"
              />
              <div className="featuredTitles">
                <h1>Madrid</h1>
                <h2>{data[5]} properties</h2>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Featured;
