import { imgPath } from "../helpers/helpers";

interface Props {
  num: number;
}

const Digit = (props: { digit: number }) => {
  return (
    <img
      src={imgPath(`digit-${props.digit}.svg`)}
      className="digit"
      alt={props.digit.toString()}
    />
  );
};

const DigitDisplay = (props: Props) => {
  const { num } = props;
  const digitArray = num
    .toString()
    .padStart(3, "0")
    .split("")
    .map((str) => parseInt(str))
    .slice(-3);

  return (
    <div className="row digits">
      {digitArray.map((digit, i) => (
        <Digit key={i} digit={digit} />
      ))}
    </div>
  );
};

export default DigitDisplay;
