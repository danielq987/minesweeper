import { imgPath } from "../helpers/helpers"

interface Props {
	num: number
}

const Digit = (props: {digit: number}) => {
	return <img src={imgPath(`digit-${props.digit}.svg`)} className="digit"/>
}

const DigitDisplay = (props: Props) => {
	const {num} = props;
	const digit0 = num % 10;
	const digit1 = Math.floor(num/10) % 10;
	const digit2 = Math.floor(num/100) % 10;
	return <div className="row digits">
		<Digit digit={digit2}/>
		<Digit digit={digit1}/>
		<Digit digit={digit0}/>
	</div>
}

export default DigitDisplay;