import SharePhone from "./SharePhone";
import ShareOther from "./ShareOthers";
import { useEffect, useState } from "react";

const ShareLink = (props) => {
  // Adaptar share link a móvil/tablet o a otros dispositivos
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    if (window.innerWidth < 720) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  });

  let shareButton = isMobile ? (
    <SharePhone title={props.title} id={props.id} classNameBtn={"bg-gray"} />
  ) : (
    <ShareOther title={props.title} id={props.id} classNameBtn={"bg-gray"} />
  );

  return shareButton;
};

export default ShareLink;
