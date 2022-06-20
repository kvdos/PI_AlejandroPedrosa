import Card from "../../shared/components/UI/Card";
import EnquiryItem from "../components/EnquiryItem";
import CardEnquiry from "../components/CardEnquiry";
import NewAnswerForm from "../components/NewAnswerForm";
import ReadMore from "../../shared/util/truncateText";
import Linkify from "react-linkify";

const SharedView = (props) => {
  // De haberse fijado un límite en la descripción, lo mostramos así
  let description = props.charLimit ? (
    <ReadMore children={props.description} charLimit={props.charLimit} />
  ) : (
    props.description
  );

  // Si el componente se renderiza en la preview, no queremos responder
  let answerForm = !props.preview && (
    <NewAnswerForm enquiryId={props.enquiryId} />
  );

  return (
    <Card xs={12} lg={9} className="p-0 my-2">
      <EnquiryItem
        className="border-0 bg-transparent"
        title={props.title}
        isShared={true}
        location={props.location}
      />
      <CardEnquiry className="my-2 px-4 border-0 bg-transparent">
        <Linkify>
          <p className="m-0 show-breaks">{description}</p>
        </Linkify>
      </CardEnquiry>
      {answerForm}
    </Card>
  );
};

export default SharedView;
