import { RWebShare } from "react-web-share";
import Button from "../shared/components/UI/Button";
import { HiLink } from "react-icons/hi";

const ShareURL = (props) => {
  const getEnquiryURL = () => {
    return `${process.env.REACT_APP_FRONTEND_URL}/consultas/shared/${props.id}`;
  };

  // objeto para compartir información
  const data = {
    text: props.title,
    url: getEnquiryURL(),
    title: props.title,
  };

  return (
    <RWebShare data={data}>
      <Button className="p-0 w-100 rounded-0">
        <HiLink className={`my-1 ${props.classNameBtn}`} />
      </Button>
    </RWebShare>
  );
};

export default ShareURL;
