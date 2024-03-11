import useFetch from "../../hooks/useFetch";
import "./propertyList.css";
import { useNavigate } from "react-router-dom";

const PropertyList = () => {
  const { data, loading, error } = useFetch("/api/hotels/countByType");
  const navigate = useNavigate();

  const handlePropertyTypeClick = (type) => {
    // Convert plural type names to singular for the URL
    let singularType = type;
    if (type === "apartments") singularType = "apartment";
    else if (type === "villas") singularType = "villa";
    else if (type === "cabins") singularType = "cabin";

    // Use singularType for navigation
    navigate(`/properties?type=${singularType}`);
  };

  const images = [
    "https://juli-hotel-sunny-beach.hotel-mix.de/data/Photos/r1672x749w/12753/1275372/1275372412/Hotel-Juli-Sunny-Beach-Exterior.JPEG",
    "https://www.londonaccommodationkensington.com/wp-content/uploads/2020/07/109-3-4-Ashburn-Gardens-020-1024x683.jpg",
    "https://media.cntraveler.com/photos/5e5e9a3617b1dc0008f2fbfe/4:3/w_2664,h_1998,c_limit/EauPalmBeachResort&Spa-PalmBeachFlorida-2020-5.jpg",
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/345769091.jpg?k=246aa2680453f328f53a3b15cde2eb0e988b5936aec2c957b22a3eb1a8178a7d&o=&hp=1",
    "https://wvtourism.com/wp-content/uploads/2015/06/DSC00287_SMALL-700x467.jpg",
  ];
  return (
    <div className="pList">
      {loading ? (
        "loading"
      ) : (
        <>
          {data &&
            images.map((img, i) => (
              <div
                className="pListItem"
                key={i}
                onClick={() => handlePropertyTypeClick(data[i].type)}
              >
                <img src={img} alt="" className="pListImg" />
                <div className="pListTitles">
                  <h1>{data[i]?.type}</h1>
                  <h2>
                    {data[i]?.count} {data[i]?.type}
                  </h2>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default PropertyList;
