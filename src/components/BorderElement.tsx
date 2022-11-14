interface Props {
  path: string;
  repeat?: number;
  isCorner?: boolean;
}

const BorderElement = (props: Props) => {
  return props.repeat ? (
    <>
      {[...Array(props.repeat)].map((_: any, index) => {
        return <img src={props.path} className="border" key={index} alt="" />;
      })}
    </>
  ) : (
    <img src={props.path} className={`border ${props.isCorner ? "corner-border" : ""}`} alt="" />
  );
};

export default BorderElement;
