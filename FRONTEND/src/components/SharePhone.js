import { Col } from "react-bootstrap";
import Button from "../shared/components/UI/Button";
import { HiLink } from "react-icons/hi";

const ShareURL = (props) => {
  const getEnquiryURL = () => {
    return `${process.env.REACT_APP_FRONTEND_URL}/consultas/shared/${props.id}`;
  };

  // Objeto para compartir información
  const text = {
    title: props.title,
    text: props.title,
    url: getEnquiryURL(),
  };

  const shareAcross = (obj) => {
    if (navigator.share) {
      navigator
        .share(obj)
        .then(() => {})
        .catch((err) => {});
    }
  };

  return (
    <Col className="text-center pe-0">
      <Button className="p-0 w-100 rounded-0" onClick={() => shareAcross(text)}>
        <HiLink className={`my-1 ${props.classNameBtn}`} />
      </Button>
    </Col>
  );
};

export default ShareURL;
